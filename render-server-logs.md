2025-07-21T00:18:21.138643636Z ==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
2025-07-21T00:18:21.138685408Z ==> Cloning from https://github.com/imjeremiah/word-rush
2025-07-21T00:18:21.738261837Z ==> Checking out commit 8fce2c5c9537d8244768d4ff93f6f3ad57be17ad in branch main
2025-07-21T00:18:23.198238101Z ==> Using Node.js version 22.16.0 (default)
2025-07-21T00:18:23.223639053Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-07-21T00:18:25.100162113Z ==> Using Bun version 1.1.0 (default)
2025-07-21T00:18:25.100183214Z ==> Docs on specifying a Bun version: https://render.com/docs/bun-version
2025-07-21T00:18:25.165058113Z ==> Running build command 'cd ../.. && npm install && cd packages/common && npm run build && cd ../server && npm run build'...
2025-07-21T00:18:27.968376479Z 
2025-07-21T00:18:27.968398971Z added 117 packages, and audited 121 packages in 3s
2025-07-21T00:18:27.96854888Z 
2025-07-21T00:18:27.96855466Z 15 packages are looking for funding
2025-07-21T00:18:27.968562601Z   run `npm fund` for details
2025-07-21T00:18:27.969446354Z 
2025-07-21T00:18:27.969453855Z found 0 vulnerabilities
2025-07-21T00:18:28.141231696Z 
2025-07-21T00:18:28.141252717Z > @word-rush/common@1.0.0 build
2025-07-21T00:18:28.141256667Z > tsc
2025-07-21T00:18:28.141258847Z 
2025-07-21T00:18:29.322223699Z 
2025-07-21T00:18:29.322246981Z > @word-rush/server@1.0.0 build
2025-07-21T00:18:29.322250671Z > tsc -p tsconfig.minimal.json && cp -r src/assets dist/
2025-07-21T00:18:29.322252821Z 
2025-07-21T00:18:33.182025219Z ==> Uploading build...
2025-07-21T00:18:38.876516638Z ==> Uploaded in 4.5s. Compression took 1.2s
2025-07-21T00:18:38.898309061Z ==> Build successful 🎉
2025-07-21T00:18:40.380927332Z ==> Deploying...
2025-07-21T00:18:54.026961009Z ==> Running 'node dist/index.js'
2025-07-21T00:18:56.129553989Z [2025-07-21T00:18:56.128Z] Dictionary loaded from: /opt/render/project/src/packages/server/dist/assets/UWU.txt
2025-07-21T00:18:57.527905899Z [2025-07-21T00:18:57.527Z] Dictionary loaded: 264022 words
2025-07-21T00:18:57.725890009Z [2025-07-21T00:18:57.725Z] 🎲 Starting board pre-generation cache...
2025-07-21T00:18:57.725922012Z [2025-07-21T00:18:57.725Z] 🎲 Starting pre-generation of 5 boards...
2025-07-21T00:19:11.93838747Z [2025-07-21T00:19:11.938Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (14212ms)
2025-07-21T00:19:26.235315208Z [2025-07-21T00:19:26.235Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (14295ms)
2025-07-21T00:19:46.375073976Z ==> No open ports detected, continuing to scan...
2025-07-21T00:19:46.462317052Z ==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
2025-07-21T00:19:59.128710759Z [2025-07-21T00:19:59.127Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (32892ms)
2025-07-21T00:20:14.035253818Z [2025-07-21T00:20:14.034Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (14906ms)
2025-07-21T00:20:47.142159485Z ==> No open ports detected, continuing to scan...
2025-07-21T00:20:47.230690329Z ==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
2025-07-21T00:21:02.233383872Z [2025-07-21T00:21:02.232Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (48197ms)
2025-07-21T00:21:02.2336109Z [2025-07-21T00:21:02.233Z] ✅ Pre-generated 5 boards in 124508ms
2025-07-21T00:21:02.325476376Z [2025-07-21T00:21:02.325Z] Word Rush server running on 0.0.0.0:10000
2025-07-21T00:21:02.325497398Z [2025-07-21T00:21:02.325Z] Environment: production
2025-07-21T00:21:02.326817495Z [2025-07-21T00:21:02.325Z] 🎯 Difficulty Multipliers Active: { easy: '1x', medium: '1.5x', hard: '2x', extreme: '3x' }
2025-07-21T00:21:02.326844027Z [2025-07-21T00:21:02.326Z] 🚀 Speed Bonus Multiplier: 1.5x
2025-07-21T00:21:02.326897772Z [2025-07-21T00:21:02.326Z] 📊 Example: 6-point word scores:
2025-07-21T00:21:02.326915873Z    Easy: 6 × 1.0 = 6 points
2025-07-21T00:21:02.3269981Z    Medium: 6 × 1.5 = 9 points
2025-07-21T00:21:02.327172214Z    Hard: 6 × 2.0 = 12 points
2025-07-21T00:21:02.327197396Z    Extreme: 6 × 3.0 = 18 points
2025-07-21T00:21:02.327201436Z    + Speed Bonus: × 1.5 (e.g., Hard + Speed = 12 × 1.5 = 18 points)
2025-07-21T00:21:02.327242149Z [2025-07-21T00:21:02.327Z] 🔧 SECTION 5 FIX: Pre-populating board cache for instant match starts...
2025-07-21T00:21:02.327605129Z [2025-07-21T00:21:02.327Z] 🎲 Starting pre-generation of 15 boards...
2025-07-21T00:21:37.534983081Z [2025-07-21T00:21:37.534Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (35207ms)
2025-07-21T00:21:42.737629651Z [2025-07-21T00:21:42.737Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5203ms)
2025-07-21T00:21:48.114166955Z ==> No open HTTP ports detected on 0.0.0.0, continuing to scan...
2025-07-21T00:21:59.031366614Z [2025-07-21T00:21:59.031Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (16294ms)
2025-07-21T00:22:26.037773753Z [2025-07-21T00:22:26.037Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (27006ms)
2025-07-21T00:22:42.130354141Z [2025-07-21T00:22:42.130Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (16093ms)
2025-07-21T00:22:49.07730676Z ==> No open HTTP ports detected on 0.0.0.0, continuing to scan...
2025-07-21T00:22:56.326189171Z [2025-07-21T00:22:56.325Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (14195ms)
2025-07-21T00:23:23.227783632Z [2025-07-21T00:23:23.227Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (26901ms)
2025-07-21T00:23:49.822492543Z ==> No open HTTP ports detected on 0.0.0.0, continuing to scan...
2025-07-21T00:23:51.738039643Z [2025-07-21T00:23:51.737Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (28510ms)
2025-07-21T00:23:51.739140713Z [2025-07-21T00:23:51.739Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (2ms)
2025-07-21T00:23:57.928792207Z [2025-07-21T00:23:57.928Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (6189ms)
2025-07-21T00:24:03.938320962Z [2025-07-21T00:24:03.938Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (6010ms)
2025-07-21T00:24:20.628990599Z [2025-07-21T00:24:20.628Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (16690ms)
2025-07-21T00:24:26.136733707Z [2025-07-21T00:24:26.136Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5508ms)
2025-07-21T00:24:42.927757028Z [2025-07-21T00:24:42.927Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (16791ms)
2025-07-21T00:24:50.58749763Z ==> No open HTTP ports detected on 0.0.0.0, continuing to scan...
2025-07-21T00:25:01.146558916Z ==> Your service is live 🎉
2025-07-21T00:25:01.189836143Z ==> 
2025-07-21T00:25:01.24029384Z ==> ///////////////////////////////////////////////////////////
2025-07-21T00:25:01.279982637Z ==> 
2025-07-21T00:25:01.343956173Z ==> Available at your primary URL https://word-rush-server.onrender.com
2025-07-21T00:25:01.3858587Z ==> 
2025-07-21T00:25:01.417397888Z ==> ///////////////////////////////////////////////////////////
2025-07-21T00:24:57.538471783Z [2025-07-21T00:24:57.538Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (14611ms)
2025-07-21T00:24:57.538600504Z [2025-07-21T00:24:57.538Z] ✅ Pre-generated 20 boards in 235211ms
2025-07-21T00:24:57.538794949Z [2025-07-21T00:24:57.538Z] ✅ SECTION 5 FIX: Board cache pre-populated - ready for zero-delay match starts
2025-07-21T00:25:01.509553774Z [2025-07-21T00:25:01.509Z] Player connected: CpZsRPFwODsWDizVAAAH
2025-07-21T00:25:01.511276584Z generateBoard: 0.094ms
2025-07-21T00:25:01.511290355Z [2025-07-21T00:25:01.511Z] 🚀 Served board from cache (19 remaining) - ZERO DELAY
2025-07-21T00:25:01.629599026Z [2025-07-21T00:25:01.629Z] Player attempting to reconnect with sessionId: C0LQemCj6jZqQAkiAAAR
2025-07-21T00:25:01.629659611Z [2025-07-21T00:25:01.629Z] No existing session found for reconnection, creating new session
2025-07-21T00:25:54.286029903Z [2025-07-21T00:25:54.285Z] Player connected: iyCRbmcFU7bTZAGRAAAK
2025-07-21T00:25:54.28734199Z generateBoard: 0.008ms
2025-07-21T00:25:54.287368932Z [2025-07-21T00:25:54.287Z] 🚀 Served board from cache (18 remaining) - ZERO DELAY
2025-07-21T00:25:54.671108704Z [2025-07-21T00:25:54.670Z] Player attempting to reconnect with sessionId: uY5jJcf_ak0g27NgAAAP
2025-07-21T00:25:54.671129226Z [2025-07-21T00:25:54.671Z] No existing session found for reconnection, creating new session
2025-07-21T00:30:04.317826738Z ==> Detected service running on port 10000
2025-07-21T00:30:04.426760718Z ==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
2025-07-21T00:31:49.8240746Z [2025-07-21T00:31:49.823Z] Player disconnected: CpZsRPFwODsWDizVAAAH, reason: transport close
2025-07-21T00:32:18.442073916Z ==> Running 'node dist/index.js'
2025-07-21T00:32:20.856836552Z [2025-07-21T00:32:20.855Z] Dictionary loaded from: /opt/render/project/src/packages/server/dist/assets/UWU.txt
2025-07-21T00:32:22.247841192Z [2025-07-21T00:32:22.245Z] Dictionary loaded: 264022 words
2025-07-21T00:32:22.443611414Z [2025-07-21T00:32:22.443Z] 🎲 Starting board pre-generation cache...
2025-07-21T00:32:22.443663838Z [2025-07-21T00:32:22.443Z] 🎲 Starting pre-generation of 5 boards...
2025-07-21T00:32:27.637421878Z [2025-07-21T00:32:27.637Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (5194ms)
2025-07-21T00:32:33.838796835Z [2025-07-21T00:32:33.838Z] 🎯 Generated valid 5x5 board with 20 words in 1 attempts (6199ms)