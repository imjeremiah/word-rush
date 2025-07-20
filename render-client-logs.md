2025-07-20T23:08:36.663259217Z To address all issues (including breaking changes), run:
2025-07-20T23:08:36.663263726Z   npm audit fix --force
2025-07-20T23:08:36.663267246Z 
2025-07-20T23:08:36.663272187Z Run `npm audit` for details.
2025-07-20T23:08:36.685517514Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../client && npm run build'...
2025-07-20T23:08:44.413163524Z 
2025-07-20T23:08:44.413190874Z added 368 packages, and audited 456 packages in 8s
2025-07-20T23:08:44.413200834Z 
2025-07-20T23:08:44.413205614Z 137 packages are looking for funding
2025-07-20T23:08:44.413213585Z   run `npm fund` for details
2025-07-20T23:08:44.422610755Z 
2025-07-20T23:08:44.422638715Z 2 moderate severity vulnerabilities
2025-07-20T23:08:44.422643976Z 
2025-07-20T23:08:44.422649206Z To address all issues (including breaking changes), run:
2025-07-20T23:08:44.422654616Z   npm audit fix --force
2025-07-20T23:08:44.422658876Z 
2025-07-20T23:08:44.422664056Z Run `npm audit` for details.
2025-07-20T23:08:44.607433838Z 
2025-07-20T23:08:44.607467159Z > @word-rush/common@1.0.0 build
2025-07-20T23:08:44.607471429Z > tsc
2025-07-20T23:08:44.607474909Z 
2025-07-20T23:08:46.071928732Z 
2025-07-20T23:08:46.071957602Z > @word-rush/client@1.0.0 build
2025-07-20T23:08:46.071964432Z > vite build
2025-07-20T23:08:46.071969683Z 
2025-07-20T23:08:46.266869891Z vite v4.5.14 building for production...
2025-07-20T23:08:46.297997958Z transforming...
2025-07-20T23:08:51.467396052Z ✓ 156 modules transformed.
2025-07-20T23:08:51.682677236Z rendering chunks...
2025-07-20T23:08:53.653305569Z [plugin:vite:reporter] 
2025-07-20T23:08:53.65333198Z (!) /opt/render/project/src/packages/client/src/services/notifications.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/LobbyScreen.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/components/interactions.ts, /opt/render/project/src/packages/client/src/services/deploymentHealthCheck.ts but also statically imported by /opt/render/project/src/packages/client/src/App.tsx, /opt/render/project/src/packages/client/src/components/GameConnection.tsx, /opt/render/project/src/packages/client/src/context/GameContext.tsx, dynamic import will not move module into another chunk.
2025-07-20T23:08:53.65335064Z 
2025-07-20T23:08:53.653468683Z [plugin:vite:reporter] 
2025-07-20T23:08:53.653479743Z (!) /opt/render/project/src/packages/client/src/components/board-rendering.ts is dynamically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, /opt/render/project/src/packages/client/src/components/PhaserGame.tsx but also statically imported by /opt/render/project/src/packages/client/src/components/PhaserGame.tsx, dynamic import will not move module into another chunk.
2025-07-20T23:08:53.653482483Z 
2025-07-20T23:08:55.761935579Z computing gzip size...
2025-07-20T23:08:56.035807394Z dist/index.html                                    1.60 kB │ gzip:   0.76 kB
2025-07-20T23:08:56.035926916Z dist/assets/index-86b8198a.css                    38.06 kB │ gzip:   7.83 kB
2025-07-20T23:08:56.03608959Z dist/assets/checksumValidation-daa16d54.js         1.24 kB │ gzip:   0.66 kB │ map:      6.75 kB
2025-07-20T23:08:56.036103731Z dist/assets/syncMonitoring-6e303518.js             5.85 kB │ gzip:   1.91 kB │ map:     18.38 kB
2025-07-20T23:08:56.036161632Z dist/assets/deploymentHealthCheck-5e78b3f8.js      6.18 kB │ gzip:   2.04 kB │ map:     17.44 kB
2025-07-20T23:08:56.036203113Z dist/assets/index-221042f4.js                  1,864.47 kB │ gzip: 454.43 kB │ map: 11,555.66 kB
2025-07-20T23:08:56.036237743Z 
2025-07-20T23:08:56.036246964Z (!) Some chunks are larger than 500 kBs after minification. Consider:
2025-07-20T23:08:56.036250994Z - Using dynamic import() to code-split the application
2025-07-20T23:08:56.036253824Z - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
2025-07-20T23:08:56.036256114Z - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2025-07-20T23:08:56.036599742Z ✓ built in 9.77s
2025-07-20T23:09:00.13981255Z ==> Uploading build...
2025-07-20T23:09:07.211855765Z ==> Your site is live 🎉