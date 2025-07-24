# **STACK Coding Standards**

## **Critical Security & Architecture Rules**

### **Security Requirements**
- **NEVER** commit secret keys, API keys, or environment variables to the repository
- All sensitive data must be stored in environment variables and accessed via `process.env`
- All API routes must have input validation using **Zod** schemas
- Authentication must use **Thirdweb Auth** for wallet-based login
- All database queries must use **Prisma** ORM to prevent SQL injection
- Implement proper error handling that doesn't expose sensitive information

### **Architecture Compliance**
- All shared types must be defined in `packages/shared-types` and imported consistently
- Follow the monorepo structure with clear separation between `apps/` and `packages/`
- Use **Turborepo** for build orchestration and caching
- All backend logic must be serverless-compatible (stateless functions)
- Database connections must use **AWS RDS Proxy** for connection pooling

### **Design System Compliance**
- **MANDATORY**: Always reference `/docs/design.json` when building any UI components or screens
- **Color Palette**: Use only the colors defined in `design.json` - never hardcode colors
- **Typography**: Follow the exact font specifications (MD Nichrome for headings, Gilroy for body text)
- **Component Styling**: Match the component specifications exactly as defined in the design system
- **Layout Standards**: Use the defined spacing, padding, and corner radius values
- **Screen Structure**: Follow the exact layout specifications for each screen defined in `design.json`

**Example of proper design.json usage:**
```typescript
// ✅ Good: Using design.json values
const styles = {
  primaryButton: {
    backgroundColor: '#5852FF', // palette.primary.royalBlue from design.json
    borderRadius: 12, // from components.buttons.primary.cornerRadius
    padding: '16px 24px' // from components.buttons.primary.padding
  }
};

// ❌ Bad: Hardcoded values not from design.json
const styles = {
  primaryButton: {
    backgroundColor: '#4A90E2', // Random blue not in design system
    borderRadius: 8, // Not matching design.json specification
    padding: '12px 20px' // Custom padding not from design system
  }
};
```

---

## **Frontend Standards (React Native + Expo)**

### **Component Architecture**
- **Component Structure**: Follow atomic design principles (atoms, molecules, organisms)
- **Styling**: Use **NativeWind** classes exclusively - no inline styles or StyleSheet
- **State Management**: Use **Zustand** for global state, local state for component-specific data
- **Performance**: Implement lazy loading for screens and heavy components

### **UI/UX Implementation Requirements**
- **Mobile-First**: All components must be optimized for mobile devices first
- **Accessibility**: Implement WCAG 2.1 Level AA compliance
  - Minimum touch target size: 44x44 pixels
  - Color contrast ratio: 4.5:1 minimum
  - Screen reader support with proper semantic markup
- **Light Mode**: Use the defined color palette from UI specification
- **Responsive Design**: Support both phone and tablet orientations

### **Gamification & User Experience**
- **Immediate Feedback**: All user actions must provide visual/haptic feedback within 100ms
- **Animations**: Use satisfying animations for key actions ("Power Up", quest completion)
- **Language**: Use engaging, Gen Z-friendly terminology (avoid financial jargon)
  - "Power Up" instead of "Invest"
  - "Cash Out" instead of "Withdraw"
  - Simple asset names with logos, not tickers

### **Component Guidelines**
```typescript
// ✅ Good: Proper component structure
interface PowerUpButtonProps {
  basketId: string;
  onPress: (amount: number) => void;
  disabled?: boolean;
}

export const PowerUpButton: React.FC<PowerUpButtonProps> = ({
  basketId,
  onPress,
  disabled = false
}) => {
  return (
    <Pressable
      className="bg-accent px-6 py-4 rounded-xl disabled:opacity-50"
      onPress={() => onPress(amount)}
      disabled={disabled}
    >
      <Text className="text-dark font-bold text-lg">Power Up 🚀</Text>
    </Pressable>
  );
};
```

---

## **Backend Standards (Node.js + TypeScript)**

### **API Design**
- **REST API**: Follow RESTful conventions with proper HTTP methods
- **Error Handling**: Use consistent error response format
- **Validation**: All inputs must be validated with Zod schemas
- **Response Format**: Consistent JSON response structure

### **Database & ORM Standards**
- **Prisma**: Use Prisma Client for all database operations
- **Migrations**: All schema changes must use Prisma migrations
- **Transactions**: Use Prisma transactions for multi-table operations
- **Indexing**: Ensure proper database indexes for performance

### **Serverless Function Structure**
```typescript
// ✅ Good: Serverless function structure
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authenticateUser } from '@/lib/auth';

const investSchema = z.object({
  basketId: z.string().cuid(),
  amount: z.number().positive().min(1)
});

export async function POST(request: Request) {
  try {
    const user = await authenticateUser(request);
    const body = await request.json();
    const { basketId, amount } = investSchema.parse(body);

    // Business logic here
    const result = await prisma.portfolioHolding.create({
      data: { /* ... */ }
    });

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Investment failed' },
      { status: 400 }
    );
  }
}
```

### **Blockchain Integration**
- **Thirdweb SDK**: Use exclusively for all blockchain interactions
- **Error Handling**: Implement proper retry logic for blockchain operations
- **Gas Optimization**: Batch operations when possible
- **Wallet Management**: Use Thirdweb's in-app wallet features

---

## **Naming Conventions**

### **File & Directory Structure**
```
apps/
├── mobile-app/
│   ├── components/
│   │   ├── atoms/           # Basic UI elements
│   │   ├── molecules/       # Component combinations
│   │   └── organisms/       # Complex components
│   ├── screens/            # Screen components
│   ├── hooks/              # Custom hooks
│   ├── stores/             # Zustand stores
│   └── utils/              # Utility functions
├── backend-api/
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── lib/            # Shared utilities
│   │   └── types/          # Type definitions
packages/
├── shared-types/           # Shared TypeScript types
├── ui-components/          # Shared UI components
└── utils/                  # Shared utilities
```

### **Naming Rules**
- **Components**: `PascalCase.tsx` (e.g., `PowerUpButton.tsx`, `BasketCard.tsx`)
- **Screens**: `PascalCase.tsx` with "Screen" suffix (e.g., `DashboardScreen.tsx`)
- **Hooks**: `useCamelCase.ts` (e.g., `useAuth.ts`, `usePortfolio.ts`)
- **API Routes**: `camelCase.ts` (e.g., `investInBasket.ts`, `getUserProfile.ts`)
- **Services**: `camelCaseService.ts` (e.g., `portfolioService.ts`, `gamificationService.ts`)
- **Stores**: `camelCaseStore.ts` (e.g., `authStore.ts`, `portfolioStore.ts`)
- **Types**: `PascalCase` interfaces (e.g., `User`, `Basket`, `PortfolioHolding`)

---

## **Testing Standards**

### **Frontend Testing**
- **Unit Tests**: Jest + React Native Testing Library
- **Component Tests**: Test user interactions and accessibility
- **E2E Tests**: Playwright for critical user flows
- **Coverage**: Minimum 80% code coverage for components

### **Backend Testing**
- **Unit Tests**: Jest for individual functions
- **Integration Tests**: Supertest for API endpoints
- **Database Tests**: Use test database with Prisma
- **Coverage**: Minimum 90% code coverage for business logic

### **Test Structure**
```typescript
// ✅ Good: Test structure
describe('PowerUpButton', () => {
  it('should trigger investment when pressed', async () => {
    const mockOnPress = jest.fn();
    render(<PowerUpButton basketId="123" onPress={mockOnPress} />);

    const button = screen.getByRole('button', { name: /power up/i });
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledWith(expect.any(Number));
  });

  it('should be accessible to screen readers', () => {
    render(<PowerUpButton basketId="123" onPress={jest.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toBeAccessible();
  });
});
```

---

## **Performance Standards**

### **Frontend Performance**
- **Bundle Size**: Keep app bundle under 50MB
- **Load Times**: Initial screen load under 2 seconds
- **Animations**: Maintain 60 FPS for all animations
- **Memory**: Optimize image loading and component unmounting

### **Backend Performance**
- **Response Times**: API responses under 500ms
- **Database**: Optimize queries with proper indexing
- **Caching**: Implement appropriate caching strategies
- **Monitoring**: Use Sentry for error tracking and performance monitoring

---

## **Code Quality & Formatting**

### **Linting & Formatting**
- **ESLint**: Enforce code quality rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled
- **Husky**: Pre-commit hooks for linting and testing

### **Code Review Guidelines**
- All code must be reviewed before merging
- Focus on security, performance, and user experience
- Ensure accessibility compliance
- Verify proper error handling

### **Documentation**
- **JSDoc**: Document complex functions and components
- **README**: Keep project documentation up to date
- **API Docs**: Maintain OpenAPI specification
- **Architecture**: Update architecture docs with changes

---

## **Git & Deployment Standards**

### **Branch Strategy**
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/**: Feature development branches
- **hotfix/**: Critical bug fixes

### **Commit Messages**
```
feat(mobile): add power up button animation
fix(api): resolve portfolio calculation error
docs(readme): update setup instructions
test(auth): add wallet connection tests
```

### **Deployment**
- **Mobile**: Use EAS Build for app builds
- **Backend**: Deploy via Vercel with proper environment variables
- **Database**: Use Prisma migrations for schema updates
- **Monitoring**: Implement proper logging and error tracking

---

## **Accessibility Requirements**

### **WCAG 2.1 Level AA Compliance**
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Touch Targets**: Minimum 44x44 pixels
- **Screen Readers**: Proper semantic markup and labels
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Focus Management**: Clear focus indicators

### **Implementation Guidelines**
```typescript
// ✅ Good: Accessible component
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Invest in Tech Basket"
  accessibilityHint="Double tap to open investment amount selector"
  className="min-h-[44px] min-w-[44px]"
>
  <Text className="text-white font-semibold">Power Up</Text>
</Pressable>
```

---

## **Error Handling Standards**

### **Frontend Error Handling**
- **User-Friendly Messages**: No technical jargon in error messages
- **Retry Mechanisms**: Implement retry for network failures
- **Offline Support**: Handle offline scenarios gracefully
- **Loading States**: Show appropriate loading indicators

### **Backend Error Handling**
- **Consistent Format**: Standardized error response structure
- **Logging**: Comprehensive error logging with context
- **Security**: Don't expose sensitive information in errors
- **Monitoring**: Integration with error tracking services

---

This comprehensive coding standards document ensures that all development aligns with STACK's goals of creating an engaging, accessible, and secure Gen Z-focused investment platform.
