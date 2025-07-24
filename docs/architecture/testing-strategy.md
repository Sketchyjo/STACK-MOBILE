# Testing Strategy

This section formalizes our commitment to the "Full Testing Pyramid" we agreed on earlier. It will define the types of tests we'll write, where they will live in our monorepo, and provide clear examples for our developers.

### Testing Pyramid

Our strategy is based on the Testing Pyramid. We will write many fast unit tests at the base, a healthy number of integration tests in the middle, and a few, high-value end-to-end tests at the top to ensure quality and reliability.

```plaintext
      /      \
   End-to-End Tests
  /----------------\
 Integration Tests
/------------------\
   Unit Tests
```

### Test Organization

  * **Frontend Tests (`apps/mobile-app`):**
      * **Unit/Component Tests (`*.test.tsx`):** Will be co-located with the component files they are testing.
      * **E2E Tests (`e2e/`):** A dedicated folder at the root of the mobile app package will contain our Playwright end-to-end test suites.
  * **Backend Tests (`apps/backend-api`):**
      * **Unit Tests (`*.test.ts`):** Will be co-located with the service and utility files they test.
      * **Integration Tests (`__tests__/`):** A dedicated folder will be used for tests that require a live database connection or test the integration between multiple services.
  * **Smart Contract Tests (`packages/contracts`):**
      * Tests will be written using Foundry or Hardhat and will live within the `contracts` package, following the standard practices for those tools.

### Test Examples

#### Frontend Component Test (Jest & React Native Testing Library)

```typescript
// src/components/ui/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

it('calls onPress when tapped', () => {
  const onPressMock = jest.fn();
  const { getByText } = render(<Button title="Test" onPress={onPressMock} />);

  fireEvent.press(getByText('Test'));

  expect(onPressMock).toHaveBeenCalledTimes(1);
});
```

#### Backend API Test (Jest & Supertest)

```typescript
// src/functions/baskets/getBaskets.test.ts
import request from 'supertest';
import { app } from '../../app'; // Assuming a central Express app instance for testing

it('returns a list of baskets', async () => {
  const response = await request(app)
    .get('/api/v1/baskets')
    .set('Authorization', 'Bearer <test_token>');

  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});
```

#### E2E Test (Playwright)

```typescript
// e2e/investment.spec.ts
import { test, expect } from '@playwright/test';

test('New user can make their first investment', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  // ... steps to log in

  // 2. Navigate to a basket
  await page.getByTestId('dashboard-feed').waitFor();
  await page.getByText('Gamer Basket').click();

  // 3. Make an investment
  await page.getByRole('button', { name: 'Power Up' }).click();
  await page.getByPlaceholder('Amount').fill('10');
  await page.getByRole('button', { name: 'Confirm Investment' }).click();

  // 4. Verify success
  await expect(page.getByText('Investment Successful!')).toBeVisible();
});
```

-----
