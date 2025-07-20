2025-07-20T18:46:50.252773371Z To address all issues (including breaking changes), run:
2025-07-20T18:46:50.252777331Z   npm audit fix --force
2025-07-20T18:46:50.252780612Z 
2025-07-20T18:46:50.252784952Z Run `npm audit` for details.
2025-07-20T18:46:50.272766833Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../client && npm run build'...
2025-07-20T18:46:58.545644673Z 
2025-07-20T18:46:58.545672074Z added 368 packages, and audited 456 packages in 8s
2025-07-20T18:46:58.545768086Z 
2025-07-20T18:46:58.545782426Z 137 packages are looking for funding
2025-07-20T18:46:58.545790716Z   run `npm fund` for details
2025-07-20T18:46:58.555203651Z 
2025-07-20T18:46:58.555223181Z 2 moderate severity vulnerabilities
2025-07-20T18:46:58.555227651Z 
2025-07-20T18:46:58.555231941Z To address all issues (including breaking changes), run:
2025-07-20T18:46:58.555235861Z   npm audit fix --force
2025-07-20T18:46:58.555239081Z 
2025-07-20T18:46:58.555243462Z Run `npm audit` for details.
2025-07-20T18:46:58.73998072Z 
2025-07-20T18:46:58.74000527Z > @word-rush/common@1.0.0 build
2025-07-20T18:46:58.74000985Z > tsc
2025-07-20T18:46:58.74001342Z 
2025-07-20T18:47:00.288983441Z 
2025-07-20T18:47:00.289010001Z > @word-rush/client@1.0.0 build
2025-07-20T18:47:00.289014391Z > vite build
2025-07-20T18:47:00.289017961Z 
2025-07-20T18:47:00.498541601Z vite v4.5.14 building for production...
2025-07-20T18:47:00.541241201Z transforming...
2025-07-20T18:47:06.297714423Z ✓ 156 modules transformed.
2025-07-20T18:47:06.524398505Z rendering chunks...
2025-07-20T18:47:08.757950106Z [plugin:vite:reporter] 
2025-07-20T18:47:08.757974357Z (!) /opt/render/project/src/packages/client/src/services/notifications.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/services/deploymentHealthCheck.ts but also statically imported by /opt/render/project/src/packages/client/src/App.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/context/GameContext.tsx, dynamic import will not move module into another chunk.
2025-07-20T18:47:08.757990837Z 
2025-07-20T18:47:08.758265063Z [plugin:vite:reporter] 
2025-07-20T18:47:08.758273713Z (!) /opt/render/project/src/packages/client/src/components/board-rendering.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx but also statically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, dynamic import will not move module into another chunk.
2025-07-20T18:47:08.758276263Z 
2025-07-20T18:47:11.437239114Z computing gzip size...
2025-07-20T18:47:11.736628956Z dist/index.html                                    1.60 kB │ gzip:   0.76 kB
2025-07-20T18:47:11.736771548Z dist/assets/index-86b8198a.css                    38.06 kB │ gzip:   7.83 kB
2025-07-20T18:47:11.736929592Z dist/assets/checksumValidation-daa16d54.js         1.24 kB │ gzip:   0.66 kB │ map:      6.75 kB
2025-07-20T18:47:11.736977573Z dist/assets/syncMonitoring-6e303518.js             5.85 kB │ gzip:   1.91 kB │ map:     18.38 kB
2025-07-20T18:47:11.737017213Z dist/assets/deploymentHealthCheck-d7c3826f.js      6.18 kB │ gzip:   2.04 kB │ map:     17.44 kB
2025-07-20T18:47:11.737030274Z dist/assets/index-bd9b3fa3.js                  1,864.47 kB │ gzip: 454.45 kB │ map: 11,555.65 kB
2025-07-20T18:47:11.737092895Z 
2025-07-20T18:47:11.737109195Z (!) Some chunks are larger than 500 kBs after minification. Consider:
2025-07-20T18:47:11.737113475Z - Using dynamic import() to code-split the application
2025-07-20T18:47:11.737117456Z - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
2025-07-20T18:47:11.737120346Z - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2025-07-20T18:47:11.737531354Z ✓ built in 11.24s
2025-07-20T18:47:20.046615996Z ==> Uploading build...
2025-07-20T18:47:27.199405239Z ==> Your site is live 🎉