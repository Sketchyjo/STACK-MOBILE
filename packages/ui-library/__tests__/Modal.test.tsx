import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { Modal } from '../src/components/atoms/Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders children when visible', () => {
    const { getByText } = render(
      <Modal isVisible={true} onClose={mockOnClose}>
        <Text>Modal Content</Text>
      </Modal>
    );

    expect(getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render children when not visible', () => {
    const { queryByText } = render(
      <Modal isVisible={false} onClose={mockOnClose}>
        <Text>Modal Content</Text>
      </Modal>
    );

    expect(queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('shows close button by default', () => {
    const { getByLabelText } = render(
      <Modal isVisible={true} onClose={mockOnClose}>
        <Text>Modal Content</Text>
      </Modal>
    );

    expect(getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByLabelText } = render(
      <Modal isVisible={true} onClose={mockOnClose}>
        <Text>Modal Content</Text>
      </Modal>
    );

    fireEvent.click(getByLabelText('Close modal'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when showCloseButton is false', () => {
    const { queryByLabelText } = render(
      <Modal isVisible={true} onClose={mockOnClose} showCloseButton={false}>
        <Text>Modal Content</Text>
      </Modal>
    );

    expect(queryByLabelText('Close modal')).not.toBeInTheDocument();
  });
});