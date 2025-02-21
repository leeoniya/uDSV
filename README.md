## 𝌠 μDSV

A [faster](#performance) CSV parser in [5KB (min)](https://github.com/leeoniya/uDSV/tree/main/dist/uDSV.iife.min.js) _(MIT Licensed)_

---
### Introduction

uDSV is a fast JS library for parsing well-formed CSV strings, either from memory or incrementally from disk or network.
It is mostly [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180) compliant, with support for quoted values containing commas, escaped quotes, and line breaks¹.
The aim of this project is to handle the 99.5% use-case without adding complexity and performance trade-offs to support the remaining 0.5%.

¹ Line breaks (`\n`,`\r`,`\r\n`) within quoted values must match the row separator.

---
### Features

What does uDSV pack into 5KB?

- [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180) compliant
- Incremental or full parsing, with optional accumulation
- Auto-detection and customization of delimiters (rows, columns, quotes, escapes)
- Schema inference and value typing: `string`, `number`, `boolean`, `date`, `json`
- Defined handling of `''`, `'null'`, `'NaN'`
- Whitespace trimming of values & skipping empty lines
- Multi-row header skipping and column renaming
- Multiple outputs: arrays (tuples), objects, nested objects, columnar arrays

Of course, _most_ of these are table stakes for CSV parsers :)

---
### Performance

Is it Lightning Fast™ or Blazing Fast™?

No, those are too slow! uDSV has [Ludicrous Speed™](https://www.youtube.com/watch?v=ygE01sOhzz0);
it's faster than the parsers you recognize and faster than those you've never heard of.

Most CSV parsers have one happy/fast path -- the one without quoted values, without value typing, and only when using the default settings & output format.
Once you're off that path, you can generally throw any self-promoting benchmarks in the trash.
In contrast, uDSV remains fast with any datasets and all options; its happy path is _every path_.

On a Ryzen 7 ThinkPad, Linux v6.4.11, and NodeJS v20.6.0, a diverse set of benchmarks show a 1x-5x performance boost relative to the [popular](https://github.com/search?q=csv+parser&type=repositories&s=stars&o=desc), [proven-fast](https://leanylabs.com/blog/js-csv-parsers-benchmarks/), [Papa Parse](https://www.papaparse.com/).

For _way too many_ synthetic and real-world benchmarks, head over to [/bench](/bench)...and don't forget your coffee!

<pre>
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                                         │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┤
│ uDSV                   │ 782K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 140 │
│ csv-simple-parser      │ 682K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 122        │
│ achilles-csv-parser    │ 469K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 83.8                      │
│ d3-dsv                 │ 433K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 77.4                        │
│ csv-rex                │ 346K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 61.9                              │
│ PapaParse              │ 305K   │ ░░░░░░░░░░░░░░░░░░░░░░ 54.5                                 │
│ csv42                  │ 296K   │ ░░░░░░░░░░░░░░░░░░░░░ 52.9                                  │
│ csv-js                 │ 285K   │ ░░░░░░░░░░░░░░░░░░░░░ 50.9                                  │
│ comma-separated-values │ 258K   │ ░░░░░░░░░░░░░░░░░░░ 46.1                                    │
│ dekkai                 │ 248K   │ ░░░░░░░░░░░░░░░░░░ 44.3                                     │
│ CSVtoJSON              │ 245K   │ ░░░░░░░░░░░░░░░░░░ 43.8                                     │
│ csv-parser (neat-csv)  │ 218K   │ ░░░░░░░░░░░░░░░░ 39                                         │
│ ACsv                   │ 218K   │ ░░░░░░░░░░░░░░░░ 39                                         │
│ SheetJS                │ 208K   │ ░░░░░░░░░░░░░░░ 37.1                                        │
│ @vanillaes/csv         │ 200K   │ ░░░░░░░░░░░░░░░ 35.8                                        │
│ node-csvtojson         │ 165K   │ ░░░░░░░░░░░░ 29.4                                           │
│ csv-parse/sync         │ 125K   │ ░░░░░░░░░ 22.4                                              │
│ @fast-csv/parse        │ 78.2K  │ ░░░░░░ 14                                                   │
│ jquery-csv             │ 55.1K  │ ░░░░ 9.85                                                   │
│ but-csv                │ ---    │ Wrong row count! Expected: 33790, Actual: 1                 │
│ @gregoranders/csv      │ ---    │ Invalid CSV at 1:109                                        │
│ utils-dsv-base-parse   │ ---    │ unexpected error. Encountered an invalid record. Field 17 o │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┘
</pre>

---
### Installation

```
npm i udsv
```

or

```html
<script src="./dist/uDSV.iife.min.js"></script>
```

---
### API

A 150 LoC [uDSV.d.ts](https://github.com/leeoniya/uDSV/blob/main/dist/uDSV.d.ts) TypeScript def.

---
### Basic Usage

```js
import { inferSchema, initParser } from 'udsv';

let csvStr = 'a,b,c\n1,2,3\n4,5,6';

let schema = inferSchema(csvStr);
let parser = initParser(schema);

// native format (fastest)
let stringArrs = parser.stringArrs(csvStr); // [ ['1','2','3'], ['4','5','6'] ]

// typed formats (internally converted from native)
let typedArrs  = parser.typedArrs(csvStr);  // [ [1, 2, 3], [4, 5, 6] ]
let typedObjs  = parser.typedObjs(csvStr);  // [ {a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6} ]
let typedCols  = parser.typedCols(csvStr);  // [ [1, 4], [2, 5], [3, 6] ]

let stringObjs = parser.stringObjs(csvStr); // [ {a: '1', b: '2', c: '3'}, {a: '4', b: '5', c: '6'} ]
let stringCols = parser.typedCols(csvStr);  // [ ['1', '4'], ['2', '5'], ['3', '6'] ]
```

Nested/deep objects can be re-constructed from column naming via `.typedDeep()`:

```js
// deep/nested objects (from column naming)
let csvStr2 = `
_type,name,description,location.city,location.street,location.geo[0],location.geo[1],speed,heading,size[0],size[1],size[2]
item,Item 0,Item 0 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,3.4,5.1,0.9
`.trim();

let schema2 = inferSchema(csvStr2);
let parser2 = initParser(schema2);

let typedDeep = parser2.typedDeep(csvStr2);

/*
[
  {
    _type: 'item',
    name: 'Item 0',
    description: 'Item 0 description in text',
    location: {
      city: 'Rotterdam',
      street: 'Main street',
      geo: [ 51.9280712, 4.4207888 ]
    },
    speed: 5.4,
    heading: 128.3,
    size: [ 3.4, 5.1, 0.9 ],
  }
]
*/
```

**CSP Note:**

uDSV uses dynamically-generated functions (via `new Function()`) for its `.typed*()` methods.
These functions are lazy-generated and use `JSON.stringify()` [code-injection guards](https://github.com/leeoniya/uDSV/commit/4e7472a7015c0a7ae5ae76e41f282bd4bdcf0c67), so the risk should be minimal.
Nevertheless, if you have strict [CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) without `unsafe-eval`, you won't be able to take advantage of the typed methods and will have to do the type conversion from the string tuples yourself.

---
### Incremental / Streaming

uDSV has no inherent knowledge of streams.
Instead, it exposes a generic incremental parsing API to which you can pass sequential chunks.
These chunks can come from various sources, such as a [Web Stream](https://css-tricks.com/web-streams-everywhere-and-fetch-for-node-js/) or [Node stream](https://nodejs.org/api/stream.html) via `fetch()` or `fs`, a [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), etc.

Here's what it looks like with Node's [fs.createReadStream()](https://nodejs.org/api/fs.html#fscreatereadstreampath-options):

```js
let stream = fs.createReadStream(filePath);

let parser = null;
let result = null;

stream.on('data', (chunk) => {
  // convert from Buffer
  let strChunk = chunk.toString();
  // on first chunk, infer schema and init parser
  parser ??= initParser(inferSchema(strChunk));
  // incremental parse to string arrays
  parser.chunk(strChunk, parser.stringArrs);
});

stream.on('end', () => {
  result = parser.end();
});
```

...and Web streams [in Node](https://nodejs.org/api/webstreams.html), or [Fetch's Response.body](https://developer.mozilla.org/en-US/docs/Web/API/Response/body):

```js
let stream = fs.createReadStream(filePath);

let webStream = Stream.Readable.toWeb(stream);
let textStream = webStream.pipeThrough(new TextDecoderStream());

let parser = null;

for await (const strChunk of textStream) {
  parser ??= initParser(inferSchema(strChunk));
  parser.chunk(strChunk, parser.stringArrs);
}

let result = parser.end();
```

The above examples show accumulating parsers -- they will buffer the full `result` into memory.
This may not be something you need (or want), for example with huge datasets where you're looking to get the sum of a single column, or want to filter only a small subset of rows.
To bypass this auto-accumulation behavior, simply pass your own handler as the third argument to `parser.chunk()`:

```js
// ...same as above

let sum = 0;

// sums fourth column
let reducer = (row) => {
  sum += row[3];
};

for await (const strChunk of textStream) {
  parser ??= initParser(inferSchema(strChunk));
  parser.chunk(strChunk, parser.typedArrs, reducer); // typedArrs + reducer
}

parser.end();
```

Building on the non-accumulating example, Node's [Transform stream](https://nodejs.org/api/stream.html#implementing-a-transform-stream) will be something like:

```js
import { Transform } from "stream";

class ParseCSVTransform extends Transform {
  #parser = null;
  #push   = null;

  constructor() {
    super({ objectMode: true });

    this.#push = parsed => {
      this.push(parsed);
    };
  }

  _transform(chunk, encoding, callback) {
    let strChunk = chunk.toString();
    this.#parser ??= initParser(inferSchema(strChunk));
    this.#parser.chunk(strChunk, this.#parser.typedArrs, this.#push);
    callback();
  }

  _flush(callback) {
    this.#parser.end();
    callback();
  }
}
```

---
### TODO?

- handle #comment rows
- emit empty-row and #comment events?