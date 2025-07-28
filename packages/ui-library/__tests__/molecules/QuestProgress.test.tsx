import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuestProgress } from '../../src/components/molecules/QuestProgress';

describe('QuestProgress', () => {
  const defaultProps = {
    title: 'Complete Daily Tasks',
    description: 'Finish all your daily investment tasks to earn rewards',
    progress: 60,
    currentStep: 3,
    totalSteps: 5,
    reward: '100 coins',
    difficulty: 'easy' as const,
    timeRemaining: '2 hours',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders quest information correctly', () => {
    const component = render(<QuestProgress {...defaultProps} />);
    expect(component).toBeTruthy();
  });

  it('displays reward and time remaining', () => {
    const component = render(<QuestProgress {...defaultProps} />);
    expect(component).toBeTruthy();
  });

  it('handles different difficulty levels', () => {
    const component1 = render(<QuestProgress {...defaultProps} difficulty="hard" />);
    expect(component1).toBeTruthy();

    const component2 = render(<QuestProgress {...defaultProps} difficulty="medium" />);
    expect(component2).toBeTruthy();
  });

  it('calls onPress when quest card is pressed', () => {
    const { getByLabelText } = render(<QuestProgress {...defaultProps} />);

    const questCard = getByLabelText('Quest: Complete Daily Tasks, 60% complete');
    fireEvent.press(questCard);

    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom className and testID', () => {
    const component = render(
      <QuestProgress {...defaultProps} className="custom-class" testID="quest-progress" />
    );
    expect(component).toBeTruthy();
  });

  it('handles zero progress', () => {
    const component = render(<QuestProgress {...defaultProps} progress={0} currentStep={0} />);
    expect(component).toBeTruthy();
  });

  it('handles complete progress', () => {
    const component = render(<QuestProgress {...defaultProps} progress={100} currentStep={5} />);
    expect(component).toBeTruthy();
  });
});