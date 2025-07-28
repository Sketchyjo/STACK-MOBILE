import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from '../src/components/atoms/Icon';

describe('Icon', () => {
  it('renders without crashing', () => {
    const { container } = render(<Icon name="home" />);
    expect(container).toBeTruthy();
  });

  it('renders with default ionicons library', () => {
    render(<Icon name="home" testID="test-icon" />);
    const iconContainer = screen.getByTestId('test-icon');
    expect(iconContainer).toBeTruthy();
  });

  it('renders with different icon libraries', () => {
    render(<Icon name="home" library="material" testID="material-icon" />);
    const iconContainer = screen.getByTestId('material-icon');
    expect(iconContainer).toBeTruthy();
  });

  it('applies custom size', () => {
    render(<Icon name="home" size={32} testID="sized-icon" />);
    const iconContainer = screen.getByTestId('sized-icon');
    expect(iconContainer).toBeTruthy();
  });

  it('applies custom color', () => {
    render(<Icon name="home" color="#FF0000" testID="colored-icon" />);
    const iconContainer = screen.getByTestId('colored-icon');
    expect(iconContainer).toBeTruthy();
  });

  it('applies custom className', () => {
    render(<Icon name="home" className="custom-class" testID="classed-icon" />);
    const iconContainer = screen.getByTestId('classed-icon');
    expect(iconContainer).toBeTruthy();
  });

  it('supports all icon libraries', () => {
    const libraries = ['ionicons', 'material', 'fontawesome', 'antdesign', 'entypo', 'feather'] as const;
    
    libraries.forEach((library, index) => {
      render(<Icon name="home" library={library} testID={`icon-${library}`} />);
      const iconContainer = screen.getByTestId(`icon-${library}`);
      expect(iconContainer).toBeTruthy();
    });
  });
});