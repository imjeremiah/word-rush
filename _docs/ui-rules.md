# Word Rush: UI & Interaction Design Rules

This document outlines the core principles that guide the user interface (UI) and interaction design for Word Rush. These rules ensure we create an experience that is intuitive, engaging, and aligns with our project's goal to be a responsive, mobile-first application built around fluid animations and clear iconography.

## 1. Clarity Above All

The player's primary goal is to find words quickly. The UI must facilitate this without distraction.

- **Legibility**: All text, especially the letters on the game grid, must be instantly readable. We will use clean, high-contrast typography.
- **Intuitiveness**: Interactions should be obvious. A player should never have to guess what a button does or how to perform a core action.
- **Focus**: The game board is the focal point. All other UI elements should support the core gameplay, not compete with it for attention.

## 2. "Juicy" Feedback is Mandatory

Every player action must be met with satisfying, immediate feedback. This principle is key to making the game feel alive and addictive.

- **Visual Feedback**: All interactions (taps, drags, button presses) will have a visual response, such as a size pop, color change, or highlight.
- **Audio Feedback**: Sound effects will confirm actions, enhancing the tactile feel of the game. A subtle sound for tile selection, a positive chime for a correct word, and a soft buzz for an incorrect one.
- **Haptic Feedback**: Where supported, subtle vibrations will accompany key actions.
- **Rewarding Animations**: Correctly submitting words will trigger rewarding particle effects and animations, making scoring feel like an accomplishment.

## 3. Clear Information Hierarchy

The UI will be structured to guide the player's attention to what's most important at any given moment.

- **Primary Level (Highest Importance)**: The game grid itself.
- **Secondary Level (High Importance)**: The player's own score, the round timer, and the current word being formed.
- **Tertiary Level (Standard Importance)**: The leaderboard with other players' scores, the shuffle button, and the settings icon.

## 4. Frictionless User Flow

Following the `user-flow.md`, the journey from opening the app to playing a game will be as short and simple as possible.

- **Minimal Steps**: We will avoid unnecessary screens, pop-ups, and confirmations.
- **Clear Calls-to-Action**: Buttons like "Create Game," "Join Game," and "Start" will be prominent and clearly labeled.
- **Fast Transitions**: All menu and scene transitions will be quick and fluid, respecting the player's time.

## 5. Accessibility by Default

The game must be playable and enjoyable for the widest possible audience.

- **High Contrast**: All text and UI elements will meet or exceed WCAG AA contrast ratio standards.
- **Colorblind-Friendly Design**: We will not use color as the _only_ way to convey information. Important states will also be indicated with icons, shapes, or text labels.
- **Responsive Layout**: The UI must adapt gracefully and remain fully usable across a wide range of screen sizes, from small mobile phones to large desktop monitors.
- **Scalable Text**: Players should be able to use their browser's zoom functionality without breaking the UI.

## 6. UI Unification (React & Phaser)

To create a seamless user experience, the visual appearance of the React-based UI and the Phaser-based game canvas must be perfectly aligned.

- **Shared Fonts**: The Phaser game canvas **must** load and use the same Google Fonts (`Nunito` for headings/titles, `Inter` for body/game tiles) defined in `theme-rules.md`. This will be achieved using a WebFontLoader script during the Phaser preloading phase.
- **Shared Colors & Theme**: The Phaser game **must** import and utilize the same theme constants (colors, spacing units) as the React components. This will be accomplished by defining the theme in a shared `common/theme.ts` file that both the React and Phaser codebases can import from.
- **Clear Responsibility**: As defined in `tech-stack.md`, React is responsible for all non-game UI (menus, lobbies, modals). Phaser is responsible for the game board, game-related UI (HUD elements like score, timer), and all core game interactions. There should be no overlap.
