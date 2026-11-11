# Map check log: rivet

Summary: 188 claims checked in round 1, 38 changed claims rechecked in round 2 and 3 in round 3. 11 wrong claims fixed (9 in round 1, 2 in round 2). The 2 still wrong after round 3 (both on BigQuery compact) were cut back to a general statement. 3 of the 5 reported gaps added, 2 declined. 0 claims marked as assumptions. Rounds: 3 (final).

## Round 1

### Wrong claims

- **node:strategies**
  - Map: listed `src/pipeline/retry.rs` as a key file.
  - Code: there is no such file. `pipeline::retry` is an inline re-export module in `src/pipeline/mod.rs` over `src/error/retry.rs` and `tuning`.
  - Why: I copied the file list from `docs/architecture.md`'s source-tree listing, which is out of date, without checking the file existed.
  - Fix: the tools line now names `src/error/retry.rs`, re-exported as `pipeline::retry`.
- **node:cdcstream, edge:str_src, flow:cdc/6, files:src/source/postgres/** (one cause)
  - Map: said PostgreSQL CDC reads the slot with pgoutput over the replication protocol.
  - Code: `src/source/postgres/cdc.rs` creates a `test_decoding` slot and polls it with SQL (`pg_logical_slot_peek_changes`). `pgoutput.rs` is a decoder that nothing outside the tests calls yet. SQL Server change tables are also read by query, not over a replication protocol.
  - Why: I trusted the ADR titles ("0031 pgoutput replaces test_decoding") and the presence of `pgoutput.rs` over the adapter's own header, which I never opened.
  - Fix: the panel, the flow hop and the files entry now say `test_decoding` polled over SQL and note that the pgoutput decoder is not wired in. The edge label is now "reads the change log". Oracle LogMiner was added to the flow hop.
- **flow:batch/15**
  - Map: said the cursor advances first, then the journal and metrics are written.
  - Code: the journal is stored (job.rs:1279) and the run-status row closed (1289) before the cursor advances (1303). Only the metrics row (1318) comes after it.
  - Why: I summarized several lines from memory of the function instead of following their order.
  - Fix: the hop now gives the order journal, then ledger close, then cursor, then metrics.
- **flow:cdc/10**
  - Map: put the state-DB recording of parts after the manifest rewrite.
  - Code: `record_part` runs right after each upload (sink.rs:441-447), before the manifest rewrite (466-490).
  - Why: I ordered the hops by the edges I had, not by the code.
  - Fix: the hops now run upload, then land, then record in state, then rewrite the manifest, then save the checkpoint and ack.
- **flow:load/4**
  - Map: said `prepare_load` compares parts with the listing by size and MD5.
  - Code: the load path only checks that each declared part key is still listed (`runs_with_missing_parts`); it compares no size or MD5.
  - Why: I took this from CONTEXT.md's description of manifest reconciliation (`reconcile_manifest_against_listing`), which belongs to destination verify and resume, not to load.
  - Fix: the hop now says runs whose parts are no longer listed are refused.
- **files:src/plan/**
  - Map: said the folder holds "chunk prioritization".
  - Code: `prioritization.rs` ranks exports, as advisory output for human review (ADR-0006).
  - Why: I guessed from the file name.
  - Fix: the entry now says "advisory export prioritization".

### Missing items

- **Accepted: warehouses read the bucket directly.**
  - Code: BigQuery uses `LOAD DATA` and Snowflake a storage integration, both reading GCS, and a load from any other destination is refused at plan time (plan.rs:636-647). ClickHouse is the exception: rivet reads each part and sends it.
  - Why: I assumed all data went through rivet's adapters.
  - Fix: added the edge bucket→warehouse ("LOAD DATA from GCS") and a load-flow hop on it. The bucket, warehouse and load-driver panels now state the GCS-only rule.
- **Accepted: CDC checkpoint file.**
  - Code: the resume position is saved to a local file (`cdc.checkpoint`, scaffolded as `./cdc/<table>.ckpt`), not to the state DB.
  - Fix: the capture-sink and state panels and the CDC flow now say so. I did not add a separate node for the file, to keep the map small.
- **Accepted: the standalone `rivet cdc` command.**
  - Fix: added the edge cli→cdcsink ("rivet cdc") and a sentence in the capture-sink panel. It drives the same `run_capture` with no state store.
- **Declined: Google OAuth token endpoint and Secret Manager.** These are authentication plumbing, not a data path a newcomer follows; adding two more outside systems would add clutter without explaining a flow.
- **Declined: a plan/apply flow.** `apply` replays a sealed plan through the same `execute_resolved_plan` the batch flow already shows; the planner panel covers it.

### Layout

- The new edges made the labels of `dest_bkt` and `ver_state` overlap. I pinned the automatic grid and reordered the commit column (commit, destinations, state, verify). The render is now clean.

## Round 2

The checker rechecked 38 changed or added claims: 36 confirmed, 2 wrong. The verdicts file has no separate notes on loose wording, so I also corrected the one place that repeated a wrong claim (the compact card).

- **flow:cdc/3**
  - Map: said the CDC run lease and a claim on the checkpoint, both in the state store, keep two configs from reading the same stream.
  - Code: only the run lease is in the state store (`cdc_run_lease`, job.rs:1429). `claim_checkpoint` writes a `<checkpoint>.owner` file beside the checkpoint file (checkpoint_identity.rs), and that file is what separates two configs with different state databases.
  - Why: I read the two calls' names in `run_export_job_inner` and assumed both went to the state store, without opening `claim_checkpoint`. This is the same blind spot as the round-1 checkpoint-file gap: I keep reading CDC resume as state-DB-backed.
  - Fix: the hop now names the owner file.
- **flow:load/13 (and the compact card, which said the same)**
  - Map: said "one MERGE per table on BigQuery".
  - Code: one MERGE only for an unpartitioned or load-date base. A day-partitioned base gets one MERGE per chunk of up to 4,000 touched days, in one scripted job. Hour, month, year or integer-range keys get one MERGE per window as separate jobs, then the DROP. The Snowflake part (DELETE and INSERT in one transaction) was right.
  - Why: I took it from the README's summary instead of `src/load/cdc.rs` and the BigQuery adapter. Round 1 confirmed the README sentence, not the code path.
  - Fix: the hop and the compact card now describe the per-partition MERGEs.

Layout: the render is clean after the fixes; nothing needed moving.

## Round 3 (final)

The checker rechecked 3 claims: 1 confirmed (flow:cdc/3, the checkpoint owner file), 2 wrong.

- **node:compact and flow:load/13**
  - Map: said a day-partitioned BigQuery base gets one MERGE per chunk of up to 4,000 touched days.
  - Code: `plan_compact_merges` in `src/load/cdc.rs` cuts the buffer's whole key range, min to max, every calendar day counted, into windows of up to 4,000 partitions. For an hourly key that is 166 days. It adds a window on each side outside `PARTITIONED_DAYS` and one MERGE for rows whose key is NULL. A range that fits in one window with no NULL keys is one MERGE.
  - Why: in round 2 I rewrote the claim from the checker's summary instead of reading `plan_compact_merges` myself, so it still guessed at what each window spans.
  - Removed, following step 6: this was the last round, so I did not reword it into a new unchecked claim. I deleted the window, day and chunk details. Both places now say only that BigQuery merges with MERGE statements, split into windows for partitioned tables. What round 3 confirmed stays: Snowflake's DELETE and INSERT in one transaction, and the buffer dropped afterwards. ClickHouse having no compact step stays on the card.

Layout: the render is clean.
