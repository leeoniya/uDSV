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

On a Ryzen 7 ThinkPad, Linux v6.13.3, and NodeJS v22.14.0, a diverse set of benchmarks show a 1x-5x performance boost relative to the [popular](https://github.com/search?q=csv+parser&type=repositories&s=stars&o=desc), [proven-fast](https://leanylabs.com/blog/js-csv-parsers-benchmarks/), [Papa Parse](https://www.papaparse.com/).

<pre>
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ customers-100000.csv (17 MB, 12 cols x 100K rows)                        (parsing to strings) │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┤
│ csv-simple-parser      │ 1.45M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 240 │
│ uDSV                   │ 1.39M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 230   │
│ PapaParse              │ 1.13M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 187             │
│ tiddlycsv              │ 1.09M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 180              │
│ ACsv                   │ 1.07M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 176               │
│ but-csv                │ 1.05M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 174                │
│ d3-dsv                 │ 987K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 163                  │
│ csv-rex                │ 887K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 147                      │
│ csv42                  │ 781K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 129                          │
│ achilles-csv-parser    │ 687K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 114                             │
│ arquero                │ 567K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 93.6                                │
│ comma-separated-values │ 545K   │ ░░░░░░░░░░░░░░░░░░░░░ 90                                    │
│ node-csvtojson         │ 456K   │ ░░░░░░░░░░░░░░░░░░ 75.3                                     │
│ @vanillaes/csv         │ 427K   │ ░░░░░░░░░░░░░░░░░ 70.5                                      │
│ SheetJS                │ 415K   │ ░░░░░░░░░░░░░░░░ 68.5                                       │
│ csv-parser (neat-csv)  │ 307K   │ ░░░░░░░░░░░░ 50.7                                           │
│ CSVtoJSON              │ 297K   │ ░░░░░░░░░░░░ 49.1                                           │
│ dekkai                 │ 221K   │ ░░░░░░░░░ 36.5                                              │
│ csv-js                 │ 206K   │ ░░░░░░░░ 34.1                                               │
│ @gregoranders/csv      │ 202K   │ ░░░░░░░░ 33.3                                               │
│ csv-parse/sync         │ 177K   │ ░░░░░░░ 29.3                                                │
│ jquery-csv             │ 155K   │ ░░░░░░ 25.6                                                 │
│ @fast-csv/parse        │ 114K   │ ░░░░░ 18.9                                                  │
│ utils-dsv-base-parse   │ 74.3K  │ ░░░ 12.3                                                    │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┘
</pre>

You might be thinking, "Okay, it's not _that_ much faster than PapaParse".
But things change significantly when parsing with types.
PapaParse is 50% slower without even creating the 100k `Date` objects that other libs do.

<pre>
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ customers-100000.csv (17 MB, 12 cols x 100K rows)                        (parsing with types) │
├────────────────────────┬────────┬────────────────────────────────────────┬────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                     │ Types              │
├────────────────────────┼────────┼────────────────────────────────────────┼────────────────────┤
│ uDSV                   │ 993K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 164 │ date,number,string │
│ csv42                  │ 686K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 113           │ number,string      │
│ csv-simple-parser      │ 666K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 110            │ date,number,string │
│ csv-rex                │ 627K   │ ░░░░░░░░░░░░░░░░░░░░░░ 104             │ number,string      │
│ comma-separated-values │ 536K   │ ░░░░░░░░░░░░░░░░░░░ 88.5               │ number,string      │
│ achilles-csv-parser    │ 517K   │ ░░░░░░░░░░░░░░░░░░ 85.3                │ number,string      │
│ arquero                │ 478K   │ ░░░░░░░░░░░░░░░░░ 79                   │ date,number,string │
│ PapaParse              │ 463K   │ ░░░░░░░░░░░░░░░░ 76.4                  │ number,string      │
│ d3-dsv                 │ 389K   │ ░░░░░░░░░░░░░░ 64.3                    │ date,number,string │
│ @vanillaes/csv         │ 312K   │ ░░░░░░░░░░░ 51.5                       │ NaN,number,string  │
│ CSVtoJSON              │ 284K   │ ░░░░░░░░░░ 46.8                        │ number,string      │
│ csv-parser (neat-csv)  │ 265K   │ ░░░░░░░░░░ 43.7                        │ number,string      │
│ csv-js                 │ 211K   │ ░░░░░░░░ 34.8                          │ number,string      │
│ dekkai                 │ 209K   │ ░░░░░░░░ 34.6                          │ number,string      │
│ csv-parse/sync         │ 101K   │ ░░░░ 16.7                              │ date,number,string │
│ SheetJS                │ 64.5K  │ ░░░ 10.7                               │ number,string      │
└────────────────────────┴────────┴────────────────────────────────────────┴────────────────────┘
</pre>

And when the dataset also has many quoted values, the performance gap grows to 3x.
Once again, we're ignoring the fact that results with "object" types ran `JSON.parse()` 34k times.

<pre>
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                    (parsing with types) │
├────────────────────────┬────────┬─────────────────────────┬───────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)      │ Types                             │
├────────────────────────┼────────┼─────────────────────────┼───────────────────────────────────┤
│ uDSV                   │ 521K   │ ░░░░░░░░░░░░░░░░░░░░ 93 │ boolean,null,number,object,string │
│ csv-simple-parser      │ 416K   │ ░░░░░░░░░░░░░░░░ 74.3   │ boolean,null,number,object,string │
│ achilles-csv-parser    │ 342K   │ ░░░░░░░░░░░░░░ 61.2     │ boolean,null,number,object,string │
│ d3-dsv                 │ 284K   │ ░░░░░░░░░░░ 50.8        │ null,number,string                │
│ csv-rex                │ 267K   │ ░░░░░░░░░░░ 47.7        │ boolean,null,number,object,string │
│ comma-separated-values │ 262K   │ ░░░░░░░░░░░ 46.7        │ number,string                     │
│ dekkai                 │ 258K   │ ░░░░░░░░░░ 46.1         │ NaN,number,string                 │
│ arquero                │ 251K   │ ░░░░░░░░░░ 44.9         │ null,number,string                │
│ CSVtoJSON              │ 236K   │ ░░░░░░░░░░ 42.2         │ number,string                     │
│ csv42                  │ 225K   │ ░░░░░░░░░ 40.1          │ number,object,string              │
│ csv-js                 │ 215K   │ ░░░░░░░░░ 38.4          │ boolean,number,string             │
│ csv-parser (neat-csv)  │ 198K   │ ░░░░░░░░ 35.3           │ boolean,null,number,object,string │
│ @vanillaes/csv         │ 179K   │ ░░░░░░░ 32              │ NaN,number,string                 │
│ PapaParse              │ 176K   │ ░░░░░░░ 31.4            │ boolean,null,number,string        │
│ SheetJS                │ 98.6K  │ ░░░░ 17.6               │ boolean,number,string             │
│ csv-parse/sync         │ 91.8K  │ ░░░░ 16.4               │ number,string                     │
└────────────────────────┴────────┴─────────────────────────┴───────────────────────────────────┘
</pre>

For _way too many_ synthetic and real-world benchmarks, head over to [/bench](/bench)...and don't forget your coffee!

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

Sometimes you may need to render the unmodified string values (like in an editable grid), but want to sort/filter using the typed values (e.g. number or date columns).
uDSV's `.typed*()` methods additionally accept the untyped string-tuples array returned by `parser.stringArrs(csvStr)`:

```js
let schema = inferSchema(csvStr);
let parser = initParser(schema);

// raw parsed strings for rendering
let stringArrs = parser.stringArrs(csvStr);
// typed values for sorting/filtering
let typedObjs = parser.typedObjs(stringArrs);
```

Need a custom or user-defined parser for a specific column?
No problem!

```js
const csvStr = `a,b,c\n1,2,a-b-c\n4,5,d-e`;

let schema = inferSchema(csvStr);
schema.cols[2].parse = str => str.split('-');

let parser = initParser(schema);

let rows = parser.typedObjs(csvStr);

/*
[
  {a: 1, b: 2, c: ['a', 'b', 'c']},
  {a: 4, b: 5, c: ['d', 'e',    ]},
]
*/
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