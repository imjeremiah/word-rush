# Word Rush: Project Overview

## Core Challenge

You will develop a multiplayer game using technologies you have never worked with before. This project tests your ability to:

- Research and learn new technologies rapidly using AI
- Make informed technical decisions under time constraints
- Build production-quality software in unfamiliar territory
- Demonstrate that AI-augmented developers can match or exceed traditional development timelines

## Core Concept

Word Rush is a real-time, competitive multiplayer word game for the browser. It combines the strategic, intellectual depth of classic word games like Scrabble with the "juicy," addictive, and highly polished feedback loops of modern puzzle games like _Candy Crush Saga_. Players compete in fast-paced rounds to find words on a shared, dynamic game board, earning points based on word length and rarity. The player with the highest score at the end of the round wins.

The project's primary goal is to create a highly engaging, polished, and replayable experience, focusing on fluid animations, satisfying audio-visual feedback, and flawless real-time multiplayer performance.

## Game Specifications

### 1. Core Gameplay Loop

- A match consists of a series of **90-second rounds**. The number of rounds is configurable by the host.
- A round begins with a grid of letter tiles presented to all players. The initial board is algorithmically guaranteed to be high-quality and contain a fair distribution of potential words for all difficulty levels.
- Players find words by dragging their cursor over adjacent letters (horizontally, vertically, or diagonally).
- Correctly submitted words are validated by the server. The corresponding letter tiles are removed, and new tiles cascade down from the top.
- **Board Resets**: If the board reaches a "dead" state with no possible words, the server will automatically shuffle the letters for all players. Additionally, players can use a **Shuffle Button** at a small point cost to get a new set of letters at any time.

### 2. Scoring & Letter System

- The point values for each letter will be identical to the official Scrabble point system.
- The pool of letters from which new tiles are generated will be weighted based on the official Scrabble letter distribution and validated against a standard tournament word list.
- **Speed Bonus**: Instead of rewarding luck-based combos, the game rewards skill. Finding multiple words in rapid succession will grant players a temporary score multiplier, encouraging fast-paced, high-skill play.

### 3. UI/UX Philosophy: A Hybrid Approach

Word Rush will use a hybrid model that leverages two specialized technologies to create a seamless and high-performance user experience:

- **React for the Application Shell**: All non-game UI elements—such as the main menu, game lobbies, settings modals, and leaderboards—will be built with React. This leverages React's strength in creating complex, stateful, and accessible user interfaces.

- **Phaser for Core Gameplay**: The core game screen—including the letter grid, tile animations, particle effects, and high-frequency updates—will be rendered by Phaser 3. This leverages Phaser's powerful 2D game engine to ensure fluid, 60fps gameplay that would be difficult to achieve with the DOM.

This approach uses the best tool for each job: React for the static interface and Phaser for the dynamic, real-time game canvas. The key challenge, as outlined in the `ui-rules.md`, is to ensure these two parts are so visually integrated (sharing fonts, colors, and styling) that the user cannot perceive a difference between the React components and the Phaser canvas.

### 4. Multiplayer Support (Real-time)

- The game will support 2-8 players in a real-time environment.
- The server will be the authoritative source for game state, including the letter grid, player scores, and word validation.
- A live leaderboard will display scores ticking up in real-time throughout the match.
- **Session Management**: To keep the implementation straightforward, player sessions will be managed in-memory on the server. A player's state (username, score, etc.) will be associated with their unique `socket.id`. This state persists as long as the socket is connected and is cleaned up automatically on disconnect.

### 5. Performance & Technical Metrics

The project will be measured against the following concrete targets:

- **Latency**: Word validation round-trip (client -> server -> client) must be **< 150ms**.
- **Concurrency**: The server must support **50 concurrent players** per instance.
- **Client FPS**: The Phaser canvas must maintain a steady **60 FPS** on modern desktop browsers during gameplay.
- **Security**: The server will implement basic security measures, including input validation on all socket events and rate-limiting on frequent actions like word submission, to prevent trivial abuse.
- **Error Handling**: The application will handle errors gracefully. The client will display non-intrusive notifications for server or connection errors, and the server will use centralized error handling to prevent crashes.

### 6. Complexity: Levels & Progression

- **Progression: King of the Hill**: To meet the complexity requirement, the game will feature a session-based progression system. Instead of a persistent ELO rating, players compete to earn **Crowns**.
- Winning a match awards the player one Crown.
- A player's Crown count is displayed for the duration of the session. The player with the most Crowns is designated the "King of the Hill," receiving a visually distinct username (e.g., a glowing effect or a crown icon) to signify their status. This provides a clear, motivating, and immediate sense of advancement.
- **"Levels"**: The game will feature different modes or "arenas" that act as levels. These could include:
  - **Standard Mode**: The classic experience.
  - **Themed Rounds**: Rounds where only words from a specific category (e.g., "animals," "science") are valid.
  - **High-Value Letter Mode**: Rounds where rare letters appear more frequently.

### 7. Difficulty & Balancing System

To ensure the game is enjoyable and fair for players of all skill levels, "Word Rush" will feature a robust difficulty system. Before a match, each player can choose a difficulty level that tailors the game's rules to their ability.

This hybrid model adjusts both the minimum required word length and the potential points scored, allowing a novice to compete with an expert in the same match.

| Difficulty  | Minimum Word Length | Score Multiplier | Target Audience                  |
| :---------- | :------------------ | :--------------- | :------------------------------- |
| **Easy**    | 2 letters           | 1.0x             | Young children, new players      |
| **Medium**  | 3 letters           | 1.2x             | Casual players, older children   |
| **Hard**    | 4 letters           | 1.5x             | Experienced players, most adults |
| **Extreme** | 5 letters           | 2.0x             | Word game experts                |

This system directly addresses skill gaps:

- **Accessibility**: Lower difficulties provide a larger pool of valid words, making it easier to participate and clear tiles.
- **Strategic Depth**: Higher difficulties reward players with a score multiplier for finding longer, more complex words, incentivizing players to challenge themselves.

### 8. AI Development Log

- To meet the project brief's requirements, this project's development will be documented in the [**`brainlift.md`**](./brainlift.md) file, which serves as a log of our AI-augmented learning, decision-making, and implementation process.
