import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { RDFStore } from "../dist/prez-lib.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(currentDir, "fixtures");

function loadFixture(name) {
    return readFileSync(join(fixturesDir, name), "utf8");
}

function parseFixture(name, parserMode = "default") {
    const store = new RDFStore();
    store.load(loadFixture(name));

    return parserMode === "jena-lucene-shacl"
        ? store.search({ parserMode })
        : store.search();
}

test("parses the default flat search shape", () => {
    const results = parseFixture("flat-search.ttl");

    assert.equal(results.length, 1);
    assert.equal(results[0].hash, "flat-1");
    assert.equal(results[0].predicate.value, "https://example.com/title");
    assert.equal(results[0].match.value, "Flat result match");
    assert.equal(results[0].resource.value, "https://example.com/item-1");
});

test("parses a Lucene SHACL result with one nested match", () => {
    const results = parseFixture("lucene-single-match.ttl", "jena-lucene-shacl");

    assert.equal(results.length, 1);
    assert.equal(results[0].hash, "lucene-1");
    assert.equal(results[0].matches.length, 1);
    assert.equal(results[0].matches[0].predicate.value, "https://example.com/comment");
    assert.equal(results[0].matches[0].match.value, "Single nested snippet");
});

test("parses a Lucene SHACL result with many nested matches", () => {
    const results = parseFixture("lucene-multi-match.ttl", "jena-lucene-shacl");

    assert.equal(results.length, 1);
    assert.deepEqual(
        results[0].matches.map(match => match.match.value).sort(),
        ["First nested snippet", "Second nested snippet", "Third nested snippet"]
    );
});

test("parses a Lucene SHACL result with zero nested matches", () => {
    const results = parseFixture("lucene-zero-match.ttl", "jena-lucene-shacl");

    assert.equal(results.length, 1);
    assert.deepEqual(results[0].matches, []);
    assert.equal(results[0].resource.value, "https://example.com/item-4");
});

test("rejects flat legacy search payloads in Lucene SHACL mode", () => {
    assert.throws(
        () => parseFixture("flat-search.ttl", "jena-lucene-shacl"),
        /parserMode is jena-lucene-shacl/
    );
});

test("rejects mixed payloads in default mode", () => {
    assert.throws(
        () => parseFixture("lucene-mixed-shape.ttl"),
        /parserMode is default/
    );
});

test("rejects mixed payloads in Lucene SHACL mode", () => {
    assert.throws(
        () => parseFixture("lucene-mixed-shape.ttl", "jena-lucene-shacl"),
        /parserMode is jena-lucene-shacl/
    );
});
