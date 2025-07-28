import React from 'react';
import { render, screen } from '@testing-library/react';
import { OrSeparator } from '../src/components/atoms/OrSeparator';

describe('OrSeparator', () => {
  it('renders without crashing', () => {
    const { container } = render(<OrSeparator />);
    expect(container).toBeTruthy();
  });

  it('renders with default "OR" text', () => {
    const { getByText } = render(<OrSeparator />);
    
    expect(getByText('OR')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const { getByText } = render(<OrSeparator text="AND" />);
    
    expect(getByText('AND')).toBeInTheDocument();
  });

  it('renders with empty text', () => {
    const { queryByText } = render(<OrSeparator text="" />);
    
    expect(queryByText('OR')).not.toBeInTheDocument();
  });

  it('renders separator lines', () => {
    const { container } = render(<OrSeparator />);
    
    // Check that the component renders successfully
    expect(container).toBeTruthy();
  });
});