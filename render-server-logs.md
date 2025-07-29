2025-07-21T01:22:31.129355876Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-21T01:22:31.129394347Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-21T01:22:31.865408323Z ==> Checking out commit ddd213a732de7000f30f79d5f766f813d3d268a4 in branch main
2025-07-21T01:22:34.182434637Z ==> Using Node.js version 22.16.0 (default)
2025-07-21T01:22:34.210926951Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-21T01:22:36.13549263Z ==> Using Bun version 1.1.0 (default)
2025-07-21T01:22:36.13551219Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-21T01:22:36.200747497Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-21T01:22:39.517849876Z 
2025-07-21T01:22:39.517890917Z added 117 packages, and audited 121 packages in 3s
2025-07-21T01:22:39.517896008Z 
2025-07-21T01:22:39.517899877Z 15 packages are looking for funding
2025-07-21T01:22:39.517919338Z   run `npm fund` for details
2025-07-21T01:22:39.51884959Z 
2025-07-21T01:22:39.518863621Z found 0 vulnerabilities
2025-07-21T01:22:39.699440397Z 
2025-07-21T01:22:39.699467228Z > @word-rush/common@1.0.0 build
2025-07-21T01:22:39.699473448Z > tsc
2025-07-21T01:22:39.699478818Z 
2025-07-21T01:22:41.012796247Z 
2025-07-21T01:22:41.012820298Z > @word-rush/server@1.0.0 build
2025-07-21T01:22:41.012825338Z > tsc -p tsconfig.minimal.json && cp -r src/assets dist/
2025-07-21T01:22:41.012828788Z 
2025-07-21T01:22:44.188298675Z ==> Uploading build...
2025-07-21T01:22:49.603382682Z ==> Uploaded in 4.1s. Compression took 1.3s
2025-07-21T01:22:49.625302988Z ==> Build successful 🎉
2025-07-21T01:22:51.385685633Z ==> Deploying...
2025-07-21T01:23:04.004560066Z ==> Running 'node dist/index.js'
2025-07-21T01:23:06.004900085Z [2025-07-21T01:23:06.004Z] Dictionary loaded from: /opt/render/project/src/packages/server/dist/assets/UWU.txt
2025-07-21T01:23:07.593780482Z [2025-07-21T01:23:07.593Z] Dictionary loaded: 264022 words
2025-07-21T01:23:07.705863405Z [2025-07-21T01:23:07.705Z] Word Rush server running on 0.0.0.0:10000
2025-07-21T01:23:07.705887916Z [2025-07-21T01:23:07.705Z] Environment: production
2025-07-21T01:23:07.706167423Z [2025-07-21T01:23:07.705Z] 🎯 Difficulty Multipliers Active: { easy: '1x', medium: '1.5x', hard: '2x', extreme: '3x' }
2025-07-21T01:23:07.706221716Z [2025-07-21T01:23:07.706Z] 🚀 Speed Bonus Multiplier: 1.5x
2025-07-21T01:23:07.706361274Z [2025-07-21T01:23:07.706Z] 📊 Example: 6-point word scores:
2025-07-21T01:23:07.706375745Z    Easy: 6 × 1.0 = 6 points
2025-07-21T01:23:07.706445529Z    Medium: 6 × 1.5 = 9 points
2025-07-21T01:23:07.706656791Z    Hard: 6 × 2.0 = 12 points
2025-07-21T01:23:07.706662271Z    Extreme: 6 × 3.0 = 18 points
2025-07-21T01:23:07.706674132Z    + Speed Bonus: × 1.5 (e.g., Hard + Speed = 12 × 1.5 = 18 points)
2025-07-21T01:23:07.706712345Z [2025-07-21T01:23:07.706Z] ✅ Server ready - boards will be generated on-demand
2025-07-21T01:23:11.979790299Z ==> Your service is live 🎉
2025-07-21T01:23:12.008909457Z ==> 
2025-07-21T01:23:12.033188376Z ==> ///////////////////////////////////////////////////////////
2025-07-21T01:23:12.058078224Z ==> 
2025-07-21T01:23:12.083700302Z ==> Available at your primary URL https://word-rush-server.onrender.com
2025-07-21T01:23:12.1082775Z ==> 
2025-07-21T01:23:12.133985149Z ==> ///////////////////////////////////////////////////////////
2025-07-21T01:24:26.540466379Z [2025-07-21T01:24:26.540Z] Player connected: rXmxoKyxeX19Vb08AAAB
2025-07-21T01:24:26.54237836Z [2025-07-21T01:24:26.542Z] ⚠️ No cached board available, generating synchronously...
2025-07-21T01:24:26.59333328Z [2025-07-21T01:24:26.593Z] 🎯 Generated valid board with 10 words in 1 attempts (51ms)
2025-07-21T01:24:26.697261107Z [2025-07-21T01:24:26.697Z] 🎯 Generated valid 5x5 board with 10 words in 1 attempts (104ms)
2025-07-21T01:24:26.697736985Z [2025-07-21T01:24:26.697Z] 📦 Added board to cache (1/3)
2025-07-21T01:24:26.699985856Z [2025-07-21T01:24:26.699Z] 🎯 Generated valid 5x5 board with 10 words in 1 attempts (2ms)
2025-07-21T01:24:26.699995086Z [2025-07-21T01:24:26.699Z] 📦 Added board to cache (2/3)
2025-07-21T01:24:26.800650593Z [2025-07-21T01:24:26.800Z] 🎯 Generated valid 5x5 board with 10 words in 1 attempts (101ms)
2025-07-21T01:24:26.800672094Z [2025-07-21T01:24:26.800Z] 📦 Added board to cache (3/3)
2025-07-21T01:24:26.915244972Z [2025-07-21T01:24:26.915Z] Player attempting to reconnect with sessionId: 7RHLsu-AgG1ax2K6AAAH
2025-07-21T01:24:26.915319737Z [2025-07-21T01:24:26.915Z] No existing session found for reconnection, creating new session