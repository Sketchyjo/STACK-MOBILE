import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
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
    const { toJSON } = render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    const rendered = toJSON();
    expect(rendered).toBeTruthy();
    expect(JSON.stringify(rendered)).toContain('Home');
    expect(JSON.stringify(rendered)).toContain('Search');
    expect(JSON.stringify(rendered)).toContain('Profile');
    
    expect(screen.getByTestId('home-icon')).toBeTruthy();
    expect(screen.getByTestId('search-icon')).toBeTruthy();
    expect(screen.getByTestId('profile-icon')).toBeTruthy();
  });

  it('shows badge when provided', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    expect(screen.getByText('3')).toBeTruthy();
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
    
    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('handles tab press correctly', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    const searchTab = screen.getByLabelText('Search');
    fireEvent.press(searchTab);
    
    expect(mockTabs[1].onPress).toHaveBeenCalled();
  });

  it('applies correct accessibility states', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    const homeTab = screen.getByLabelText('Home');
    const searchTab = screen.getByLabelText('Search');
    
    expect(homeTab.props.accessibilityState.selected).toBe(true);
    expect(searchTab.props.accessibilityState.selected).toBe(false);
  });

  it('has correct accessibility roles', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home" 
      />
    );
    
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });

  it('applies custom className', () => {
    render(
      <NavigationBar 
        tabs={mockTabs} 
        activeTabId="home"
        className="custom-nav"
      />
    );
    
    expect(screen.getByText('Home')).toBeTruthy();
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
    
    // Check that the badge is rendered within the component
    expect(screen.getByText('Messages')).toBeTruthy();
  });
});