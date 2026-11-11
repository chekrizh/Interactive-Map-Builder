## Map X
Components:
- Data engineer or scheduler (Person · cron · Airflow)
- AI agent (MCP client)
- Source databases (PostgreSQL · MySQL · SQL Server · MongoDB · Oracle)
- Command line (Component · src/cli)
- Config loader (Component · src/config)
- Run plan (Component · src/plan)
- Init, check and doctor (Component · src/init · src/preflight)
- MCP server (Component · rivet-mcp binary)
- Export job runner (Component · pipeline/run.rs · job.rs)
- Extraction strategies (Component · single · chunked · keyset)
- Source drivers (Component · Source trait · src/source)
- Export sink and formats (Component · pipeline/sink · src/format)
- Change streams (Component · ChangeStream trait)
- Capture sink (Component · pipeline/cdc)
- Commit seam and manifest (Component · commit.rs · manifest_writer.rs)
- Destination backends (Component · Destination trait)
- State store (SQLite file or PostgreSQL)
- Validate, reconcile, repair (Component · pipeline/*_cmd.rs)
- Load driver (Component · load/orchestrate.rs)
- Warehouse adapters (Component · TargetLoader trait)
- Compact (Component · load/compact.rs)
- Object store or local folder (S3 · GCS · Azure Blob · local disk)
- Data warehouses (BigQuery · Snowflake · ClickHouse)
- Slack webhook (Incoming webhook)
Flows:
- Batch export
- Change capture run
- Load the warehouse
- Prove what landed

## Map Y
Components:
- Data engineer or scheduler (Person · cron · Airflow)
- AI agent (MCP client)
- Source databases (PostgreSQL · MySQL · SQL Server · MongoDB · Oracle)
- Command line (Component · src/cli)
- Config loader (Component · src/config)
- Run plan (Component · src/plan)
- Init, check and doctor (Component · src/init · src/preflight)
- MCP server (Component · rivet-mcp binary)
- Export job runner (Component · pipeline/run.rs · job.rs)
- Extraction strategies (Component · single · chunked · keyset)
- Source drivers (Component · Source trait · src/source)
- Export sink and formats (Component · pipeline/sink · src/format)
- Change streams (Component · ChangeStream trait)
- Capture sink (Component · pipeline/cdc)
- Commit seam and manifest (Component · commit.rs · manifest_writer.rs)
- Destination backends (Component · Destination trait)
- State store (SQLite file or PostgreSQL)
- Validate, reconcile, repair (Component · pipeline/*_cmd.rs)
- Load driver (Component · load/orchestrate.rs)
- Warehouse adapters (Component · TargetLoader trait)
- Compact (Component · load/compact.rs)
- Object store or local folder (S3 · GCS · Azure Blob · local disk)
- Data warehouses (BigQuery · Snowflake · ClickHouse)
- Slack webhook (Incoming webhook)
Flows:
- Batch export
- Change capture run
- Load the warehouse
- Prove what landed
