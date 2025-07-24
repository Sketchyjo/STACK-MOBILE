import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { ProgressBar } from '../src/components/atoms/ProgressBar';

describe('ProgressBar Component', () => {
  it('renders correctly with default props', () => {
    const component = render(
      <ProgressBar progress={50} />
    );
    
    expect(component.toJSON()).toBeTruthy();
  });

  it('displays correct progress width', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressBar progress={75} />
    );
    
    const views = UNSAFE_getAllByType(View);
    const progressFill = views[1]; // Second View is the progress fill
    
    expect(progressFill.props.style.width).toBe('75%');
  });

  it('clamps progress to 0-100 range', () => {
    const { rerender, UNSAFE_getAllByType } = render(
      <ProgressBar progress={-10} />
    );
    
    let views = UNSAFE_getAllByType(View);
    let progressFill = views[1];
    expect(progressFill.props.style.width).toBe('0%');

    rerender(<ProgressBar progress={150} />);
    
    views = UNSAFE_getAllByType(View);
    progressFill = views[1];
    expect(progressFill.props.style.width).toBe('100%');
  });

  it('applies custom height', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressBar progress={50} height={12} />
    );
    
    const views = UNSAFE_getAllByType(View);
    const progressBar = views[0]; // First View is the container
    const style = Array.isArray(progressBar.props.style) 
      ? progressBar.props.style[0] 
      : progressBar.props.style;
    expect(style.height).toBe(12);
  });

  it('applies custom background color', () => {
    const customBg = '#FF0000';
    const { UNSAFE_getAllByType } = render(
      <ProgressBar 
        progress={50} 
        backgroundColor={customBg} 
      />
    );
    
    const views = UNSAFE_getAllByType(View);
    const progressBar = views[0];
    const style = Array.isArray(progressBar.props.style) 
      ? progressBar.props.style[0] 
      : progressBar.props.style;
    expect(style.backgroundColor).toBe(customBg);
  });

  it('applies custom progress color', () => {
    const customColor = '#00FF00';
    const { UNSAFE_getAllByType } = render(
      <ProgressBar 
        progress={50} 
        progressColor={customColor} 
      />
    );
    
    const views = UNSAFE_getAllByType(View);
    const progressFill = views[1];
    expect(progressFill.props.style.backgroundColor).toBe(customColor);
  });

  it('applies custom className', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressBar 
        progress={50} 
        className="custom-class" 
      />
    );
    
    const views = UNSAFE_getAllByType(View);
    const progressBar = views[0];
    expect(progressBar.props.className).toContain('custom-class');
  });

  it('uses design system colors by default', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressBar progress={50} />
    );
    
    const views = UNSAFE_getAllByType(View);
    const progressBar = views[0];
    const progressFill = views[1];
    
    const containerStyle = Array.isArray(progressBar.props.style) 
      ? progressBar.props.style[0] 
      : progressBar.props.style;
    
    expect(containerStyle.backgroundColor).toBe('#EAE2FF');
    expect(progressFill.props.style.backgroundColor).toBe('#5852FF');
  });

  it('handles zero progress', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressBar progress={0} />
    );
    
    const views = UNSAFE_getAllByType(View);
    const progressFill = views[1];
    expect(progressFill.props.style.width).toBe('0%');
  });

  it('handles full progress', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressBar progress={100} />
    );
    
    const views = UNSAFE_getAllByType(View);
    const progressFill = views[1];
    expect(progressFill.props.style.width).toBe('100%');
  });
});