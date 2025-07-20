2025-07-20T18:31:03.767233149Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-20T18:31:03.767480094Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-20T18:31:04.749242759Z ==> Checking out commit 4d98f35275ad5af4004a747e241f0677d1a44bdb in branch main
2025-07-20T18:31:06.838670914Z ==> Using Node.js version 22.16.0 (default)
2025-07-20T18:31:06.884617983Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-20T18:31:09.038815114Z ==> Using Bun version 1.1.0 (default)
2025-07-20T18:31:09.038863577Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T18:31:09.123574839Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-20T18:31:12.892361628Z 
2025-07-20T18:31:12.892415151Z added 117 packages, and audited 121 packages in 4s
2025-07-20T18:31:12.892437472Z 
2025-07-20T18:31:12.892445863Z 15 packages are looking for funding
2025-07-20T18:31:12.892452483Z   run `npm fund` for details
2025-07-20T18:31:12.893640902Z 
2025-07-20T18:31:12.893655923Z found 0 vulnerabilities
2025-07-20T18:31:13.115475209Z 
2025-07-20T18:31:13.1154937Z > @word-rush/common@1.0.0 build
2025-07-20T18:31:13.11549616Z > tsc
2025-07-20T18:31:13.11549784Z 
2025-07-20T18:31:14.829735446Z 
2025-07-20T18:31:14.829766457Z > @word-rush/server@1.0.0 build
2025-07-20T18:31:14.829770757Z > tsc -p tsconfig.prod.json
2025-07-20T18:31:14.829773688Z 
2025-07-20T18:31:17.228808147Z src/handlers/roomHandlers.ts(130,29): error TS2339: Property 'error' does not exist on type '{ success: true; room: GameRoom; } | { success: false; error: string; }'.
2025-07-20T18:31:17.228832729Z   Property 'error' does not exist on type '{ success: true; room: GameRoom; }'.
2025-07-20T18:31:17.228968006Z src/index.ts(149,54): error TS2339: Property 'error' does not exist on type '{ success: false; error: string; } | { success: true; data: EventData<T>; }'.
2025-07-20T18:31:17.228978017Z   Property 'error' does not exist on type '{ success: true; data: EventData<T>; }'.
2025-07-20T18:31:17.255633039Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:31:17.255739295Z npm error code 2
2025-07-20T18:31:17.255793029Z npm error path /opt/render/project/src/packages/server
2025-07-20T18:31:17.255920736Z npm error workspace @word-rush/server@1.0.0
2025-07-20T18:31:17.25598837Z npm error location /opt/render/project/src/packages/server
2025-07-20T18:31:17.256049523Z npm error command failed
2025-07-20T18:31:17.256111987Z npm error command sh -c tsc -p tsconfig.prod.json
2025-07-20T18:31:17.263804412Z ==> Build failed 😞
2025-07-20T18:31:17.263823113Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys