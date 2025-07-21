2025-07-21T01:07:23.413655864Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-21T01:07:23.47171786Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-21T01:07:26.265824427Z 
2025-07-21T01:07:26.265849739Z added 117 packages, and audited 121 packages in 3s
2025-07-21T01:07:26.26586656Z 
2025-07-21T01:07:26.265965686Z 15 packages are looking for funding
2025-07-21T01:07:26.265975696Z   run `npm fund` for details
2025-07-21T01:07:26.2668618Z 
2025-07-21T01:07:26.266869551Z found 0 vulnerabilities
2025-07-21T01:07:26.44567455Z 
2025-07-21T01:07:26.445693641Z > @word-rush/common@1.0.0 build
2025-07-21T01:07:26.445696601Z > tsc
2025-07-21T01:07:26.445698982Z 
2025-07-21T01:07:27.695310296Z 
2025-07-21T01:07:27.695326587Z > @word-rush/server@1.0.0 build
2025-07-21T01:07:27.695330217Z > tsc -p tsconfig.minimal.json && cp -r src/assets dist/
2025-07-21T01:07:27.695332977Z 
2025-07-21T01:07:30.554795575Z ==> Uploading build...
2025-07-21T01:07:35.66141304Z ==> Uploaded in 3.8s. Compression took 1.4s
2025-07-21T01:07:35.714398238Z ==> Build successful 🎉
2025-07-21T01:07:37.750004761Z ==> Deploying...
2025-07-21T01:07:50.443594845Z ==> Running 'node dist/index.js'
2025-07-21T01:07:52.735995511Z [2025-07-21T01:07:52.735Z] Dictionary loaded from: /opt/render/project/src/packages/server/dist/assets/UWU.txt
2025-07-21T01:07:54.038955Z [2025-07-21T01:07:54.038Z] Dictionary loaded: 264022 words
2025-07-21T01:07:54.238212996Z [2025-07-21T01:07:54.238Z] Word Rush server running on 0.0.0.0:10000
2025-07-21T01:07:54.238231056Z [2025-07-21T01:07:54.238Z] Environment: production
2025-07-21T01:07:54.238570323Z [2025-07-21T01:07:54.238Z] 🎯 Difficulty Multipliers Active: { easy: '1x', medium: '1.5x', hard: '2x', extreme: '3x' }
2025-07-21T01:07:54.238579263Z [2025-07-21T01:07:54.238Z] 🚀 Speed Bonus Multiplier: 1.5x
2025-07-21T01:07:54.238618884Z [2025-07-21T01:07:54.238Z] 📊 Example: 6-point word scores:
2025-07-21T01:07:54.238723676Z    Easy: 6 × 1.0 = 6 points
2025-07-21T01:07:54.238844038Z    Medium: 6 × 1.5 = 9 points
2025-07-21T01:07:54.239069463Z    Hard: 6 × 2.0 = 12 points
2025-07-21T01:07:54.239084923Z    Extreme: 6 × 3.0 = 18 points
2025-07-21T01:07:54.239093793Z    + Speed Bonus: × 1.5 (e.g., Hard + Speed = 12 × 1.5 = 18 points)
2025-07-21T01:07:54.239130924Z [2025-07-21T01:07:54.239Z] 🔧 SECTION 5 FIX: Pre-populating board cache for instant match starts...
2025-07-21T01:07:56.241639703Z [2025-07-21T01:07:56.241Z] 🎲 Starting pre-generation of 3 boards...
2025-07-21T01:08:22.435991439Z [2025-07-21T01:08:22.435Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (26194ms)
2025-07-21T01:08:27.835703515Z [2025-07-21T01:08:27.835Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5400ms)
2025-07-21T01:08:27.836759316Z [2025-07-21T01:08:27.836Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (1ms)
2025-07-21T01:08:27.836768936Z [2025-07-21T01:08:27.836Z] ✅ Pre-generated 3 boards in 31595ms
2025-07-21T01:08:27.836902418Z [2025-07-21T01:08:27.836Z] ✅ SECTION 5 FIX: Initial board cache pre-populated - ready for zero-delay match starts
2025-07-21T01:08:27.836908868Z [2025-07-21T01:08:27.836Z] 🎲 Starting pre-generation of 7 boards...
2025-07-21T01:08:42.935443401Z [2025-07-21T01:08:42.935Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (15099ms)
2025-07-21T01:09:09.143888868Z [2025-07-21T01:09:09.143Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (26208ms)
2025-07-21T01:09:14.835468094Z [2025-07-21T01:09:14.835Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5692ms)
2025-07-21T01:09:20.439987348Z [2025-07-21T01:09:20.439Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5604ms)
2025-07-21T01:09:59.046965644Z [2025-07-21T01:09:59.046Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (38607ms)
2025-07-21T01:10:04.749775512Z [2025-07-21T01:10:04.749Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5703ms)
2025-07-21T01:10:20.866055156Z ==> Your service is live 🎉
2025-07-21T01:10:20.929755111Z ==> 
2025-07-21T01:10:20.966462629Z ==> ///////////////////////////////////////////////////////////
2025-07-21T01:10:21.014308635Z ==> 
2025-07-21T01:10:21.053575853Z ==> Available at your primary URL https://word-rush-server.onrender.com
2025-07-21T01:10:21.09576309Z ==> 
2025-07-21T01:10:21.122770968Z ==> ///////////////////////////////////////////////////////////
2025-07-21T01:10:20.342902866Z [2025-07-21T01:10:20.342Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (15593ms)
2025-07-21T01:10:20.342958738Z [2025-07-21T01:10:20.342Z] ✅ Pre-generated 10 boards in 112506ms
2025-07-21T01:10:32.367814475Z [2025-07-21T01:10:32.367Z] Player connected: BH6fA7d9Tf4GgH41AAAB
2025-07-21T01:10:32.370275712Z generateBoard: 0.091ms
2025-07-21T01:10:32.370297483Z [2025-07-21T01:10:32.370Z] 🚀 Served board from cache (9 remaining) - ZERO DELAY