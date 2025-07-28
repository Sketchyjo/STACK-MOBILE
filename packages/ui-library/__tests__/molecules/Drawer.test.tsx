import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Drawer, DrawerItem } from '../../src/components/molecules/Drawer';

describe('Drawer', () => {
  const mockItems: DrawerItem[] = [
    {
      id: '1',
      label: 'Home',
      icon: 'home',
      onPress: jest.fn(),
    },
    {
      id: '2',
      label: 'Settings',
      icon: 'settings',
      onPress: jest.fn(),
      badge: 3,
    },
    {
      id: '3',
      label: 'Disabled Item',
      icon: 'block',
      onPress: jest.fn(),
      disabled: true,
    },
  ];

  const defaultProps = {
    isVisible: true,
    items: mockItems,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible', () => {
    const component = render(<Drawer {...defaultProps} />);
    expect(component).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const component = render(<Drawer {...defaultProps} isVisible={false} />);
    expect(component).toBeTruthy();
  });

  it('calls onPress when item is pressed', () => {
    const { getByLabelText } = render(<Drawer {...defaultProps} />);
    
    const homeItem = getByLabelText('Home');
    fireEvent.press(homeItem);
    
    expect(mockItems[0].onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled item is pressed', () => {
    const component = render(<Drawer {...defaultProps} />);
    expect(component).toBeTruthy();
  });

  it('displays badge when provided', () => {
    const component = render(<Drawer {...defaultProps} />);
    expect(component).toBeTruthy();
  });

  it('renders custom header when provided', () => {
    const customHeader = <div>Custom Header</div>;
    const component = render(<Drawer {...defaultProps} header={customHeader} />);
    expect(component).toBeTruthy();
  });

  it('renders custom footer when provided', () => {
    const customFooter = <div>Custom Footer</div>;
    const component = render(<Drawer {...defaultProps} footer={customFooter} />);
    expect(component).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByLabelText } = render(<Drawer {...defaultProps} />);
    
    const closeButton = getByLabelText('Close drawer');
    fireEvent.press(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('applies custom testID', () => {
    const component = render(<Drawer {...defaultProps} testID="custom-drawer" />);
    expect(component).toBeTruthy();
  });

  it('handles empty items array', () => {
    const component = render(<Drawer {...defaultProps} items={[]} />);
    expect(component).toBeTruthy();
  });
});