## 𝌠 μDSV

A [faster](#performance) CSV parser in [5KB (min)](https://github.com/leeoniya/uDSV/tree/main/dist/uDSV.iife.min.js) _(MIT Licensed)_

---
### Introduction

μDSV is a [faster](#performance) JS library for parsing well-formed CSV strings, either at once from memory or incrementally from disk or network.
It is mostly [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180)-compliant, with support for quoted values containing commas, escaped quotes, and line breaks¹.
The aim of this project is to handle the 99.5% use-case without adding complexity and performance trade-offs to support the remaining 0.5%.

¹ Line breaks (`\n`,`\r`,`\r\n`) within quoted values must match the row separator.

---
### Features

What does μDSV pack into 5KB?

- [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180)-compliant
- Customizable delimiters for rows and columns, with auto-detection
- Header skipping and column renaming
- Schema inference and value typing: `string`, `number`, `boolean`, `date`, `json`
- Defined handling of `''`, `'null'`, `'NaN'`
- Incremental or full parsing, with optional accumulation
- Multiple outputs: arrays (tuples), objects, nested objects, columnar arrays

Of course, _most_ of these are [table stakes](https://en.wikipedia.org/wiki/Table_stakes#Other_uses) for CSV parsers :)

---
### Performance

Is it Lightning Fast™ or Blazing Fast™?

No, those are too slow!

μDSV has [Ludicrous Speed™](https://www.youtube.com/watch?v=ygE01sOhzz0)

It's impossible to communicate the necessary nuance in a single statement, but on my Ryzen 7 ThinkPad with Linux v6.4.11/NodeJS v20.5.1, I see 1x-5x single threaded performance improvements relative to [Papa Parse](https://www.papaparse.com/). I use Papa Parse as a reference not because it's the fastest (spoiler: it isn't), but due to its [massive popularity](https://github.com/search?q=csv+parser&type=repositories&s=stars&o=desc), battle-testedness, and [some external validation](https://leanylabs.com/blog/js-csv-parsers-benchmarks/) of its own performance claims. μDSV is _also_ faster than the fastest existing libraries in all benchmarks.

For the full benchmark writeup + runnable source of 20+ tested CSV parsers, multiple real-world datasets, parsing parity commentary, and Bun.js, head over to [/bench](/bench)...and don't forget your coffee!

---
### Installation

---
### Basic Usage

```js
import { inferSchema, initParser } from 'udsv';

let csvStr = 'a,b,c\n1,2,3\n4,5,6';

let schema = inferSchema(csvStr);
let parser = initParser(schema);

// fastest/native format
let stringArrs = parser.stringArrs(csvStr); // [ ['1','2','3'], ['4','5','6'] ]

// typed formats (internally converted from native)
let typedArrs  = parser.typedArrs(csvStr);  // [ [1, 2, 3], [4, 5, 6] ]
let typedObjs  = parser.typedObjs(csvStr);  // [ {a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6} ]
let typedCols  = parser.typedCols(csvStr);  // [ [1, 4], [2, 5], [3, 6] ]
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

---
### Incremental / Streaming

μDSV has no inherent knowledge of streams.
Instead, it exposes a generic incremental parsing API to which you can pass sequential chunks.
These chunks can be come from various sources, such as a [Web Stream](https://css-tricks.com/web-streams-everywhere-and-fetch-for-node-js/) or [Node stream](https://nodejs.org/api/stream.html) via `fetch()` or `fs`, a [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), etc.

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
  result = p.end();
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
This may not be something you want (or need), for example with huge datasets where you're looking to get the sum of a single column, or want to filter only a small subset of rows.
To bypass this auto-accumulation behavior, simply pass your own handler as the third argument to `parser.chunk()`:

```js
// ...same as above

let sum = 0;

let reducer = (rows) => {
  for (let i = 0; i < rows.length; i++) {
    sum += rows[i][3]; // sum fourth column
  }
};

for await (const strChunk of textStream) {
  parser ??= initParser(inferSchema(strChunk));
  parser.chunk(strChunk, parser.typedArrs, reducer); // typedArrs + reducer
}

parser.end();
```

---
### TODO?

- trim whitespace in values (quoted and unquoted)
- omit empty rows