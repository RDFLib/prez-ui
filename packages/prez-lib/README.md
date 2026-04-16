# Prez Lib
A JS library for processing RDF data for use with Prez UI, implementing [RDF/JS types](https://github.com/rdfjs/types) and [N3.js](https://github.com/rdfjs/N3.js).

## Installing

```bash
npm install prez-lib
```

## Example Usage
Using the factory functions:
```typescript
import { literal, node } from "prez-lib";

const term = node({
    value: "https://example.com",
    label: literal("term"),
    links: [
        {
            value: "/"
        }
    ],
});
```

Using the store class:
```typescript
import { RDFStore } from "prez-lib";

const data = "<https://example.com/subject> <https://example.com/predicate> <https://example.com/object> .";
const store = new RDFStore();
store.load(data);
const data = store.getItem();
```

## Search parser modes

`search()` defaults to the existing flat Prez search result shape.

The parser mode is strict: the mode you configure must match the backend search model. `prez-lib` does not do compatibility fallbacks between the flat and Jena Lucene SHACL shapes.

To opt into Jena Lucene SHACL nested matches, pass the parser mode explicitly:

```typescript
import { search } from "prez-lib";

const results = await search("https://example.com", "/search?q=rock", {
    parserMode: "jena-lucene-shacl",
});
```
