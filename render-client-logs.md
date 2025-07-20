2025-07-20T18:38:54.12155169Z 
2025-07-20T18:38:54.12155722Z To address all issues (including breaking changes), run:
2025-07-20T18:38:54.121562951Z   npm audit fix --force
2025-07-20T18:38:54.121568071Z 
2025-07-20T18:38:54.121573411Z Run `npm audit` for details.
2025-07-20T18:38:54.156157391Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../client && npm run build'...
2025-07-20T18:39:07.346525789Z 
2025-07-20T18:39:07.34656135Z added 368 packages, and audited 456 packages in 13s
2025-07-20T18:39:07.346577401Z 
2025-07-20T18:39:07.346699064Z 137 packages are looking for funding
2025-07-20T18:39:07.346716395Z   run `npm fund` for details
2025-07-20T18:39:07.367057509Z 
2025-07-20T18:39:07.36709398Z 2 moderate severity vulnerabilities
2025-07-20T18:39:07.36710126Z 
2025-07-20T18:39:07.367109961Z To address all issues (including breaking changes), run:
2025-07-20T18:39:07.367117311Z   npm audit fix --force
2025-07-20T18:39:07.367123331Z 
2025-07-20T18:39:07.367130751Z Run `npm audit` for details.
2025-07-20T18:39:07.69248309Z 
2025-07-20T18:39:07.692529501Z > @word-rush/common@1.0.0 build
2025-07-20T18:39:07.692535622Z > tsc
2025-07-20T18:39:07.692541102Z 
2025-07-20T18:39:10.557169029Z 
2025-07-20T18:39:10.55721508Z > @word-rush/client@1.0.0 build
2025-07-20T18:39:10.557221731Z > vite build
2025-07-20T18:39:10.557226901Z 
2025-07-20T18:39:10.925768808Z vite v4.5.14 building for production...
2025-07-20T18:39:10.982158493Z transforming...
2025-07-20T18:39:20.888137129Z ✓ 156 modules transformed.
2025-07-20T18:39:21.223181997Z rendering chunks...
2025-07-20T18:39:25.019717137Z [plugin:vite:reporter] 
2025-07-20T18:39:25.019759468Z (!) /opt/render/project/src/packages/client/src/services/notifications.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/services/deploymentHealthCheck.ts but also statically imported by /opt/render/project/src/packages/client/src/App.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/context/GameContext.tsx, dynamic import will not move module into another chunk.
2025-07-20T18:39:25.019785539Z 
2025-07-20T18:39:25.019941903Z [plugin:vite:reporter] 
2025-07-20T18:39:25.019952493Z (!) /opt/render/project/src/packages/client/src/components/board-rendering.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx but also statically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, dynamic import will not move module into another chunk.
2025-07-20T18:39:25.019956114Z 
2025-07-20T18:39:29.741782602Z computing gzip size...
2025-07-20T18:39:29.920593165Z dist/index.html                                    1.60 kB │ gzip:   0.76 kB
2025-07-20T18:39:29.920767309Z dist/assets/index-86b8198a.css                    38.06 kB │ gzip:   7.83 kB
2025-07-20T18:39:29.921046777Z dist/assets/checksumValidation-daa16d54.js         1.24 kB │ gzip:   0.66 kB │ map:      6.75 kB
2025-07-20T18:39:29.921083118Z dist/assets/syncMonitoring-6e303518.js             5.85 kB │ gzip:   1.91 kB │ map:     18.38 kB
2025-07-20T18:39:29.921093008Z dist/assets/deploymentHealthCheck-d7c3826f.js      6.18 kB │ gzip:   2.04 kB │ map:     17.44 kB
2025-07-20T18:39:29.92115886Z 
2025-07-20T18:39:29.92116192Z dist/assets/index-bd9b3fa3.js                  1,864.47 kB │ gzip: 454.45 kB │ map: 11,555.65 kB
2025-07-20T18:39:29.921170301Z (!) Some chunks are larger than 500 kBs after minification. Consider:
2025-07-20T18:39:29.921174491Z - Using dynamic import() to code-split the application
2025-07-20T18:39:29.921179001Z - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
2025-07-20T18:39:29.921182751Z - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2025-07-20T18:39:29.921766337Z ✓ built in 18.99s
2025-07-20T18:39:31.39457084Z ==> Uploading build...
2025-07-20T18:39:39.192130287Z ==> Your site is live 🎉