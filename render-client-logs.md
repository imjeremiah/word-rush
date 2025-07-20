2025-07-20T18:18:56.764357602Z src/components/GameConnection.tsx(624,41): error TS7006: Parameter 'prev' implicitly has an 'any' type.
2025-07-20T18:18:56.764392603Z src/components/GameConnection.tsx(629,54): error TS7006: Parameter 'p' implicitly has an 'any' type.
2025-07-20T18:18:56.764549935Z src/components/GameConnection.tsx(637,78): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.764922001Z src/components/GameConnection.tsx(645,39): error TS7006: Parameter 'prev' implicitly has an 'any' type.
2025-07-20T18:18:56.764940331Z src/components/GameConnection.tsx(645,39): error TS2345: Argument of type '(prev: any) => any' is not assignable to parameter of type '{ currentRound: number; totalRounds: number; timeRemaining: number; leaderboard: { id: string; username: string; score: number; difficulty?: any; }[]; }'.
2025-07-20T18:18:56.764947001Z src/components/GameConnection.tsx(799,52): error TS2339: Property 'timestamp' does not exist on type '{ board: { tiles: { letter: string; points: number; x: number; y: number; id: string; }[][]; width: number; height: number; }; boardChecksum: string; timeRemaining: number; currentRound: number; totalRounds: number; playerCount: number; }'.
2025-07-20T18:18:56.765068233Z src/components/GameConnection.tsx(1130,13): error TS6133: 'handleServerCrashDuringMatch' is declared but its value is never read.
2025-07-20T18:18:56.765194985Z src/components/GameHUD.tsx(8,24): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.765202175Z src/components/LobbyScreen.tsx(9,68): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.765217475Z src/components/LobbyScreen.tsx(32,50): error TS7006: Parameter 'p' implicitly has an 'any' type.
2025-07-20T18:18:56.765222035Z src/components/LobbyScreen.tsx(33,53): error TS7006: Parameter 'p' implicitly has an 'any' type.
2025-07-20T18:18:56.765303786Z src/components/LobbyScreen.tsx(137,41): error TS7006: Parameter 'player' implicitly has an 'any' type.
2025-07-20T18:18:56.765309826Z src/components/MainMenu.tsx(91,19): error TS6133: 'setCurrentRoom' is declared but its value is never read.
2025-07-20T18:18:56.765313566Z src/components/MainMenu.tsx(91,35): error TS6133: 'setGameState' is declared but its value is never read.
2025-07-20T18:18:56.765372057Z src/components/MatchComplete.tsx(58,3): error TS6133: 'isHost' is declared but its value is never read.
2025-07-20T18:18:56.765378157Z src/components/MatchComplete.tsx(72,9): error TS6133: 'isWinner' is declared but its value is never read.
2025-07-20T18:18:56.765455108Z src/components/MatchComplete.tsx(76,9): error TS6133: 'currentPlayerRank' is declared but its value is never read.
2025-07-20T18:18:56.765460368Z src/components/PhaserGame.tsx(16,3): error TS6133: 'FONTS' is declared but its value is never read.
2025-07-20T18:18:56.765464108Z src/components/PhaserGame.tsx(19,8): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.765471549Z src/components/PhaserGame.tsx(40,1): error TS6133: 'notifications' is declared but its value is never read.
2025-07-20T18:18:56.765475029Z src/components/PhaserGame.tsx(67,52): error TS7006: Parameter 'p' implicitly has an 'any' type.
2025-07-20T18:18:56.76558861Z src/components/PhaserGame.tsx(209,46): error TS2339: Property 'clearModuleTimeouts' does not exist on type 'typeof import("/opt/render/project/src/packages/client/src/components/board-rendering")'.
2025-07-20T18:18:56.7655949Z src/components/PhaserGame.tsx(830,25): error TS2339: Property 'isDestroying' does not exist on type 'ScenePlugin'.
2025-07-20T18:18:56.76559812Z src/components/PhaserGame.tsx(1865,33): error TS2339: Property 'setVolume' does not exist on type 'number | true | BaseSound'.
2025-07-20T18:18:56.765615561Z   Property 'setVolume' does not exist on type 'number'.
2025-07-20T18:18:56.765648531Z src/components/PhaserGame.tsx(1866,15): error TS2339: Property 'setVolume' does not exist on type 'number | true | BaseSound'.
2025-07-20T18:18:56.765663791Z   Property 'setVolume' does not exist on type 'number'.
2025-07-20T18:18:56.765668011Z src/components/PhaserGame.tsx(1873,75): error TS2339: Property 'setVolume' does not exist on type 'BaseSound'.
2025-07-20T18:18:56.765683212Z src/components/PhaserGame.tsx(1874,35): error TS2339: Property 'setVolume' does not exist on type 'BaseSound'.
2025-07-20T18:18:56.765693272Z src/components/PhaserGame.tsx(1919,42): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:18:56.765709722Z src/components/board-rendering.ts(15,8): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.765777453Z src/components/board-rendering.ts(46,34): error TS6133: 'scene' is declared but its value is never read.
2025-07-20T18:18:56.765819824Z src/components/board-rendering.ts(659,3): error TS6133: 'scene' is declared but its value is never read.
2025-07-20T18:18:56.765835824Z src/components/board-rendering.ts(777,19): error TS6133: 'particles' is declared but its value is never read.
2025-07-20T18:18:56.765917955Z src/components/board-rendering.ts(1026,42): error TS2345: Argument of type 'Text' is not assignable to parameter of type 'Rectangle'.
2025-07-20T18:18:56.765923905Z   Type 'Text' is missing the following properties from type 'Rectangle': setRounded, radius, isRounded, geom, and 13 more.
2025-07-20T18:18:56.765927835Z src/components/board-rendering.ts(1027,41): error TS2345: Argument of type 'Text' is not assignable to parameter of type 'Rectangle'.
2025-07-20T18:18:56.765931495Z   Type 'Text' is missing the following properties from type 'Rectangle': setRounded, radius, isRounded, geom, and 13 more.
2025-07-20T18:18:56.765934765Z src/components/board-rendering.ts(1250,7): error TS2322: Type 'Rectangle | null' is not assignable to type 'Rectangle'.
2025-07-20T18:18:56.765938145Z   Type 'null' is not assignable to type 'Rectangle'.
2025-07-20T18:18:56.765980926Z src/components/board-rendering.ts(1254,40): error TS2345: Argument of type 'Text' is not assignable to parameter of type 'Rectangle'.
2025-07-20T18:18:56.765985276Z   Type 'Text' is missing the following properties from type 'Rectangle': setRounded, radius, isRounded, geom, and 13 more.
2025-07-20T18:18:56.765988436Z src/components/board-rendering.ts(1255,39): error TS2345: Argument of type 'Text' is not assignable to parameter of type 'Rectangle'.
2025-07-20T18:18:56.765991496Z   Type 'Text' is missing the following properties from type 'Rectangle': setRounded, radius, isRounded, geom, and 13 more.
2025-07-20T18:18:56.766044027Z src/components/board-rendering.ts(1287,10): error TS6133: 'animateTileRemovalAndCascade' is declared but its value is never read.
2025-07-20T18:18:56.766049107Z src/components/board-rendering.ts(1325,86): error TS2304: Cannot find name 'selected'.
2025-07-20T18:18:56.766108928Z src/components/board-rendering.ts(1339,13): error TS18047: 'particles' is possibly 'null'.
2025-07-20T18:18:56.766116338Z src/components/board-rendering.ts(1538,7): error TS2322: Type 'Text | null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766120818Z   Type 'null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766137258Z src/components/board-rendering.ts(1539,7): error TS2322: Type 'Text | null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766143508Z   Type 'null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766152449Z src/components/board-rendering.ts(1543,7): error TS2322: Type 'Rectangle | null' is not assignable to type 'Rectangle'.
2025-07-20T18:18:56.766170059Z   Type 'null' is not assignable to type 'Rectangle'.
2025-07-20T18:18:56.766178479Z src/components/board-rendering.ts(1586,10): error TS6133: 'createBatchedAnimationTimeline' is declared but its value is never read.
2025-07-20T18:18:56.76623373Z src/components/board-rendering.ts(1602,35): error TS2339: Property 'createTimeline' does not exist on type 'TweenManager'.
2025-07-20T18:18:56.76623912Z src/components/board-rendering.ts(1713,7): error TS2322: Type 'Rectangle | null' is not assignable to type 'Rectangle'.
2025-07-20T18:18:56.76624266Z   Type 'null' is not assignable to type 'Rectangle'.
2025-07-20T18:18:56.76626979Z src/components/board-rendering.ts(1738,7): error TS2322: Type 'Text | null' is not assignable to type 'Text'.
2025-07-20T18:18:56.76627882Z   Type 'null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766321571Z src/components/board-rendering.ts(1739,7): error TS2322: Type 'Text | null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766327461Z   Type 'null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766331291Z src/components/board-rendering.ts(2026,13): error TS2322: Type 'Text | null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766334371Z   Type 'null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766342101Z src/components/board-rendering.ts(2027,13): error TS2322: Type 'Text | null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766345281Z   Type 'null' is not assignable to type 'Text'.
2025-07-20T18:18:56.766416402Z src/components/board-rendering.ts(2028,13): error TS2322: Type 'Rectangle | null' is not assignable to type 'Rectangle'.
2025-07-20T18:18:56.766422342Z   Type 'null' is not assignable to type 'Rectangle'.
2025-07-20T18:18:56.766426092Z src/components/board-rendering.ts(2313,46): error TS2551: Property 'destroyed' does not exist on type 'Game'. Did you mean 'destroy'?
2025-07-20T18:18:56.766430073Z src/components/board-rendering.ts(2349,46): error TS2551: Property 'destroyed' does not exist on type 'Game'. Did you mean 'destroy'?
2025-07-20T18:18:56.766486733Z src/components/board-rendering.ts(2415,46): error TS2551: Property 'destroyed' does not exist on type 'Game'. Did you mean 'destroy'?
2025-07-20T18:18:56.766569175Z src/components/board-rendering.ts(2461,48): error TS2551: Property 'destroyed' does not exist on type 'Game'. Did you mean 'destroy'?
2025-07-20T18:18:56.766575495Z src/components/board-rendering.ts(2546,54): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:18:56.766688806Z src/components/board-rendering.ts(2558,54): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:18:56.766698006Z src/components/board-rendering.ts(2571,71): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:18:56.766701356Z src/components/board-rendering.ts(2585,62): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:18:56.766704447Z src/components/board-rendering.ts(2603,81): error TS2339: Property 'depth' does not exist on type 'GameObject'.
2025-07-20T18:18:56.766741987Z src/components/interactions.ts(17,8): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.766766957Z src/components/interactions.ts(155,38): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:18:56.766792928Z src/components/layout.ts(7,10): error TS6133: 'COLORS' is declared but its value is never read.
2025-07-20T18:18:56.766803958Z src/components/layout.ts(7,18): error TS6133: 'BACKGROUNDS' is declared but its value is never read.
2025-07-20T18:18:56.76692406Z src/components/layout.ts(7,57): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.76694399Z src/components/layout.ts(69,3): error TS6133: 'boardState' is declared but its value is never read.
2025-07-20T18:18:56.76694831Z src/components/layout.ts(195,3): error TS6133: 'boardState' is declared but its value is never read.
2025-07-20T18:18:56.76697441Z src/context/GameContext.tsx(15,8): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.766982971Z src/context/GameContext.tsx(182,3): error TS6133: 'type' is declared but its value is never read.
2025-07-20T18:18:56.767106072Z src/services/checksumTestUtils.ts(7,27): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.767113943Z src/services/checksumValidation.ts(7,27): error TS2307: Cannot find module '@word-rush/common' or its corresponding type declarations.
2025-07-20T18:18:56.767118163Z src/services/checksumValidation.ts(20,28): error TS7006: Parameter 'row' implicitly has an 'any' type.
2025-07-20T18:18:56.767140073Z src/services/checksumValidation.ts(21,15): error TS7006: Parameter 'tile' implicitly has an 'any' type.
2025-07-20T18:18:56.767150683Z src/services/checksumValidation.ts(58,40): error TS7006: Parameter 'row' implicitly has an 'any' type.
2025-07-20T18:18:56.767245094Z src/services/checksumValidation.ts(58,55): error TS7006: Parameter 'tile' implicitly has an 'any' type.
2025-07-20T18:18:56.848487189Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:18:56.84854671Z npm error code 2
2025-07-20T18:18:56.848680092Z npm error path /opt/render/project/src/packages/client
2025-07-20T18:18:56.848695352Z npm error workspace @word-rush/client@1.0.0
2025-07-20T18:18:56.848904465Z npm error location /opt/render/project/src/packages/client
2025-07-20T18:18:56.848947416Z npm error command failed
2025-07-20T18:18:56.849052137Z npm error command sh -c tsc && vite build
2025-07-20T18:18:56.86153606Z ==> Build failed 😞
2025-07-20T18:18:56.86155847Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys