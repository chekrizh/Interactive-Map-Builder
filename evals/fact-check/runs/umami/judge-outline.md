## Map X
Components:
- Site visitor (Person)
- Site owner (Person)
- AI assistant (MCP) (External · optional)
- Tracker script (Script · script.js)
- Session recorder (Script · recorder.js)
- Dashboard UI (Component · React)
- Collect endpoint (Component · POST /api/send)
- Replay and heatmap endpoint (Component · POST /api/record)
- Short links and pixels (Component · GET /q, /p)
- Client info (Component · lib/detect)
- Auth and permissions (Component · lib/auth, permissions)
- Analytics API (Component · /api/websites/:id/*)
- Management API (Component · /api/*)
- MCP endpoint (Component · /mcp)
- Query layer (Component · src/queries)
- PostgreSQL (PostgreSQL · Prisma)
- ClickHouse (Optional · CLICKHOUSE_URL)
- Kafka (Optional · KAFKA_URL)
- Redis (Optional · REDIS_URL)
- GeoLite2 database (Data file · GeoLite2)
- umami.is services (External · optional)
- Share page viewer (Person · anonymous)
Flows:
- Track a page view
- Write at scale: ClickHouse and Kafka
- Read the dashboard
- Record a session replay
- Ask an AI assistant

## Map Y
Components:
- Site visitor (Person)
- Site owner (Person)
- AI assistant (MCP) (External · optional)
- Tracker script (Script · script.js)
- Session recorder (Script · recorder.js)
- Dashboard UI (Component · React)
- Collect endpoint (Component · POST /api/send)
- Replay and heatmap endpoint (Component · POST /api/record)
- Short links and pixels (Component · GET /q, /p)
- Client info (Component · lib/detect)
- Auth and permissions (Component · lib/auth, permissions)
- Analytics API (Component · /api/websites/:id/*)
- Management API (Component · /api/*)
- MCP endpoint (Component · /mcp)
- Query layer (Component · src/queries)
- PostgreSQL (PostgreSQL · Prisma)
- ClickHouse (Optional · CLICKHOUSE_URL)
- Kafka (Optional · KAFKA_URL)
- Redis (Optional · REDIS_URL)
- GeoLite2 database (Data file · GeoLite2)
Flows:
- Track a page view
- Write at scale: ClickHouse and Kafka
- Read the dashboard
- Record a session replay
- Ask an AI assistant
