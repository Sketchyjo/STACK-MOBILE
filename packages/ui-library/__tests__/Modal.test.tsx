import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Modal } from '../src/components/atoms/Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders children when visible', () => {
    const component = render(
      <Modal isVisible={true} onClose={mockOnClose}>
        <Text>Modal Content</Text>
      </Modal>
    );

    const tree = component.toJSON();
    expect(JSON.stringify(tree)).toContain('Modal Content');
  });

  it('does not render children when not visible', () => {
    const { queryByText } = render(
      <Modal isVisible={false} onClose={mockOnClose}>
        <Text>Modal Content</Text>
      </Modal>
    );

    expect(queryByText('Modal Content')).toBeNull();
  });

  it('shows close button by default', () => {
    const { getByLabelText } = render(
      <Modal isVisible={true} onClose={mockOnClose}>
        <Text>Modal Content</Text>
      </Modal>
    );

    expect(getByLabelText('Close modal')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByLabelText } = render(
      <Modal isVisible={true} onClose={mockOnClose}>
        <Text>Modal Content</Text>
      </Modal>
    );

    fireEvent.press(getByLabelText('Close modal'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when showCloseButton is false', () => {
    const { queryByLabelText } = render(
      <Modal isVisible={true} onClose={mockOnClose} showCloseButton={false}>
        <Text>Modal Content</Text>
      </Modal>
    );

    expect(queryByLabelText('Close modal')).toBeNull();
  });
});