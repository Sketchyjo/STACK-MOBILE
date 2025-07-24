import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../src/components/molecules/SearchBar';

describe('SearchBar', () => {
  it('renders without crashing', () => {
    const result = render(<SearchBar />);
    expect(result).toBeTruthy();
  });

  it('renders with placeholder text', () => {
    const { getByLabelText } = render(
      <SearchBar placeholder="Search items..." />
    );
    
    const input = getByLabelText('Search input');
    expect(input.props.placeholder).toBe('Search items...');
  });

  it('handles text input changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByLabelText } = render(
      <SearchBar onChangeText={mockOnChangeText} />
    );
    
    const input = getByLabelText('Search input');
    fireEvent.changeText(input, 'test query');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test query');
  });

  it('handles search submission', () => {
    const mockOnSearch = jest.fn();
    const { getByLabelText } = render(
      <SearchBar onSearch={mockOnSearch} />
    );
    
    const input = getByLabelText('Search input');
    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');
    
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('shows clear button when text is entered', () => {
    const { getByLabelText } = render(<SearchBar value="test" />);
    
    expect(getByLabelText('Clear search')).toBeTruthy();
  });

  it('handles clear button press', () => {
    const mockOnClear = jest.fn();
    const mockOnChangeText = jest.fn();
    const { getByLabelText } = render(
      <SearchBar value="test" onClear={mockOnClear} onChangeText={mockOnChangeText} />
    );
    
    const clearButton = getByLabelText('Clear search');
    fireEvent.press(clearButton);
    
    expect(mockOnClear).toHaveBeenCalled();
    expect(mockOnChangeText).toHaveBeenCalledWith('');
  });

  it('renders with controlled value', () => {
    const { getByLabelText } = render(
      <SearchBar value="controlled value" />
    );
    
    const input = getByLabelText('Search input');
    expect(input.props.value).toBe('controlled value');
  });

  it('renders in disabled state', () => {
    const { getByLabelText } = render(
      <SearchBar disabled />
    );
    
    const input = getByLabelText('Search input');
    expect(input).toBeTruthy();
  });

  it('renders with custom class name', () => {
    const result = render(
      <SearchBar className="custom-search" />
    );
    
    expect(result).toBeTruthy();
  });

  it('renders with autoFocus', () => {
    const { getByLabelText } = render(
      <SearchBar autoFocus />
    );
    
    const input = getByLabelText('Search input');
    expect(input).toBeTruthy();
  });
});