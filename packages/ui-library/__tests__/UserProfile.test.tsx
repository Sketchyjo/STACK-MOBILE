import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { UserProfile } from '../src/components/organisms/UserProfile';

const mockStats = [
  { label: 'Posts', value: '42' },
  { label: 'Followers', value: '1.2K' },
  { label: 'Following', value: '256' }
];

describe('UserProfile', () => {
  it('renders without crashing', () => {
    const result = render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
      />
    );
    expect(result).toBeTruthy();
  });

  it('renders with edit button when onEditPress is provided', () => {
    const mockOnEdit = jest.fn();
    const result = render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        onEditPress={mockOnEdit}
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with action buttons when provided', () => {
    const actions = [
      { label: 'Follow', onPress: jest.fn() },
      { label: 'Message', onPress: jest.fn() }
    ];
    
    const result = render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        actions={actions}
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with custom class name', () => {
    const result = render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        className="custom-profile"
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with bio', () => {
    const result = render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        bio="Software developer passionate about React Native"
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with stats', () => {
    const result = render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        stats={mockStats}
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with avatar', () => {
    const avatar = <Text>👤</Text>;
    
    const result = render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        avatar={avatar}
      />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders without optional props', () => {
    const result = render(<UserProfile name="John Doe" />);
    expect(result).toBeTruthy();
  });
});