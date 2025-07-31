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

- **Typography**: Reference `tailwind.config.js` for font families (MD Nichrome for headings, Gilroy for body text)
- **Component Styling**: Match component specifications using Tailwind classes defined in `tailwind.config.js`
- **Layout Standards**: Use spacing, padding, and border radius values from `tailwind.config.js` theme settings
- **Screen Structure**: Follow layout specifications using Tailwind's responsive breakpoints and grid system
- **Colors**: Use color tokens defined in `tailwind.config.js` theme.colors for consistent branding

---

## **Frontend Standards (React Native + Expo)**

### **Component Architecture**

- **Component Structure**: Follow atomic design principles (atoms, molecules, organisms)
- **Styling**: Use **NativeWind** classes exclusively - no inline styles or StyleSheet
  - Reference `tailwind.config.js` for custom utility classes and theme settings
  - Use theme extensions for custom values not in default Tailwind
- **State Management**: Use **Zustand** for global state, local state for component-specific data
- **Performance**: Implement lazy loading for screens and heavy components

### **UI/UX Implementation Requirements**

- **Mobile-First**: All components must be optimized for mobile devices first
  - Use Tailwind's responsive breakpoints defined in `tailwind.config.js`
- **Accessibility**: Implement WCAG 2.1 Level AA compliance
  - Minimum touch target size: 44x44 pixels (use Tailwind's min-w and min-h utilities)
  - Color contrast ratio: 4.5:1 minimum (verify using color tokens from theme)
  - Screen reader support with proper semantic markup
- **Theme Configuration**:
  - Reference `tailwind.config.js` for:
    - Color palette and gradients
    - Typography scale and line heights
    - Spacing and sizing units
    - Custom animations and transitions
    - Breakpoints and container queries
- **Responsive Design**: Support both phone and tablet orientations using Tailwind's responsive modifiers

[Rest of the document remains unchanged...]
