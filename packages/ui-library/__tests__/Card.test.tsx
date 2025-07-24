import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Card } from '../src/components/atoms/Card';

describe('Card Component', () => {
  it('renders correctly with default props', () => {
    const component = render(
      <Card>
        <Text>Test Content</Text>
      </Card>
    );
    
    const tree = component.toJSON();
    expect(JSON.stringify(tree)).toContain('Test Content');
  });

  it('applies default variant styles', () => {
    const { UNSAFE_getByType } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    const style = Array.isArray(card.props.style) 
      ? card.props.style[0] 
      : card.props.style;
    expect(style.backgroundColor).toBe('#F7F7F7');
  });

  it('applies quest variant styles', () => {
    const { UNSAFE_getByType } = render(
      <Card variant="quest">
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    const style = Array.isArray(card.props.style) 
      ? card.props.style[0] 
      : card.props.style;
    expect(style.backgroundColor).toBe('#F7F7F7');
  });

  it('applies different padding sizes', () => {
    const { rerender, UNSAFE_getByType } = render(
      <Card padding="small">
        <Text>Content</Text>
      </Card>
    );
    
    let card = UNSAFE_getByType(View);
    let style = Array.isArray(card.props.style) 
      ? card.props.style[1] 
      : card.props.style;
    expect(style.padding).toBe(12);

    rerender(
      <Card padding="medium">
        <Text>Content</Text>
      </Card>
    );
    
    card = UNSAFE_getByType(View);
    style = Array.isArray(card.props.style) 
      ? card.props.style[1] 
      : card.props.style;
    expect(style.padding).toBe(16);

    rerender(
      <Card padding="large">
        <Text>Content</Text>
      </Card>
    );
    
    card = UNSAFE_getByType(View);
    style = Array.isArray(card.props.style) 
      ? card.props.style[1] 
      : card.props.style;
    expect(style.padding).toBe(24);
  });

  it('applies custom className', () => {
    const { UNSAFE_getByType } = render(
      <Card className="custom-class">
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    expect(card.props.className).toContain('custom-class');
  });

  it('passes through additional props', () => {
    const { UNSAFE_getByType } = render(
      <Card accessibilityLabel="Test Card">
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    expect(card.props.accessibilityLabel).toBe('Test Card');
  });

  it('renders children correctly', () => {
    const component = render(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Card>
    );
    
    const tree = component.toJSON();
    const treeString = JSON.stringify(tree);
    expect(treeString).toContain('First Child');
    expect(treeString).toContain('Second Child');
  });
});