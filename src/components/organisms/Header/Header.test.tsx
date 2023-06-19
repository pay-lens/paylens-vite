import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { testId } from '../../../../tests/utils/testEnums';
import Header from './Header';

describe('Header Tests', () => {
  it('should render without errors with default props', () => {
    const { getByTestId } = render(<Header data-testid={testId} />);

    expect(getByTestId(testId)).toBeDefined();
  });

  it('should not have axe accessibility issues with default props', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
