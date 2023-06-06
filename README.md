## 𝌠 μCSV

A modern, [fast](#performance), [~2 KB min](https://github.com/leeoniya/uCSV/tree/master/dist/uCSV.iife.min.js) CSV parser _(MIT Licensed)_

---
### Introduction

μCSV is a modern, [fast](#performance) JS library for parsing well-formed CSV files with either a synchronous or async/incremental (WIP) API.
It is mostly [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180)-compliant, with support for quoted values containing commas, escaped quotes, and line breaks¹.
The aim of this project is to handle the 99.5% use-case without adding complexity and performance trade-offs to support the remaining 0.5%.

¹ Line breaks (`\n`,`\r`,`\r\n`) within quoted values must match the row separator.

---
### Features

- 0 dependencies

---
### TODO (pre 1.0)

- async/incremental API for streaming with [Web Streams](https://css-tricks.com/web-streams-everywhere-and-fetch-for-node-js/) from `fetch()` and `fs`
- dedicated header (right now it's just parsed as a row)
- explicit schema (skip header)
- column type guessing/coercion
- output as objects, as columns, or as row tuples (current)
- options for what to do with empty strings (nulls? zeros?)
- trim whitespace in values (quoted and unquoted)
- omit empty rows

---
### Documentation

---
### Performance

The synchronous API is currently 2-3x faster than [Papa Parse](https://www.papaparse.com/)