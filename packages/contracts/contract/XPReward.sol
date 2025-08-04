// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@thirdweb-dev/contracts/extension/Permissions.sol";
import "@thirdweb-dev/contracts/lib/CurrencyTransferLib.sol";

/**
 * @title XPReward
 * @dev ERC721-based XP and achievement system with NFT rewards
 */
contract XPReward is ERC721Base, Permissions {
    // Roles
    bytes32 public constant XP_MANAGER_ROLE = keccak256("XP_MANAGER_ROLE");
    bytes32 public constant ACHIEVEMENT_MANAGER_ROLE = keccak256("ACHIEVEMENT_MANAGER_ROLE");

    // Achievement types
    enum AchievementType {
        FIRST_LOAN,
        LOAN_REPAID,
        PERFECT_REPAYMENT,
        LENDING_MILESTONE,
        REFERRAL_MASTER,
        LEVEL_MILESTONE,
        STREAK_MASTER,
        COMMUNITY_CONTRIBUTOR
    }

    // User profile structure
    struct UserProfile {
        uint256 totalXP;
        uint256 currentLevel;
        uint256 joinTimestamp;
        uint256 lastActivityTimestamp;
        uint256 streakCount;
        uint256 loansCompleted;
        uint256 perfectRepayments;
        uint256 totalLentAmount;
        uint256 referralCount;
        bool[] achievementsUnlocked;
    }

    // Achievement structure
    struct Achievement {
        string name;
        string description;
        uint256 xpReward;
        uint256 requiredValue;
        AchievementType achievementType;
        bool isActive;
        string metadataURI;
    }

    // NFT tier structure
    struct NFTTier {
        string name;
        uint256 minLevel;
        uint256 maxSupply;
        uint256 currentSupply;
        string baseURI;
        uint256 xpBoostPercentage;
        bool isActive;
    }

    // Level structure
    struct Level {
        uint256 requiredXP;
        string title;
        uint256 rewardAmount;
        bool hasNFTReward;
        uint256 nftTierId;
    }

    // State variables
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => Achievement) public achievements;
    mapping(uint256 => NFTTier) public nftTiers;
    mapping(uint256 => Level) public levels;
    mapping(address => mapping(uint256 => bool)) public userAchievements;
    mapping(uint256 => address) public nftOwners;
    mapping(address => uint256[]) public userNFTs;

    uint256 public nextAchievementId = 1;
    uint256 public nextNFTTierId = 1;
    uint256 public maxLevel = 100;
    uint256 public baseXPPerLevel = 1000;
    uint256 public streakBonusMultiplier = 5;
    uint256 public referralXPReward = 50;
    address public rewardToken;

    // Events
    event XPAwarded(address indexed user, uint256 amount, string reason, uint256 totalXP);
    event LevelUp(address indexed user, uint256 newLevel, string title, uint256 rewardAmount);
    event AchievementUnlocked(address indexed user, uint256 achievementId, string name, uint256 xpReward);
    event NFTRewardMinted(address indexed user, uint256 tokenId, uint256 tierId, string tierName);
    event StreakUpdated(address indexed user, uint256 streakCount, uint256 bonusXP);

    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _rewardToken
    ) ERC721Base(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {
        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _setupRole(XP_MANAGER_ROLE, _defaultAdmin);
        _setupRole(ACHIEVEMENT_MANAGER_ROLE, _defaultAdmin);
        
        rewardToken = _rewardToken;
        
        // Initialize default levels
        _initializeDefaultLevels();
        
        // Initialize default achievements
        _initializeDefaultAchievements();
        
        // Initialize default NFT tiers
        _initializeDefaultNFTTiers();
    }

    // Internal helper functions first
    function _calculateLevel(uint256 totalXP) internal view returns (uint256) {
        if (totalXP == 0) return 1;
        
        for (uint256 i = 1; i <= maxLevel; i++) {
            if (totalXP < levels[i].requiredXP) {
                return i - 1 == 0 ? 1 : i - 1;
            }
        }
        return maxLevel;
    }

    function _calculateXPWithBoost(address user, uint256 baseXP) internal view returns (uint256) {
        uint256[] memory userTokens = userNFTs[user];
        uint256 maxBoost = 0;
        
        for (uint256 i = 0; i < userTokens.length; i++) {
            for (uint256 j = 1; j < nextNFTTierId; j++) {
                if (nftTiers[j].xpBoostPercentage > maxBoost) {
                    maxBoost = nftTiers[j].xpBoostPercentage;
                }
            }
        }
        
        return baseXP + (baseXP * maxBoost) / 100;
    }

    function _updateStreak(address _user) internal returns (uint256) {
        UserProfile storage profile = userProfiles[_user];
        
        uint256 daysSinceLastActivity = (block.timestamp - profile.lastActivityTimestamp) / 1 days;
        
        if (daysSinceLastActivity <= 1) {
            profile.streakCount++;
        } else if (daysSinceLastActivity > 1) {
            profile.streakCount = 1; // Reset streak but count today
        }
        
        uint256 streakBonus = (profile.streakCount * streakBonusMultiplier * 10) / 100;
        
        if (streakBonus > 0) {
            emit StreakUpdated(_user, profile.streakCount, streakBonus);
        }
        
        return streakBonus;
    }

    function _levelUp(address _user, uint256 _newLevel) internal {
        UserProfile storage profile = userProfiles[_user];
        profile.currentLevel = _newLevel;
        
        Level memory levelInfo = levels[_newLevel];
        
        if (levelInfo.rewardAmount > 0 && rewardToken != address(0)) {
            CurrencyTransferLib.transferCurrency(
                rewardToken,
                address(this),
                _user,
                levelInfo.rewardAmount
            );
        }
        
        if (levelInfo.hasNFTReward) {
            _mintNFTReward(_user, levelInfo.nftTierId);
        }
        
        emit LevelUp(_user, _newLevel, levelInfo.title, levelInfo.rewardAmount);
    }

    function _mintNFTReward(address _user, uint256 _tierId) internal returns (uint256) {
        require(_tierId < nextNFTTierId, "NFT tier does not exist");
        
        NFTTier storage tier = nftTiers[_tierId];
        require(tier.isActive, "NFT tier not active");
        require(tier.currentSupply < tier.maxSupply, "NFT tier supply exhausted");

        UserProfile memory profile = userProfiles[_user];
        require(profile.currentLevel >= tier.minLevel, "User level too low for this tier");

        uint256 tokenId = nextTokenIdToMint();
        tier.currentSupply++;
        
        _mint(_user, tokenId);
        nftOwners[tokenId] = _user;
        userNFTs[_user].push(tokenId);

        emit NFTRewardMinted(_user, tokenId, _tierId, tier.name);
        return tokenId;
    }

    function _unlockAchievement(address _user, uint256 _achievementId) internal {
        require(_achievementId < nextAchievementId, "Achievement does not exist");
        require(!userAchievements[_user][_achievementId], "Achievement already unlocked");

        Achievement memory achievement = achievements[_achievementId];
        require(achievement.isActive, "Achievement not active");

        userAchievements[_user][_achievementId] = true;
        
        _awardXP(_user, achievement.xpReward, achievement.name);

        emit AchievementUnlocked(_user, _achievementId, achievement.name, achievement.xpReward);
    }

    function _awardXP(address _user, uint256 _amount, string memory _reason) internal {
        require(_user != address(0), "Invalid user address");
        require(_amount > 0, "XP amount must be greater than 0");

        UserProfile storage profile = userProfiles[_user];
        
        if (profile.joinTimestamp == 0) {
            profile.joinTimestamp = block.timestamp;
            profile.achievementsUnlocked = new bool[](nextAchievementId);
        }

        uint256 boostedAmount = _calculateXPWithBoost(_user, _amount);
        uint256 streakBonus = _updateStreak(_user);
        boostedAmount += streakBonus;

        uint256 oldLevel = profile.currentLevel;
        profile.totalXP += boostedAmount;
        profile.lastActivityTimestamp = block.timestamp;

        uint256 newLevel = _calculateLevel(profile.totalXP);
        if (newLevel > oldLevel) {
            _levelUp(_user, newLevel);
        }

        emit XPAwarded(_user, boostedAmount, _reason, profile.totalXP);
    }

    function _checkLoanAchievements(address _user) internal {
        UserProfile memory profile = userProfiles[_user];
        
        if (profile.loansCompleted == 1 && !userAchievements[_user][1]) {
            _unlockAchievement(_user, 1);
        }
        
        if (profile.perfectRepayments >= 5 && !userAchievements[_user][3]) {
            _unlockAchievement(_user, 3);
        }
    }

    function _checkLendingAchievements(address _lender) internal {
        UserProfile memory profile = userProfiles[_lender];
        
        if (profile.totalLentAmount >= 10 ether && !userAchievements[_lender][4]) {
            _unlockAchievement(_lender, 4);
        }
    }

    function _checkReferralAchievements(address _referrer) internal {
        UserProfile memory profile = userProfiles[_referrer];
        
        if (profile.referralCount >= 10 && !userAchievements[_referrer][10]) {
            _unlockAchievement(_referrer, 10);
        }
    }

    function _initializeDefaultLevels() internal {
        for (uint256 i = 1; i <= 10; i++) {
            levels[i] = Level({
                requiredXP: baseXPPerLevel * i + (i * i * 50),
                title: string(abi.encodePacked("Level ", _toString(i))),
                rewardAmount: i * 100 * 1e18,
                hasNFTReward: i % 5 == 0,
                nftTierId: i / 5
            });
        }
    }

    function _initializeDefaultAchievements() internal {
        achievements[1] = Achievement({
            name: "First Steps",
            description: "Complete your first loan",
            xpReward: 200,
            requiredValue: 1,
            achievementType: AchievementType.FIRST_LOAN,
            isActive: true,
            metadataURI: "ipfs://first-loan-achievement"
        });

        achievements[2] = Achievement({
            name: "Responsible Borrower",
            description: "Successfully repay a loan",
            xpReward: 150,
            requiredValue: 1,
            achievementType: AchievementType.LOAN_REPAID,
            isActive: true,
            metadataURI: "ipfs://loan-repaid-achievement"
        });

        nextAchievementId = 3;
    }

    function _initializeDefaultNFTTiers() internal {
        nftTiers[1] = NFTTier({
            name: "Bronze Achiever",
            minLevel: 5,
            maxSupply: 1000,
            currentSupply: 0,
            baseURI: "ipfs://bronze-tier/",
            xpBoostPercentage: 5,
            isActive: true
        });

        nftTiers[2] = NFTTier({
            name: "Silver Champion",
            minLevel: 10,
            maxSupply: 500,
            currentSupply: 0,
            baseURI: "ipfs://silver-tier/",
            xpBoostPercentage: 10,
            isActive: true
        });

        nextNFTTierId = 3;
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Public/External functions
    function awardXP(address _user, uint256 _amount, string memory _reason) external onlyRole(XP_MANAGER_ROLE) {
        _awardXP(_user, _amount, _reason);
    }

    function awardLoanCompletionXP(address _user, uint256 _loanAmount, bool _isEarlyRepayment) external onlyRole(XP_MANAGER_ROLE) {
        UserProfile storage profile = userProfiles[_user];
        profile.loansCompleted++;
        
        uint256 baseXP = 100 + (_loanAmount / 1e18) * 10;
        
        if (_isEarlyRepayment) {
            profile.perfectRepayments++;
            baseXP = (baseXP * 150) / 100;
        }

        _awardXP(_user, baseXP, "Loan completion");
        _checkLoanAchievements(_user);
    }

    function awardLendingXP(address _lender, uint256 _amount) external onlyRole(XP_MANAGER_ROLE) {
        UserProfile storage profile = userProfiles[_lender];
        profile.totalLentAmount += _amount;
        
        uint256 xpAmount = 50 + (_amount / 1e18) * 5;
        _awardXP(_lender, xpAmount, "Lending activity");
        _checkLendingAchievements(_lender);
    }

    function awardReferralXP(address _referrer, address _referee) external onlyRole(XP_MANAGER_ROLE) {
        UserProfile storage referrerProfile = userProfiles[_referrer];
        referrerProfile.referralCount++;
        
        _awardXP(_referrer, referralXPReward, "Successful referral");
        _awardXP(_referee, referralXPReward / 2, "Referred user bonus");
        _checkReferralAchievements(_referrer);
    }

    function unlockAchievement(address _user, uint256 _achievementId) external onlyRole(ACHIEVEMENT_MANAGER_ROLE) {
        _unlockAchievement(_user, _achievementId);
    }

    function mintNFTReward(address _user, uint256 _tierId) external onlyRole(XP_MANAGER_ROLE) returns (uint256) {
        return _mintNFTReward(_user, _tierId);
    }

    function createAchievement(
        string memory _name,
        string memory _description,
        uint256 _xpReward,
        uint256 _requiredValue,
        AchievementType _achievementType,
        string memory _metadataURI
    ) external onlyRole(ACHIEVEMENT_MANAGER_ROLE) returns (uint256) {
        uint256 achievementId = nextAchievementId++;
        
        achievements[achievementId] = Achievement({
            name: _name,
            description: _description,
            xpReward: _xpReward,
            requiredValue: _requiredValue,
            achievementType: _achievementType,
            isActive: true,
            metadataURI: _metadataURI
        });

        return achievementId;
    }

    function createNFTTier(
        string memory _name,
        uint256 _minLevel,
        uint256 _maxSupply,
        string memory _baseURI,
        uint256 _xpBoostPercentage
    ) external onlyRole(ACHIEVEMENT_MANAGER_ROLE) returns (uint256) {
        uint256 tierId = nextNFTTierId++;
        
        nftTiers[tierId] = NFTTier({
            name: _name,
            minLevel: _minLevel,
            maxSupply: _maxSupply,
            currentSupply: 0,
            baseURI: _baseURI,
            xpBoostPercentage: _xpBoostPercentage,
            isActive: true
        });

        return tierId;
    }

    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }

    function getUserLevel(address _user) external view returns (uint256) {
        return userProfiles[_user].currentLevel;
    }

    function getUserXP(address _user) external view returns (uint256) {
        return userProfiles[_user].totalXP;
    }

    function hasAchievement(address _user, uint256 _achievementId) external view returns (bool) {
        return userAchievements[_user][_achievementId];
    }

    function getUserNFTs(address _user) external view returns (uint256[] memory) {
        return userNFTs[_user];
    }

    function updateRewardToken(address _newRewardToken) external onlyRole(DEFAULT_ADMIN_ROLE) {
        rewardToken = _newRewardToken;
    }

    function emergencyWithdraw(address _token, uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_token == address(0)) {
            payable(msg.sender).transfer(_amount);
        } else {
            CurrencyTransferLib.transferCurrency(_token, address(this), msg.sender, _amount);
        }
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "Token does not exist");
        
        for (uint256 i = 1; i < nextNFTTierId; i++) {
            if (nftTiers[i].currentSupply > 0) {
                return string(abi.encodePacked(nftTiers[i].baseURI, _toString(_tokenId)));
            }
        }
        
        return "";
    }

    receive() external payable {}
}