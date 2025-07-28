import React from 'react';
import { render, screen } from '@testing-library/react';
import { Chart } from '../src/components/atoms/Chart';

const mockData = [
  { value: 10, label: 'Jan' },
  { value: 20, label: 'Feb' },
  { value: 15, label: 'Mar' },
  { value: 25, label: 'Apr' },
];

describe('Chart', () => {
  it('renders without crashing', () => {
    const { container } = render(<Chart data={mockData} />);
    expect(container).toBeTruthy();
  });

  it('renders with default line chart type', () => {
    render(<Chart data={mockData} testID="line-chart" />);
    const chart = screen.getByTestId('line-chart');
    expect(chart).toBeTruthy();
  });

  it('renders bar chart type', () => {
    render(<Chart data={mockData} type="bar" testID="bar-chart" />);
    const chart = screen.getByTestId('bar-chart');
    expect(chart).toBeTruthy();
  });

  it('renders progress chart type', () => {
    render(<Chart data={mockData} type="progress" testID="progress-chart" />);
    const chart = screen.getByTestId('progress-chart');
    expect(chart).toBeTruthy();
  });

  it('renders with title', () => {
    render(<Chart data={mockData} title="Test Chart" testID="titled-chart" />);
    const title = screen.getByText('Test Chart');
    expect(title).toBeTruthy();
  });

  it('renders with custom height', () => {
    render(<Chart data={mockData} height={200} testID="custom-height-chart" />);
    const chart = screen.getByTestId('custom-height-chart');
    expect(chart).toBeTruthy();
  });

  it('shows labels when enabled', () => {
    render(<Chart data={mockData} showLabels={true} testID="labeled-chart" />);
    const chart = screen.getByTestId('labeled-chart');
    expect(chart).toBeTruthy();
    
    // Check if labels are rendered
    expect(screen.getByText('Jan')).toBeTruthy();
    expect(screen.getByText('Feb')).toBeTruthy();
  });

  it('shows values when enabled for bar chart', () => {
    render(<Chart data={mockData} type="bar" showValues={true} testID="valued-chart" />);
    const chart = screen.getByTestId('valued-chart');
    expect(chart).toBeTruthy();
    
    // Check if values are rendered
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('20')).toBeTruthy();
  });

  it('handles empty data gracefully', () => {
    render(<Chart data={[]} testID="empty-chart" />);
    const chart = screen.getByTestId('empty-chart');
    expect(chart).toBeTruthy();
  });

  it('handles single data point', () => {
    const singleData = [{ value: 50, label: 'Single' }];
    render(<Chart data={singleData} testID="single-chart" />);
    const chart = screen.getByTestId('single-chart');
    expect(chart).toBeTruthy();
  });

  it('applies custom className', () => {
    render(<Chart data={mockData} className="custom-class" testID="classed-chart" />);
    const chart = screen.getByTestId('classed-chart');
    expect(chart).toBeTruthy();
  });

  it('handles data with custom colors', () => {
    const coloredData = [
      { value: 10, label: 'Red', color: '#FF0000' },
      { value: 20, label: 'Blue', color: '#0000FF' },
    ];
    render(<Chart data={coloredData} testID="colored-chart" />);
    const chart = screen.getByTestId('colored-chart');
    expect(chart).toBeTruthy();
  });
});