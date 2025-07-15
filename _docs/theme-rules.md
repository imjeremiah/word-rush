# Word Rush: Theme & Style Guide

This document defines the visual theme for Word Rush. Our theme is **Flat 2.0 / Modern Material Design**, which will give us a clean, vibrant, and professional aesthetic that balances strategic clarity with playful, 'juicy' feedback.

## 1. Color Palette

The color palette is designed to be energetic, clear, and accessible.

### Primary Colors
-   **Primary (`primary`)**: `#4A6BFF` (A friendly, confident blue for main buttons and branding.)
-   **Accent (`accent`)**: `#FF7A59` (A vibrant orange for highlights, secondary actions, and timers.)

### Neutral Colors (Grayscale)
-   **Text (`text`)**: `#2D3748` (A dark, soft charcoal for all body copy and headings.)
-   **Subtle Text (`text-subtle`)**: `#718096` (A lighter gray for secondary text and labels.)
-   **Disabled (`disabled`)**: `#A0AEC0` (For disabled buttons and text inputs.)
-   **Border / Divider (`border`)**: `#E2E8F0` (For subtle borders and dividers.)
-   **Background (`background`)**: `#F7FAFC` (A very light, off-white for main backgrounds.)
-   **Card Background (`card-bg`)**: `#FFFFFF` (Pure white for cards and modals to lift them off the background.)

### Feedback Colors
-   **Success (`success`)**: `#1DD1A1` (A bright, positive green.)
-   **Error (`error`)**: `#FF5252` (A clear, unambiguous red.)
-   **Warning (`warning`)**: `#FFC107` (A noticeable yellow/orange.)

## 2. Typography

We will use high-quality, legible fonts hosted by Google Fonts.

-   **Heading Font**: **Nunito**
    -   **Why**: Its rounded terminals give it a friendly, approachable feel that aligns with the "fun" aspect of the game.
    -   **Weights**: Use `700` (Bold) for main titles and `600` (Semi-Bold) for subtitles.
-   **Body Font**: **Inter**
    -   **Why**: It's a highly readable sans-serif font designed specifically for computer screens, ensuring maximum clarity.
    -   **Weights**: Use `400` (Regular) for body text and `600` (Semi-Bold) for button text.

## 3. UI Element Styles

### Spacing & Sizing
-   **Base Unit**: `8px`. All spacing (padding, margins) should be a multiple of this unit (e.g., `8px`, `16px`, `24px`).
-   **Border Radius**: A standard `8px` border-radius will be used on buttons, inputs, and cards to maintain a soft, friendly aesthetic.

### Buttons
-   **Primary**: Solid `primary` background, white text, soft shadow. On hover, it should get slightly brighter.
-   **Secondary**: Solid `accent` background, white text, soft shadow.
-   **Tertiary/Ghost**: Transparent background, `primary` text, and a `primary` border.

### Cards & Containers
-   **Style**: White (`#FFFFFF`) background, `8px` border-radius, and a soft, diffused shadow to lift it from the main background.
-   **Usage**: For lobbies, player lists, and modal dialogs.

### Shadows
-   **Standard**: `0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)` (A soft, subtle shadow for buttons and cards).
-   **Large**: `0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)` (A larger shadow for modals or elements that need to appear closer).

## 4. Iconography

-   **Library**: **Feather Icons**
-   **Why**: It's a clean, modern, and lightweight icon set that perfectly matches our aesthetic. Its icons are simple and instantly recognizable.
-   **Implementation**: Use a library like `react-feather` for easy integration into our React components.

## 5. In-Game Theme & Visuals

This section defines the visual rules for the core gameplay elements rendered by Phaser. These styles must be used to maintain consistency with the overall theme.

### Game Tiles
-   **Base Color**: `#FFFFFF` (Card Background)
-   **Border Color**: `#E2E8F0` (Border / Divider)
-   **Text Color**: `#2D3748` (Text)
-   **Hover/Selected Path**: A semi-transparent overlay using the `primary` color (`#4A6BFF` at 20% opacity).

### Status & Progression Indicators
-   **King of the Hill**: The player's name and/or crown icon should be colored `#FFD700` (a standard gold color) to stand out.
-   **Speed Bonus**: The score multiplier text should flash or glow using the `accent` color (`#FF7A59`).

### Difficulty Level Indicators
To provide clear visual cues in the lobby, each difficulty level will be associated with a color:
-   **Easy**: `success` (`#1DD1A1`)
-   **Medium**: `primary` (`#4A6BFF`)
-   **Hard**: `accent` (`#FF7A59`)
-   **Extreme**: `error` (`#FF5252`) 