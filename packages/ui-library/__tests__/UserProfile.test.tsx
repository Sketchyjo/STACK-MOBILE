import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { UserProfile } from '../src/components/organisms/UserProfile';

const mockStats = [
  { label: 'Posts', value: '42' },
  { label: 'Followers', value: '1.2K' },
  { label: 'Following', value: '256' }
];

describe('UserProfile', () => {
  it('renders without crashing', () => {
    render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('renders with edit button when onEditPress is provided', () => {
    const mockOnEdit = jest.fn();
    render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        onEditPress={mockOnEdit}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders with action buttons when provided', () => {
    const actions = [
      { label: 'Follow', onPress: jest.fn() },
      { label: 'Message', onPress: jest.fn() }
    ];
    
    render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        actions={actions}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Follow')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('renders with custom class name', () => {
    render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        className="custom-profile"
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders with bio', () => {
    render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        bio="Software developer passionate about React Native"
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software developer passionate about React Native')).toBeInTheDocument();
  });

  it('renders with stats', () => {
    render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        stats={mockStats}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('1.2K')).toBeInTheDocument();
  });

  it('renders with avatar', () => {
    const avatar = <Text>👤</Text>;
    
    render(
      <UserProfile 
        name="John Doe"
        email="john.doe@example.com"
        avatar={avatar}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    render(<UserProfile name="John Doe" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});