# Expressionizer
**Age:** 17
**Link:** https://pypi.org/project/expressionizer/
**Tags:** python, library, symbolic math, cas, calculus, latex, ai training, procedural generation, localization, pypi, open source

**Short Description:**
A Python library for symbolic math expression building, simplification, and step-by-step evaluation. Renders explanations in plain text and LaTeX, supports derivatives, integrals, and multivariate calculus, and ships with localization packs for 7 languages. I primarily use it to procedurally generate math training data with full solution traces.

**Long Description:**
Expressionizer is a Python library for symbolic math expression building, simplification, and step-by-step evaluation. Unlike a typical CAS, it is designed around explainable algebraic transformation — every evaluation returns both a result and a rendered context tracing the steps, decomposition, and reasoning.<br><br>Core features include symbolic expression-tree primitives (<code>Symbol</code>, <code>Sum</code>, <code>Product</code>, <code>Power</code>, <code>FunctionCall</code>, <code>Equation</code>, <code>InEquality</code>), a rule-based calculus engine covering multivariate differentiation and definite/indefinite integrals, plain-text + LaTeX rendering, structured explanation output for downstream pipelines (<code>render_document()</code>, <code>render_json()</code>), calculator-mode tool-call placeholders for training workflows, and order-of-magnitude estimation to bound runaway traces on large numeric ops.<br><br>Built-in localization packs ship for English, Spanish, French, German, Korean, Hebrew, and Hebrew with niqqud, each validated for placeholder safety and English-leakage. <code>ExplanationProfile</code> allows per-call locale swaps, preset overlays (default, compact, plain, XML), and fine-grained template overrides for downstream rendering.<br><br>I primarily use Expressionizer for procedural generation of math training data — producing large datasets of problems paired with step-by-step solutions across multiple languages and formatting styles — but it is equally applicable to math tutoring tools, educational software, and any system that needs algebraic reasoning with human-readable traces. Published on PyPI, currently at 0.8.3 (pre-stable, tracking toward 1.0).

---

# DAT-Byte-Small
**Age:** 17
**Link:** https://huggingface.co/hudsongouge/DAT-Byte-Small
**Tags:** ai, llm, pytorch, transformer, differential attention, byte-level, pretraining, ai training, rtx 5090, from scratch

**Short Description:**
A 200M-parameter byte-level Differential Attention Transformer I trained from scratch on an RTX 5090. Decoder-only, 28 layers, 768 hidden, RoPE, pre-LN, and a 259-token byte-level vocabulary. Trained on Gutenberg English, OpenDiscord, and public-domain Bible translations for 31,200 steps across an estimated 5–10B tokens.

**Long Description:**
DAT Byte is a family of byte-level Differential Attention Transformers trained from scratch on an RTX 5090. This is the smallest in the family at ~200M parameters. Decoder-only architecture with RoPE, pre-layernorm, 768 hidden, 3072 FFN, 12 attention heads, 28 layers, and a 259-token byte-level vocabulary (256 bytes + 3 specials). Trained on Gutenberg English, OpenDiscord (ChatML-formatted Discord dumps), proprietary Discord data, and a diverse set of public-domain English Bible translations. 31,200 steps, max sequence length 2048, ~5–10B tokens seen during training. Differential Attention from Ye et al. (2024) reduces attention noise, which is especially useful at byte granularity.<br><br>Two larger siblings were also in progress: DAT-Byte Medium (350M) completed training, and DAT-Byte Large (700M) was mid-training. Both were discontinued before publication after I identified an issue in the architecture implementation, compounded by underwhelming benchmark performance relative to similarly sized models. The family may be revisited once the implementation issue is resolved.

---

# MMLU-NGRAM
**Age:** 17
**Link:** https://huggingface.co/datasets/hudsongouge/MMLU-NGRAM
**Tags:** ai, llm, benchmark, evaluation, robustness, mmlu, dataset, hugging face

**Short Description:**
A robustness benchmark I built and published that rewrites MMLU questions into character n-grams (n=1 to n=4) to test how well LLMs read unconventional, hard-to-parse inputs. Benchmarked Grok-3-mini, GPT-4.1, Gemini 2.5 Flash, Qwen3-235B, and others. Grok-3-mini led with 87%+ across all n; most models dropped 20–30 points from the original.

**Long Description:**
MMLU-NGRAM is a robustness benchmark I built and published on Hugging Face. It takes the full 14,042-question MMLU test set and rewrites each question into character n-grams of sizes 1 through 4 — separated by spaces, with words shorter than n left intact. The goal is to evaluate LLM performance on unconventional, hard-to-read inputs. Benchmarks were run on a random 1,500-sample subset across Grok-3-mini, GPT-4.1, GPT-4.1-nano, Gemini 2.5 Flash, Qwen3-4B, Qwen3-235B-A22B, and SmolLM3-3B. Grok-3-mini (thinking) led with 87%+ across every n; most other models dropped 20–30 accuracy points from the original baseline, revealing brittleness in tokenization and reading robustness.

---

# SCIFF v3
**Age:** 17
**Link:** N/A
**Tags:** c++, image format, compression, file format, systems, binary format, open source

**Short Description:**
A ground-up C++ rewrite of my Super Compact Image File Format, descended from the same core ideas as v1 and v2. Dramatically faster than the earlier Python versions, with compression that's competitive with PNG and JPEG across nearly all image types — usually matching or exceeding both, though it doesn't reach the levels of modern formats like WebP or AVIF.

**Long Description:**
SCIFF v3 is a ground-up C++ rewrite of my Super Compact Image File Format, descended from the same core ideas as v1 and v2 but substantially redesigned. The encoder and decoder are dramatically faster than the earlier Python implementations, and the format's compression is now competitive with PNG and JPEG on nearly all image types — usually matching or exceeding both. It doesn't yet reach the compression levels of modern formats like WebP or AVIF, but for a hobby format it holds its own against the widely-deployed baselines. Files can still be converted to and from SCIFF, with metadata support carried over from earlier versions.

---

# TinyBookyLLM
**Age:** 17
**Link:** https://huggingface.co/hudsongouge/TinyBookyLLM
**Tags:** ai, llm, pytorch, llama, transformer, pretraining, ai training, from scratch, gqa

**Short Description:**
A 65M-parameter Llama-3-style LLM I trained on my laptop in about 30 minutes on ~32M tokens of Gutenberg English. 9 layers, 640 hidden, 8 Q / 2 KV heads (GQA), RoPE, 16k BPE tokenizer. It writes surprisingly coherent Victorian-sounding prose for a model this small.

**Long Description:**
TinyBookyLLM is a 65M-parameter Llama-3-architecture LLM trained on my laptop in roughly half an hour using only ~5GB of memory. Trained on ~32M tokens of Gutenberg English with a 16k BPE tokenizer. Architecture: 9 layers, 640 hidden size, 2048 intermediate, 8 query heads, 2 KV heads (GQA), RoPE, SiLU, 512 sequence length. 16,000 steps, peak LR 5e-5, cosine decay, no warmup. The output sounds like a convincingly coherent pastiche of 19th-century English prose — a fun demonstration of how much style a very small model can absorb from a focused corpus.

---

# OpenDiscord
**Age:** 16
**Link:** https://huggingface.co/datasets/hudsongouge/Open-Discord
**Tags:** ai, dataset, llm, training data, discord, chatml, hugging face

**Short Description:**
A public dataset of content extracted from many Discord servers, ~322MB, formatted in ChatML with usernames as speaker roles. Designed for training LLMs on natural multi-party dialogue. Used as a core training source for my DAT-Byte model family.

**Long Description:**
OpenDiscord is a public Hugging Face dataset I released containing content extracted from many Discord servers — roughly 322MB of conversation data. It is formatted in ChatML with usernames serving as speaker roles, which lets language models learn natural dialogue structure, turn-taking, and the tone of real multi-party chat. It spans many topics, including a substantial amount of code discussion, giving models basic exposure to common programming-language syntax patterns. OpenDiscord serves as one of the primary training sources for my DAT-Byte model family.

---

# Time Accountability
**Age:** 16
**Link:** https://github.com/hg0428/Accountability
**Tags:** python, PyQt6, app, accountability

**Short Description:**
An application that lets you log your activities hour by hour, along with daily notes, and summaries. It also has an AI analyzation system powered by Ollama. This is unfinished and just a prototype for now. Built on WindSurf in collaboration with Claude and Gemini AI.

**Long Description:**
An application that lets you log your activities hour by hour, along with daily notes, and summaries. It also has an AI analyzation system powered by Ollama. This is unfinished and just a prototype for now.

---

# Copper Scroll Project Website
**Age:** 16
**Link:** https://copper-scroll-project.vercel.app
**Tags:** ts, scss, css, html, nunjucks, design, web design, website

**Short Description:**
The Copper Scroll Project is a group determined to recover the items of the Copper Scroll and return them to the nation of Israel. Among these are many treasure of ancient Israel. I built this website using a modular article system, SCSS, TypeScript, and HTML with nunjucks templating.

**Long Description:**
The Copper Scroll Project is a group determined to recover the items of the Copper Scroll and return them to the nation of Israel. Among these are many treasure of ancient Israel. I built this website using a modular article system, SCSS, TypeScript, and HTML with nunjucks templating. Going live soon.

---

# Chatter 70M
**Age:** 16
**Link:** https://huggingface.co/hudsongouge/Chatter-70M
**Tags:** ai, llm, pytorch, transformer, transformers, pretraining, ai training, training

**Short Description:**
A 70M parameter LLM I pre-trained from scratch on my laptop following a Llama-3 architecture and using a Llama-2 tokenizer. It was trained on 705.8mb of uncompressed text data from Discord and other sources. The model generalized and is able to chat like a random person on Discord. But it is very very dumb.

**Long Description:**
A 70M parameter LLM I pre-trained from scratch on my laptop following a Llama-3 architecture and using a Llama-2 tokenizer. It was trained on 705.8mb of uncompressed text data from Discord and other sources. The model generalized and is able to chat like a random person on Discord. But it is very very dumb.

---

# HOSS
**Age:** 16
**Link:** https://gethoss.io/
**Tags:** web app, html, css, js, ts, bun.js, bun, falcon jwt, login, cool, security system, security, cyber security

**Short Description:**
Holistic Online Security Scanner Minimum Viable Product. I built this for Fortis Cyber Defense. Enterprise-grade security scanning and automation platform for comprehensive infrastructure protection. It includes...

**Long Description:**
Holistic Online Security Scanner Minimum Viable Product.I built this for Fortis Cyber Defense. Enterprise-grade security scanning and automation platform for comprehensive infrastructure protection. It includes a login system, multi-user support, organizations, email confirmation, in-app notifications, email notifications, projects, domain verification, project dashboard, settings, Post Quantum Cryptographically Secure JWTs (falcon), port scanning, and more. It took me 42 hours to build this MVP! (I did re-use some code from past projects).

---

# The Trial of Freedom: AI Regulation
**Age:** 16
**Link:** https://medium.com/@hudson.gouge/the-trial-of-freedom-ai-regulation-aa98141c76b8
**Tags:** ai, article, politics, regulation, artificial intelligence

**Short Description:**
An article I wrote on the regulation of Artificial Intelligence.

**Long Description:**
An article I wrote on the regulation of Artificial Intelligence.

---

# LLM Probability Visualizer
**Age:** 16
**Link:** https://github.com/hg0428/LLM-probability-visualization
**Tags:** web app, html, css, js, python, flask, ai, local-ai, LLM, math

**Short Description:**
A system allowing you to visualize how LLMs really work on the inside, seeing the probability of each token generated. The system also includes custom implementations of various sampling systems, including DRY, XTC, temperature, and many many more.

**Long Description:**
A system allowing you to visualize how LLMs really work on the inside, seeing the probability of each token generated. The system also includes custom implementations of various sampling systems, including DRY, XTC, temperature, and many many more.

---

# Emerge-Gen-Z
**Age:** 16
**Link:** https://emerge-gen-z.com
**Tags:** website, html, css, js, typescript, nunjucks, scss

**Short Description:**
Website for a Christian retreat for Gen Z. Built with Nunjucks, SCSS, and TypeScript. Bundled with Webpack. Hosted on Vercel.

**Long Description:**
Website for a Christian retreat for Gen Z. Built with Nunjucks, SCSS, and TypeScript. Bundled with Webpack. Hosted on Vercel.

---

# Writing In Color
**Age:** 16
**Link:** https://writingincolor.org
**Tags:** website, html, css, js, typescript, nunjucks, scss, bun.js, fastify, passkeys, authentication, post quantum cryptography, http/2.0

**Short Description:**
Complete with a website builder, a secure authentication system, HTTP/2.0, Post Quantum Cryptography, Passkey Support, and more. I worked on the backend and the website builder system, including animations (which are very nice). I did not work on the main page design.

**Long Description:**
Features:
- Website builder including the creation of elements, styling options, nice animations, and more
- Secure authentication system with JWTs and hashed+salted passwords
- HTTP/2.0
- Post Quantum Cryptography
- Passkey Support
- Hosted on AWS
- Database management system
- Account settings with the ability to add and remove emails, passkeys, or change your password
I worked on the backend and the website builder system, including animations (which are very nice). I did not work on the main page design.

---

# MAR-PS
**Age:** 16
**Link:** https://github.com/hg0428/Mar-PS
**Tags:** ai, python, local-ai, ollama, openai, LLM, LLMs

**Short Description:**
Multi-Agent Reasoning Problem Solver. A Python library where you can make teams of AIs that work together.

**Long Description:**
Multi-Agent Reasoning Problem Solver. A Python library where you can make teams of AIs that work together.

---

# Aardvark 1.0 Compiler
**Age:** 14-16
**Link:** https://github.com/Aardvark-team/Aardvark
**Tags:** aardvark, aardvark programming language, adk, self-hosted, programming language, language

**Short Description:**
This is a programming language I worked on with the rest of the 5-member Aardvark development team. The compiler is unfinished and is still being worked on. This is an active project.

**Long Description:**
This is a programming language I worked on with the rest of the 5-member Aardvark development team. The compiler is unfinished and is still being worked on. This is an active project.

---

# Aardvark 1.0 Documentation, Specifications, and Articles
**Age:** 14-16
**Link:** https://aardvark-docs.replit.app
**Tags:** html, css, javascript, aardvark, docs, documentation, blog, articles

**Short Description:**
N/A

**Long Description:**
This website includes documentation, specifications, many tutorials and articles, style guides, syntax guides, and so much more. I wrote most of it, but the actual syntax was agreed upon and designed by the Aardvark development team.

---

# Aardvark 1.0 Interpretter
**Age:** 14-16
**Link:** https://aardvark-docs.programit.repl.co
**Tags:** python, aardvark, aardvark programming language, adk, interpreter, programming language, language

**Short Description:**
This is a programming language I worked on with the rest of the Aardvark development team. The interpretter is done and fully functional.

**Long Description:**
This is a programming language I worked on with the rest of the Aardvark development team. The interpretter is done and fully functional.

---

# New Profile Page
**Age:** 15-16
**Link:** https://hgouge.vercel.app/
**Tags:** html, css, js, bun.js, profile, portfolio, projects

**Short Description:**
This very website right here.

**Long Description:**
This very website right here.

---

# A.C.T.S. Biblical Training Center Website
**Age:** 15
**Link:** https://actsbtc.com/
**Tags:** html, css, js, acts, learnworlds, website, education, pwa, web app, courses, learn

**Short Description:**
I was on the team that made this. I did the course and lessons cards, and the Install PWA prompt myself, but for the rest I used a combination of HTML/CSS/JS and the website builder.

**Long Description:**
I was on the team that made this. I did the course and lessons cards, and the Install PWA prompt myself, but for the rest I used a combination of HTML/CSS/JS and the website builder. It was built on the Learnworlds platform.

---

# EncryptoChat
**Age:** 15
**Link:** https://encryptochat.replit.app/
**Tags:** html, js, javascript, css, python, django, pgp, encryption, login, chat, messenger, messaging, messaging app, messaging application

**Short Description:**
This messaging application uses PGP encryption on every message. Your keys are not stored on server, but are instead stored locally inside of a password-locked encrypted localstorage... Click to view more information including video tour.

**Long Description:**
This messaging application uses PGP encryption on every message. Your keys are not stored on server, but are instead stored locally inside of a password-locked encrypted localstorage. This was my final capstone project of CS50W. There was a 5 minuite max on the submission video.

---

# Projxon Cyber Security System
**Age:** 14-15
**Link:** https://pypi.org/project/projxon-cyber-security-system/
**Tags:** python, encryption, hash, hashing, xor, encryption, cyber security, cybersecurity, security, cyber, security system

**Short Description:**
This Python library includes functions for xor based encryption as well as a somewhat decent custom hash function...

**Long Description:**
This Python library includes functions for xor based encryption as well as a somewhat decent custom hash function.

---

# Social Network - CS50W Project 4
**Age:** 15
**Link:** N/A
**Tags:** html, js, css, python, django, bootstrap, social network, social media

**Short Description:**
This was a project for CS50W from Harvard. There was a 5 minuite max on the submission video.

**Long Description:**
This was a project for CS50W from Harvard.

---

# Mail - CS50W Project 3
**Age:** 15
**Link:** N/A
**Tags:** html, js, css, python, django, bootstrap, email

**Short Description:**
This was a project for CS50W. Afterwards, I found the reason the purple line wasn't working is because I forgot the semicolon and end quote. Such a silly mistake.

**Long Description:**
This was a project for CS50W. Afterwards, I found the reason the purple line wasn't working is because I forgot the semicolon and end quote. Such a silly mistake.

---

# Commerce - CS50W Project 2
**Age:** 15
**Link:** N/A
**Tags:** html, js, css, python, django, bootstrap, commerce

**Short Description:**
This was a project for CS50W.

**Long Description:**
This was a project for CS50W.

---

# Wiki - CS50W Project 1
**Age:** 15
**Link:** N/A
**Tags:** html, js, css, python, django, wiki

**Short Description:**
This was a project for CS50W. It uses my own custom markdown parser.

**Long Description:**
This was a project for CS50W. It uses my own custom markdown parser.

---

# Search - CS50W Project 0
**Age:** 15
**Link:** N/A
**Tags:** html, js, css, python, django, wiki

**Short Description:**
This was a project for CS50W.

**Long Description:**
This was a project for CS50W.

---

# ProAI
**Age:** 15
**Link:** https://github.com/hg0428/ProAI
**Tags:** ai, numpy, python, math, llm, matrix multiplication, custom

**Short Description:**
A completely custom (but slow) LLM text prediction library. Developed and trained locally on an iPad Pro. Built with NumPy.

**Long Description:**
A completely custom (but slow) LLM text prediction library. Developed and trained locally on an iPad Pro. Built with NumPy.

---

# Adkcode
**Age:** 13-15
**Link:** https://adkcode.replit.app
**Tags:** html, css, adk, adkcode, aardvark, aardvark programming language, code editor, javascript, node.js, express.js

**Short Description:**
A project I worked on with the rest of the Aardvark development team. It is a code editor built for the Aardvark Programming language.

**Long Description:**
A project I worked on with the rest of the Aardvark development team. It is a code editor built for the Aardvark Programming language.

---

# Tricky Really 2
**Age:** 13-15
**Link:** https://tricky-really.replit.app/
**Tags:** html, css, javascript, node.js, tricky, game, socket.io, express.js, canvas-game, spelling-game, tricky really 2, tricky really 2 game

**Short Description:**
N/A

**Long Description:**
This game is the second version of the game that won honorable mention in the Replit Kajam competition. You can see the original version below. This version was updated to include new levels, profiles, stats, a better leaderboard system, and more.

---

# Academicool
**Age:** 15
**Link:** https://academicool.hg0428.repl.co/
**Tags:** html, css, javascript, python, flask, json, learning, education, academic

**Short Description:**
Made for the Capstone project of the National Youth Leadership Forum for Engineering. It was a team project. I made the app, someone else made the name and logo, another made the slideshow, and another made a cad model of a van.

**Long Description:**
Made for the Capstone project of the National Youth Leadership Forum for Engineering. It was a team project. I made the app, someone else made the name and logo, another made the slideshow, and another made a cad model of a van.

---

# AI (best version)
**Age:** 14
**Link:** https://replit.com/@hg0428/ai-best-version
**Tags:** python, numpy, ai

**Short Description:**
I built an AI from scratch using numpy. I had no idea how LLMs really worked at the time, so I guessed, creating this single-layered AI that runs on a simple sigmoid function...

**Long Description:**
I built an AI from scratch using numpy. I had no idea how LLMs really worked at the time, so I guessed, creating this single-layered AI that runs on a simple sigmoid function. It does not predict tokens, instead, it takes 5 characters as input and outputs 5 characters. It works surprisingly well for its size and it was able to understand more than I taught it, which proves that it wasn't too overfit. After this, I learned how LLMs really worked and went on to create some smaller text prediction models of my own.

---

# Chat
**Age:** 14
**Link:** https://chat.hg0428.repl.co/
**Tags:** node.js, html, css, javascript, socket.io, express.js, chat, discord, chat app

**Short Description:**
It's like discord, but if there was only one channel per server.

**Long Description:**
It's like discord, but if there was only one channel per server.

---

# New Game Engine
**Age:** 14
**Link:** https://new-game-engine-js.hg0428.repl.co/
**Tags:** javascript, game, game engine, canvas, html, html5

**Short Description:**
This is a game engine built in Javascript using the HTML5 canvas. I made it in collaboration with @JustCoding123/@NeverUsedDC. We designed it to be easy to use and powerful.

**Long Description:**
This is a game engine built in Javascript using the HTML5 canvas. I made it in collaboration with @JustCoding123/@NeverUsedDC. We designed it to be easy to use and powerful.

---

# Search The World 3
**Age:** 14
**Link:** https://search-the-world-3.hg0428.repl.co/
**Tags:** html, css, javascript, python, flask, search, search engine, web crawling, web scraper, web scrape, web scraping, web crawler, search the world, parsing

**Short Description:**
This third iteration of the Search The World series builds upon the idea of the previous versions, but with an engine rebuilt from the ground up to be more powerful and dynamic. It can scrape images and even rich results... Click for more details.

**Long Description:**
This third iteration of the Search The World series builds upon the idea of the previous versions, but with an engine rebuilt from the ground up to be more powerful and dynamic. It can scrape images and even rich results such as information about authors, dates, and people. It includes full safe search capabilities and scans all images and content. It does have a very advanced system for information about and definitions for words, that I still to this day find useful when writing.

---

# Sticky Art
**Age:** 14
**Link:** https://replit.com/@hg0428/StickyArt
**Tags:** javascript, html, css, node.js, website, UI, design, multilingual

**Short Description:**
N/A

**Long Description:**
A website I made for a business class where we made stickers.

---

# Never Too Spicy
**Age:** 14
**Link:** https://never-too-spicy.replit.app/
**Tags:** javascript, html canvas, canvas, 2d game, video game, game, game development, kajam, spicy

**Short Description:**
N/A

**Long Description:**
A game I made for the #MadeWithReplit game competition. My game didn't win, but it did have the most upvotes. It was quite buggy. It was a team competition, yet I was working alone, but still did pretty decently.

---

# Just a Pong
**Age:** 14
**Link:** https://just-a-pong.hg0428.repl.co/
**Tags:** html, javascript, pong, game, game development

**Short Description:**
N/A

**Long Description:**
A classic Pong game, but with a twist! You can stretch!

---

# 3D Rain effect
**Age:** 13
**Link:** https://my-best-attempt-at-3d-rain-effects.hg0428.repl.co/
**Tags:** html, css, javascript, canvas-game, html5-canvas, canvas, 3d

**Short Description:**
It's a 3d rain effect! My best attempt at the time, although I did eventually create something way better.

**Long Description:**
It's a 3d rain effect! My best attempt at the time, although I did eventually create something way better.

---

# SCIFF V2
**Age:** 13
**Link:** https://replit.com/@hg0428/SCIFF-V2
**Tags:** python, image format, compression, file format, bitarray, pillow

**Short Description:**
Super Compact Image File Format. It's ranges from 55x larger than JPEG and PNG to 7x smaller for some images. It supports metadata too. Like other file formats, it stores compacted binary code for an image in a file that can then be read to view the image.

**Long Description:**
Super Compact Image File Format. It's ranges from 55x larger than JPEG and PNG to 7x smaller for some images. It supports metadata too. Like other file formats, it stores compacted binary code for an image in a file that can then be read to view the image. I used Python's bitarray library and pillow to make this happen. Files can be converted to and from SCIFF.

---

# Counter Game
**Age:** 13
**Link:** https://counter-game.hg0428.repl.co/
**Tags:** html, css, javascript, game

**Short Description:**
N/A

**Long Description:**
I honestly don't even know why I made this.

---

# Tricky Really
**Age:** 13
**Link:** https://tricky-really.hg0428.repl.co/
**Tags:** html, css, javascript, node.js, tricky, game, socket.io, express.js, canvas-game, spelling-game, tricky really

**Short Description:**
N/A

**Long Description:**
This game won honorable mention in the #MadeWithReplit competition. It's a game of tricks, riddles, and puzzles.

---

# AdkVM Aardvark docs
**Age:** 12
**Link:** https://docs.programit.repl.co/
**Tags:** aardvark, aardvark programming language, adk, interpretter, programming language, language, website, docs, html, css, javascript, js

**Short Description:**
The docs for AdkVM Aardvark.

**Long Description:**
The docs for AdkVM Aardvark.

---

# AdkVM - Aardvark bytecode compiler
**Age:** 13
**Link:** https://aardvark-docs.programit.repl.co
**Tags:** aardvark, aardvark programming language, adk, c++, programming language, language

**Short Description:**
@Theboys619 actually made most of it. I helped a lot at the end though. This project was abandoned because @Theboys619 became unresponsive and left the team, and the rest of us couldn't navigate the codebase without him. Click for more info.

**Long Description:**
@Theboys619 actually made most of it. I helped a lot at the end though. This project was abandoned because @Theboys619 became unresponsive and left the team, and the rest of us couldn't navigate the codebase without him. @Theboys619 was a dedicated Aardvark developer who worked through two implementations of the language, and we were all sad to see him leave. You can find his AardvarkC project <a href="https://www.youtube.com/playlist?list=PL2K-yVF6vU--TneOL_8RiPbjlRM6DdbND">here</a>

---

# Idea Generator V2
**Age:** 13
**Link:** https://idea-generator-tutorial.hg0428.repl.co/
**Tags:** python, html, css, flask, ideas, nlp

**Short Description:**
N/A

**Long Description:**
An idea generator that I also made a YouTube tutorial for.

---

# 2D DOM JS Game Engine
**Age:** 13
**Link:** https://kajam.hg0428.repl.co
**Tags:** html, css, javascript, canvas-game, canvas, 2d, game, game engine, game development

**Short Description:**
N/A

**Long Description:**
A powerful JS game engine that runs on using DOM elements instead of the canvas. It makes a lot of stuff easier because it supports CSS.

---

# Socket.io Test
**Age:** 13
**Link:** https://socketio-test.hg0428.repl.co
**Tags:** html, css, javascript, canvas-game, canvas, 2d, game, game engine, game development, socket.io, express.js, node.js

**Short Description:**
Uses Express.js and Socket.io to create a basic 2d online multiplayer game. 

**Long Description:**
Uses Express.js and Socket.io to create a basic 2d online multiplayer game. 

---

# Fun Console Animation
**Age:** 13
**Link:** https://replit.com/talk/share/Fun-Console-Animation/146697
**Tags:** python, animation, console, terminal, fib, fibonacci

**Short Description:**
A simple, fun animation with the fibonacci sequence. I made this after discovering that every 5 Fibonacci numbers, the number of digits goes up by 1. Its just a simple 5 minute project.

**Long Description:**
A simple, fun animation with the fibonacci sequence. I made this after discovering that every 5 Fibonacci numbers, the number of digits goes up by 1. Its just a simple 5 minute project.

---

# CSS Library
**Age:** 13
**Link:** https://css-library.hg0428.repl.co/
**Tags:** html, css, javascript, game

**Short Description:**
N/A

**Long Description:**
It's... well... a CSS Library. I can't really describe it much more than the name. It's just whatever CSS I thought I would like to use, so I put it into a library. I did use it for a bunch of my projects.

---

# Projxon Login
**Age:** 12-13
**Link:** https://projxon.repl.co/
**Tags:** python, login, google-auth, google-oauth2, encryption, login, signin, signup, projxon, projxon login, css, html, javascript

**Short Description:**
N/A

**Long Description:**
Even your user name is encrypted here! Once you login, you can connect your google or replit account to it.

---

# Search The World 2
**Age:** 12-13
**Link:** https://search-the-world.hg0428.repl.co/
**Tags:** html, css, javascript, python, flask, search, search engine, web crawling, web scraper, web scrape, web scraping, web crawler, search the world, parsing

**Short Description:**
Search The World 2 was a well-styled and pretty decent search engine that I built. It even has an API.

**Long Description:**
Search The World 2 was a well-styled and pretty decent search engine that I built. It even has an API.

---

# CSISP Website
**Age:** 12
**Link:** https://csisp.projxon.repl.co/
**Tags:** html, css, python, http, http/1, http/1.1, protocol, standard

**Short Description:**
This is a website explaining the syntax and implementation of CSISP, or the Client-Server Information Share Protocol. It is a HTTP replacement I came up with.

**Long Description:**
This is a website explaining the syntax and implementation of CSISP, or the Client-Server Information Share Protocol. It is a HTTP replacement I came up with.

---

# Webr
**Age:** 12
**Link:** https://webr.projxon.repl.co/
**Tags:** html, python, http, http/1, http/1.1, server

**Short Description:**
This is a Python library for servers with no external dependancies! It's very similar to Flask, but slightly more low level. I never finished it, and I never published it, but it taught me how to build HTTP servers from scratch with only sockets.

**Long Description:**
This is a Python library for servers with no external dependancies! It's very similar to Flask, but slightly more low level. I never finished it, and I never published it, but it taught me how to build HTTP servers from scratch with only sockets.

---

# My Original Profile Page
**Age:** 12
**Link:** https://hg0428.repl.co
**Tags:** html, css, javascript, python, flask, profile, portfolio

**Short Description:**
N/A

**Long Description:**
N/A

---

# AmazingActiveProgrammingBot
**Age:** 12
**Link:** https://top.gg/bot/745166643990233118?tab=updates
**Tags:** discord bot, python

**Short Description:**
N/A

**Long Description:**
A Discord Bot that was very popular for a while. When Replit made a bunch of changes, the bot went down, and has not been running consistently since.

---

# Search The World 1
**Age:** 12
**Link:** https://search-engine.hg0428.repl.co/
**Tags:** html, css, javascript, python, flask, search, search engine, web crawling, web scraper, web scrape, web scraping, web crawler, search the world, parsing

**Short Description:**
N/A

**Long Description:**
N/A

---

# Idea Generator V1
**Age:** 12
**Link:** https://idea-generator.hg0428.repl.co/
**Tags:** html, python, flask, ideas, nlp

**Short Description:**
N/A

**Long Description:**
N/A

---

# Smartbot
**Age:** 12
**Link:** https://replit.com/@hg0428/chatter
**Tags:** python, nlp, nltk, chatbot

**Short Description:**
Uses NLP to create a chatbot. Pretty simple. No generative AI, just pre-defined patterns. Used Python's nltk library.

**Long Description:**
Uses NLP to create a chatbot. Pretty simple. No generative AI, just pre-defined patterns. Used Python's nltk library.

---

# Original Aardvark docs
**Age:** 12
**Link:** https://aardvark.readthedocs.io/en/latest/
**Tags:** aardvark, aardvark programming language, adk, interpretter, programming language, language, website, docs, readthedocs

**Short Description:**
The docs for the original Aardvark.

**Long Description:**
The docs for the original Aardvark.

---

# Aardvark website
**Age:** 12
**Link:** https://aardvark-website.programit.repl.co/
**Tags:** aardvark, aardvark programming language, adk, interpretter, programming language, language, package manager, ape, website, html, css, js, javascript

**Short Description:**
This website has barely been updated since it was created. It hosts the original APE (a package manager for Aardvark), which actually still works.

**Long Description:**
This website has barely been updated since it was created. It hosts the original APE (a package manager for Aardvark), which actually still works.

---

# The original Aardvark: 0.7.4 - 0.8.7
**Age:** 12
**Link:** https://replit.com/talk/share/Aardvark-The-language-that-covers-all-of-your-needs/51790
**Tags:** aardvark, aardvark programming language, adk, python, regex, interpretter, programming language, language

**Short Description:**
Aardvark was born out of the Replit LangJam, a programming competition where each team built a full programming language. The winner recieved $10,000 and a spot as an official language on Replit. It was @PlasDev, @ZDev1, and I on a team against some of the most experienced coders around. We didn't win, but we started something that would never die. A project that forever strives to make programming easy and powerful, revolutionizing coding the world around. Aardvark has never died, it has always inspired the minds of programmers around the world to join the cause. Though the team has changed and shifted, our purpose never will.

**Long Description:**
Aardvark was born out of the Replit LangJam, a programming competition where each team built a full programming language. The winner recieved $10,000 and a spot as an official language on Replit. It was @PlasDev, @ZPlus4, and I on a team against some of the most experienced coders around. We didn't win, but we started something that would never die. A project that forever strives to make programming easy and powerful, revolutionizing coding the world around. Aardvark has never died, it has always inspired the minds of programmers around the world to join the cause. Though the team has changed and shifted, our purpose never will.

---

# Self-Reproducing Program
**Age:** 11
**Link:** N/A
**Tags:** python

**Short Description:**
Let it run, and it will eventually take up all your computer's storage space!

**Long Description:**
Let it run, and it will eventually take up all your computer's storage space!

---

# Information-based Password Cracker
**Age:** 11
**Link:** https://replit.com/talk/share/Information-based-Password-Cracker/31781
**Tags:** python, password cracker

**Short Description:**
This program has a brute force system, but also includes an "Information-based Password Cracker", which takes in user information such as name, birthday, significant number, names, or things and applies them procedurally to common password patterns.

**Long Description:**
This program has a brute force system, but also includes an "Information-based Password Cracker", which takes in user information such as name, birthday, significant number, names, or things and applies them procedurally to common password patterns.

---

# Simple Cipher
**Age:** 11
**Link:** N/A
**Tags:** python, cypher

**Short Description:**
N/A

**Long Description:**
N/A

---

# Python Autocorrect
**Age:** 11
**Link:** https://replit.com/@hg0428/autocorrect
**Tags:** python, autocorrect, nlp

**Short Description:**
This program uses a list of english words and nltk's 'edit_distance' function to autocorrect misspelled words in user input.

**Long Description:**
This program uses a list of english words and nltk's 'edit_distance' function to autocorrect misspelled words in user input.

---

# Python Operating System Version 2.1.9
**Age:** 11
**Link:** https://replit.com/talk/share/Python-Operating-System-Version-219/21243
**Tags:** python, programming language, shell

**Short Description:**
This was my very first published project that I still have. It is a very complete shell emulator, including commands and functions.

**Long Description:**
This was my very first published project that I still have. It is a very complete shell emulator, including commands and functions. There were earlier versions, but I don't have them anymore.

---
