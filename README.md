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

On a Ryzen 7 ThinkPad, Linux v6.14.7, and NodeJS v24.1.0, a diverse set of benchmarks show a 2x-5x performance boost relative to the [popular](https://github.com/search?q=csv+parser&type=repositories&s=stars&o=desc), [proven-fast](https://leanylabs.com/blog/js-csv-parsers-benchmarks/), [Papa Parse](https://www.papaparse.com/).

**Parsing to arrays of strings**

<pre>
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ customers-100000.csv (17 MB, 12 cols x 100K rows)                        (parsing to strings) │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┤
│ csv-simple-parser      │ 2.21M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 366 │
│ uDSV                   │ 2M     │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 330      │
│ but-csv                │ 1.15M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 190                           │
│ PapaParse              │ 1.13M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 186                           │
│ ACsv                   │ 1.12M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 185                            │
│ tiddlycsv              │ 1.11M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 183                            │
│ d3-dsv                 │ 939K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 155                                │
│ csv-rex                │ 884K   │ ░░░░░░░░░░░░░░░░░░░░░░ 146                                  │
│ achilles-csv-parser    │ 856K   │ ░░░░░░░░░░░░░░░░░░░░░░ 141                                  │
│ csv42                  │ 807K   │ ░░░░░░░░░░░░░░░░░░░░░ 133                                   │
│ arquero                │ 541K   │ ░░░░░░░░░░░░░░ 89.4                                         │
│ node-csvtojson         │ 478K   │ ░░░░░░░░░░░░ 78.9                                           │
│ comma-separated-values │ 469K   │ ░░░░░░░░░░░░ 77.4                                           │
│ CSVtoJSON              │ 447K   │ ░░░░░░░░░░░░ 73.8                                           │
│ SheetJS                │ 411K   │ ░░░░░░░░░░░ 67.8                                            │
│ @vanillaes/csv         │ 396K   │ ░░░░░░░░░░ 65.4                                             │
│ csv-parser (neat-csv)  │ 278K   │ ░░░░░░░ 45.9                                                │
│ dekkai                 │ 211K   │ ░░░░░░ 34.8                                                 │
│ @gregoranders/csv      │ 198K   │ ░░░░░ 32.6                                                  │
│ csv-js                 │ 193K   │ ░░░░░ 31.9                                                  │
│ csv-parse/sync         │ 153K   │ ░░░░ 25.3                                                   │
│ jquery-csv             │ 153K   │ ░░░░ 25.3                                                   │
│ @fast-csv/parse        │ 106K   │ ░░░ 17.6                                                    │
│ utils-dsv-base-parse   │ 68.9K  │ ░░ 11.4                                                     │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┘
</pre>

**Parsing to arrays with types**

Note: `date` in the Types column means the lib created 100,000 `Date` objects; not all libs do.

<pre>
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ customers-100000.csv (17 MB, 12 cols x 100K rows)                        (parsing with types) │
├────────────────────────┬────────┬────────────────────────────────────────┬────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                     │ Types              │
├────────────────────────┼────────┼────────────────────────────────────────┼────────────────────┤
│ uDSV                   │ 967K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 160 │ date,number,string │
│ csv42                  │ 712K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 118         │ number,string      │
│ csv-simple-parser      │ 697K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 115          │ date,number,string │
│ csv-rex                │ 629K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 104            │ number,string      │
│ achilles-csv-parser    │ 560K   │ ░░░░░░░░░░░░░░░░░░░░ 92.6              │ number,string      │
│ comma-separated-values │ 471K   │ ░░░░░░░░░░░░░░░░░ 77.7                 │ number,string      │
│ arquero                │ 459K   │ ░░░░░░░░░░░░░░░░░ 75.9                 │ date,number,string │
│ PapaParse              │ 454K   │ ░░░░░░░░░░░░░░░░ 75                    │ number,string      │
│ CSVtoJSON              │ 425K   │ ░░░░░░░░░░░░░░░ 70.1                   │ number,string      │
│ d3-dsv                 │ 380K   │ ░░░░░░░░░░░░░░ 62.8                    │ date,number,string │
│ @vanillaes/csv         │ 302K   │ ░░░░░░░░░░░ 49.9                       │ NaN,number,string  │
│ csv-parser (neat-csv)  │ 260K   │ ░░░░░░░░░░ 43                          │ number,string      │
│ csv-js                 │ 229K   │ ░░░░░░░░░ 37.9                         │ number,string      │
│ dekkai                 │ 213K   │ ░░░░░░░░ 35.1                          │ number,string      │
│ csv-parse/sync         │ 101K   │ ░░░░ 16.7                              │ date,number,string │
│ SheetJS                │ 70.8K  │ ░░░ 11.7                               │ number,string      │
└────────────────────────┴────────┴────────────────────────────────────────┴────────────────────┘
</pre>

**Parsing quote-heavy CSV to arrays with types**

Note: `object` in the Types column means the lib called `JSON.parse()` 34,000 times; not all libs do.

<pre>
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                    (parsing with types) │
├────────────────────────┬────────┬─────────────────────────┬───────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)      │ Types                             │
├────────────────────────┼────────┼─────────────────────────┼───────────────────────────────────┤
│ uDSV                   │ 537K   │ ░░░░░░░░░░░░░░░░░░░░ 96 │ boolean,null,number,object,string │
│ csv-simple-parser      │ 445K   │ ░░░░░░░░░░░░░░░░░ 79.6  │ boolean,null,number,object,string │
│ achilles-csv-parser    │ 420K   │ ░░░░░░░░░░░░░░░░ 75.1   │ boolean,null,number,object,string │
│ CSVtoJSON              │ 270K   │ ░░░░░░░░░░░ 48.2        │ number,string                     │
│ d3-dsv                 │ 266K   │ ░░░░░░░░░░ 47.6         │ null,number,string                │
│ comma-separated-values │ 261K   │ ░░░░░░░░░░ 46.6         │ number,string                     │
│ csv-rex                │ 255K   │ ░░░░░░░░░░ 45.6         │ boolean,null,number,object,string │
│ dekkai                 │ 248K   │ ░░░░░░░░░░ 44.3         │ NaN,number,string                 │
│ arquero                │ 245K   │ ░░░░░░░░░░ 43.8         │ null,number,string                │
│ csv42                  │ 235K   │ ░░░░░░░░░ 42            │ number,object,string              │
│ csv-js                 │ 232K   │ ░░░░░░░░░ 41.4          │ boolean,number,string             │
│ csv-parser (neat-csv)  │ 191K   │ ░░░░░░░░ 34.2           │ boolean,null,number,object,string │
│ PapaParse              │ 176K   │ ░░░░░░░ 31.4            │ boolean,null,number,string        │
│ @vanillaes/csv         │ 170K   │ ░░░░░░░ 30.4            │ NaN,number,string                 │
│ SheetJS                │ 102K   │ ░░░░ 18.3               │ boolean,number,string             │
│ csv-parse/sync         │ 92.2K  │ ░░░░ 16.5               │ number,string                     │
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
let stringCols = parser.stringCols(csvStr); // [ ['1', '4'], ['2', '5'], ['3', '6'] ]
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