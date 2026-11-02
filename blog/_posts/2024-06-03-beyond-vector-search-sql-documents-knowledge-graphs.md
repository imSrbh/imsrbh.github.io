---
layout: post
title: "Beyond Vector Search: Connecting SQL and Documents with Knowledge Graphs"
subtitle: "An architectural walkthrough of graph-guided retrieval, natural-language SQL, and agentic orchestration"
date: 2024-06-03 09:00:00 +0530
tags: [GenAI, RAG, Knowledge Graphs, LLM, Deployment]
image: /blog/blog_img/graph-guided-retrieval/cover.svg
---

A business question rarely respects the boundary between a database and a document folder.

Consider a retailer asking:  
>**“Which products had the most returned units last quarter, and what return conditions apply to them?”**  

Transaction records can identify the products. Policy documents explain the conditions. A useful answer needs both, connected by the right context.

A document chatbot might find a relevant policy but cannot reliably calculate totals from a live database. A SQL assistant might calculate those totals correctly but miss the rules described in documents. Connecting these capabilities is where knowledge graphs and tool-using language models become interesting.

This article describes a generalized architecture for combining **SQL, document retrieval, and knowledge graphs**. All examples are fictional. It is an architectural walkthrough, not a benchmark report or a claim that every deployment safeguard discussed below is already implemented.

![Beyond vector search: connecting SQL, knowledge graphs, and documents]({{ '/blog/blog_img/graph-guided-retrieval/cover.svg' | relative_url }})

## 1. Why vector search alone is not enough

Retrieval-augmented generation, or RAG, supplies a language model with external information before it generates an answer. A common document pipeline splits text into chunks, creates embeddings, retrieves semantically similar chunks, and asks the model to answer from that context.

This works well for questions such as **“What does the return policy say about opened packaging?”**   
But similarity is not a substitute for a database operation. Finding passages about returns does not calculate how many units were returned, apply the correct reporting period, or join product records consistently.

Different tools answer different parts of the problem:

| Capability | Best suited to |
|---|---|
| Vector retrieval | Finding passages with related meaning, even when wording differs |
| SQL | Filtering, joining, counting, and aggregating structured records |
| Knowledge graphs | Representing explicit relationships and retrieving connected context |
| Language models | Interpreting questions, selecting tools, and explaining retrieved evidence |

The goal is not to replace vector search. It is to combine complementary retrieval methods without asking one method to do everything.

A graph is not automatically necessary, either. For a small database and a handful of documents, direct schema prompting plus document retrieval may be simpler. Graph construction earns its complexity only when the relationships help answer real questions.

## 2. Separate ingestion from question answering

There are two distinct workflows: preparing knowledge and answering questions.

During **ingestion**, the system discovers database structure, builds a schema graph, processes documents, and creates retrieval indexes. During **question answering**, it retrieves relevant context, selects tools, queries the original data sources, and synthesizes an answer.

![Architecture showing database schema and documents feeding graph indexes, followed by retrieval, tool selection, and an answer with evidence]({{ '/blog/blog_img/graph-guided-retrieval/architecture.svg' | relative_url }})

*The graph helps identify context. Numerical facts are still queried from the relational database, and document statements should remain traceable to their sources.*

A practical stack can use SQLAlchemy for database access, LlamaIndex for indexing and query orchestration, Neo4j for graph storage, and a FastAPI service behind a React interface. A separate graph API can support visualization and graph operations. These are implementation choices, not prerequisites for the pattern.

An important boundary is worth stating explicitly: **a schema graph is not a copy of every database record**. It describes tables and their relationships. Actual sales, returns, and quantities remain in the database.

## 3. Turn the database schema into retrieval context

Imagine a schema containing Customers, Orders, OrderItems, Products, and Returns. Foreign keys describe how those tables connect; column metadata describes what each table contains.

Schema discovery can collect:

- Table and column names.
- Data types and available descriptions.
- Primary and foreign keys.
- Relationships between tables.

The graph can represent tables as nodes and foreign-key connections as edges, with column details attached as metadata. Tables without foreign keys must remain discoverable too: absence of a relationship does not make a table irrelevant.

When a question mentions returned products, retrieval can identify Returns, OrderItems, and Products as candidate tables. The SQL tool receives the relevant schema instead of an unrestricted dump of every table.

This can reduce irrelevant context, but narrowing the schema also introduces risk. Missing an intermediate join table can make a valid query impossible. Retrieval should preserve necessary join paths and be tested on questions that cross several tables.

Schema changes create another operational concern. A renamed column or changed foreign key can invalidate the retrieved context even while the database itself remains healthy. Index freshness needs an explicit update strategy.

## 4. Connect document concepts to schema entities

Documents use business language; databases often use abbreviated technical identifiers. “Returned merchandise” in a policy might correspond to a Returns table. Connecting the two requires more than matching identical words.

One approach is **schema-aware relationship extraction**:

1. Split a document into chunks while retaining its filename, page, and version metadata.
2. Retrieve schema entities potentially relevant to each chunk.
3. Supply that schema context to an extraction model.
4. Extract relationships connecting document concepts to the relevant entities.
5. Validate and store the relationships with references to the supporting text.

![Example connecting a Products schema node to order items and returns, and separately to a document-supported return policy]({{ '/blog/blog_img/graph-guided-retrieval/schema-document.svg' | relative_url }})

*Solid edges represent schema relationships; dashed edges illustrate extracted document associations. An association is a candidate connection, not proof that a policy applies to every product.*

Suppose a policy describes a thirty-day return window for unopened accessories. A document association can help retrieve that policy when the question involves products and returns. However, determining applicability still requires checking the product category, policy dates, region, and any exceptions.

This is a subtle but important distinction: **connecting a policy to Products does not establish a product-level eligibility rule**. Extracted edges should not silently become authoritative business facts.

Validation should reject nonexistent schema entities, preserve evidence for relationships, and allow uncertainty. If no relevant schema context exists, document-only retrieval is preferable to forcing an artificial connection.

## 5. Give the agent focused tools

Instead of one large prompt handling every operation, expose tools with clear responsibilities. A ReAct-style agent can alternate between choosing an action, observing its result, and deciding whether another action is needed.

| Tool | Responsibility | Example question |
|---|---|---|
| Structured query tool | Generate SQL using selected schema and retrieve records or aggregates | “Which products had the most returned units?” |
| Document query tool | Retrieve passages and answer with source references | “What conditions apply to opened products?” |
| Combined query tool | Coordinate structured results and document evidence | “Which products had the most returns, and which policies apply?” |

There are two useful combined-query patterns. In **SQL-led augmentation**, database results identify entities that guide subsequent document retrieval. In **separate retrieval and synthesis**, structured and document tools produce intermediate answers that are combined afterward.

The first is useful when policy lookup depends on the specific products returned by SQL. The second can work when both sources are independently relevant. Neither removes the need to reconcile identifiers and scope across sources.

Tool descriptions should explain capabilities and boundaries, not just provide attractive names. A document tool should not invent aggregate counts. A structured tool should not guess policy clauses absent from the database.

Agent autonomy should also be bounded: limit iterations, time, and cost; handle tool failures explicitly; and ask for clarification when a question cannot be resolved safely. Agentic routing is a design option, not evidence that an unbounded reasoning loop is better than a simpler router.

## 6. Follow one question end to end

Return to the opening question:

> Which products had the most returned units last quarter, and what return conditions apply to them?

Before retrieval, resolve “last quarter” into explicit dates using an agreed reporting calendar. For an illustrative question asked on June 3, 2024, the previous calendar quarter is January 1 through March 31, 2024. A different fiscal calendar could produce a different interval.

![Question-answering sequence from resolving the reporting period through schema retrieval, SQL, policy lookup, and evidence-backed synthesis]({{ '/blog/blog_img/graph-guided-retrieval/query-flow.svg' | relative_url }})

### Retrieve the schema and run SQL

Assume a fictional reporting schema has Products and Returns tables, with a product identifier, return timestamp, and returned quantity. A read-only aggregation might look like this:

```sql
SELECT
    p.product_id,
    p.product_name,
    SUM(r.quantity) AS returned_units
FROM returns AS r
JOIN products AS p ON p.product_id = r.product_id
WHERE r.returned_at >= :quarter_start
  AND r.returned_at < :next_quarter_start
GROUP BY p.product_id, p.product_name
ORDER BY returned_units DESC, p.product_id
LIMIT 5;
```

The date values are bound parameters, not string substitutions. The half-open interval includes the full last day without assuming a particular timestamp precision. Real schemas may require additional joins, status filters, or adjustments for reversed returns.

This query calculates **returned-unit counts**, not return rates. A rate requires a denominator and a clearly defined sales cohort. Keeping the metric explicit prevents a plausible-looking answer from answering a different question.

### Retrieve applicable policies

Use the returned product identifiers and relevant attributes to find policy evidence. Check effective dates and scope: the policy applying to an original purchase might differ from the policy current at query time.

If category or purchase-date information is missing, retrieve it or explain the limitation. Do not infer policy eligibility from semantic similarity alone.

### Synthesize without blending facts and assumptions

The final answer should distinguish:

- **Database facts:** product rankings and returned-unit counts.
- **Document evidence:** policy clauses and their source locations.
- **Unresolved applicability:** conditions that cannot be confirmed from available data.

A valid partial answer is better than a complete-sounding invention. The system can report the ranking while stating that policy applicability remains unverified for a particular product.

## 7. Make the evidence inspectable

An answer interface can expose generated SQL, document filenames and page references, relevant graph nodes, and downloadable query results. These details help users investigate where an answer came from.

They should be understood as an **evidence trail**, not a correctness guarantee. Valid SQL can calculate the wrong metric. A citation can point to a related page without supporting the claim. A highlighted node can show retrieval activity without proving the retrieved context was sufficient.

Prefer concise tool-status messages, source excerpts, and verifiable results over displaying model-generated reasoning as proof. Users need to inspect evidence, not trust a fluent explanation of how the model believes it reached an answer.

Exports also need access controls. A downloadable result must not reveal records that the requesting user would be unable to view through the application.

## 8. Deployment: treat it as a data application

A retrieval prototype becomes a multi-service system once it includes a browser interface, application backend, graph storage, relational access, document storage, and external model calls.

Containers help package these components consistently. Docker Compose can describe a local or single-host environment, but containerization alone does not provide resilience, isolation, or secure data access.

The following are deployment recommendations, not claims about a particular implementation.

### Keep state outside replaceable containers

Persist graph data, source documents, and retrieval indexes independently of application containers. Separate ingestion jobs from interactive requests where possible so large uploads do not block question answering.

Track document and schema versions. If a policy changes, old extracted relationships and stale chunks should not remain indistinguishable from current evidence. Plan backups and test restoration, not just backup creation.

### Bound access and execution

Use least-privilege, read-only database credentials for question answering. Restrict accessible schemas and add query validation, row limits, execution timeouts, and resource controls. A prompt asking for read-only SQL is not an authorization boundary.

Treat retrieved text as data, not instructions. Documents can contain misleading requests, and generated SQL is untrusted output. Enforcement belongs in application and database controls, outside the model's discretion.

Keep credentials in an appropriate secret store or deployment-managed configuration. Authenticate API and WebSocket connections, apply authorization to every source, and avoid exposing internal services directly to the internet.

### Isolate requests and observe failures

Conversation history, intermediate results, and output files should be scoped to the correct user and request. Shared mutable state can mix responses under concurrent usage.

Use structured request events for progress updates rather than depending on parsing console output. Monitor retrieval failures, empty results, SQL errors, model latency, token usage, and end-to-end response time. Logs should help diagnose failures without collecting unnecessary sensitive content.

## 9. Evaluate before claiming improvement

A compelling architecture diagram is not evidence of better answers. Build a representative question set and compare document-only retrieval, SQL-only question answering, and the combined graph-guided approach where each is applicable.

Include structured-only, document-only, and mixed-source questions, plus ambiguous and unanswerable cases. Mixed-source questions should test whether the answer actually uses both sources correctly—not merely whether it mentions both.

| Dimension | What to check |
|---|---|
| Schema retrieval | Were all necessary tables and join paths available? |
| SQL correctness | Did the query calculate the intended result, not merely execute? |
| Document grounding | Do the cited passages support the stated claims? |
| Tool selection | Did the system choose appropriate tools and avoid unnecessary calls? |
| Cross-source consistency | Were entities, time periods, and policy scope aligned? |
| Abstention | Did the system acknowledge insufficient evidence? |
| Operational performance | What were latency, model cost, and ingestion cost? |

Use fixed data snapshots and expected answers where possible. An ablation that removes graph guidance while keeping the other components comparable helps distinguish the graph's contribution from better prompts or a different model.

Graph extraction has costs: additional model calls, index maintenance, and potentially incorrect relationships. More retrieval hops can add irrelevant context. Whether the added complexity is justified depends on measured outcomes for the intended workload.

## 10. The takeaway

SQL, vector retrieval, and knowledge graphs solve different parts of a knowledge-access problem. SQL computes over structured facts. Document retrieval finds supporting text. Graphs make selected relationships explicit and can guide which context reaches the answering tools.

A useful combined system preserves those boundaries. It retrieves evidence, performs calculations in the right place, checks whether sources refer to the same entities and time periods, and acknowledges what remains unknown.

**The objective is not to make a chatbot sound more informed. It is to make answers easier to support, inspect, and evaluate across different kinds of information.**

## Further reading

- [LlamaIndex documentation](https://docs.llamaindex.ai/) — indexing, retrieval, query engines, and agents. APIs vary by version.
- [Neo4j documentation](https://neo4j.com/docs/) — graph modeling, querying, and operations.
- [SQLAlchemy documentation](https://docs.sqlalchemy.org/en/20/) — database connectivity, schema inspection, and parameterized execution.
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — the tool-interaction pattern discussed in this article.
- [Docker Compose documentation](https://docs.docker.com/compose/) — defining and running multi-container applications.

[Explore more projects →]({{ '/projects' | relative_url }})
