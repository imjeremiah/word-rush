2025-07-20T18:29:50.044585484Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-20T18:29:50.044627475Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-20T18:29:51.038133879Z ==> Checking out commit 4d98f35275ad5af4004a747e241f0677d1a44bdb in branch main
2025-07-20T18:29:54.115070662Z ==> Installing dependencies with npm...
2025-07-20T18:29:54.282654296Z ==> Using Node.js version 22.16.0 (default)
2025-07-20T18:29:54.328848486Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-20T18:29:57.054258877Z ==> Using Bun version 1.1.0 (default)
2025-07-20T18:29:57.054288588Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T18:30:04.029373325Z 
2025-07-20T18:30:04.029414106Z added 84 packages, and audited 87 packages in 7s
2025-07-20T18:30:04.029468288Z 
2025-07-20T18:30:04.029502308Z 8 packages are looking for funding
2025-07-20T18:30:04.029510459Z   run `npm fund` for details
2025-07-20T18:30:04.042354835Z 
2025-07-20T18:30:04.042380705Z 2 moderate severity vulnerabilities
2025-07-20T18:30:04.042387876Z 
2025-07-20T18:30:04.042395476Z To address all issues (including breaking changes), run:
2025-07-20T18:30:04.042402946Z   npm audit fix --force
2025-07-20T18:30:04.042408026Z 
2025-07-20T18:30:04.042413386Z Run `npm audit` for details.
2025-07-20T18:30:05.714238789Z 
2025-07-20T18:30:05.71427367Z up to date, audited 87 packages in 1s
2025-07-20T18:30:05.71427979Z 
2025-07-20T18:30:05.714293541Z 8 packages are looking for funding
2025-07-20T18:30:05.714299461Z   run `npm fund` for details
2025-07-20T18:30:05.727237209Z 
2025-07-20T18:30:05.72726469Z 2 moderate severity vulnerabilities
2025-07-20T18:30:05.72727066Z 
2025-07-20T18:30:05.727276481Z To address all issues (including breaking changes), run:
2025-07-20T18:30:05.727282071Z   npm audit fix --force
2025-07-20T18:30:05.727286791Z 
2025-07-20T18:30:05.727292281Z Run `npm audit` for details.
2025-07-20T18:30:05.767736672Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../client && npm run build'...
2025-07-20T18:30:18.67876658Z 
2025-07-20T18:30:18.678806951Z added 368 packages, and audited 456 packages in 13s
2025-07-20T18:30:18.678821432Z 
2025-07-20T18:30:18.678827702Z 137 packages are looking for funding
2025-07-20T18:30:18.678833222Z   run `npm fund` for details
2025-07-20T18:30:18.69825605Z 
2025-07-20T18:30:18.698285791Z 2 moderate severity vulnerabilities
2025-07-20T18:30:18.698291201Z 
2025-07-20T18:30:18.698296992Z To address all issues (including breaking changes), run:
2025-07-20T18:30:18.698302822Z   npm audit fix --force
2025-07-20T18:30:18.698307632Z 
2025-07-20T18:30:18.698313102Z Run `npm audit` for details.
2025-07-20T18:30:19.024291396Z 
2025-07-20T18:30:19.024324787Z > @word-rush/common@1.0.0 build
2025-07-20T18:30:19.024330357Z > tsc
2025-07-20T18:30:19.024335647Z 
2025-07-20T18:30:21.698907461Z 
2025-07-20T18:30:21.698957192Z > @word-rush/client@1.0.0 build
2025-07-20T18:30:21.698963813Z > tsc -p tsconfig.prod.json && vite build
2025-07-20T18:30:21.698968863Z 
2025-07-20T18:30:27.971525033Z src/components/GameConnection.tsx(23,32): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
2025-07-20T18:30:27.971906914Z src/components/GameConnection.tsx(567,41): error TS2345: Argument of type '(prev: any) => any' is not assignable to parameter of type 'GameRoom'.
2025-07-20T18:30:27.971921234Z src/components/GameConnection.tsx(586,43): error TS2345: Argument of type '{ id: string; username: string; socketId: string; isConnected: boolean; lastActivity: number; score: number; wordsSubmitted: number; }' is not assignable to parameter of type 'PlayerSession'.
2025-07-20T18:30:27.971954305Z   Property 'crowns' is missing in type '{ id: string; username: string; socketId: string; isConnected: boolean; lastActivity: number; score: number; wordsSubmitted: number; }' but required in type 'PlayerSession'.
2025-07-20T18:30:27.971959125Z src/components/GameConnection.tsx(600,43): error TS2345: Argument of type '{ id: string; username: string; socketId: string; isConnected: boolean; lastActivity: number; score: number; wordsSubmitted: number; }' is not assignable to parameter of type 'PlayerSession'.
2025-07-20T18:30:27.971963325Z   Property 'crowns' is missing in type '{ id: string; username: string; socketId: string; isConnected: boolean; lastActivity: number; score: number; wordsSubmitted: number; }' but required in type 'PlayerSession'.
2025-07-20T18:30:27.972026307Z src/components/GameConnection.tsx(624,41): error TS2345: Argument of type '(prev: any) => any' is not assignable to parameter of type 'GameRoom'.
2025-07-20T18:30:27.97211129Z src/components/GameConnection.tsx(645,39): error TS2345: Argument of type '(prev: any) => any' is not assignable to parameter of type '{ currentRound: number; totalRounds: number; timeRemaining: number; leaderboard: { id: string; username: string; score: number; difficulty?: DifficultyLevel; }[]; }'.
2025-07-20T18:30:27.97212794Z src/components/GameConnection.tsx(693,41): error TS2345: Argument of type '{ id: string; roomCode: string; hostId: string; players: { id: string; username: string; score: number; isConnected: boolean; difficulty?: "easy" | "medium" | "hard" | "extreme"; isReady?: boolean; lastWordTimestamp?: number; roundScore?: number; }[]; ... 4 more ...; lastActivity: number; }' is not assignable to parameter of type 'GameRoom'.
2025-07-20T18:30:27.9721325Z   Types of property 'settings' are incompatible.
2025-07-20T18:30:27.97213645Z     Property 'gameMode' is missing in type '{ totalRounds: number; roundDuration: number; shuffleCost: number; speedBonusMultiplier: number; speedBonusWindow: number; deadBoardThreshold: number; }' but required in type 'MatchSettings'.
2025-07-20T18:30:27.972254123Z src/components/GameConnection.tsx(707,41): error TS2345: Argument of type '{ id: string; roomCode: string; hostId: string; players: { id: string; username: string; score: number; isConnected: boolean; difficulty?: "easy" | "medium" | "hard" | "extreme"; isReady?: boolean; lastWordTimestamp?: number; roundScore?: number; }[]; ... 4 more ...; lastActivity: number; }' is not assignable to parameter of type 'GameRoom'.
2025-07-20T18:30:27.972260094Z   Types of property 'settings' are incompatible.
2025-07-20T18:30:27.972264154Z     Property 'gameMode' is missing in type '{ totalRounds: number; roundDuration: number; shuffleCost: number; speedBonusMultiplier: number; speedBonusWindow: number; deadBoardThreshold: number; }' but required in type 'MatchSettings'.
2025-07-20T18:30:27.972421648Z src/components/GameConnection.tsx(713,41): error TS2345: Argument of type '{ id: string; roomCode: string; hostId: string; players: { id: string; username: string; score: number; isConnected: boolean; difficulty?: "easy" | "medium" | "hard" | "extreme"; isReady?: boolean; lastWordTimestamp?: number; roundScore?: number; }[]; ... 4 more ...; lastActivity: number; }' is not assignable to parameter of type 'GameRoom'.
2025-07-20T18:30:27.972428258Z   Types of property 'settings' are incompatible.
2025-07-20T18:30:27.972432978Z     Property 'gameMode' is missing in type '{ totalRounds: number; roundDuration: number; shuffleCost: number; speedBonusMultiplier: number; speedBonusWindow: number; deadBoardThreshold: number; }' but required in type 'MatchSettings'.
2025-07-20T18:30:27.972664705Z src/components/GameConnection.tsx(719,41): error TS2345: Argument of type '{ id: string; roomCode: string; hostId: string; players: { id: string; username: string; score: number; isConnected: boolean; difficulty?: "easy" | "medium" | "hard" | "extreme"; isReady?: boolean; lastWordTimestamp?: number; roundScore?: number; }[]; ... 4 more ...; lastActivity: number; }' is not assignable to parameter of type 'GameRoom'.
2025-07-20T18:30:27.972683985Z   Types of property 'settings' are incompatible.
2025-07-20T18:30:27.972687565Z     Property 'gameMode' is missing in type '{ totalRounds: number; roundDuration: number; shuffleCost: number; speedBonusMultiplier: number; speedBonusWindow: number; deadBoardThreshold: number; }' but required in type 'MatchSettings'.
2025-07-20T18:30:27.972703676Z src/components/GameConnection.tsx(725,41): error TS2345: Argument of type '{ id: string; roomCode: string; hostId: string; players: { id: string; username: string; score: number; isConnected: boolean; difficulty?: "easy" | "medium" | "hard" | "extreme"; isReady?: boolean; lastWordTimestamp?: number; roundScore?: number; }[]; ... 4 more ...; lastActivity: number; }' is not assignable to parameter of type 'GameRoom'.
2025-07-20T18:30:27.972710226Z   Types of property 'settings' are incompatible.
2025-07-20T18:30:27.972713576Z     Property 'gameMode' is missing in type '{ totalRounds: number; roundDuration: number; shuffleCost: number; speedBonusMultiplier: number; speedBonusWindow: number; deadBoardThreshold: number; }' but required in type 'MatchSettings'.
2025-07-20T18:30:27.972717286Z src/components/GameConnection.tsx(799,52): error TS2339: Property 'timestamp' does not exist on type '{ board: { tiles: { letter: string; points: number; x: number; y: number; id: string; }[][]; width: number; height: number; }; boardChecksum: string; timeRemaining: number; currentRound: number; totalRounds: number; playerCount: number; }'.
2025-07-20T18:30:27.972820759Z src/components/PhaserGame.tsx(209,46): error TS2339: Property 'clearModuleTimeouts' does not exist on type 'typeof import("/opt/render/project/src/packages/client/src/components/board-rendering")'.
2025-07-20T18:30:27.972930002Z src/components/PhaserGame.tsx(830,25): error TS2339: Property 'isDestroying' does not exist on type 'ScenePlugin'.
2025-07-20T18:30:27.972947473Z src/components/PhaserGame.tsx(1865,33): error TS2339: Property 'setVolume' does not exist on type 'number | true | BaseSound'.
2025-07-20T18:30:27.972963183Z   Property 'setVolume' does not exist on type 'number'.
2025-07-20T18:30:27.972978454Z src/components/PhaserGame.tsx(1866,15): error TS2339: Property 'setVolume' does not exist on type 'number | true | BaseSound'.
2025-07-20T18:30:27.972982484Z   Property 'setVolume' does not exist on type 'number'.
2025-07-20T18:30:27.973023315Z src/components/PhaserGame.tsx(1873,75): error TS2339: Property 'setVolume' does not exist on type 'BaseSound'.
2025-07-20T18:30:27.973048565Z src/components/PhaserGame.tsx(1874,35): error TS2339: Property 'setVolume' does not exist on type 'BaseSound'.
2025-07-20T18:30:27.973053546Z src/components/PhaserGame.tsx(1919,42): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:30:27.973124928Z src/components/board-rendering.ts(1026,42): error TS2345: Argument of type 'Text' is not assignable to parameter of type 'Rectangle'.
2025-07-20T18:30:27.973131308Z   Type 'Text' is missing the following properties from type 'Rectangle': setRounded, radius, isRounded, geom, and 13 more.
2025-07-20T18:30:27.973135438Z src/components/board-rendering.ts(1027,41): error TS2345: Argument of type 'Text' is not assignable to parameter of type 'Rectangle'.
2025-07-20T18:30:27.973139588Z   Type 'Text' is missing the following properties from type 'Rectangle': setRounded, radius, isRounded, geom, and 13 more.
2025-07-20T18:30:27.973149778Z src/components/board-rendering.ts(1254,40): error TS2345: Argument of type 'Text' is not assignable to parameter of type 'Rectangle'.
2025-07-20T18:30:27.973153468Z   Type 'Text' is missing the following properties from type 'Rectangle': setRounded, radius, isRounded, geom, and 13 more.
2025-07-20T18:30:27.973174269Z src/components/board-rendering.ts(1255,39): error TS2345: Argument of type 'Text' is not assignable to parameter of type 'Rectangle'.
2025-07-20T18:30:27.973177829Z   Type 'Text' is missing the following properties from type 'Rectangle': setRounded, radius, isRounded, geom, and 13 more.
2025-07-20T18:30:27.973185679Z src/components/board-rendering.ts(1325,86): error TS2304: Cannot find name 'selected'.
2025-07-20T18:30:27.97321839Z src/components/board-rendering.ts(1602,35): error TS2339: Property 'createTimeline' does not exist on type 'TweenManager'.
2025-07-20T18:30:27.973231131Z src/components/board-rendering.ts(2313,46): error TS2551: Property 'destroyed' does not exist on type 'Game'. Did you mean 'destroy'?
2025-07-20T18:30:27.973240511Z src/components/board-rendering.ts(2349,46): error TS2551: Property 'destroyed' does not exist on type 'Game'. Did you mean 'destroy'?
2025-07-20T18:30:27.973269852Z src/components/board-rendering.ts(2415,46): error TS2551: Property 'destroyed' does not exist on type 'Game'. Did you mean 'destroy'?
2025-07-20T18:30:27.973297902Z src/components/board-rendering.ts(2461,48): error TS2551: Property 'destroyed' does not exist on type 'Game'. Did you mean 'destroy'?
2025-07-20T18:30:27.973308073Z src/components/board-rendering.ts(2546,54): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:30:27.973438786Z src/components/board-rendering.ts(2558,54): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:30:27.973454787Z src/components/board-rendering.ts(2571,71): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:30:27.973458617Z src/components/board-rendering.ts(2585,62): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:30:27.973481977Z src/components/board-rendering.ts(2603,81): error TS2339: Property 'depth' does not exist on type 'GameObject'.
2025-07-20T18:30:27.973490118Z src/components/interactions.ts(155,38): error TS2339: Property 'isDestroyed' does not exist on type 'Game'.
2025-07-20T18:30:27.973495018Z src/validation/schemas.ts(320,77): error TS2339: Property 'error' does not exist on type '{ success: false; error: string; } | { success: true; data: output<{ readonly 'server:welcome': ZodObject<{ message: ZodString; socketId: ZodString; }, $strip>; ... 26 more ...; readonly 'game:tile-changes': ZodObject<...>; }[T]>; }'.
2025-07-20T18:30:27.973499688Z   Property 'error' does not exist on type '{ success: true; data: output<{ readonly 'server:welcome': ZodObject<{ message: ZodString; socketId: ZodString; }, $strip>; readonly 'server:error': ZodObject<{ message: ZodString; code: ZodOptional<...>; }, $strip>; ... 25 more ...; readonly 'game:tile-changes': ZodObject<...>; }[T]>; }'.
2025-07-20T18:30:28.036821023Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:30:28.036916526Z npm error code 2
2025-07-20T18:30:28.036933116Z npm error path /opt/render/project/src/packages/client
2025-07-20T18:30:28.037165492Z npm error workspace @word-rush/client@1.0.0
2025-07-20T18:30:28.037231714Z npm error location /opt/render/project/src/packages/client
2025-07-20T18:30:28.037324747Z npm error command failed
2025-07-20T18:30:28.037384249Z npm error command sh -c tsc -p tsconfig.prod.json && vite build
2025-07-20T18:30:28.049397141Z ==> Build failed 😞
2025-07-20T18:30:28.049425862Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys