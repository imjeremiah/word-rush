2025-07-21T00:18:32.500883789Z To address all issues (including breaking changes), run:
2025-07-21T00:18:32.500886729Z   npm audit fix --force
2025-07-21T00:18:32.50088878Z 
2025-07-21T00:18:32.50089188Z Run `npm audit` for details.
2025-07-21T00:18:32.520570673Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../client && npm run build'...
2025-07-21T00:18:39.159484873Z 
2025-07-21T00:18:39.159513324Z added 368 packages, and audited 456 packages in 7s
2025-07-21T00:18:39.159535724Z 
2025-07-21T00:18:39.159576795Z 137 packages are looking for funding
2025-07-21T00:18:39.159590376Z   run `npm fund` for details
2025-07-21T00:18:39.170013134Z 
2025-07-21T00:18:39.170046365Z 2 moderate severity vulnerabilities
2025-07-21T00:18:39.170051655Z 
2025-07-21T00:18:39.170055915Z To address all issues (including breaking changes), run:
2025-07-21T00:18:39.170060995Z   npm audit fix --force
2025-07-21T00:18:39.170064975Z 
2025-07-21T00:18:39.170069715Z Run `npm audit` for details.
2025-07-21T00:18:39.351087425Z 
2025-07-21T00:18:39.351111145Z > @word-rush/common@1.0.0 build
2025-07-21T00:18:39.351115436Z > tsc
2025-07-21T00:18:39.351118926Z 
2025-07-21T00:18:40.746509767Z 
2025-07-21T00:18:40.746539637Z > @word-rush/client@1.0.0 build
2025-07-21T00:18:40.746545928Z > vite build
2025-07-21T00:18:40.746551028Z 
2025-07-21T00:18:40.953509492Z vite v4.5.14 building for production...
2025-07-21T00:18:40.98438607Z transforming...
2025-07-21T00:18:46.171280198Z ✓ 156 modules transformed.
2025-07-21T00:18:46.38292711Z rendering chunks...
2025-07-21T00:18:48.375313842Z [plugin:vite:reporter] 
2025-07-21T00:18:48.375338592Z (!) /opt/render/project/src/packages/client/src/services/notifications.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/services/deploymentHealthCheck.ts but also statically imported by /opt/render/project/src/packages/client/src/App.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/context/GameContext.tsx, dynamic import will not move module into another chunk.
2025-07-21T00:18:48.375357203Z 
2025-07-21T00:18:48.375587397Z [plugin:vite:reporter] 
2025-07-21T00:18:48.375596128Z (!) /opt/render/project/src/packages/client/src/components/board-rendering.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx but also statically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, dynamic import will not move module into another chunk.
2025-07-21T00:18:48.375598708Z 
2025-07-21T00:18:50.423654537Z computing gzip size...
2025-07-21T00:18:50.533132225Z dist/index.html                                    1.60 kB │ gzip:   0.76 kB
2025-07-21T00:18:50.533263788Z dist/assets/index-86b8198a.css                    38.06 kB │ gzip:   7.83 kB
2025-07-21T00:18:50.533415971Z dist/assets/checksumValidation-daa16d54.js         1.24 kB │ gzip:   0.66 kB │ map:      6.75 kB
2025-07-21T00:18:50.533444302Z dist/assets/syncMonitoring-6e303518.js             5.85 kB │ gzip:   1.91 kB │ map:     18.38 kB
2025-07-21T00:18:50.533480343Z dist/assets/deploymentHealthCheck-88c4391b.js      6.18 kB │ gzip:   2.04 kB │ map:     17.44 kB
2025-07-21T00:18:50.533520773Z dist/assets/index-bad222d8.js                  1,866.24 kB │ gzip: 454.76 kB │ map: 11,560.59 kB
2025-07-21T00:18:50.533548544Z 
2025-07-21T00:18:50.533551934Z (!) Some chunks are larger than 500 kBs after minification. Consider:
2025-07-21T00:18:50.533555354Z - Using dynamic import() to code-split the application
2025-07-21T00:18:50.533557684Z - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
2025-07-21T00:18:50.533559534Z - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2025-07-21T00:18:50.533909452Z ✓ built in 9.58s
2025-07-21T00:18:52.517057628Z ==> Uploading build...
2025-07-21T00:18:59.66243871Z ==> Your site is live 🎉