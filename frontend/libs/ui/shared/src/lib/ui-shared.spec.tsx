import { render } from '@testing-library/react';

import UiShared from './ui-shared';

describe('UiShared', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiShared />);
    expect(baseElement).toBeTruthy();
  });
});
