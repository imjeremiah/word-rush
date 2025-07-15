# Phase 3: Dynamic Multiplayer Experience

**Goal**: To transform the MVP into a complete, real-time multiplayer game. This phase introduces the full user flow, from creating a game to competing in a multi-round match with dynamic game mechanics.

**Scope**: Multiplayer lobbies, matchmaking, dynamic tile cascades, multi-round matches, and a complete in-game UI.

**Deliverable**: A fully playable multiplayer game for 2-8 players. Players can create and join games, play a "Best of 3" match, see the board update dynamically, and interact with the full UI.

---

### Features & Tasks

#### 1. Lobby and Matchmaking System
*   **Description**: Implement the complete pre-game user flow, allowing players to host and join games.
*   **Steps**:
    1.  On the server, implement logic to create unique game "rooms" with shareable codes.
    2.  Build the React components for the UI: `CreateGameScreen`, `JoinGameScreen`, and `LobbyScreen`.
    3.  Use Socket.io `rooms` to broadcast lobby state changes (e.g., player joining) only to members of that lobby.
    4.  Implement a "Ready" system, allowing the host to start the match only when all players are ready.
    5.  Allow the host to configure match settings (e.g., "Best of 3") in the lobby.

#### 2. Dynamic Tile & Board System
*   **Description**: Replace the static board with a fully dynamic grid where tiles are removed and replaced.
*   **Steps**:
    1.  On the server, when a word is validated, identify the tiles to be removed.
    2.  Implement the "cascade" logic: determine how existing tiles fall and which new tiles are generated from the top.
    3.  Generate new letters based on the weighted Scrabble distribution.
    4.  Send a `board:update` event to all players in the room with the new grid state.
    5.  On the client, create slick animations for tiles being removed and new ones falling into place.

#### 3. Multi-Round Match Flow
*   **Description**: Implement the full "Best of 3" match structure with timers and round summaries.
*   **Steps**:
    1.  Implement the 90-second round timer on the server, broadcasting the remaining time periodically.
    2.  When the timer ends, transition all players to a "Round Summary" screen showing scores.
    3.  After a brief period, start the next round with a new, freshly generated board.
    4.  After the final round, display a "Match Over" screen declaring the winner.
    5.  Return players to the lobby, allowing the host to start a new match.

#### 4. Complete In-Game UI
*   **Description**: Build the full Heads-Up Display (HUD) for the game.
*   **Steps**:
    1.  Create the real-time leaderboard React component, which updates as `score:update` events are received.
    2.  Display the round timer prominently.
    3.  Implement the UI for the `Shuffle Button`.
    4.  On click, the client sends a `player:shuffle` request; the server validates, deducts points, and sends a new board to that player only.

#### 5. Speed Bonus & Dead Board System
*   **Description**: Implement the speed bonus for rapid word submissions and the "dead board" check.
*   **Steps**:
    1.  On the server, when a player submits a valid word, store a `lastWordTimestamp`.
    2.  If the next valid word is submitted within 3 seconds, apply a 1.5x score multiplier.
    3.  When a player requests a shuffle, the server will first run its "solver" to check if the board was dead (e.g., < 5 words possible).
    4.  If the board was not dead, deduct the point cost for the shuffle. If it was, the shuffle is free.

#### 6. Difficulty and Balancing System
*   **Description**: Allow players of different skill levels to compete fairly in the same match.
*   **Steps**:
    1.  In the React `LobbyScreen` component, allow each player to select their difficulty level (`Easy`, `Medium`, `Hard`, `Extreme`).
    2.  Send the chosen difficulty to the server when joining a lobby.
    3.  On the server, enforce the minimum word length rule for each player based on their chosen difficulty.
    4.  On the server, apply the appropriate score multiplier when a valid word is submitted. 