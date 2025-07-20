2025-07-20T19:04:43.502061266Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-20T19:04:43.502092438Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-20T19:04:44.389430011Z ==> Checking out commit c9a1a5343dfac8c2d3e18e8c7f1c7ff04b5a4ff7 in branch main
2025-07-20T19:04:46.565837805Z ==> Using Node.js version 22.16.0 (default)
2025-07-20T19:04:46.591224075Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-20T19:04:48.476499829Z ==> Using Bun version 1.1.0 (default)
2025-07-20T19:04:48.47651821Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T19:04:48.53595526Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-20T19:04:51.497098009Z 
2025-07-20T19:04:51.49712076Z added 117 packages, and audited 121 packages in 3s
2025-07-20T19:04:51.497142761Z 
2025-07-20T19:04:51.497154212Z 15 packages are looking for funding
2025-07-20T19:04:51.497188364Z   run `npm fund` for details
2025-07-20T19:04:51.498098132Z 
2025-07-20T19:04:51.498105053Z found 0 vulnerabilities
2025-07-20T19:04:51.69004834Z 
2025-07-20T19:04:51.690067811Z > @word-rush/common@1.0.0 build
2025-07-20T19:04:51.690073931Z > tsc
2025-07-20T19:04:51.690079092Z 
2025-07-20T19:04:52.911888625Z 
2025-07-20T19:04:52.911911447Z > @word-rush/server@1.0.0 build
2025-07-20T19:04:52.911916347Z > tsc -p tsconfig.minimal.json
2025-07-20T19:04:52.911919727Z 
2025-07-20T19:04:55.546783917Z ==> Uploading build...
2025-07-20T19:05:02.232064342Z ==> Uploaded in 5.4s. Compression took 1.3s
2025-07-20T19:05:02.251620523Z ==> Build successful 🎉
2025-07-20T19:05:04.014759945Z ==> Deploying...
2025-07-20T19:05:17.196945945Z ==> Running 'node dist/index.js'
2025-07-20T19:05:20.162131387Z ==> Exited with status 1
2025-07-20T19:05:20.177022387Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys
2025-07-20T19:05:19.501702387Z [2025-07-20T19:05:19.497Z] Failed to load dictionary: Error: ENOENT: no such file or directory, open '/opt/render/project/src/packages/server/dist/assets/UWU.txt'
2025-07-20T19:05:19.501723939Z     at readFileSync (node:fs:442:20)
2025-07-20T19:05:19.501728579Z     at loadWordList (file:///opt/render/project/src/packages/server/dist/services/dictionary.js:12:33)
2025-07-20T19:05:19.501732319Z     at createDictionaryService (file:///opt/render/project/src/packages/server/dist/services/dictionary.js:58:5)
2025-07-20T19:05:19.50173683Z     at file:///opt/render/project/src/packages/server/dist/services/dictionary.js:66:34
2025-07-20T19:05:19.50174083Z     at ModuleJob.run (node:internal/modules/esm/module_job:274:25)
2025-07-20T19:05:19.50174447Z     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:644:26)
2025-07-20T19:05:19.501748Z     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
2025-07-20T19:05:19.50175169Z   errno: -2,
2025-07-20T19:05:19.501755751Z   code: 'ENOENT',
2025-07-20T19:05:19.501759311Z   syscall: 'open',
2025-07-20T19:05:19.501763041Z   path: '/opt/render/project/src/packages/server/dist/assets/UWU.txt'
2025-07-20T19:05:19.501766451Z }
2025-07-20T19:05:19.501770002Z file:///opt/render/project/src/packages/server/dist/services/dictionary.js:23
2025-07-20T19:05:19.501774042Z             throw new Error('Failed to load UWU word list');
2025-07-20T19:05:19.501777902Z                   ^
2025-07-20T19:05:19.501781252Z 
2025-07-20T19:05:19.501784752Z Error: Failed to load UWU word list
2025-07-20T19:05:19.501788253Z     at loadWordList (file:///opt/render/project/src/packages/server/dist/services/dictionary.js:23:19)
2025-07-20T19:05:19.501791713Z     at createDictionaryService (file:///opt/render/project/src/packages/server/dist/services/dictionary.js:58:5)
2025-07-20T19:05:19.501795203Z     at file:///opt/render/project/src/packages/server/dist/services/dictionary.js:66:34
2025-07-20T19:05:19.501798653Z     at ModuleJob.run (node:internal/modules/esm/module_job:274:25)
2025-07-20T19:05:19.501802153Z     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:644:26)
2025-07-20T19:05:19.501805694Z     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)
2025-07-20T19:05:19.501808934Z 
2025-07-20T19:05:19.501812434Z Node.js v22.16.0
2025-07-20T19:05:25.684727974Z ==> Running 'node dist/index.js'
2025-07-20T19:05:28.180265665Z [2025-07-20T19:05:28.178Z] Failed to load dictionary: Error: ENOENT: no such file or directory, open '/opt/render/project/src/packages/server/dist/assets/UWU.txt'
2025-07-20T19:05:28.180293326Z     at readFileSync (node:fs:442:20)
2025-07-20T19:05:28.180298707Z     at loadWordList (file:///opt/render/project/src/packages/server/dist/services/dictionary.js:12:33)
2025-07-20T19:05:28.180303107Z     at createDictionaryService (file:///opt/render/project/src/packages/server/dist/services/dictionary.js:58:5)
2025-07-20T19:05:28.180307937Z     at file:///opt/render/project/src/packages/server/dist/services/dictionary.js:66:34
2025-07-20T19:05:28.180312727Z     at ModuleJob.run (node:internal/modules/esm/module_job:274:25)
2025-07-20T19:05:28.180317478Z     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:644:26)
2025-07-20T19:05:28.180321628Z     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5) {
2025-07-20T19:05:28.180325838Z   errno: -2,
2025-07-20T19:05:28.180330869Z   code: 'ENOENT',
2025-07-20T19:05:28.180335349Z   syscall: 'open',
2025-07-20T19:05:28.180339849Z   path: '/opt/render/project/src/packages/server/dist/assets/UWU.txt'
2025-07-20T19:05:28.180344789Z }
2025-07-20T19:05:28.180643667Z file:///opt/render/project/src/packages/server/dist/services/dictionary.js:23
2025-07-20T19:05:28.180652798Z             throw new Error('Failed to load UWU word list');
2025-07-20T19:05:28.180657168Z                   ^
2025-07-20T19:05:28.180659868Z 
2025-07-20T19:05:28.180663278Z Error: Failed to load UWU word list
2025-07-20T19:05:28.180667368Z     at loadWordList (file:///opt/render/project/src/packages/server/dist/services/dictionary.js:23:19)
2025-07-20T19:05:28.180672909Z     at createDictionaryService (file:///opt/render/project/src/packages/server/dist/services/dictionary.js:58:5)
2025-07-20T19:05:28.180677499Z     at file:///opt/render/project/src/packages/server/dist/services/dictionary.js:66:34
2025-07-20T19:05:28.180682019Z     at ModuleJob.run (node:internal/modules/esm/module_job:274:25)
2025-07-20T19:05:28.18068618Z     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:644:26)
2025-07-20T19:05:28.18069026Z     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)
2025-07-20T19:05:28.180694Z 
2025-07-20T19:05:28.18069791Z Node.js v22.16.0