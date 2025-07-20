2025-07-20T18:25:15.454577968Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-20T18:25:15.454604829Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-20T18:25:16.37362866Z ==> Checking out commit 6c3ea1b4d1d9b1d12a8c6e8295538014f8853eea in branch main
2025-07-20T18:25:19.922930638Z ==> Using Node.js version 22.16.0 (default)
2025-07-20T18:25:19.948728563Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-20T18:25:22.23985309Z ==> Using Bun version 1.1.0 (default)
2025-07-20T18:25:22.239910571Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T18:25:22.312449003Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-20T18:25:25.496514078Z 
2025-07-20T18:25:25.496539029Z added 113 packages, and audited 117 packages in 3s
2025-07-20T18:25:25.496550719Z 
2025-07-20T18:25:25.496555439Z 15 packages are looking for funding
2025-07-20T18:25:25.4965623Z   run `npm fund` for details
2025-07-20T18:25:25.497435641Z 
2025-07-20T18:25:25.497450672Z found 0 vulnerabilities
2025-07-20T18:25:25.675065517Z 
2025-07-20T18:25:25.675091128Z > @word-rush/common@1.0.0 build
2025-07-20T18:25:25.675096278Z > tsc
2025-07-20T18:25:25.675099958Z 
2025-07-20T18:25:26.802375739Z 
2025-07-20T18:25:26.80239086Z > @word-rush/server@1.0.0 build
2025-07-20T18:25:26.80239449Z > tsc
2025-07-20T18:25:26.8023973Z 
2025-07-20T18:25:28.546964707Z src/index.ts(6,21): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/node_modules/express/index.js' implicitly has an 'any' type.
2025-07-20T18:25:28.546985047Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-07-20T18:25:28.568999377Z src/index.ts(87,21): error TS7006: Parameter '_' implicitly has an 'any' type.
2025-07-20T18:25:28.569013757Z src/index.ts(87,24): error TS7006: Parameter 'res' implicitly has an 'any' type.
2025-07-20T18:25:28.569024497Z src/services/board.ts(590,10): error TS6133: 'findAllValidWords' is declared but its value is never read.
2025-07-20T18:25:28.569053458Z src/services/board.ts(593,3): error TS6133: 'config' is declared but its value is never read.
2025-07-20T18:25:28.569066878Z src/services/board.ts(602,10): error TS6133: 'findWordsFromPosition' is declared but its value is never read.
2025-07-20T18:25:28.569101919Z src/services/board.ts(610,3): error TS6133: 'config' is declared but its value is never read.
2025-07-20T18:25:28.56910997Z src/services/board.ts(657,3): error TS6133: 'dictionaryService' is declared but its value is never read.
2025-07-20T18:25:28.569268914Z src/services/room.ts(7,43): error TS6133: 'DEFAULT_MATCH_SETTINGS' is declared but its value is never read.
2025-07-20T18:25:28.569427198Z src/services/room.ts(309,57): error TS6133: 'reject' is declared but its value is never read.
2025-07-20T18:25:28.569439268Z src/services/room.ts(1223,33): error TS6133: 'roomCode' is declared but its value is never read.
2025-07-20T18:25:28.569478709Z src/services/room.ts(1229,42): error TS6133: 'roomCode' is declared but its value is never read.
2025-07-20T18:25:28.569484179Z src/services/room.ts(1235,42): error TS6133: 'roomCode' is declared but its value is never read.
2025-07-20T18:25:28.58993851Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:25:28.590051393Z npm error code 2
2025-07-20T18:25:28.590091194Z npm error path /opt/render/project/src/packages/server
2025-07-20T18:25:28.590138345Z npm error workspace @word-rush/server@1.0.0
2025-07-20T18:25:28.590181206Z npm error location /opt/render/project/src/packages/server
2025-07-20T18:25:28.590196266Z npm error command failed
2025-07-20T18:25:28.590239077Z npm error command sh -c tsc
2025-07-20T18:25:28.596250977Z ==> Build failed 😞
2025-07-20T18:25:28.596274438Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys