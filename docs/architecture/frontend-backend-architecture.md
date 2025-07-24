# **Frontend & Backend Architecture**

## **Frontend (React Native / Expo)**

  * **Folder Structure**:
    ```
    apps/mobile-app/
    ├── src/
    │   ├── api/          # API service definitions
    │   ├── components/   # Reusable UI components (ui/ & domain/)
    │   ├── hooks/        # Custom React hooks
    │   ├── navigation/   # React Navigation setup
    │   ├── screens/      # Top-level screen components
    │   ├── store/        # Zustand state management stores
    │   └── styles/       # Global styles, themes, NativeWind config
    └── app.json
    ```
  * **Component Template**:
    ```typescript
    // src/components/ui/MyComponent.tsx
    import { View, Text } from 'react-native';

    interface MyComponentProps {
      title: string;
    }

    export const MyComponent = ({ title }: MyComponentProps) => {
      return (
        <View className="p-4 bg-neutral-light rounded-lg">
          <Text className="text-white font-bold">{title}</StyledText>
        </View>
      );
    };
    ```

## **Backend (Express on Vercel/Lambda)**

  * **Folder Structure**:
    ```
    apps/backend-api/
    ├── src/
    │   ├── api/          # Vercel serverless function handlers
    │   ├── services/     # Core business logic
    │   ├── lib/          # Shared utilities (e.g., Prisma client)
    │   └── types/        # API-specific types
    └── vercel.json
    ```
  * **Service Template**:
    ```typescript
    // src/services/basketService.ts
    import { prisma } from '../lib/prisma';

    export const getBaskets = async () => {
      return await prisma.basket.findMany({
        where: { isCommunity: false },
      });
    };
    ```

-----
