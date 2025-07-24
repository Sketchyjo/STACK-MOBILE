import React from 'react';
import { render } from '@testing-library/react-native';
import { OrSeparator } from '../src/components/atoms/OrSeparator';

describe('OrSeparator', () => {
  it('renders without crashing', () => {
    const result = render(<OrSeparator />);
    expect(result).toBeTruthy();
  });

  it('renders with default "OR" text', () => {
    const { getByText } = render(<OrSeparator />);
    
    expect(getByText('OR')).toBeTruthy();
  });

  it('renders with custom text', () => {
    const { getByText } = render(<OrSeparator text="AND" />);
    
    expect(getByText('AND')).toBeTruthy();
  });

  it('renders with empty text', () => {
    const { queryByText } = render(<OrSeparator text="" />);
    
    expect(queryByText('OR')).toBeNull();
  });

  it('renders separator lines', () => {
    const { root } = render(<OrSeparator />);
    
    // Check that the component has the expected structure with separator lines
    const views = root.findAllByType('View');
    expect(views.length).toBeGreaterThan(1); // Should have multiple View components for lines
  });
});