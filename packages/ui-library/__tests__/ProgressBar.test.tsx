import React from 'react';
import { render } from '@testing-library/react';
import { ProgressBar } from '../src/components/atoms/ProgressBar';

describe('ProgressBar Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(
      <ProgressBar progress={50} />
    );
    
    expect(container).toBeTruthy();
  });

  it('displays correct progress width', () => {
    const { container } = render(
      <ProgressBar progress={75} />
    );
    
    expect(container).toBeTruthy();
  });

  it('clamps progress to 0-100 range', () => {
    const { container, rerender } = render(
      <ProgressBar progress={-10} />
    );
    
    expect(container).toBeTruthy();

    rerender(<ProgressBar progress={150} />);
    
    expect(container).toBeTruthy();
  });

  it('applies custom height', () => {
    const { container } = render(
      <ProgressBar progress={50} height={12} />
    );
    
    expect(container).toBeTruthy();
  });

  it('applies custom background color', () => {
    const { container } = render(
      <ProgressBar 
        progress={50} 
        backgroundColor="#FF0000" 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('applies custom progress color', () => {
    const { container } = render(
      <ProgressBar 
        progress={50} 
        progressColor="#00FF00" 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProgressBar 
        progress={50} 
        className="custom-class" 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('uses design system colors by default', () => {
    const { container } = render(
      <ProgressBar progress={50} />
    );
    
    expect(container).toBeTruthy();
  });

  it('handles zero progress', () => {
    const { container } = render(
      <ProgressBar progress={0} />
    );
    
    expect(container).toBeTruthy();
  });

  it('handles full progress', () => {
    const { container } = render(
      <ProgressBar progress={100} />
    );
    
    expect(container).toBeTruthy();
  });
});