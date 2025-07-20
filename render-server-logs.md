2025-07-20T18:46:02.430237306Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-20T18:46:02.430557106Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-20T18:46:03.339463436Z ==> Checking out commit 891ca70c40e3b38cbb1582421cb226f4b17614ec in branch main
2025-07-20T18:46:05.474781804Z ==> Using Node.js version 22.16.0 (default)
2025-07-20T18:46:05.501047909Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-20T18:46:07.564554158Z ==> Using Bun version 1.1.0 (default)
2025-07-20T18:46:07.564573049Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T18:46:07.63123916Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-20T18:46:11.003909913Z 
2025-07-20T18:46:11.003928434Z added 117 packages, and audited 121 packages in 3s
2025-07-20T18:46:11.003974307Z 
2025-07-20T18:46:11.004000889Z 15 packages are looking for funding
2025-07-20T18:46:11.00401929Z   run `npm fund` for details
2025-07-20T18:46:11.005243108Z 
2025-07-20T18:46:11.005256929Z found 0 vulnerabilities
2025-07-20T18:46:11.186155015Z 
2025-07-20T18:46:11.186192007Z > @word-rush/common@1.0.0 build
2025-07-20T18:46:11.186196577Z > tsc
2025-07-20T18:46:11.186200048Z 
2025-07-20T18:46:12.723918837Z 
2025-07-20T18:46:12.723941998Z > @word-rush/server@1.0.0 build
2025-07-20T18:46:12.723945418Z > tsc -p tsconfig.minimal.json
2025-07-20T18:46:12.723948029Z 
2025-07-20T18:46:14.811273976Z src/handlers/roomHandlers.ts(130,29): error TS2339: Property 'error' does not exist on type '{ success: true; room: GameRoom; } | { success: false; error: string; }'.
2025-07-20T18:46:14.811299478Z   Property 'error' does not exist on type '{ success: true; room: GameRoom; }'.
2025-07-20T18:46:14.811632629Z src/index.ts(149,54): error TS2339: Property 'error' does not exist on type '{ success: false; error: string; } | { success: true; data: EventData<T>; }'.
2025-07-20T18:46:14.81164194Z   Property 'error' does not exist on type '{ success: true; data: EventData<T>; }'.
2025-07-20T18:46:14.81164664Z tsconfig.minimal.json(17,5): error TS5023: Unknown compiler option 'suppressOutputPathCheck'.
2025-07-20T18:46:14.84694123Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:46:14.846967092Z npm error code 2
2025-07-20T18:46:14.847034686Z npm error path /opt/render/project/src/packages/server
2025-07-20T18:46:14.847105541Z npm error workspace @word-rush/server@1.0.0
2025-07-20T18:46:14.847121042Z npm error location /opt/render/project/src/packages/server
2025-07-20T18:46:14.847189166Z npm error command failed
2025-07-20T18:46:14.847202807Z npm error command sh -c tsc -p tsconfig.minimal.json
2025-07-20T18:46:14.853587644Z ==> Build failed 😞
2025-07-20T18:46:14.853609556Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys