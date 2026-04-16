# Jena Lucene SHACL Search Support Design

Date: 2026-04-15

## Goal

Add opt-in support in `prez-lib` for the Jena Lucene SHACL search result shape, without changing default behavior for existing Prez installations.

Implementation scope for this change:

- `prez-lib` only

This repo also contains `prez-ui`, but that is not the delivery target for this change. The immediate consumer is an external Angular application that uses `prez-lib` directly.

The support needs to handle two cases:

1. `q` is supplied: search results include nested match nodes.
2. `q` is not supplied: search results still include scored hits and IRIs, but no nested match nodes.

## Current Behavior

`prez-lib` currently assumes a flat search result model.

Current parser entry points:

- `packages/prez-lib/src/service.ts`
- `packages/prez-lib/src/store.ts`
- `packages/prez-lib/src/types.ts`

Current assumptions in `RDFStore.search()`:

- each `prez:SearchResult` has exactly one `prez:searchResultPredicate`
- each `prez:SearchResult` has exactly one `prez:searchResultMatch`
- each `prez:SearchResult` has exactly one `prez:searchResultURI`

That maps to the current type:

```ts
type PrezSearchResult = {
  hash: string;
  weight: number;
  predicate: PrezNode;
  match: PrezLiteral;
  resource: PrezFocusNode;
};
```

This does not fit the Jena Lucene SHACL shape where a result node contains zero or more nested match nodes via `prez:hasSearchMatch`.

## Observed Jena Lucene SHACL Shape

At the result level:

- `a prez:SearchResult`
- `prez:searchResultWeight`
- `prez:searchResultURI`
- optional `prez:hasSearchMatch`

At the nested match level:

- `a prez:SearchResultMatch`
- `prez:searchResultPredicate`
- `prez:searchResultMatch`

From the sample:

```turtle
<urn:hash:...> a prez:SearchResult ;
    prez:searchResultWeight "8.222368"^^xsd:float ;
    prez:searchResultURI gswa_site:mineral-drill-hole_M0003251 ;
    prez:hasSearchMatch <urn:match:1>, <urn:match:2> .

<urn:match:1> a prez:SearchResultMatch ;
    prez:searchResultPredicate <urn:jena:lucene:field#comment> ;
    prez:searchResultMatch "Drillcore donated by Gold Road Resources.\n" .
```

## Required Design Constraints

This must be opt-in.

This must also be a permanent dual-mode design.

Default Prez behavior should continue to parse the current flat shape with no changes required by existing users.

When the feature flag is enabled, the Jena Lucene SHACL parser and UI behavior should be used. When the flag is disabled, the existing flat parser and existing UI behavior should be used.

## Proposed Design

### 1. Use explicit mode-specific search models rather than heuristic compatibility fields

Add a dedicated match type:

```ts
type PrezSearchMatch = {
  predicate: PrezNode;
  match: PrezLiteral;
};
```

Keep the existing flat result type for default mode:

```ts
type PrezFlatSearchResult = {
  hash: string;
  weight: number;
  predicate: PrezNode;
  match: PrezLiteral;
  resource: PrezFocusNode;
};
```

Define a separate result type for Jena Lucene SHACL mode:

```ts
type PrezLuceneShaclSearchResult = {
  hash: string;
  weight: number;
  resource: PrezFocusNode;
  matches: PrezSearchMatch[];
};
```

Rationale:

- supports zero matches when `q` is absent
- supports multiple matches when `q` is supplied
- avoids duplicating the same resource into multiple rows
- keeps the contract explicit: consumers know which model they asked for

Do not synthesize `predicate` and `match` in Jena Lucene SHACL mode based on match count. Consumers of `prez-lib` should know which parser mode they configured and should receive the corresponding result shape directly.

### 2. Introduce an explicit feature flag and parser mode

Add an explicit parser mode in `prez-lib`.

Consumer-facing feature flag example:

```ts
const useJenaLuceneShaclSearch = true;
```

Library-facing parser mode example:

```ts
type PrezSearchParserMode = "default" | "jena-lucene-shacl";
```

Thread that through the public API:

```ts
search(baseUrl, path, options?)
```

Possible option:

```ts
type PrezSearchOptions = {
  parserMode?: PrezSearchParserMode;
};
```

And reflect that in the returned search data type. Conceptually:

```ts
type PrezDataSearch =
  | { type: "search"; parserMode: "default"; data: PrezFlatSearchResult[]; ... }
  | { type: "search"; parserMode: "jena-lucene-shacl"; data: PrezLuceneShaclSearchResult[]; ... };
```

Behavior:

- `default`: existing flat parser only
- `jena-lucene-shacl`: parse result-level hits plus nested matches

Mapping rule:

- if the consumer feature flag is `false`, call `prez-lib.search(..., { parserMode: "default" })`
- if the consumer feature flag is `true`, call `prez-lib.search(..., { parserMode: "jena-lucene-shacl" })`

I do not recommend implicit auto-detection as the primary API. Permanent support for both modes is easier to reason about when the behavior is controlled explicitly by a feature flag.

### 3. Add a dedicated predicate constant

Add:

```ts
PREZ_PREDICATES.hasSearchMatch = "https://prez.dev/hasSearchMatch"
```

### 4. Split search parsing into helpers

In `RDFStore.search()` replace the single flat mapping with mode-specific helpers:

- `parseDefaultSearchResult(...)`
- `parseJenaLuceneShaclSearchResult(...)`

For the Jena Lucene SHACL mode:

1. find all `rdf:type prez:SearchResult` subjects
2. read `prez:searchResultWeight`
3. read `prez:searchResultURI`
4. read zero or more `prez:hasSearchMatch` objects
5. for each match node, read `prez:searchResultPredicate` and `prez:searchResultMatch`
6. build `matches[]`
7. return the Jena Lucene SHACL result shape directly, without synthesizing flat fields

### 5. UI impacts are downstream only for this change

This repository contains `prez-ui`, so there are clear UI touch points if this search mode is ever wired into the bundled Nuxt application. Those are noted here for completeness only.

They are not part of the implementation scope for this change.

Current `prez-ui` `useSearch()` in `packages/prez-ui/app/composables/useLib.ts` exits early when `q` is absent:

```ts
const query = new URL(baseUrl + urlPath.value).searchParams.get("q");
if (!query) {
  return emptySearchResult;
}
```

That means the UI will never request the backend shape you described for empty `q`.

If `prez-ui` later needs to support that backend behavior, this guard must become configurable.

Possible future UI runtime config:

```ts
public: {
  prezJenaLuceneShaclSearch: boolean,
  prezSearchAllowEmptyQuery: boolean
}
```

Recommended behavior:

- feature flag off: preserve current early-return behavior and current flat parsing
- feature flag on: use Jena Lucene SHACL parsing and optionally allow requests without `q`

## Touch Points

### `packages/prez-lib`

`src/types.ts`

- add `PrezSearchMatch`
- keep flat search result type for default mode
- add dedicated Jena Lucene SHACL search result type
- add `PrezSearchOptions` and parser mode type

`src/consts.ts`

- add `PREZ_PREDICATES.hasSearchMatch`

`src/store.ts`

- update `RDFStore.search()` to accept parser mode or options
- add nested match parsing helper
- preserve old flat parser behavior

`src/service.ts`

- extend exported `search()` signature to accept options
- pass parser mode to the store

`src/index.ts`

- export new types if needed

### `packages/prez-components` and `packages/prez-ui`

These are downstream UI touch points only. They are not in scope for the current change, but they are the places that would need updates if the bundled UI were later taught to consume the new parser mode.

`src/types.ts`

- `SearchResultsProps` can likely stay the same if it already uses `PrezSearchResult[]`
- type updates will flow from `prez-lib`

`src/components/SearchResults.vue`

- render zero, one, or many matches per result
- handle results with no match snippets
- decide how to show predicate information when there are multiple matches

### `packages/prez-ui`

`app/composables/useLib.ts`

- map feature flag to `prez-lib.search()` parser mode
- make the empty-`q` short-circuit depend on the feature flag and config

`app/components/SearchResults.vue`

- wrapper likely unchanged unless prop shape changes beyond `prez-components`

`nuxt.config.ts` and/or runtime config

- expose opt-in config so current users stay unchanged

## Rendering Recommendation

For the component layer, render per resource, not per match.

Suggested row behavior:

- title: result resource label
- badges: resource RDF types
- metadata: score if useful
- match section:
  - no matches: show nothing, or a muted "No match snippets returned"
  - one match: current behavior
  - many matches: render a short list of matched predicates and snippets

This aligns with the backend semantics better than flattening each nested match into a separate top-level result row.

## Potential Issues

### Empty `q` is currently blocked in the UI, not in `prez-lib`

`prez-lib` already fetches whatever search path it is given, including paths without `q`.

The current blocker is `prez-ui`, where `useSearch()` returns an empty client-side result if `q` is absent and does not call `prez-lib.search()`.

There is a separate parser issue in `prez-lib`: the current `RDFStore.search()` implementation assumes every `prez:SearchResult` has direct `prez:searchResultPredicate` and `prez:searchResultMatch` values. That means a no-`q` Jena Lucene SHACL response containing only score and hit IRI still requires parser changes, even though the fetch path already works in `prez-lib`.

For this piece of work, the relevant action is the parser change in `prez-lib`. The `prez-ui` behavior is noted here only so future integrators are not surprised.

### Search result typing should be explicit

Existing code expects `predicate` and `match` to exist in the default mode. That should remain true.

For Jena Lucene SHACL mode, consumers should not receive partially-compatible objects that sometimes expose flat fields and sometimes do not.

The cleaner options are:

1. separate result types per parser mode
2. a discriminated `PrezDataSearch` union keyed by `parserMode`

My recommendation is to make the mode explicit in the returned type contract and avoid compatibility synthesis inside the parser.

### Multi-match UI behavior is a product decision

If one resource matches multiple fields, the UI needs a rule for display:

- first match only
- all matches
- first N matches with truncation

I recommend rendering the first 2 to 3 matches and collapsing the rest.

### Result ordering must stay result-level

The backend score belongs to the resource hit, not to individual nested matches. That is another reason not to flatten nested matches into top-level rows.

### Predicate labels may be weak

The sample predicates use IRIs like `urn:jena:lucene:field#comment` and may not have `prez:label`.

Possible result:

- tooltip or inline text may show raw IRI or CURIE-like values

This may be acceptable, but it should be expected in the UI.

### Missing labels or descriptions on result resources

If the backend only returns the hit IRI and limited annotations, search rows may become sparse. The parser can still work, but UX quality depends on how much of the focus node is materialized in the response.

### Parser modes should be strict

This implementation should assume the backend is configured for exactly one search result model at a time.

That means:

- `default` mode parses only the flat shape
- `jena-lucene-shacl` mode parses only the nested match shape
- if the backend returns the wrong shape for the configured parser mode, parsing should fail rather than trying to recover

I do not want compatibility fallback logic here. Supporting mixed shapes in a single parser path creates unnecessary branching and makes the contract harder to reason about.

## Recommended Implementation Order

1. Add the design-compatible types in `prez-lib`.
2. Add parser mode and nested match support in `RDFStore.search()`.
3. Extend `service.ts` to expose the mode cleanly.
4. Update `prez-components` search rendering for zero or many matches.
5. Add `prez-ui` runtime config and relax the empty-`q` guard only when explicitly enabled.
6. Add fixture-based tests for:
   - current flat shape
   - nested shape with one match
   - nested shape with many matches
   - nested shape with zero matches
   - flat payload rejected in `jena-lucene-shacl` mode
   - nested payload rejected in `default` mode

## Recommendation

Implement this as a permanent two-path design:

- flat search behavior remains the default path
- Jena Lucene SHACL behavior is activated by feature flag

`prez-lib` should support both parser modes indefinitely.

For this change, that is sufficient. External consumers, including the Angular client, can select the parser mode explicitly via their own feature flagging/configuration.

The critical design choices are:

- preserve one result row per resource and model nested snippets as `matches[]`, rather than flattening them into multiple top-level results
- make the parser mode explicit in both configuration and returned data shape, rather than inferring behavior from how many matches happen to be present
