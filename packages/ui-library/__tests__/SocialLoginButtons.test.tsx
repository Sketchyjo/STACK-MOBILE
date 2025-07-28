import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SocialLoginButton, SocialLoginButtons } from '../src/components/atoms/SocialLoginButtons';

const mockOnPress = jest.fn();

describe('SocialLoginButton', () => {
  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders without crashing', () => {
    render(<SocialLoginButton provider="google" onPress={mockOnPress} />);
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('renders Google button with correct text', () => {
    render(<SocialLoginButton provider="google" onPress={mockOnPress} />);
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('renders Apple button with correct text', () => {
    render(<SocialLoginButton provider="apple" onPress={mockOnPress} />);
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
  });

  it('renders Facebook button with correct text', () => {
    render(<SocialLoginButton provider="facebook" onPress={mockOnPress} />);
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
  });

  it('handles button press', () => {
    render(<SocialLoginButton provider="google" onPress={mockOnPress} />);
    
    const button = screen.getByText('Continue with Google');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders in disabled state', () => {
    render(<SocialLoginButton provider="google" onPress={mockOnPress} disabled />);
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('does not call onPress when disabled', () => {
    render(<SocialLoginButton provider="google" onPress={mockOnPress} disabled />);
    
    const button = screen.getByText('Continue with Google');
    expect(button).toBeInTheDocument();
    
    // Button should be disabled, so click shouldn't trigger handler
    fireEvent.click(button);
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
    render(<SocialLoginButtons />);
    // Component should render even without handlers
    expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument();
    expect(screen.queryByText('Continue with Apple')).not.toBeInTheDocument();
    expect(screen.queryByText('Continue with Facebook')).not.toBeInTheDocument();
  });

  it('renders only Google button when only Google handler provided', () => {
    render(<SocialLoginButtons onGooglePress={mockGooglePress} />);
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.queryByText('Continue with Apple')).not.toBeInTheDocument();
    expect(screen.queryByText('Continue with Facebook')).not.toBeInTheDocument();
  });

  it('renders only Apple button when only Apple handler provided', () => {
    render(<SocialLoginButtons onApplePress={mockApplePress} />);
    
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
    expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument();
    expect(screen.queryByText('Continue with Facebook')).not.toBeInTheDocument();
  });

  it('renders only Facebook button when only Facebook handler provided', () => {
    render(<SocialLoginButtons onFacebookPress={mockFacebookPress} />);
    
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
    expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument();
    expect(screen.queryByText('Continue with Apple')).not.toBeInTheDocument();
  });

  it('renders all buttons when all handlers provided', () => {
    render(
      <SocialLoginButtons 
        onGooglePress={mockGooglePress}
        onApplePress={mockApplePress}
        onFacebookPress={mockFacebookPress}
      />
    );
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
  });

  it('handles Google button press', () => {
    render(<SocialLoginButtons onGooglePress={mockGooglePress} />);
    
    const button = screen.getByText('Continue with Google');
    fireEvent.click(button);
    
    expect(mockGooglePress).toHaveBeenCalledTimes(1);
  });

  it('handles Apple button press', () => {
    render(<SocialLoginButtons onApplePress={mockApplePress} />);
    
    const button = screen.getByText('Continue with Apple');
    fireEvent.click(button);
    
    expect(mockApplePress).toHaveBeenCalledTimes(1);
  });

  it('handles Facebook button press', () => {
    render(<SocialLoginButtons onFacebookPress={mockFacebookPress} />);
    
    const button = screen.getByText('Continue with Facebook');
    fireEvent.click(button);
    
    expect(mockFacebookPress).toHaveBeenCalledTimes(1);
  });

  it('renders all buttons in disabled state', () => {
    render(
      <SocialLoginButtons 
        onGooglePress={mockGooglePress}
        onApplePress={mockApplePress}
        onFacebookPress={mockFacebookPress}
        disabled
      />
    );
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
  });

  it('does not call handlers when disabled', () => {
    render(
      <SocialLoginButtons 
        onGooglePress={mockGooglePress}
        onApplePress={mockApplePress}
        onFacebookPress={mockFacebookPress}
        disabled
      />
    );
    
    const googleButton = screen.getByText('Continue with Google');
    const appleButton = screen.getByText('Continue with Apple');
    const facebookButton = screen.getByText('Continue with Facebook');
    
    fireEvent.click(googleButton);
    fireEvent.click(appleButton);
    fireEvent.click(facebookButton);
    
    expect(mockGooglePress).not.toHaveBeenCalled();
    expect(mockApplePress).not.toHaveBeenCalled();
    expect(mockFacebookPress).not.toHaveBeenCalled();
  });
});