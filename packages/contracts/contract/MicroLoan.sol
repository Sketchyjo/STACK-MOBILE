// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@thirdweb-dev/contracts/extension/Permissions.sol";
import "@thirdweb-dev/contracts/lib/CurrencyTransferLib.sol";

/**
 * @title MicroLoan
 * @dev A comprehensive micro loan smart contract with collateral management,
 * flexible repayment terms, and automated liquidation mechanisms
 * @author Stack Mobile Team
 */
contract MicroLoan is Permissions {
    using CurrencyTransferLib for address;

    // Loan status enumeration
    enum LoanStatus {
        PENDING,     // Loan application submitted
        ACTIVE,      // Loan approved and funds disbursed
        REPAID,      // Loan fully repaid
        DEFAULTED,   // Loan defaulted and liquidated
        CANCELLED    // Loan cancelled before approval
    }

    // Loan structure
    struct Loan {
        uint256 loanId;
        address borrower;
        address lender;
        uint256 principal;           // Original loan amount
        uint256 interestRate;        // Annual interest rate in basis points (e.g., 1000 = 10%)
        uint256 duration;            // Loan duration in seconds
        uint256 collateralAmount;    // Collateral amount in wei
        address collateralToken;     // Collateral token address (address(0) for ETH)
        uint256 startTime;           // Loan start timestamp
        uint256 repaidAmount;        // Amount repaid so far
        LoanStatus status;
        bool autoLiquidation;        // Enable automatic liquidation on default
    }

    // Lender pool structure
    struct LenderPool {
        address lender;
        uint256 availableFunds;
        uint256 minLoanAmount;
        uint256 maxLoanAmount;
        uint256 preferredInterestRate;
        bool isActive;
    }

    // Events
    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 principal,
        uint256 interestRate,
        uint256 duration,
        uint256 collateralAmount,
        address collateralToken
    );

    event LoanApproved(
        uint256 indexed loanId,
        address indexed lender,
        address indexed borrower,
        uint256 principal
    );

    event LoanRepayment(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 remainingBalance
    );

    event LoanDefaulted(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 collateralLiquidated
    );

    event CollateralDeposited(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        address token
    );

    event LenderPoolCreated(
        address indexed lender,
        uint256 availableFunds,
        uint256 minLoanAmount,
        uint256 maxLoanAmount
    );

    // State variables
    mapping(uint256 => Loan) public loans;
    mapping(address => LenderPool) public lenderPools;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256[]) public lenderLoans;
    mapping(uint256 => mapping(address => uint256)) public collateralBalances;

    uint256 public nextLoanId = 1;
    uint256 public platformFeeRate = 100; // 1% in basis points
    address public feeRecipient;
    uint256 public liquidationThreshold = 8000; // 80% in basis points
    uint256 public gracePeriod = 7 days; // Grace period before liquidation

    // Role definitions
    bytes32 public constant LENDER_ROLE = keccak256("LENDER_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");

    // Modifiers
    modifier onlyBorrower(uint256 _loanId) {
        require(loans[_loanId].borrower == msg.sender, "Not the borrower");
        _;
    }

    modifier onlyLender(uint256 _loanId) {
        require(loans[_loanId].lender == msg.sender, "Not the lender");
        _;
    }

    modifier loanExists(uint256 _loanId) {
        require(loans[_loanId].borrower != address(0), "Loan does not exist");
        _;
    }

    constructor(address _defaultAdmin, address _feeRecipient) {
        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _setupRole(LENDER_ROLE, _defaultAdmin);
        _setupRole(LIQUIDATOR_ROLE, _defaultAdmin);
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Request a micro loan with collateral
     * @param _principal Loan amount requested
     * @param _interestRate Annual interest rate in basis points
     * @param _duration Loan duration in seconds
     * @param _collateralToken Token address for collateral (address(0) for ETH)
     * @param _autoLiquidation Enable automatic liquidation
     */
    function requestLoan(
        uint256 _principal,
        uint256 _interestRate,
        uint256 _duration,
        address _collateralToken,
        bool _autoLiquidation
    ) external payable returns (uint256) {
        require(_principal > 0, "Principal must be greater than 0");
        require(_interestRate > 0 && _interestRate <= 10000, "Invalid interest rate");
        require(_duration >= 1 days && _duration <= 365 days, "Invalid duration");

        uint256 loanId = nextLoanId++;
        uint256 collateralAmount = msg.value;

        // For ERC20 collateral, transfer tokens to contract
        if (_collateralToken != address(0)) {
            require(msg.value == 0, "ETH not needed for ERC20 collateral");
            // Note: Borrower should approve this contract before calling
            // Implementation would require SafeERC20 for production
        }

        loans[loanId] = Loan({
            loanId: loanId,
            borrower: msg.sender,
            lender: address(0),
            principal: _principal,
            interestRate: _interestRate,
            duration: _duration,
            collateralAmount: collateralAmount,
            collateralToken: _collateralToken,
            startTime: 0,
            repaidAmount: 0,
            status: LoanStatus.PENDING,
            autoLiquidation: _autoLiquidation
        });

        borrowerLoans[msg.sender].push(loanId);

        if (collateralAmount > 0) {
            collateralBalances[loanId][_collateralToken] = collateralAmount;
            emit CollateralDeposited(loanId, msg.sender, collateralAmount, _collateralToken);
        }

        emit LoanRequested(
            loanId,
            msg.sender,
            _principal,
            _interestRate,
            _duration,
            collateralAmount,
            _collateralToken
        );

        return loanId;
    }

    /**
     * @dev Approve and fund a loan
     * @param _loanId Loan ID to approve
     */
    function approveLoan(uint256 _loanId)
        external
        payable
        onlyRole(LENDER_ROLE)
        loanExists(_loanId)
    {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.PENDING, "Loan not pending");
        require(msg.value >= loan.principal, "Insufficient funds");

        loan.lender = msg.sender;
        loan.status = LoanStatus.ACTIVE;
        loan.startTime = block.timestamp;

        lenderLoans[msg.sender].push(_loanId);

        // Transfer loan amount to borrower (minus platform fee)
        uint256 platformFee = (loan.principal * platformFeeRate) / 10000;
        uint256 netAmount = loan.principal - platformFee;

        payable(loan.borrower).transfer(netAmount);
        payable(feeRecipient).transfer(platformFee);

        // Refund excess payment
        if (msg.value > loan.principal) {
            payable(msg.sender).transfer(msg.value - loan.principal);
        }

        emit LoanApproved(_loanId, msg.sender, loan.borrower, loan.principal);
    }

    /**
     * @dev Make a loan repayment
     * @param _loanId Loan ID to repay
     */
    function repayLoan(uint256 _loanId)
        external
        payable
        onlyBorrower(_loanId)
        loanExists(_loanId)
    {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.ACTIVE, "Loan not active");
        require(msg.value > 0, "Repayment amount must be greater than 0");

        uint256 totalOwed = calculateTotalOwed(_loanId);
        uint256 repaymentAmount = msg.value;

        if (loan.repaidAmount + repaymentAmount >= totalOwed) {
            // Full repayment
            uint256 finalPayment = totalOwed - loan.repaidAmount;
            loan.repaidAmount = totalOwed;
            loan.status = LoanStatus.REPAID;

            // Transfer payment to lender
            payable(loan.lender).transfer(finalPayment);

            // Return collateral to borrower
            _returnCollateral(_loanId);

            // Refund excess payment
            if (repaymentAmount > finalPayment) {
                payable(msg.sender).transfer(repaymentAmount - finalPayment);
            }

            emit LoanRepayment(_loanId, msg.sender, finalPayment, 0);
        } else {
            // Partial repayment
            loan.repaidAmount += repaymentAmount;
            payable(loan.lender).transfer(repaymentAmount);

            uint256 remainingBalance = totalOwed - loan.repaidAmount;
            emit LoanRepayment(_loanId, msg.sender, repaymentAmount, remainingBalance);
        }
    }

    /**
     * @dev Liquidate a defaulted loan
     * @param _loanId Loan ID to liquidate
     */
    function liquidateLoan(uint256 _loanId)
        external
        onlyRole(LIQUIDATOR_ROLE)
        loanExists(_loanId)
    {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.ACTIVE, "Loan not active");
        require(isLoanDefaulted(_loanId), "Loan not in default");

        loan.status = LoanStatus.DEFAULTED;

        // Transfer collateral to lender
        uint256 collateralAmount = collateralBalances[_loanId][loan.collateralToken];
        if (collateralAmount > 0) {
            collateralBalances[_loanId][loan.collateralToken] = 0;

            if (loan.collateralToken == address(0)) {
                payable(loan.lender).transfer(collateralAmount);
            } else {
                // Handle ERC20 token transfer using CurrencyTransferLib
                CurrencyTransferLib.transferCurrency(
                    loan.collateralToken,
                    address(this),
                    loan.lender,
                    collateralAmount
                );
            }
        }

        emit LoanDefaulted(_loanId, loan.borrower, collateralAmount);
    }

    /**
     * @dev Create a lender pool for automatic loan matching
     * @param _minLoanAmount Minimum loan amount to fund
     * @param _maxLoanAmount Maximum loan amount to fund
     * @param _preferredInterestRate Preferred interest rate in basis points
     */
    function createLenderPool(
        uint256 _minLoanAmount,
        uint256 _maxLoanAmount,
        uint256 _preferredInterestRate
    ) external payable onlyRole(LENDER_ROLE) {
        require(msg.value > 0, "Must deposit funds");
        require(_minLoanAmount <= _maxLoanAmount, "Invalid loan amount range");

        lenderPools[msg.sender] = LenderPool({
            lender: msg.sender,
            availableFunds: msg.value,
            minLoanAmount: _minLoanAmount,
            maxLoanAmount: _maxLoanAmount,
            preferredInterestRate: _preferredInterestRate,
            isActive: true
        });

        emit LenderPoolCreated(msg.sender, msg.value, _minLoanAmount, _maxLoanAmount);
    }

    /**
     * @dev Calculate total amount owed including interest
     * @param _loanId Loan ID
     * @return Total amount owed
     */
    function calculateTotalOwed(uint256 _loanId) public view returns (uint256) {
        Loan memory loan = loans[_loanId];
        if (loan.status != LoanStatus.ACTIVE) return 0;

        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 interest = (loan.principal * loan.interestRate * timeElapsed) / (365 days * 10000);

        return loan.principal + interest;
    }

    /**
     * @dev Check if a loan is in default
     * @param _loanId Loan ID
     * @return True if loan is defaulted
     */
    function isLoanDefaulted(uint256 _loanId) public view returns (bool) {
        Loan memory loan = loans[_loanId];
        if (loan.status != LoanStatus.ACTIVE) return false;

        uint256 dueDate = loan.startTime + loan.duration;
        return block.timestamp > dueDate + gracePeriod;
    }

    /**
     * @dev Get loan details
     * @param _loanId Loan ID
     * @return Loan struct
     */
    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        return loans[_loanId];
    }

    /**
     * @dev Get borrower's loan IDs
     * @param _borrower Borrower address
     * @return Array of loan IDs
     */
    function getBorrowerLoans(address _borrower) external view returns (uint256[] memory) {
        return borrowerLoans[_borrower];
    }

    /**
     * @dev Get lender's loan IDs
     * @param _lender Lender address
     * @return Array of loan IDs
     */
    function getLenderLoans(address _lender) external view returns (uint256[] memory) {
        return lenderLoans[_lender];
    }

    /**
     * @dev Return collateral to borrower (internal function)
     * @param _loanId Loan ID
     */
    function _returnCollateral(uint256 _loanId) internal {
        Loan memory loan = loans[_loanId];
        uint256 collateralAmount = collateralBalances[_loanId][loan.collateralToken];

        if (collateralAmount > 0) {
            collateralBalances[_loanId][loan.collateralToken] = 0;

            if (loan.collateralToken == address(0)) {
                payable(loan.borrower).transfer(collateralAmount);
            } else {
                // Handle ERC20 token transfer using CurrencyTransferLib
                CurrencyTransferLib.transferCurrency(
                    loan.collateralToken,
                    address(this),
                    loan.borrower,
                    collateralAmount
                );
            }
        }
    }

    /**
     * @dev Update platform fee rate (admin only)
     * @param _newFeeRate New fee rate in basis points
     */
    function updatePlatformFeeRate(uint256 _newFeeRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newFeeRate <= 1000, "Fee rate too high"); // Max 10%
        platformFeeRate = _newFeeRate;
    }

    /**
     * @dev Update liquidation threshold (admin only)
     * @param _newThreshold New threshold in basis points
     */
    function updateLiquidationThreshold(uint256 _newThreshold) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newThreshold >= 5000 && _newThreshold <= 9500, "Invalid threshold");
        liquidationThreshold = _newThreshold;
    }

    /**
     * @dev Emergency withdrawal (admin only)
     */
    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Receive function to accept ETH
    receive() external payable {}
}
