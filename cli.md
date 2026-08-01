 ╭─Next steps───────────────────────────────────────────────────────╮
│ │  1. cd tipx                                                      │
│ │  2. pnpm install                                                 │
│ │  3. pnpm run dev                                                 │
│ │                                                                  │
│ │  Local development                                               │
│ │  Frontend       http://localhost:3001                            │
│ │  API            http://localhost:3000                            │
│ │  API reference  http://localhost:3000/api-reference              │
│ │  Fumadocs       http://localhost:4000                            │
│ │                                                                  │
│ │  NOTE: For Expo connectivity issues, update                      │
│ │     apps/native/.env with your local IP address:                 │
│ │     EXPO_PUBLIC_SERVER_URL=http://<YOUR_LOCAL_IP>:3000           │
│ │                                                                  │
│ │  Database                                                        │
│ │  IMPORTANT: Docker required for MySQL. Install for Windows:      │
│ │  https://docs.docker.com/desktop/setup/install/windows-install/  │
│ │  Start database   pnpm run db:start                              │
│ │  Generate client  pnpm run db:generate                           │
│ │  Apply schema     pnpm run db:push                               │
│ │  Open studio      pnpm run db:studio                             │
│ │                                                                  │
│ │  Git hooks with Husky:                                           │
│ │  • Initialize hooks: pnpm run prepare                            │
│ │                                                                  │
│ │  Linting and formatting:                                         │
│ │  • Run checks: pnpm run check                                    │
│ │                                                                  │
│ │  Deploy web + server with Docker Compose:                        │
│ │  • Start: pnpm run docker:up                                     │
│ │  • Logs: pnpm run docker:logs                                    │
│ │  • Stop: pnpm run docker:down                                    │
│ │  • Config: docker-compose.yml                                    │
│ ╰──────────────────────────────────────────────────────────────────╯
│
│  Special sponsors
│  • neondatabase   • Clerk   • Convex   • Guillermo Rauch   • Databuddy
│  • CodeRabbit
│
│  Like Better T Stack? Star the project on GitHub
│  https://github.com/AmanVarshney01/create-better-t-stack
│
│  Setup saved to history
│  pnpm dlx create-better-t-stack@latest history