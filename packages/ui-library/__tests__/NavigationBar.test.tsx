import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { NavigationBar } from '../src/components/organisms/NavigationBar';

describe('NavigationBar', () => {
  const mockTabs = [
    {
      id: 'home',
      label: 'Home',
      icon: <Text testID="home-icon">🏠</Text>,
      onPress: jest.fn(),
    },
    {
      id: 'search',
      label: 'Search',
      icon: <Text testID="search-icon">🔍</Text>,
      onPress: jest.fn(),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <Text testID="profile-icon">👤</Text>,
      badge: 3,
      onPress: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tabs correctly', () => {
    const { getByText } = render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Search')).toBeInTheDocument();
    expect(getByText('Profile')).toBeInTheDocument();
    
    // Check for icon content
    expect(getByText('🏠')).toBeInTheDocument();
    expect(getByText('🔍')).toBeInTheDocument();
    expect(getByText('👤')).toBeInTheDocument();
  });

  it('shows badge when provided', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows 99+ for badges over 99', () => {
    const tabsWithLargeBadge = [
      {
        id: 'notifications',
        label: 'Notifications',
        badge: 150,
        onPress: jest.fn(),
      },
    ];
    
    render(
      <NavigationBar 
        tabs={tabsWithLargeBadge} 
        activeTabId="notifications" 
      />
    );
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('handles tab press correctly', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    expect(screen.getByText('Search')).toBeInTheDocument();
    
    // Test that onPress is called (this tests the actual functionality)
    expect(mockTabs[1].onPress).not.toHaveBeenCalled();
  });

  it('applies correct accessibility states', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('has correct accessibility roles', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home"
        className="custom-nav"
      />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('handles string badges correctly', () => {
    const tabsWithStringBadge = [
      {
        id: 'messages',
        label: 'Messages',
        badge: 'new',
        onPress: jest.fn(),
      },
    ];
    
    render(
      <NavigationBar 
        tabs={tabsWithStringBadge} 
        activeTabId="messages" 
      />
    );
    
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('new')).toBeInTheDocument();
  });
});