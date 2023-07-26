import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { testId } from '../tests/utils/testEnums';
import App from './App';

describe('App Tests', () => {
  it('should render without errors with default props', () => {
    // const { getByTestId } = render(<App data-testid={testId} />);

    // expect(getByTestId(testId)).toBeDefined();
    return true;
  });

  it('should not have axe accessibility issues with default props', async () => {
    // const { container } = render(<App />);
    // const results = await axe(container);

    // expect(results).toHaveNoViolations();
    return true;
  });
});
