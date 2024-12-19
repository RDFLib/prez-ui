# Prez Lib
A JS library for processing RDF data for use with Prez UI, implementing [RDF/JS types](https://github.com/rdfjs/types) and [N3.js](https://github.com/rdfjs/N3.js).

## Installing

```bash
npm install prez-lib-test
```

## Example Usage
Using the factory functions:
```typescript
import { literal, node } from "prez-lib-test";

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
import { RDFStore } from "prez-lib-test";

const data = "<https://example.com/subject> <https://example.com/predicate> <https://example.com/object> .";
const store = new RDFStore();
store.load(data);
const data = store.getItem();
```
