---
name: interactive-map-repo
description: Explains how a code repository works as an interactive C4-style map (system context, then containers and their key components, with animated request and data flows). Use when the user asks to map, explain or onboard onto a repository, a service or a codebase. Draft; builds on the interactive-map skill for rendering.
---

# Interactive map of a repository

You read a repository, model it in C4 terms and hand the result to the `interactive-map` skill, which renders the map. This skill decides what goes on the map; `interactive-map` decides how to write and render the JSON. Read its SKILL.md before writing the map definition.

The reader is someone who must understand a codebase fast: a lead reviewing a team's project, a new engineer, a lecturer. Every element on the map must be traceable to files in the repository. When you infer something you could not see in the code, say so in the panel text.

## 1. Find the evidence

Read in this order and stop each step when the answer is clear:

1. README, docs folder, architecture notes.
2. Deployment units: `docker-compose*.yml`, Dockerfiles, Kubernetes or Helm manifests, Procfile, serverless configs, IaC (Terraform, Pulumi). Each separately deployed or separately running process or data store is a container candidate.
3. Entry points: `main` functions, server start files, CLI commands, job and worker definitions, cron and schedulers, queue consumers.
4. External contracts: HTTP routes, OpenAPI specs, message topics, environment variables naming other services (`*_URL`, `*_HOST`, SMTP, OAuth, cloud SDK clients).
5. Dependency manifests (`package.json`, `pyproject.toml`, `go.mod`, ...) to name the technology of each container.

Write down, with file paths, what you found before designing anything.

## 2. Build the C4 model

**Level 1, context.** People (by role) and external systems that the system talks to, plus the system itself. Name each relationship with a verb and, where known, a protocol.

**Level 2, containers.** Separately running processes and data stores inside the system boundary: web apps, APIs, workers, schedulers, databases, caches, queues, object stores. Every container gets a name, a type, its technology and one sentence of responsibility.

**Level 3, components, only where it pays.** If a container holds most of the logic (a monolith, a single ML service), open it into its main components: routers, handlers, domain modules, data-access layer, background processors. Pick components a reader needs to follow the flows, not every folder. Keep each level under about 20 elements.

**Libraries and CLIs** have no containers. Model the public API and the main internal modules instead.

## 3. Pick the flows

Flows are C4 dynamic diagrams: one use case as ordered steps over the elements above. Choose 2 to 5 that matter most, usually the main user request, the main write path, and any background or asynchronous work. Trace each one through the real code and note the file for every step. Mark responses as reverse steps and asynchronous hand-offs (queues, jobs) explicitly.

## 4. Map it onto the viewer

- Overview cards: the level-1 picture. External systems and people around the system; the system itself split into 3 to 6 parts by purpose.
- Map: containers grouped into zones; a container opened to level 3 becomes a zone holding its components.
- Node `shape` shows the C4 kind (see the `interactive-map` skill): `person` for people, `external` for systems outside the boundary, `database` for SQL and document stores, `queue` for message brokers and streams, `worker` only for a pool of parallel workers. Everything else, including schedulers and single background jobs, stays `component` (the default); give a scheduler a clock icon instead.
- Edges: verb plus protocol as the label.
- Panels: `what` is the responsibility, `why` is why it exists or what breaks without it, `tools` is the technology and the key files.
- Inside scenes for 2 to 4 key nodes only: the hot path, the core logic, the main data store. Set top-level `source` to the repository URL and the commit you read, so every code reference links to the exact lines.
  - `kind: "steps"` for a component with logic: its main function as ordered steps, each with `t`, an optional `d`, `code` as `path:from-to`, `async: true` for hand-offs, and `exit` (`when`, `t`, optional `code`) for early returns and error branches. Read the function before writing steps; one step per decision or side effect, not per line.
  - `kind: "schema"` for a data store: `tables`, each with `name`, `note`, `code`, optional `ttl`, and `fields` (`n`, `type`, `ref` to another table, `note`). For a cache or key-value store, use key patterns as table names and say what each key holds. Pick the fields a reader needs to follow the flows, and say what is surprising about the data (aggregates, denormalised copies, soft deletes).
- Flows: the traced use cases. Tour: context first, then each part, then the most important flow.

Then follow the `interactive-map` skill to write the JSON, render and deliver it.
