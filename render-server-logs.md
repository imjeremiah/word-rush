2025-07-21T00:37:31.452870622Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-21T00:37:31.452967535Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-21T00:37:32.038240966Z ==> Checking out commit 72951f5b3f28c8d1b631ab398f7af00b994ce93f in branch main
2025-07-21T00:37:33.508668453Z ==> Using Node.js version 22.16.0 (default)
2025-07-21T00:37:33.534253412Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-21T00:37:35.531115637Z ==> Using Bun version 1.1.0 (default)
2025-07-21T00:37:35.531149668Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-21T00:37:35.595641113Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-21T00:37:39.669142988Z 
2025-07-21T00:37:39.669168588Z added 117 packages, and audited 121 packages in 4s
2025-07-21T00:37:39.669186399Z 
2025-07-21T00:37:39.669258701Z 15 packages are looking for funding
2025-07-21T00:37:39.669272011Z   run `npm fund` for details
2025-07-21T00:37:39.670578054Z 
2025-07-21T00:37:39.670592615Z found 0 vulnerabilities
2025-07-21T00:37:39.866114022Z 
2025-07-21T00:37:39.866145423Z > @word-rush/common@1.0.0 build
2025-07-21T00:37:39.866150523Z > tsc
2025-07-21T00:37:39.866154834Z 
2025-07-21T00:37:41.220286601Z 
2025-07-21T00:37:41.220316832Z > @word-rush/server@1.0.0 build
2025-07-21T00:37:41.220327702Z > tsc -p tsconfig.minimal.json && cp -r src/assets dist/
2025-07-21T00:37:41.220330922Z 
2025-07-21T00:37:43.190229014Z src/services/board.ts(583,16): error TS1160: Unterminated template literal.
2025-07-21T00:37:43.224180865Z npm error Lifecycle script `build` failed with error:
2025-07-21T00:37:43.224227226Z npm error code 2
2025-07-21T00:37:43.224251947Z npm error path /opt/render/project/src/packages/server
2025-07-21T00:37:43.22437256Z npm error workspace @word-rush/server@1.0.0
2025-07-21T00:37:43.224413991Z npm error location /opt/render/project/src/packages/server
2025-07-21T00:37:43.224492533Z npm error command failed
2025-07-21T00:37:43.224510174Z npm error command sh -c tsc -p tsconfig.minimal.json && cp -r src/assets dist/
2025-07-21T00:37:43.231767547Z ==> Build failed 😞
2025-07-21T00:37:43.231789698Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys