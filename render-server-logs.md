2025-07-20T23:45:02.77803325Z ==> Using Bun version 1.1.0 (default)
2025-07-20T23:45:02.77805059Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-20T23:45:02.837325719Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-20T23:45:05.988925678Z 
2025-07-20T23:45:05.988971829Z added 117 packages, and audited 121 packages in 3s
2025-07-20T23:45:05.98899217Z 
2025-07-20T23:45:05.98900654Z 15 packages are looking for funding
2025-07-20T23:45:05.98901165Z   run `npm fund` for details
2025-07-20T23:45:05.989791544Z 
2025-07-20T23:45:05.989802755Z found 0 vulnerabilities
2025-07-20T23:45:06.158903813Z 
2025-07-20T23:45:06.158926673Z > @word-rush/common@1.0.0 build
2025-07-20T23:45:06.158931554Z > tsc
2025-07-20T23:45:06.158935154Z 
2025-07-20T23:45:07.431272672Z 
2025-07-20T23:45:07.431299473Z > @word-rush/server@1.0.0 build
2025-07-20T23:45:07.431306593Z > tsc -p tsconfig.minimal.json && cp -r src/assets dist/
2025-07-20T23:45:07.431311983Z 
2025-07-20T23:45:09.781505692Z ==> Uploading build...
2025-07-20T23:45:15.524621631Z ==> Uploaded in 4.4s. Compression took 1.3s
2025-07-20T23:45:15.545686147Z ==> Build successful 🎉
2025-07-20T23:45:18.128916348Z ==> Deploying...
2025-07-20T23:45:35.936373583Z ==> Running 'node dist/index.js'
2025-07-20T23:45:38.441743216Z [2025-07-20T23:45:38.440Z] Dictionary loaded from: /opt/render/project/src/packages/server/dist/assets/UWU.txt
2025-07-20T23:45:40.039032988Z [2025-07-20T23:45:40.038Z] Dictionary loaded: 264022 words
2025-07-20T23:45:40.237474275Z [2025-07-20T23:45:40.237Z] 🎲 Starting board pre-generation cache...
2025-07-20T23:45:40.237537147Z [2025-07-20T23:45:40.237Z] 🎲 Starting pre-generation of 5 boards...
2025-07-20T23:46:07.643242546Z [2025-07-20T23:46:07.642Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (27405ms)
2025-07-20T23:46:13.334519624Z [2025-07-20T23:46:13.334Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5689ms)
2025-07-20T23:46:23.376264413Z ==> No open ports detected, continuing to scan...
2025-07-20T23:46:23.454255805Z ==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
2025-07-20T23:47:01.133026474Z [2025-07-20T23:47:01.046Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (47712ms)
2025-07-20T23:47:06.038530275Z [2025-07-20T23:47:06.038Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (4905ms)
2025-07-20T23:47:11.734672214Z [2025-07-20T23:47:11.734Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5696ms)
2025-07-20T23:47:11.734699335Z [2025-07-20T23:47:11.734Z] ✅ Pre-generated 5 boards in 91497ms
2025-07-20T23:47:11.832845343Z [2025-07-20T23:47:11.832Z] Word Rush server running on 0.0.0.0:10000
2025-07-20T23:47:11.833593574Z [2025-07-20T23:47:11.832Z] Environment: production
2025-07-20T23:47:11.835527558Z [2025-07-20T23:47:11.833Z] 🎯 Difficulty Multipliers Active: { easy: '1x', medium: '1.5x', hard: '2x', extreme: '3x' }
2025-07-20T23:47:11.836123085Z [2025-07-20T23:47:11.835Z] 🚀 Speed Bonus Multiplier: 1.5x
2025-07-20T23:47:11.836137656Z [2025-07-20T23:47:11.835Z] 📊 Example: 6-point word scores:
2025-07-20T23:47:11.836142236Z    Easy: 6 × 1.0 = 6 points
2025-07-20T23:47:11.836145966Z    Medium: 6 × 1.5 = 9 points
2025-07-20T23:47:11.836180147Z    Hard: 6 × 2.0 = 12 points
2025-07-20T23:47:11.836189197Z    Extreme: 6 × 3.0 = 18 points
2025-07-20T23:47:11.83630377Z    + Speed Bonus: × 1.5 (e.g., Hard + Speed = 12 × 1.5 = 18 points)
2025-07-20T23:47:11.836327401Z [2025-07-20T23:47:11.836Z] 🔧 SECTION 5 FIX: Pre-populating board cache for instant match starts...
2025-07-20T23:47:11.836802874Z [2025-07-20T23:47:11.836Z] 🎲 Starting pre-generation of 15 boards...
2025-07-20T23:47:24.092233606Z ==> No open HTTP ports detected on 0.0.0.0, continuing to scan...
2025-07-20T23:47:27.040124823Z [2025-07-20T23:47:27.039Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (15203ms)
2025-07-20T23:47:32.641459806Z [2025-07-20T23:47:32.641Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5601ms)
2025-07-20T23:47:47.233695655Z [2025-07-20T23:47:47.233Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (14592ms)
2025-07-20T23:48:19.443047664Z [2025-07-20T23:48:19.442Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (32209ms)
2025-07-20T23:48:24.791132048Z ==> No open HTTP ports detected on 0.0.0.0, continuing to scan...
2025-07-20T23:48:44.145538324Z [2025-07-20T23:48:44.145Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (24702ms)
2025-07-20T23:48:57.536490347Z [2025-07-20T23:48:57.536Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (13391ms)
2025-07-20T23:49:02.033120807Z [2025-07-20T23:49:02.032Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (4496ms)
2025-07-20T23:49:25.383266724Z ==> No open HTTP ports detected on 0.0.0.0, continuing to scan...
2025-07-20T23:49:37.941014644Z [2025-07-20T23:49:37.940Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (35907ms)
2025-07-20T23:49:42.733870755Z [2025-07-20T23:49:42.733Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (4793ms)