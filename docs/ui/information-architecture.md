# Information Architecture (IA)

## Site Map / Screen Inventory

This diagram shows the high-level relationship between the main screens of the application.

Code snippet

graph TD  
    subgraph Onboarding Flow  
        O1\[Sign Up / Login\] \--\> O2\[Wallet Creation\] \--\> O3\[Onboarding Steps\] \--\> O4\[Receive Starter Slice\] \--\> A\[Dashboard\]  
    end

    subgraph Main App Navigation  
        A\[Dashboard / 'For You' Feed\] \--\> B\[Basket Detail View\]  
        A \--\> C\[Curator Profile View\]

        D\[Portfolio\] \--\> B  
          
        F\[Card Hub\] \--\> G\[Micro-loan Hub\]  
        F \--\> H\[Transaction History\]

        I\[Quests / Battle Pass\]  
          
        J\[Profile & Settings\]  
    end

## Navigation Structure

* **Primary Navigation:** A persistent bottom tab bar will be used for main navigation, providing immediate access to the core sections of the app. The proposed tabs are: **Dashboard**, **Portfolio**, **Card**, **Quests**, and **Profile**.  
* **Secondary Navigation:** Secondary navigation will be contextual, following standard mobile patterns. For example, tapping a "Basket" on the Dashboard will navigate the user forward to the "Basket Detail View," which will have a back button in the header to return.  
* **Breadcrumbs:** Traditional breadcrumbs are not used in mobile app navigation. Clear screen titles will provide context for the user's location within the app.