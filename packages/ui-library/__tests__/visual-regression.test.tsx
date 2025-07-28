import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Mock React Native Modal to avoid test environment issues
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Modal: ({ children, visible }: any) => visible ? <RN.View testID="modal">{children}</RN.View> : null,
  };
});

import { Button } from '../src/components/atoms/Button';
import { Card } from '../src/components/atoms/Card';
import { InputField } from '../src/components/atoms/InputField';
import { ToggleSwitch } from '../src/components/atoms/ToggleSwitch';
import { ProgressBar } from '../src/components/atoms/ProgressBar';
import { Modal } from '../src/components/atoms/Modal';
import { Header } from '../src/components/molecules/Header';
import { NavigationBar } from '../src/components/organisms/NavigationBar';
import { QuestProgress } from '../src/components/molecules/QuestProgress';
import { BattlePass } from '../src/components/organisms/BattlePass';

/**
 * Visual Regression Test Suite
 * 
 * These tests capture component snapshots to detect unintended visual changes.
 * Run with: npm test -- --updateSnapshot to update snapshots when changes are intentional.
 */

describe('Visual Regression Tests', () => {
  describe('Atomic Components', () => {
    it('Button - Primary variant should match snapshot', () => {
      const component = render(
        <Button title="Primary Button" variant="primary" onPress={() => {}} />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Button - Accent variant should match snapshot', () => {
      const component = render(
        <Button title="Accent Button" variant="accent" onPress={() => {}} />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Button - Tertiary variant should match snapshot', () => {
      const component = render(
        <Button title="Tertiary Button" variant="tertiary" onPress={() => {}} />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Button - Disabled state should match snapshot', () => {
      const component = render(
        <Button title="Disabled Button" variant="primary" disabled onPress={() => {}} />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Button - Loading state should match snapshot', () => {
      const component = render(
        <Button title="Loading..." variant="primary" onPress={() => {}} loading />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Card - Default variant should match snapshot', () => {
      const component = render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('InputField - Default state should match snapshot', () => {
      const component = render(
        <InputField
          label="Email"
          placeholder="Enter your email"
          value=""
          onChangeText={() => {}}
        />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('InputField - Error state should match snapshot', () => {
      const component = render(
        <InputField
          label="Email"
          placeholder="Enter your email"
          value="invalid-email"
          onChangeText={() => {}}
          error="Please enter a valid email address"
        />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('ToggleSwitch - Enabled state should match snapshot', () => {
      const component = render(
        <ToggleSwitch
          value={true}
          onValueChange={() => {}}
        />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('ToggleSwitch - Disabled state should match snapshot', () => {
      const component = render(
        <ToggleSwitch
          value={false}
          onValueChange={() => {}}
        />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('ProgressBar - 50% progress should match snapshot', () => {
      const component = render(
        <ProgressBar progress={50} height={8} />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('ProgressBar - 100% progress should match snapshot', () => {
      const component = render(
        <ProgressBar progress={100} height={8} />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('Molecular Components', () => {
    it('Header - Default configuration should match snapshot', () => {
      const component = render(
        <Header title="Screen Title" />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Header - With back button should match snapshot', () => {
      const component = render(
        <Header title="Screen Title" showBackButton onLeftPress={() => {}} />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Modal - Open state should match snapshot', () => {
      const component = render(
        <Modal
          isVisible={true}
          onClose={() => {}}
        >
          <View>
            <Text>Modal Content</Text>
          </View>
        </Modal>
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('QuestProgress - Active quest should match snapshot', () => {
      const component = render(
        <QuestProgress
          title="Daily Login"
          description="Log in to the app every day"
          progress={75}
          totalSteps={4}
          currentStep={3}
          reward="100 XP"
          difficulty="easy"
          timeRemaining="2 days"
        />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('Organism Components', () => {
    it('NavigationBar - Default tabs should match snapshot', () => {
      const mockTabs = [
        { id: 'home', label: 'Home', icon: 'home', onPress: () => {} },
        { id: 'portfolio', label: 'Portfolio', icon: 'pie-chart', onPress: () => {} },
        { id: 'card', label: 'Card', icon: 'card', onPress: () => {} },
        { id: 'quests', label: 'Quests', icon: 'trophy', onPress: () => {} },
        { id: 'profile', label: 'Profile', icon: 'person', onPress: () => {} },
      ];

      const component = render(
          <NavigationBar
            tabs={mockTabs}
            activeTabId="home"
          />
        );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('BattlePass - Level 5 progress should match snapshot', () => {
        const mockTiers = [
          { id: '1', level: 1, reward: '100 XP', isUnlocked: true, isClaimed: true, isPremium: false },
          { id: '2', level: 2, reward: '200 XP', isUnlocked: true, isClaimed: true, isPremium: false },
          { id: '3', level: 3, reward: '300 XP', isUnlocked: true, isClaimed: false, isPremium: false },
          { id: '4', level: 4, reward: 'Premium Skin', isUnlocked: false, isClaimed: false, isPremium: true },
          { id: '5', level: 5, reward: '500 XP', isUnlocked: false, isClaimed: false, isPremium: false },
        ];

        const component = render(
           <BattlePass
             currentLevel={3}
             currentXP={750}
             xpToNextLevel={250}
             totalXP={1000}
             tiers={mockTiers}
             hasPremium={false}
             onUpgradePress={() => {}}
           />
         );
        expect(component.toJSON()).toMatchSnapshot();
      });
  });

  describe('Component Combinations', () => {
    it('Card with Button should match snapshot', () => {
      const component = render(
        <Card>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Card Title</Text>
            <Text style={{ marginBottom: 16 }}>Card description text goes here.</Text>
            <Button title="Action Button" variant="primary" onPress={() => {}} />
          </View>
        </Card>
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Form with InputField and Button should match snapshot', () => {
      const component = render(
        <View>
          <InputField
            label="Email"
            placeholder="Enter your email"
            value=""
            onChangeText={() => {}}
          />
          <View style={{ marginTop: 16 }}>
            <InputField
              label="Password"
              placeholder="Enter your password"
              value=""
              onChangeText={() => {}}
              secureTextEntry
            />
          </View>
          <View style={{ marginTop: 24 }}>
            <Button title="Sign In" variant="primary" onPress={() => {}} fullWidth />
          </View>
        </View>
      );
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('Responsive Behavior', () => {
    it('Button - Full width should match snapshot', () => {
      const component = render(
        <Button title="Full Width Button" variant="primary" onPress={() => {}} fullWidth />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Card - With custom className should match snapshot', () => {
      const component = render(
        <Card className="custom-card-class">
          <Text>Custom styled card content</Text>
        </Card>
      );
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('Error States', () => {
    it('InputField - Multiple errors should match snapshot', () => {
      const component = render(
        <InputField
          label="Password"
          placeholder="Enter your password"
          value="123"
          onChangeText={() => {}}
          error="Password must be at least 8 characters long"
        />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Button - Loading state should match snapshot', () => {
      const component = render(
        <Button title="Loading..." variant="primary" onPress={() => {}} loading />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('Accessibility States', () => {
    it('Button - With accessibility props should match snapshot', () => {
      const component = render(
        <Button 
          title="Accessible Button" 
          variant="primary" 
          onPress={() => {}} 
          accessibilityLabel="Submit form"
          accessibilityHint="Submits the current form data"
        />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('ToggleSwitch - On state should match snapshot', () => {
      const component = render(
        <ToggleSwitch
          value={true}
          onValueChange={() => {}}
        />
      );
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});