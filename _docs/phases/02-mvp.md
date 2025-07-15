# Phase 2: Minimum Viable Product (MVP)

**Goal**: To build a minimal, playable version of the game. This phase focuses on implementing the core single-player gameplay loop on a static board.

**Scope**: Rendering the game board, selecting and validating words, and basic scoring. This phase intentionally omits multiplayer lobbies, dynamic tile cascades, and advanced UI.

**Deliverable**: A user can open the application, see a pre-defined game grid, drag to select letters, and have the word validated by the server. A correct word will update a score displayed on the screen.

---

### Features & Tasks

#### 1. Static Game Board Rendering
*   **Description**: Display a static, pre-defined grid of letter tiles to the player. The server will define the grid layout to ensure the client is just a renderer.
*   **Steps**:
    1.  On the server, define a static 4x4 letter grid data structure.
    2.  When a client connects, send this grid to them via a Socket.io event.
    3.  On the client, create a Phaser Scene that receives the grid data.
    4.  Dynamically render the letter tiles in the Phaser Scene based on the received data.
    5.  Style the tiles with a basic background and legible font, according to `theme-rules.md`.

#### 2. Word Selection & Submission
*   **Description**: Allow the player to form words by dragging over adjacent tiles.
*   **Steps**:
    1.  In Phaser, implement pointer down, drag, and up events on the letter tiles.
    2.  As the player drags over tiles, track the selected path and the resulting word string.
    3.  Visually highlight the tiles that are part of the current selection path.
    4.  On pointer up, send the completed word string to the server via a `word:submit` event.

#### 3. Server-Side Word Validation
*   **Description**: The server will validate submitted words against a dictionary.
*   **Steps**:
    1.  Find and add a standard English word list file (e.g., a `.txt` file) to the `server/src/assets` directory.
    2.  Create a `DictionaryService` that loads this file into a `Set` on server startup for fast lookups.
    3.  Listen for the `word:submit` event from clients.
    4.  Use the `DictionaryService` to validate the word.
    5.  Reply to the client with a `word:valid` or `word:invalid` event, including the submitted word.

#### 4. Basic Scoring System
*   **Description**: Implement the Scrabble-based scoring system for valid words.
*   **Steps**:
    1.  Create a data structure on the server to hold the Scrabble point value for each letter.
    2.  When a word is validated, calculate its total score.
    3.  Store the player's score in memory on the server, associated with their socket ID.
    4.  Include the score for the word and the player's new total score in the `word:valid` event payload.

#### 5. Minimal UI Feedback
*   **Description**: Create a basic React UI to display the score and validation status.
*   **Steps**:
    1.  Create a React component for the in-game HUD.
    2.  Use a React Context or a simple hook to manage the Socket.io connection.
    3.  Listen for the `word:valid` and `word:invalid` events.
    4.  Update a score display when a `word:valid` event is received.
    5.  Show a temporary "Invalid Word" message when a `word:invalid` event is received. 