import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../src/components/molecules/SearchBar';

describe('SearchBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<SearchBar />);
    expect(container).toBeTruthy();
  });

  it('renders with placeholder text', () => {
    const { getByPlaceholderText } = render(
      <SearchBar placeholder="Search items..." />
    );
    
    expect(getByPlaceholderText('Search items...')).toBeInTheDocument();
  });

  it('handles text input changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByLabelText } = render(
      <SearchBar onChangeText={mockOnChangeText} />
    );
    
    const input = getByLabelText('Search input');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test query');
  });

  it('handles search submission', () => {
    const mockOnSearch = jest.fn();
    const { getByLabelText } = render(
      <SearchBar onSearch={mockOnSearch} />
    );
    
    const input = getByLabelText('Search input');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('shows clear button when text is entered', () => {
    const { getByLabelText } = render(<SearchBar value="test" />);
    
    expect(getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('handles clear button press', () => {
    const mockOnClear = jest.fn();
    const mockOnChangeText = jest.fn();
    const { getByLabelText } = render(
      <SearchBar value="test" onClear={mockOnClear} onChangeText={mockOnChangeText} />
    );
    
    const clearButton = getByLabelText('Clear search');
    fireEvent.click(clearButton);
    
    expect(mockOnClear).toHaveBeenCalled();
    expect(mockOnChangeText).toHaveBeenCalledWith('');
  });

  it('renders with controlled value', () => {
    const { getByDisplayValue } = render(
      <SearchBar value="controlled value" />
    );
    
    expect(getByDisplayValue('controlled value')).toBeInTheDocument();
  });

  it('renders in disabled state', () => {
    const { getByLabelText } = render(
      <SearchBar disabled />
    );
    
    const input = getByLabelText('Search input');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom class name', () => {
    const { container } = render(
      <SearchBar className="custom-search" />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with autoFocus', () => {
    const { getByLabelText } = render(
      <SearchBar autoFocus />
    );
    
    const input = getByLabelText('Search input');
    expect(input).toBeInTheDocument();
  });
});