2025-07-20T18:38:37.319332174Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-20T18:38:37.319363366Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-20T18:38:38.211884225Z ==> Checking out commit 5c6a942bd9fcf8812edb08464dea9cb396d230cc in branch main
2025-07-20T18:38:40.395697974Z ==> Using Node.js version 22.16.0 (default)
2025-07-20T18:38:40.421862903Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-20T18:38:42.350522859Z ==> Using Bun version 1.1.0 (default)
2025-07-20T18:38:42.350543251Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T18:38:42.413626254Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-20T18:38:45.582607229Z 
2025-07-20T18:38:45.582632531Z added 117 packages, and audited 121 packages in 3s
2025-07-20T18:38:45.582643272Z 
2025-07-20T18:38:45.582683594Z 15 packages are looking for funding
2025-07-20T18:38:45.582695145Z   run `npm fund` for details
2025-07-20T18:38:45.583856379Z 
2025-07-20T18:38:45.58386756Z found 0 vulnerabilities
2025-07-20T18:38:45.761707691Z 
2025-07-20T18:38:45.761757494Z > @word-rush/common@1.0.0 build
2025-07-20T18:38:45.761765095Z > tsc
2025-07-20T18:38:45.761768635Z 
2025-07-20T18:38:47.107405041Z 
2025-07-20T18:38:47.107431462Z > @word-rush/server@1.0.0 build
2025-07-20T18:38:47.107436693Z > tsc -p tsconfig.notype.json
2025-07-20T18:38:47.107441013Z 
2025-07-20T18:38:48.915002697Z tsconfig.notype.json(30,5): error TS5102: Option 'suppressImplicitAnyIndexErrors' has been removed. Please remove it from your configuration.
2025-07-20T18:38:48.915066111Z tsconfig.notype.json(31,5): error TS5102: Option 'noStrictGenericChecks' has been removed. Please remove it from your configuration.
2025-07-20T18:38:48.951515305Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:38:48.95159228Z npm error code 2
2025-07-20T18:38:48.951643754Z npm error path /opt/render/project/src/packages/server
2025-07-20T18:38:48.951718888Z npm error workspace @word-rush/server@1.0.0
2025-07-20T18:38:48.951797513Z npm error location /opt/render/project/src/packages/server
2025-07-20T18:38:48.951854427Z npm error command failed
2025-07-20T18:38:48.95190565Z npm error command sh -c tsc -p tsconfig.notype.json
2025-07-20T18:38:48.959093949Z ==> Build failed 😞
2025-07-20T18:38:48.959107839Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys