import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SocialLoginButton, SocialLoginButtons } from '../src/components/atoms/SocialLoginButtons';

const mockOnPress = jest.fn();

describe('SocialLoginButton', () => {
  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders without crashing', () => {
    const result = render(
      <SocialLoginButton provider="google" onPress={mockOnPress} />
    );
    expect(result).toBeTruthy();
  });

  it('renders Google button with correct text', () => {
    const { getByText } = render(
      <SocialLoginButton provider="google" onPress={mockOnPress} />
    );
    
    expect(getByText('Continue with Google')).toBeTruthy();
  });

  it('renders Apple button with correct text', () => {
    const { getByText } = render(
      <SocialLoginButton provider="apple" onPress={mockOnPress} />
    );
    
    expect(getByText('Continue with Apple')).toBeTruthy();
  });

  it('renders Facebook button with correct text', () => {
    const { getByText } = render(
      <SocialLoginButton provider="facebook" onPress={mockOnPress} />
    );
    
    expect(getByText('Continue with Facebook')).toBeTruthy();
  });

  it('handles button press', () => {
    const { getByText } = render(
      <SocialLoginButton provider="google" onPress={mockOnPress} />
    );
    
    const button = getByText('Continue with Google');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders in disabled state', () => {
    const { getByText } = render(
      <SocialLoginButton provider="google" onPress={mockOnPress} disabled />
    );
    
    const button = getByText('Continue with Google');
    expect(button.parent?.props.disabled).toBe(true);
  });

  it('does not call onPress when disabled', () => {
    const { getByText } = render(
      <SocialLoginButton provider="google" onPress={mockOnPress} disabled />
    );
    
    const button = getByText('Continue with Google');
    fireEvent.press(button);
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});

describe('SocialLoginButtons', () => {
  const mockGooglePress = jest.fn();
  const mockApplePress = jest.fn();
  const mockFacebookPress = jest.fn();

  beforeEach(() => {
    mockGooglePress.mockClear();
    mockApplePress.mockClear();
    mockFacebookPress.mockClear();
  });

  it('renders without crashing', () => {
    const result = render(<SocialLoginButtons />);
    expect(result).toBeTruthy();
  });

  it('renders only Google button when only Google handler provided', () => {
    const { getByText, queryByText } = render(
      <SocialLoginButtons onGooglePress={mockGooglePress} />
    );
    
    expect(getByText('Continue with Google')).toBeTruthy();
    expect(queryByText('Continue with Apple')).toBeNull();
    expect(queryByText('Continue with Facebook')).toBeNull();
  });

  it('renders only Apple button when only Apple handler provided', () => {
    const { getByText, queryByText } = render(
      <SocialLoginButtons onApplePress={mockApplePress} />
    );
    
    expect(getByText('Continue with Apple')).toBeTruthy();
    expect(queryByText('Continue with Google')).toBeNull();
    expect(queryByText('Continue with Facebook')).toBeNull();
  });

  it('renders only Facebook button when only Facebook handler provided', () => {
    const { getByText, queryByText } = render(
      <SocialLoginButtons onFacebookPress={mockFacebookPress} />
    );
    
    expect(getByText('Continue with Facebook')).toBeTruthy();
    expect(queryByText('Continue with Google')).toBeNull();
    expect(queryByText('Continue with Apple')).toBeNull();
  });

  it('renders all buttons when all handlers provided', () => {
    const { getByText } = render(
      <SocialLoginButtons 
        onGooglePress={mockGooglePress}
        onApplePress={mockApplePress}
        onFacebookPress={mockFacebookPress}
      />
    );
    
    expect(getByText('Continue with Google')).toBeTruthy();
    expect(getByText('Continue with Apple')).toBeTruthy();
    expect(getByText('Continue with Facebook')).toBeTruthy();
  });

  it('handles Google button press', () => {
    const { getByText } = render(
      <SocialLoginButtons onGooglePress={mockGooglePress} />
    );
    
    const googleButton = getByText('Continue with Google');
    fireEvent.press(googleButton);
    
    expect(mockGooglePress).toHaveBeenCalledTimes(1);
  });

  it('handles Apple button press', () => {
    const { getByText } = render(
      <SocialLoginButtons onApplePress={mockApplePress} />
    );
    
    const appleButton = getByText('Continue with Apple');
    fireEvent.press(appleButton);
    
    expect(mockApplePress).toHaveBeenCalledTimes(1);
  });

  it('handles Facebook button press', () => {
    const { getByText } = render(
      <SocialLoginButtons onFacebookPress={mockFacebookPress} />
    );
    
    const facebookButton = getByText('Continue with Facebook');
    fireEvent.press(facebookButton);
    
    expect(mockFacebookPress).toHaveBeenCalledTimes(1);
  });

  it('renders all buttons in disabled state', () => {
    const { getByText } = render(
      <SocialLoginButtons 
        onGooglePress={mockGooglePress}
        onApplePress={mockApplePress}
        onFacebookPress={mockFacebookPress}
        disabled
      />
    );
    
    const googleButton = getByText('Continue with Google');
    const appleButton = getByText('Continue with Apple');
    const facebookButton = getByText('Continue with Facebook');
    
    expect(googleButton.parent?.props.disabled).toBe(true);
    expect(appleButton.parent?.props.disabled).toBe(true);
    expect(facebookButton.parent?.props.disabled).toBe(true);
  });

  it('does not call handlers when disabled', () => {
    const { getByText } = render(
      <SocialLoginButtons 
        onGooglePress={mockGooglePress}
        onApplePress={mockApplePress}
        onFacebookPress={mockFacebookPress}
        disabled
      />
    );
    
    const googleButton = getByText('Continue with Google');
    const appleButton = getByText('Continue with Apple');
    const facebookButton = getByText('Continue with Facebook');
    
    fireEvent.press(googleButton);
    fireEvent.press(appleButton);
    fireEvent.press(facebookButton);
    
    expect(mockGooglePress).not.toHaveBeenCalled();
    expect(mockApplePress).not.toHaveBeenCalled();
    expect(mockFacebookPress).not.toHaveBeenCalled();
  });
});