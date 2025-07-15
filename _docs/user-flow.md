# Word Rush: User Flow

This document defines the user journey through the Word Rush application, from landing on the page to completing a match. It serves as a guide for building out the project architecture and UI elements, ensuring a cohesive and intuitive player experience.

## 1. Session Start & Onboarding

The flow is designed to be as frictionless as possible, getting users into the game quickly without requiring permanent accounts.

1.  **Landing Page**: A new user arrives at the game's URL.
2.  **Enter Username**: The user is immediately prompted to enter a username. This name is tied to their current browser session and will be used to identify them in games and on leaderboards.
3.  **Main Menu**: After providing a username, the user is taken to the main menu.

## 2. Main Menu & Game Selection

The main menu is simple, offering two clear paths for the user.

-   **`Create Game`**: For users who want to host a match and invite others.
-   **`Join Game`**: For users who have a code to join a friend's match.

## 3. Creating a Game (Host Flow)

This flow outlines the steps for a user acting as the game host.

1.  **Initiate Creation**: The user clicks `Create Game` from the main menu.
2.  **Lobby Creation**: The user is automatically taken to a new, private "Lobby" screen.
3.  **Shareable Code**: The lobby displays a unique, shareable **Room Code** (e.g., `ABCD`) and a direct link (e.g., `wordrush.game/join/ABCD`) that can be sent to friends.
4.  **Game Configuration**: As the host, the user configures the match settings:
    -   **Game Mode**: The user can select from different modes, such as:
        -   `Standard Mode`: The classic experience.
        -   `Themed Rounds`: Words must fit a specific category.
        -   `High-Value Letter Mode`: Rare letters appear more frequently.
    -   **Match Length**: The user sets the number of rounds (e.g., "Best of 3").
5.  **Difficulty Selection**: The host chooses their personal difficulty level (`Easy`, `Medium`, `Hard`, `Extreme`), which adjusts their minimum word length and score multiplier.
6.  **Player Management**: The lobby displays a list of players as they join. The host can see each player's chosen username and difficulty level.
7.  **Start Match**: Once all invited players have joined and signaled they are ready, the host clicks `Start Game` to begin the match for everyone.

## 4. Joining a Game (Player Flow)

This flow is for users joining a pre-existing lobby.

1.  **Initiate Join**: The user clicks `Join Game` from the main menu or navigates to a direct join link.
2.  **Enter Code**: If they haven't used a direct link, they are prompted to enter the Room Code.
3.  **Enter Lobby**: Upon entering a valid code, the user joins the host's lobby.
4.  **Review Settings**: The player can see the game settings configured by the host and the list of other players in the room.
5.  **Difficulty Selection**: The player must choose their personal difficulty level (`Easy`, `Medium`, `Hard`, `Extreme`).
6.  **Signal Readiness**: The player clicks a `Ready` button to indicate they are prepared to start.

## 5. The Match: Core Gameplay Loop

This is the central experience of the game.

1.  **Round Start**: The game begins with a 90-second timer and a grid of letter tiles, synchronized for all players.
2.  **Gameplay Interface**: The UI prominently displays:
    -   The shared game grid.
    -   A real-time leaderboard showing all player scores.
    -   The round timer.
    -   A `Shuffle Button`, which players can use at a small point cost.
3.  **Finding Words**:
    -   Players drag their cursor over adjacent letters to form words.
    -   The server validates submissions. Correct words are removed, and new tiles cascade down.
    -   **Speed Bonus**: A temporary score multiplier is awarded for submitting multiple words in quick succession.
4.  **Board Resets**: The server automatically shuffles the board if it detects a "dead" state with no possible words.
5.  **End of Round**: When the timer expires, a summary screen displays the scores for that round.
6.  **End of Match**: After the final round, a "Winner" screen declares the victor. The winning player is awarded one **Crown**.

## 6. Post-Match & Session Progression

The game loop encourages continuous play and tracks short-term achievements.

1.  **Return to Lobby**: All players are returned to the game lobby. The host can choose to start a new match with the same group.
2.  **Crowns & King of the Hill**:
    -   A player's Crown count is tied to their browser session and is displayed next to their username.
    -   The player with the most Crowns is designated the "King of the Hill," receiving a special visual indicator (e.g., a glowing username or icon).
3.  **Session End**: The session, along with the user's username and Crown count, is terminated when the user closes the browser tab. A new session begins on their next visit.