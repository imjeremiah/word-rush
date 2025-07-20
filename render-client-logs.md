2025-07-20T18:35:38.795481412Z 2 moderate severity vulnerabilities
2025-07-20T18:35:38.795486773Z 
2025-07-20T18:35:38.795492753Z To address all issues (including breaking changes), run:
2025-07-20T18:35:38.795498693Z   npm audit fix --force
2025-07-20T18:35:38.795503533Z 
2025-07-20T18:35:38.795509023Z Run `npm audit` for details.
2025-07-20T18:35:40.333528339Z 
2025-07-20T18:35:40.33356671Z up to date, audited 87 packages in 1s
2025-07-20T18:35:40.33357215Z 
2025-07-20T18:35:40.333605081Z 8 packages are looking for funding
2025-07-20T18:35:40.333629112Z   run `npm fund` for details
2025-07-20T18:35:40.346616422Z 
2025-07-20T18:35:40.346632743Z 2 moderate severity vulnerabilities
2025-07-20T18:35:40.346637873Z 
2025-07-20T18:35:40.346643933Z To address all issues (including breaking changes), run:
2025-07-20T18:35:40.346650633Z   npm audit fix --force
2025-07-20T18:35:40.346655524Z 
2025-07-20T18:35:40.346661264Z Run `npm audit` for details.
2025-07-20T18:35:40.382657253Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../client && npm run build'...
2025-07-20T18:35:53.594951702Z 
2025-07-20T18:35:53.595016924Z added 368 packages, and audited 456 packages in 13s
2025-07-20T18:35:53.595063285Z 
2025-07-20T18:35:53.595098906Z 137 packages are looking for funding
2025-07-20T18:35:53.595126097Z   run `npm fund` for details
2025-07-20T18:35:53.612243632Z 
2025-07-20T18:35:53.612269692Z 2 moderate severity vulnerabilities
2025-07-20T18:35:53.612277142Z 
2025-07-20T18:35:53.612286933Z To address all issues (including breaking changes), run:
2025-07-20T18:35:53.612296343Z   npm audit fix --force
2025-07-20T18:35:53.612303443Z 
2025-07-20T18:35:53.612310133Z Run `npm audit` for details.
2025-07-20T18:35:53.933359912Z 
2025-07-20T18:35:53.933392763Z > @word-rush/common@1.0.0 build
2025-07-20T18:35:53.933399123Z > tsc
2025-07-20T18:35:53.933404113Z 
2025-07-20T18:35:56.582416397Z 
2025-07-20T18:35:56.582458628Z > @word-rush/client@1.0.0 build
2025-07-20T18:35:56.582465108Z > tsc -p tsconfig.notype.json && vite build
2025-07-20T18:35:56.582470168Z 
2025-07-20T18:36:02.116172207Z tsconfig.notype.json(16,5): error TS5023: Unknown compiler option 'transpileOnly'.
2025-07-20T18:36:02.116428374Z tsconfig.notype.json(19,35): error TS5096: Option 'allowImportingTsExtensions' can only be used when either 'noEmit' or 'emitDeclarationOnly' is set.
2025-07-20T18:36:02.176376997Z npm error Lifecycle script `build` failed with error:
2025-07-20T18:36:02.17647437Z npm error code 2
2025-07-20T18:36:02.176493181Z npm error path /opt/render/project/src/packages/client
2025-07-20T18:36:02.176668355Z npm error workspace @word-rush/client@1.0.0
2025-07-20T18:36:02.176722357Z npm error location /opt/render/project/src/packages/client
2025-07-20T18:36:02.17683224Z npm error command failed
2025-07-20T18:36:02.17684758Z npm error command sh -c tsc -p tsconfig.notype.json && vite build
2025-07-20T18:36:02.189298276Z ==> Build failed 😞
2025-07-20T18:36:02.189316646Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys