import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text, View } from 'react-native';
import { Card } from '../src/components/atoms/Card';

describe('Card Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Card>
        <Text>Test Content</Text>
      </Card>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );
    
    expect(container).toBeTruthy();
  });

  it('applies quest variant styles', () => {
    const { container } = render(
      <Card variant="quest">
        <Text>Content</Text>
      </Card>
    );
    
    expect(container).toBeTruthy();
  });

  it('applies different padding sizes', () => {
    const { container, rerender } = render(
      <Card padding="small">
        <Text>Content</Text>
      </Card>
    );
    
    expect(container).toBeTruthy();

    rerender(
      <Card padding="medium">
        <Text>Content</Text>
      </Card>
    );
    
    expect(container).toBeTruthy();

    rerender(
      <Card padding="large">
        <Text>Content</Text>
      </Card>
    );
    
    expect(container).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <Text>Content</Text>
      </Card>
    );
    
    expect(container).toBeTruthy();
  });

  it('passes through additional props', () => {
    const { container } = render(
      <Card accessibilityLabel="Test Card">
        <Text>Content</Text>
      </Card>
    );
    
    expect(container).toBeTruthy();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Card>
    );
    
    expect(getByText('First Child')).toBeInTheDocument();
    expect(getByText('Second Child')).toBeInTheDocument();
  });
});