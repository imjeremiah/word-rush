2025-07-20T18:42:06.455200161Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-20T18:42:06.455276032Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-20T18:42:08.232711873Z ==> Checking out commit 31af9c9ef1022b3e5a77033796f1c4f5e564cd82 in branch main
2025-07-20T18:42:30.842819213Z ==> Using Node.js version 22.16.0 (default)
2025-07-20T18:42:30.926858278Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-20T18:42:33.132922887Z ==> Using Bun version 1.1.0 (default)
2025-07-20T18:42:33.132941037Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T18:42:33.206092226Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-20T18:42:36.477060169Z 
2025-07-20T18:42:36.477082489Z added 117 packages, and audited 121 packages in 3s
2025-07-20T18:42:36.477092309Z 
2025-07-20T18:42:36.477095359Z 15 packages are looking for funding
2025-07-20T18:42:36.47709807Z   run `npm fund` for details
2025-07-20T18:42:36.478063895Z 
2025-07-20T18:42:36.478071955Z found 0 vulnerabilities
2025-07-20T18:42:36.798773537Z 
2025-07-20T18:42:36.798798158Z > @word-rush/common@1.0.0 build
2025-07-20T18:42:36.798801698Z > tsc
2025-07-20T18:42:36.798804438Z 
2025-07-20T18:42:38.106995324Z 
2025-07-20T18:42:38.167196303Z > @word-rush/server@1.0.0 build
2025-07-20T18:42:38.167239144Z > tsc -p tsconfig.notype.json
2025-07-20T18:42:38.167256724Z 
2025-07-20T18:42:40.182184258Z src/handlers/roomHandlers.ts(130,29): error TS2339: Property 'error' does not exist on type '{ success: true; room: GameRoom; } | { success: false; error: string; }'.
2025-07-20T18:42:40.182226649Z   Property 'error' does not exist on type '{ success: true; room: GameRoom; }'.
2025-07-20T18:42:40.182373763Z src/index.ts(149,54): error TS2339: Property 'error' does not exist on type '{ success: false; error: string; } | { success: true; data: EventData<T>; }'.
2025-07-20T18:42:40.182381563Z   Property 'error' does not exist on type '{ success: true; data: EventData<T>; }'.
2025-07-20T18:42:40.182398443Z src/services/dictionary.ts(35,40): error TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', 'node18', or 'nodenext'.
2025-07-20T18:42:40.233788892Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:42:40.233848143Z npm error code 2
2025-07-20T18:42:40.233895054Z npm error path /opt/render/project/src/packages/server
2025-07-20T18:42:40.233939555Z npm error workspace @word-rush/server@1.0.0
2025-07-20T18:42:40.233988847Z npm error location /opt/render/project/src/packages/server
2025-07-20T18:42:40.234029228Z npm error command failed
2025-07-20T18:42:40.234074989Z npm error command sh -c tsc -p tsconfig.notype.json
2025-07-20T18:42:40.240508608Z ==> Build failed 😞
2025-07-20T18:42:40.240525568Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys