import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TactileButton } from '../../src/components/TactileButton';

describe('TactileButton', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <TactileButton onPress={() => {}}>
        <Text>Test Button</Text>
      </TactileButton>
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <TactileButton onPress={mockOnPress}>
        <Text>Test Button</Text>
      </TactileButton>
    );
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <TactileButton onPress={mockOnPress} disabled={true}>
        <Text>Test Button</Text>
      </TactileButton>
    );
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
