2025-07-20T23:45:11.87333302Z 
2025-07-20T23:45:11.873336631Z To address all issues (including breaking changes), run:
2025-07-20T23:45:11.873340221Z   npm audit fix --force
2025-07-20T23:45:11.873342831Z 
2025-07-20T23:45:11.873345821Z Run `npm audit` for details.
2025-07-20T23:45:11.895370861Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../client && npm run build'...
2025-07-20T23:45:20.988270767Z 
2025-07-20T23:45:20.988301597Z added 368 packages, and audited 456 packages in 9s
2025-07-20T23:45:20.988321768Z 
2025-07-20T23:45:20.988353249Z 137 packages are looking for funding
2025-07-20T23:45:20.988376669Z   run `npm fund` for details
2025-07-20T23:45:20.997805386Z 
2025-07-20T23:45:20.997821457Z 2 moderate severity vulnerabilities
2025-07-20T23:45:20.997825427Z 
2025-07-20T23:45:20.997831447Z To address all issues (including breaking changes), run:
2025-07-20T23:45:20.997835527Z   npm audit fix --force
2025-07-20T23:45:20.997838827Z 
2025-07-20T23:45:20.997842777Z Run `npm audit` for details.
2025-07-20T23:45:21.17350799Z 
2025-07-20T23:45:21.17353097Z > @word-rush/common@1.0.0 build
2025-07-20T23:45:21.17353528Z > tsc
2025-07-20T23:45:21.173540541Z 
2025-07-20T23:45:22.624497757Z 
2025-07-20T23:45:22.624552388Z > @word-rush/client@1.0.0 build
2025-07-20T23:45:22.624558088Z > vite build
2025-07-20T23:45:22.624561878Z 
2025-07-20T23:45:22.82313828Z vite v4.5.14 building for production...
2025-07-20T23:45:22.853206019Z transforming...
2025-07-20T23:45:28.269757416Z ✓ 156 modules transformed.
2025-07-20T23:45:28.487156421Z rendering chunks...
2025-07-20T23:45:30.575499133Z [plugin:vite:reporter] 
2025-07-20T23:45:30.575522783Z (!) /opt/render/project/src/packages/client/src/services/notifications.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/services/deploymentHealthCheck.ts but also statically imported by /opt/render/project/src/packages/client/src/App.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/context/GameContext.tsx, dynamic import will not move module into another chunk.
2025-07-20T23:45:30.575539514Z 
2025-07-20T23:45:30.575700627Z [plugin:vite:reporter] 
2025-07-20T23:45:30.575708387Z (!) /opt/render/project/src/packages/client/src/components/board-rendering.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx but also statically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, dynamic import will not move module into another chunk.
2025-07-20T23:45:30.575711007Z 
2025-07-20T23:45:32.772013906Z computing gzip size...
2025-07-20T23:45:33.050454958Z dist/index.html                                    1.60 kB │ gzip:   0.76 kB
2025-07-20T23:45:33.050605461Z dist/assets/index-86b8198a.css                    38.06 kB │ gzip:   7.83 kB
2025-07-20T23:45:33.050768244Z dist/assets/checksumValidation-daa16d54.js         1.24 kB │ gzip:   0.66 kB │ map:      6.75 kB
2025-07-20T23:45:33.050820335Z dist/assets/syncMonitoring-6e303518.js             5.85 kB │ gzip:   1.91 kB │ map:     18.38 kB
2025-07-20T23:45:33.050822875Z dist/assets/deploymentHealthCheck-5e78b3f8.js      6.18 kB │ gzip:   2.04 kB │ map:     17.44 kB
2025-07-20T23:45:33.050901267Z 
2025-07-20T23:45:33.050905337Z dist/assets/index-221042f4.js                  1,864.47 kB │ gzip: 454.43 kB │ map: 11,555.66 kB
2025-07-20T23:45:33.050910167Z (!) Some chunks are larger than 500 kBs after minification. Consider:
2025-07-20T23:45:33.050914127Z - Using dynamic import() to code-split the application
2025-07-20T23:45:33.050917277Z - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
2025-07-20T23:45:33.050923017Z - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2025-07-20T23:45:33.051308735Z ✓ built in 10.23s
2025-07-20T23:45:34.366979222Z ==> Uploading build...
2025-07-20T23:45:41.384248143Z ==> Your site is live 🎉