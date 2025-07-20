2025-07-20T18:35:20.321040702Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-20T18:35:20.321075813Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-20T18:35:21.36252241Z ==> Checking out commit 8a76d3dfd26778f4c62fd1ff21cf142318dfb233 in branch main
2025-07-20T18:35:23.401472048Z ==> Using Node.js version 22.16.0 (default)
2025-07-20T18:35:23.426955238Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-20T18:35:25.340255093Z ==> Using Bun version 1.1.0 (default)
2025-07-20T18:35:25.340276174Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T18:35:25.406358081Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-20T18:35:28.82897112Z 
2025-07-20T18:35:28.82899425Z added 117 packages, and audited 121 packages in 3s
2025-07-20T18:35:28.8290037Z 
2025-07-20T18:35:28.829007541Z 15 packages are looking for funding
2025-07-20T18:35:28.829014161Z   run `npm fund` for details
2025-07-20T18:35:28.829872413Z 
2025-07-20T18:35:28.829882104Z found 0 vulnerabilities
2025-07-20T18:35:29.129155321Z 
2025-07-20T18:35:29.129181131Z > @word-rush/common@1.0.0 build
2025-07-20T18:35:29.129186571Z > tsc
2025-07-20T18:35:29.129190831Z 
2025-07-20T18:35:30.404381651Z 
2025-07-20T18:35:30.404406392Z > @word-rush/server@1.0.0 build
2025-07-20T18:35:30.404411672Z > tsc -p tsconfig.notype.json
2025-07-20T18:35:30.404415832Z 
2025-07-20T18:35:32.043369924Z tsconfig.notype.json(15,5): error TS5023: Unknown compiler option 'transpileOnly'.
2025-07-20T18:35:32.103630238Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:35:32.103660989Z npm error code 2
2025-07-20T18:35:32.103756501Z npm error path /opt/render/project/src/packages/server
2025-07-20T18:35:32.103825223Z npm error workspace @word-rush/server@1.0.0
2025-07-20T18:35:32.103883915Z npm error location /opt/render/project/src/packages/server
2025-07-20T18:35:32.103936516Z npm error command failed
2025-07-20T18:35:32.103991737Z npm error command sh -c tsc -p tsconfig.notype.json
2025-07-20T18:35:32.110668033Z ==> Build failed 😞
2025-07-20T18:35:32.110704374Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys