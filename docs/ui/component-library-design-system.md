# Component Library / Design System

Design System Approach:
For STACK, we will create a custom, lightweight component library. While using a pre-built library can be faster, building our own will give us complete control over the unique, gamified look and feel that is central to our brand. This ensures every button, card, and interaction feels like it belongs to STACK and aligns with the visual direction from the reference images.

## Core Components

### Button

* **Purpose:** To be used for all primary and secondary user actions (e.g., 'Power Up', 'Confirm', 'See All').
* **Variants:**
  * **Primary:** High-emphasis actions (lime green background).
  * **Secondary:** Medium-emphasis actions (e.g., blue background or outlined).
  * **Text/Link:** Low-emphasis navigation or minor actions.
* **States:** The button must have clear visual states for Default, Hover, Pressed, Disabled, and Loading.

### Info Card

* **Purpose:** To display distinct, self-contained blocks of information, such as the portfolio balance, individual assets in a list, or active quests.
* **Variants:**
  * **Primary Metric Card:** For displaying large, key numbers like the 'Total Value' or 'Available for Withdrawal'.
  * **List Item Card:** A smaller, horizontal card used for items in a list, like the assets in the 'Your Investments' section.
  * **Quest Card:** A variant designed to display gamified information, progress, and a 'Claim' button.
* **States:** Cards will have a 'Default' state and a 'Tappable' state (with visual feedback like a highlight or shadow lift on press) for cards that navigate to a detail view.

### Bottom Tab Bar

* **Purpose:** To provide persistent, top-level navigation, allowing users to switch between the main sections of the app (e.g., Home, Portfolio, Statistics, Settings).
* **Variants:** N/A. There will be one standard tab bar for the application.
* **States:** Each tab icon will have two states: **Active** (to indicate the user's current screen) and **Inactive**.
* **Usage Guidelines:** The tab bar should contain 4-5 items only, corresponding to the primary sections identified in the Information Architecture. It should be visible on all top-level screens.

## Foundational Components

In addition to the core components, the following foundational elements are required to construct the screens and experiences described in this document.

## Form & Input Components

### Input Field
A standardized text input for forms and modals, such as the "Enter Amount Modal" for investments. Must support labels, placeholders, and validation states.

### Toggle Switch
An on/off switch, required for enabling/disabling features like the "Round-up" setting in the Card Hub.

## Layout & Navigation Components

### Screen Header
A consistent header for secondary screens that displays the screen title and a contextual back button.

### Modal
A component for displaying content over the current screen, required for the "Power Up" flow and other confirmation dialogues.

### Floating Action Button (FAB)
A circular button that floats above the UI, intended for the AI Expert feature on the Dashboard.

## Data Display Components

### Chart / Graph
A simple, non-technical line graph component to visualize historical performance in the Basket Detail View.

### Progress Bar
A visual element to show progress, required for the Battle Pass progression tracker on the Quest screen.

### Icon
A dedicated component to consistently render icons from our selected library, adhering to the minimalist, outlined style.

### List & List Item
A generic list container and item component for displaying simple, scrollable data like transaction history or the assets within a Basket.

