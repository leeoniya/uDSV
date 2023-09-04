## Benchmarks

Seemingly every JS lib on Earth claims to have Blazing or Lightning Fast performance.

Fortunately, we don't have to rely on bench-marketing or 2017-era proclamations.
["Trust, but verify"](https://en.wikipedia.org/wiki/Trust,_but_verify) ;)

---
### Environment

<table>
  <tr>
    <th>Date</th>
    <td>2023-09</td>
  </tr>
  <tr>
    <th>Hardware</th>
    <td>
      CPU: <a href="https://www.amd.com/en/products/apu/amd-ryzen-7-pro-5850u">Ryzen 7 PRO 5850U</a> (1.9GHz, 7nm, 15W TDP)<br>
      RAM: 48GB<br>
      SSD: Samsung SSD 980 PRO 1TB (NVMe)<br>
    </td>
  </tr>
  <tr>
    <th>OS</th>
    <td>EndeavourOS (Arch Linux)<br>v6.4.11-arch2-1 x86_64</td>
  </tr>
  <tr>
    <th>NodeJS</th>
    <td>v20.5.1</td>
  </tr>
</table>

---
### Synthetic Datasets

The goal of this section is to give all parsers some simple synthetic datasets as a "peak performance" litmus test -- one without malformed data or delimiters within quotes.
Parsing here is from CSV strings loaded into memory (no file streaming) and the output is string values, avoiding any additional overhead of conversion to numbers, booleans, dates, etc.
While the usefulness of to-string parsing is limited to rendering rather than data processing, every token starts life as a string, so this is a good baseline.

We won't waste time on small datasets -- they're uninteresting.
To create meaningful GC/memory pressure, but without hitting Node's default 2GB limit, [we'll create](./bench/litmus_gen.cjs) three files with 20 columns x 10,000 rows.

**litmus_strings.csv**:

```csv
GtQ56taEqPynZE,wEAh,f5z,D1VVdO Np,WaFyN1Id8KDz,gVAlB5sRJs,cZjEklz7XcVE AK,oO46 fUXJi2QrUE,EsulmPCrEuVg97w,kUCRJ8RTo zDb,zYRwvEvRh3W,aGUntTXMf1,anh,pSoE516Q1g1Uc,hcxDfkqqRkI,IMDAN8Vr2RR2j,0ieUio5mjOx1NAZ,BbxKs0j2Zo,3mPOw8xR9,cbMJsnK
HCbe,029,PP1kw,igSUIHib6H3t,Pd98sXAUBj,Yut YJYk8aT4rhf,hxuo a2GHn45,88umhQYZQNd,gGDVF,fdDXRU7A,HQZ ,dPsxUFPaggqObue,PVXC7,2NI,9ak83UwObk,QohttaOxq,U SfWqpiDJLv,x5LA2EnN8,qduPA2y,xnP2vcSm5E
m 2tn5AF,ywO,tecaOIw6K1XLXf,osxLRmM0A3Eo,1EQLjeb5,e2 rfHd,eevJKj6AIVQhxte,yfI4iPGY,RXmanBadY,4Ev,g7HNv85Ng,vzncmimdX8t Hw1,4AxN07,WOOgygjd6ZW4pM,Bh4W3t43,eY CbkjgLlRZ,Z3brV,ISbn8cm,Gk8BZ5,aCYm
1ng84W6b0uZWh5s,0Drg6JKS,KjiKgA0a,JhPJ9,1oC2kSJgJ11m1,yIyn509bu2 w7I,lxVv1EsDmRSE7Tc,NA2nUS,DFUmeUY,UafqgUV,XCOmuBi43J,pVVPtFVhlHN,OkPbn8,nYk07P,uqK44MnKxROlHS,IYcAKLd,81x0,IS27VO,1ByRjQ3CbB3r,MwhoE
sUo,2lkn,HN52tnJL6C,ac6DLKMrd,MTBD8YWPn,vaia7aAIib,Cc9OzC7988GOY5,WyLIT1ExQ6Tw31,eqFmXyitt8lI,8Uc0FvDS,iCAXDAnrP,AywvZUAs, JILDeiNihD8,p65yWvtcL2e, JUh9F0BPQiN2,jBMStvPRSel,4wi7LTb3,ROk0PR,4UBO,bEaP
34fX8f,dsn,fCXtOP9UGtKWo,Eb7WdTT4tZlQG,6UF6dSLM3ObvPlc,eZ5VDR9koO,JBk,Si7st,MlF,MiQDGuXgpHQzja,BvyRxI5x5VImVd,bAFDmAXnLt,F 1V8rfgxW,SUmGlk,Yl09,g6ZxtEXt,3Vpv,27hf,XumxnyVmN,PktPl
IO9MyUIE4EtuC,XgIzj,WZMRg7,wvyC4exwl,dTQuZFuViN53,2OnH,XmxK0KG,89Snk,lNn7KAZg0,2zK,zjsBlJ5Mk,Cqm Gg,mKYq,IXKQiNa74kRf,4uRTZwVjnY5ydPP,Dku,sbQFpzv1 I,ON0ZB8,M86F3AnBoYTRqBi,4G1MOMC
```

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_strings.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                               │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 70 MiB baseline (MiB) │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ String.split()         │ 1.49M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 284 │ ░░░░░ 43.1                      │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ uDSV                   │ 1.33M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 254      │ ░░░░░ 45.1                      │ string │ [["m 2tn5AF","ywO","tecaOIw6K1XLXf","osxLRmM0A3Eo" │
│ but-csv                │ 932K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 177                     │ ░░░░░░ 52.1                     │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv-simple-parser      │ 826K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 157                         │ ░░░░░░ 53.8                     │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ PapaParse              │ 651K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 124                               │ ░░░░░░░░░░░░░░░░ 146            │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ ACsv                   │ 643K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 123                                │ ░░░░░░░░░░░░░░░░ 147            │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ d3-dsv                 │ 627K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 119                                │ ░░░░░░░░░░░░░░░░ 149            │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv-rex                │ 557K   │ ░░░░░░░░░░░░░░░░░░░░░ 106                                   │ ░░░░░░░░░░░░░░░░░░ 170          │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ node-csvtojson         │ 422K   │ ░░░░░░░░░░░░░░░░ 80.4                                       │ ░░░░░░░░░░░░░░░░░░░ 182         │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ comma-separated-values │ 342K   │ ░░░░░░░░░░░░░ 65.3                                          │ ░░░░░░░░░░░░░░░░░░░░ 186        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ achilles-csv-parser    │ 302K   │ ░░░░░░░░░░░░ 57.6                                           │ ░░░░░░░░░░░░░░░░░░░░░░ 204      │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ SheetJS                │ 274K   │ ░░░░░░░░░░░ 52.2                                            │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 255 │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ @vanillaes/csv         │ 252K   │ ░░░░░░░░░░ 47.9                                             │ ░░░░░░░░░░░░░░░░░ 156           │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv-js                 │ 243K   │ ░░░░░░░░░ 46.3                                              │ ░░░░░░░░░░░░░░░░░░░░░ 196       │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ CSVtoJSON              │ 242K   │ ░░░░░░░░░ 46.1                                              │ ░░░░░░░░░░░░░░░░░░░░░░ 208      │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ @gregoranders/csv      │ 218K   │ ░░░░░░░░░ 41.5                                              │ ░░░░░░░░░░░░░░░░░░░░░ 194       │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv42                  │ 206K   │ ░░░░░░░░ 39.2                                               │ ░░░░░░░░░░░░░░░░░░░░░░ 211      │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ dekkai                 │ 191K   │ ░░░░░░░░ 36.5                                               │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 236   │ string │ [["m 2tn5AF","ywO","tecaOIw6K1XLXf","osxLRmM0A3Eo" │
│ csv-parser (neat-csv)  │ 177K   │ ░░░░░░░ 33.8                                                │ ░░░░░░░░░░░░░░░░░░░░ 185        │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-parse/sync         │ 121K   │ ░░░░░ 23                                                    │ ░░░░░░░░░░░░░ 121               │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ jquery-csv             │ 102K   │ ░░░░ 19.4                                                   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 261 │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ @fast-csv/parse        │ 78.9K  │ ░░░ 15                                                      │ ░░░░░░░░░░░░░░░░░░░ 174         │ string │ [{"GtQ56taEqPynZE0":"m 2tn5AF","wEAh1":"ywO","f5z2 │
│ utils-dsv-base-parse   │ 60.5K  │ ░░░ 11.5                                                    │ ░░░░░░░░░░░░ 112                │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ json-2-csv             │ 25.3K  │ ░ 4.82                                                      │ ░░░░░░░░░░░░░░░░ 146            │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

**litmus_ints.csv**:

```csv
zYs0DQRw06,E5mPdSri,Cku78,zLczDs,E5LUK4F 9BVo6B,HQPxv,FrBPxQ,06SOz,OLHX100,yjV8,3qLy,2rFthiPxsv,HEK85ebc3d2N4,BmKq,Q6gM,u5j,rP5K,ig5AI7ahLQV,7pHz9nMe1beBgt,oUnkBD
-8399,-5705,-5076,8780,8650,-55,7413,-1017,-958,-1898,-8616,-7101,-4804,-9040,-2021,-941,-123,-908,991,6120
6287,-60,7062,-3411,4613,-5840,209,5279,6342,3449,-2086,8958,8804,-2481,-8907,4886,1176,9852,3982,598
-1569,-1789,3670,-5489,4854,-8895,-7881,7532,4447,4722,-1872,-6194,-231,-3289,-6423,-7955,-971,5340,-5151,7831
7844,-9001,7369,-3476,-5166,-5033,7343,1943,9652,2846,8254,9169,5346,883,-4415,-9912,7947,3537,-6250,3020
-5205,5354,-8457,2277,-4508,-5735,2683,9630,-8114,5846,-1841,3216,-2016,-524,7711,-9511,2333,-548,-3192,-8615
3769,-8549,2816,-8398,7926,-5584,3378,-7553,8752,9940,-2517,-4928,2843,8994,4602,1816,7616,1308,7163,8847
```

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_ints.csv (1 MB, 20 cols x 10K rows)                                                                                                                                                    │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 68 MiB baseline (MiB) │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 2.41M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 248 │ ░░░░ 34.5                       │ string │ [["6287","-60","7062","-3411","4613","-5840","209" │
│ String.split()         │ 1.6M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 164                   │ ░░░░░ 37.8                      │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-simple-parser      │ 1.59M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 163                   │ ░░░░░ 42.1                      │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ d3-dsv                 │ 1.31M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 134                          │ ░░░░░░░ 58                      │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ but-csv                │ 981K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 101                                 │ ░░░░░░ 48.8                     │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ PapaParse              │ 727K   │ ░░░░░░░░░░░░░░░░░ 74.8                                      │ ░░░░░░░░░░░░░░ 128              │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ ACsv                   │ 717K   │ ░░░░░░░░░░░░░░░░░ 73.8                                      │ ░░░░░░░░░░░░░░░░ 146            │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-rex                │ 617K   │ ░░░░░░░░░░░░░░░ 63.5                                        │ ░░░░░░░░░░░░░░░░░░ 162          │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ @gregoranders/csv      │ 555K   │ ░░░░░░░░░░░░░ 57.1                                          │ ░░░░░░░░ 73.4                   │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ node-csvtojson         │ 517K   │ ░░░░░░░░░░░░ 53.2                                           │ ░░░░░░░░░░░░░░░░ 150            │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ achilles-csv-parser    │ 508K   │ ░░░░░░░░░░░░ 52.2                                           │ ░░░░░░░░░░░░░░░░░░ 162          │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ csv-js                 │ 498K   │ ░░░░░░░░░░░░ 51.2                                           │ ░░░░░░░░░░░░░░░░░░ 164          │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ comma-separated-values │ 412K   │ ░░░░░░░░░░ 42.4                                             │ ░░░░░░░░░░░░░░░░░░ 167          │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv42                  │ 338K   │ ░░░░░░░░ 34.7                                               │ ░░░░░░░░░░░░░░░░░ 151           │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ dekkai                 │ 315K   │ ░░░░░░░░ 32.4                                               │ ░░░░░░░░░░░░░░░░░ 157           │ string │ [["6287","-60","7062","-3411","4613","-5840","209" │
│ SheetJS                │ 304K   │ ░░░░░░░ 31.3                                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 245 │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ CSVtoJSON              │ 280K   │ ░░░░░░░ 28.8                                                │ ░░░░░░░░░░░░░░░░░░░░░░ 198      │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ @vanillaes/csv         │ 264K   │ ░░░░░░░ 27.2                                                │ ░░░░░░░░░░░░░░░░ 145            │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-parser (neat-csv)  │ 207K   │ ░░░░░ 21.2                                                  │ ░░░░░░░░░░░░░░░░░░░░ 186        │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ csv-parse/sync         │ 157K   │ ░░░░ 16.1                                                   │ ░░░░░░░░░░░░░░░ 134             │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ jquery-csv             │ 104K   │ ░░░ 10.7                                                    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 253 │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ utils-dsv-base-parse   │ 100K   │ ░░░ 10.3                                                    │ ░░░░░░░░░░░░░ 116               │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ @fast-csv/parse        │ 95.8K  │ ░░░ 9.85                                                    │ ░░░░░░░░░░░░░░░░░ 152           │ string │ [{"zYs0DQRw060":"6287","E5mPdSri1":"-60","Cku782": │
│ json-2-csv             │ 25.9K  │ ░ 2.67                                                      │ ░░░░░░░░░░░░░░ 122              │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

**litmus_quoted.csv**:

```csv
"DRadpUJ9 TCnUO0","92ZnE3J8IME4Ru","OG3z","EnrBwtb2xaDal g","3MwFXz8qaOTuQ5u","GyBHQsg","Frih5vgpsL","B11Kytl2YDc","0YEtlrydSd","yrO9iA1","eCmAcmYyGeNR24m","K1mFOGrMHYWUgSy","5xng15kApkp0pRB","WolN","TwsWWAy9rIpRbC","ZPJlo5jSzXc3c","4TRd","b9hy8Q","d7dpTAxOcE vr9b","MReW4wj"
"UPwF","5742","TWB88","-2020","ih2q9F5ijs","-8640","LE9i","3910","46XwuaEt0Sm","7431","CNyC raS","-4781","DPtF0vraiIUaDLc","-8628","4d th0 T","-7073","6mgEpy2uAKl","9896","f5MBvA7Euktx","2536"
"JitoL7gXbT","-3677"," NoqmZHgaSk14","1997","mtWFJB8","-932","Cd diKYJ4dICC","-4396","2gKgLXlI","3688","MGWSOfb9D47XO","-8634","37tz ","4555"," A8N","1450","OP7DG3f1W","8393","r6zQlRBnSXK25","8923"
"fEVMdY","-6699","P3gb","-8679","4K44LDhxWWt8v","-6500","TYCk1yRyh0ll","-1658"," XWsqj6ufUFW","1011","FTBEG","5186","tdjWe","-9921","g1jas8bkx4","-1551","JQe1B26U","-197","QkWIkVFY","-9050"
"SgU","8624","IycKYdvQ","191","OWfSmYlXpS","-1967","vEBT","-759","eRD78x7SnRQ","-4627","sASxM4tCjoED","-5443","f28khBJ6j","5170","G Av2l","-5249","ys8r6NMnlehWZ3n","2157","tMd1O6ddPJs","-3359"
"ZvFhsgYEVnsclM7","9355","icU8 7MQ","3713","zWXkXA","-242","oNYbYAtFV5UwbtG","8820","kRiNuVf","-1120","5ymOX0p ","9929","GffbQEkpLVA","286","0HWj","-1941","TLVNbPP1GdK","-6322","ksN4pZ4p8Zl","-3656"
"nTwqHDjzYl","5854","JkKFANbWRI","-4706","HKDJyYG3BsRADP","-4263","P5bGApH8C6pfjpq","5934","aBdJUPt5QhNe","-3924","y9Bve","-6668","kpRK","-3837","nhQaogmpKFvD2XZ","-6600"," 6N8gMAY1j","5925","VN8Kj","-4564"
```

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_quoted.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                                │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 74 MiB baseline (MiB) │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.62M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 301 │ ░░░ 45.1                        │ string │ [["JitoL7gXbT","-3677"," NoqmZHgaSk14","1997","mtW │
│ csv-simple-parser      │ 1.23M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 228              │ ░░░ 43.8                        │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ but-csv                │ 895K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 166                         │ ░░░░ 58.3                       │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ achilles-csv-parser    │ 395K   │ ░░░░░░░░░░░░░░ 73.1                                         │ ░░░░░░ 81.8                     │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ d3-dsv                 │ 370K   │ ░░░░░░░░░░░░░ 68.5                                          │ ░░░░░░░░░░░ 156                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-rex                │ 363K   │ ░░░░░░░░░░░░░ 67.1                                          │ ░░░░░░░░░░░ 164                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-js                 │ 287K   │ ░░░░░░░░░░ 53.1                                             │ ░░░░░░░░░░░░ 176                │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ PapaParse              │ 282K   │ ░░░░░░░░░░ 52.1                                             │ ░░░░░░░░░░░░ 170                │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ comma-separated-values │ 242K   │ ░░░░░░░░░ 44.9                                              │ ░░░░░░░░░░░ 155                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ dekkai                 │ 232K   │ ░░░░░░░░ 43                                                 │ ░░░░░░░░░░░░░░ 212              │ string │ [["JitoL7gXbT","-3677"," NoqmZHgaSk14","1997","mtW │
│ SheetJS                │ 212K   │ ░░░░░░░░ 39.2                                               │ ░░░░░░░░░░░░░░░░ 229            │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ ACsv                   │ 208K   │ ░░░░░░░░ 38.6                                               │ ░░░░░░░░░░ 150                  │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @vanillaes/csv         │ 208K   │ ░░░░░░░░ 38.5                                               │ ░░░░░░░░░ 133                   │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv42                  │ 201K   │ ░░░░░░░ 37.1                                                │ ░░░░░░░░░░░░░ 187               │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ node-csvtojson         │ 189K   │ ░░░░░░░ 35                                                  │ ░░░░░░░░░░░ 161                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ CSVtoJSON              │ 178K   │ ░░░░░░░ 33                                                  │ ░░░░░░░░░░░░░ 197               │ string │ [{"\"DRadpUJ9TCnUO0\"":"JitoL7gXbT","\"92ZnE3J8IME │
│ csv-parser (neat-csv)  │ 162K   │ ░░░░░░ 30                                                   │ ░░░░░░░░░░░░ 180                │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ utils-dsv-base-parse   │ 120K   │ ░░░░░ 22.2                                                  │ ░░░░░░░░░ 132                   │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @gregoranders/csv      │ 117K   │ ░░░░ 21.6                                                   │ ░░░░░░░░░░ 143                  │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-parse/sync         │ 108K   │ ░░░░ 20.1                                                   │ ░░░░░░░░░ 134                   │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @fast-csv/parse        │ 74.2K  │ ░░░ 13.7                                                    │ ░░░░░░░░░░░░░░░ 228             │ string │ [{"DRadpUJ9 TCnUO00":"JitoL7gXbT","92ZnE3J8IME4Ru1 │
│ jquery-csv             │ 57.9K  │ ░░ 10.7                                                     │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 411 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ json-2-csv             │ 23.5K  │ ░ 4.35                                                      │ ░░░░░░░░░░░░ 170                │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Notes:

- Bizzarely, the throughput of many parsers (including `String.split()`!) drops off a cliff with integer strings, even though we're not actually converting anything to integers, the memory usage is unchanged, and the dataset is 50% smaller.
- A significant portion exhibits 40%-60% performance deterioration when quotes are introduced.
- Despite enabling `.supportQuotedField(true)`, CSVtoJSON does not properly remove the wrapping quotes from column names.
- Some libs require non-default settings here to extract the most performance (e.g. omit value typing, output tuples instead of objects)
- `json-2-csv` is so irredeemably slow that it will be excluded from additional benchmarks to save my CPU from a premature meltdown.


#### Dekkai and SheetJS

Before moving on we need to talk about Dekkai and SheetJS.

These two libs have "native" formats that they parse to, and expose additional APIs to convert this format to plain JS arrays of records (as tuples or objects), which is the native format of all other libs.
These APIs are used by benchmark in order to compare apples to apples, but this imposes some performace cost which we'll dissect here.

**SheetJS** is pretty straightforward with a predictable impact due to having a JS-native format that is directly convertible via `XLSX.utils.sheet_to_json(sheet);`:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_strings.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                          │
├──────────────────┬────────┬──────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name             │ Rows/s │ Throughput (MiB/s)                                           │ RSS above 68 MiB baseline (MiB) │ Types  │ Sample                                             │
├──────────────────┼────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ SheetJS (native) │ 337K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 64.3 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 273  │ s      │ [[{"t":"s","v":"HCbe"},{"t":"s","v":"029"},{"t":"s │
│ SheetJS          │ 271K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 51.6           │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 286 │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
└──────────────────┴────────┴──────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_ints.csv (1 MB, 20 cols x 10K rows)                                                                                                                                             │
├──────────────────┬────────┬────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name             │ Rows/s │ Throughput (MiB/s)                                         │ RSS above 68 MiB baseline (MiB) │ Types  │ Sample                                             │
├──────────────────┼────────┼────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ SheetJS (native) │ 399K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 41 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 265 │ s      │ [[{"t":"s","v":"-8399"},{"t":"s","v":"-5705"},{"t" │
│ SheetJS          │ 303K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 31.1            │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 247  │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
└──────────────────┴────────┴────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_quoted.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                           │
├──────────────────┬────────┬──────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name             │ Rows/s │ Throughput (MiB/s)                                           │ RSS above 74 MiB baseline (MiB) │ Types  │ Sample                                             │
├──────────────────┼────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ SheetJS (native) │ 234K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 43.3 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 267 │ s      │ [[{"t":"s","v":"UPwF"},{"t":"s","v":"5742"},{"t":" │
│ SheetJS          │ 207K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 38.4       │ ░░░░░░░░░░░░░░░░░░░░░░░░ 230    │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
└──────────────────┴────────┴──────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

If you are using SheetJS to load CSV files and continue to use its API to access the parsed data (instead of native JS methods), then this slowdown _may_ not affect you.

The situation with **Dekkai** is a more nuanced than [its own benchmarks](https://github.com/darionco/dekkai#benchmark) would have you believe.

How Dekkai works is by parsing chunks of data in worker thread(s) using WASM.
What I assume it does is simply stores arrays of offsets where it found row and column delimiters in each chunk.
By itself, this process can be quite fast.

```js
// native
let table = await dekkai.tableFromLocalFile(file);
```

So, what's the catch?

Well, when you actually need to _touch_ the data, you pay a lot for that privilege.

```js
// native + row-access
let table = await dekkai.tableFromLocalFile(file);

await table.forEach(row => {
  // do nothing
});
```

```js
// native + row-access + value-access
let table = await dekkai.tableFromLocalFile(file);

await table.forEach(row => {
  row.forEach(val => {
    // do nothing
  });
});
```

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_quoted.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                                           │
├───────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────────┬────────────────────────────────────────────────────┤
│ Name                          │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 74 MiB baseline (MiB) │ Types      │ Sample                                             │
├───────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────────┼────────────────────────────────────────────────────┤
│ uDSV                          │ 1.62M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 300 │ ░░░░░░ 46                       │ string     │ [["JitoL7gXbT","-3677"," NoqmZHgaSk14","1997","mtW │
│ dekkai (native)               │ 1.14M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 212                 │ ░░░░░░░░░░░░░░ 106              │ int,string │ ["<native object>"]                                │
│ dekkai (native, row access)   │ 524K   │ ░░░░░░░░░░░░░░░░░░ 97                                       │ ░░░░░░░░░░░░░░░░ 118            │ int,string │ ["<native object>"]                                │
│ dekkai (native, value access) │ 303K   │ ░░░░░░░░░░░ 56                                              │ ░░░░░░░░░░░░░░░░░ 130           │ int,string │ ["<native object>"]                                │
│ PapaParse                     │ 279K   │ ░░░░░░░░░░ 51.6                                             │ ░░░░░░░░░░░░░░░░░░░░░░░ 171     │ string     │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ dekkai                        │ 232K   │ ░░░░░░░░ 43                                                 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 209 │ string     │ [["JitoL7gXbT","-3677"," NoqmZHgaSk14","1997","mtW │
└───────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────────┴────────────────────────────────────────────────────┘
```

If we want to compare apples to apples, we have to look at the bottom Dekkai entry, where we incur the cost of decoding and allocating every parsed value into native JS types, as they are in all other parsers.

[Dekkai's benchmark](https://github.com/darionco/dekkai#benchmark) shows it being 5x faster than Papa Parse when streaming and summing a single integer column of a 3.6M row dataset, but [I haven't found evidence](https://github.com/leeoniya/uDSV/tree/main/bench#non-retained) of this either.

Anyways...the remainder of this benchmark will use the Dekkai and SheetJS code which produces the same output as the other parsers.
If you'd like to poke around the other variants, they're available in this repo.

---
### Real Datasets

Synthetic datsets can be too uniform to extrapolate actual performance in production environments.
Testing with real data can surface inefficiencies in code paths that were either bypassed or infrequently executed.


**Sensors Time Series**

https://github.com/Schlumberger/hackathon/blob/master/backend/dataset/data-large.csv<br>

- 36 MB
- 37 cols x 130K rows
- 3 header rows, empty first col heading
- purely numeric, unquoted

```csv
,ESP01,ESP01,ESP01,ESP01,ESP01,ESP01,ESP02,ESP02,ESP02,ESP02,ESP02,ESP02,ESP03,ESP03,ESP03,ESP03,ESP03,ESP03,IC01,IC01,IC01,IC01,IC01,IC01,IC01,IC01,IC01,IC02,IC02,IC02,IC02,IC02,IC02,IC02,IC02,IC02
time,DISCHARGE_PRESSURE,INTAKE_PRESSURE,INTAKE_TEMPERATURE,MOTOR_TEMP,VSDFREQOUT,VSDMOTAMPS,DISCHARGE_PRESSURE,INTAKE_PRESSURE,INTAKE_TEMPERATURE,MOTOR_TEMP,VSDFREQOUT,VSDMOTAMPS,DISCHARGE_PRESSURE,INTAKE_PRESSURE,INTAKE_TEMPERATURE,MOTOR_TEMP,VSDFREQOUT,VSDMOTAMPS,CHOKE_POSITION,PRESSURE1,PRESSURE2,TEMPERATURE1,TEMPERATURE2,WATER_CUT,LIQUID_RATE,WATER_RATE,OIL_RATE,CHOKE_POSITION,PRESSURE1,PRESSURE2,TEMPERATURE1,TEMPERATURE2,WATER_CUT,LIQUID_RATE,WATER_RATE,OIL_RATE
s,psia,psia,K,K,Hz,A,psia,psia,K,K,Hz,A,psia,psia,K,K,Hz,A,%,psia,psia,degF,degF,%,bbl/d,bbl/d,bbl/d,%,psia,psia,degF,degF,%,bbl/d,bbl/d,bbl/d
1370044800,4819440.062,4645092.555,382.8436706,383.0596235,0,2,13935372.4,4230328.642,358.828813,375.6540512,45.01385132,191.3370908,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,192,197,0,0,0,0,0,2489,2485,196,193,0.2,0,0,0
1370045100,4869044.81,4630605.41,382.8270592,382.9445269,0,2,13064140.62,4141697.565,359.4253646,379.0754459,43.99295035,195.107323,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,194,196,0,0,0,0,0,2489,2485,198,196,0.2,0,0,0
1370045400,4824754.919,4684340.8,382.8626879,382.9402203,0,2,14110557.56,4430323.167,357.2496335,374.2655201,44.16140698,189.5892357,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,197,192,0,0,0,0,0,2489,2485,195,193,0.5,0,0,0
1370045700,4849769.046,4697244.12,382.862196,382.9384828,0,2,12781664.74,3917750.211,359.2356498,378.5094705,45.02241074,199.5982215,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,191,196,0,0,0,0,0,2489,2485,196,198,0.8,0,0,0
1370046000,4838199.888,4705090.494,382.855058,382.9485043,0,2,15252131.42,4355878.258,356.3494983,373.59845,44.04228406,209.9629697,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,197,191,0,0,0,0,0,2489,2485,195,196,0.3,0,0,0
1370046300,4874408.563,4669871.883,382.8602124,382.9429073,0,2,13265647.71,3927390.758,358.2028666,375.2891046,44.01957626,195.5540406,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,198,192,0,0,0,0,0,2489,2485,193,194,0.6,0,0,0
```

For bench purposes, we'll simplify to a single header row with unique names, since some libs have trouble with multi-row headers and empty or duplicate column names:

```csv
A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI,AJ,AK
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ data-large2.csv (36 MB, 37 cols x 130K rows)                                                                                                                                                    │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬───────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 282 MiB baseline (MiB)  │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 525K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 145 │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.69K     │ string │ [["1370045100","4869044.81","4630605.41","382.8270 │
│ String.split()         │ 446K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 124         │ ░░░░░░░░░░░░░░░░░░░░░░░░ 1.76K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ ACsv                   │ 387K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 107               │ ░░░░░░░░░░░░░░░░░░░░░░░░ 1.75K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ PapaParse              │ 385K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 107               │ ░░░░░░░░░░░░░░░░░░░░░░░░ 1.72K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-simple-parser      │ 373K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 104                │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.68K     │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ d3-dsv                 │ 372K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 103                 │ ░░░░░░░░░░░░░░░░░░░░░░░░ 1.75K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ but-csv                │ 365K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 101                 │ ░░░░░░░░░░░░░░░░░░░░░░░░ 1.69K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-rex                │ 334K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 92.7                   │ ░░░░░░░░░░░░░░░░░░░░░░ 1.57K      │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ comma-separated-values │ 228K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 63.3                               │ ░░░░░░░░░░░░░░ 1.01K              │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-js                 │ 185K   │ ░░░░░░░░░░░░░░░░░░░░ 51.3                                   │ ░░░░░░░░░░░░░░░ 1.05K             │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv42                  │ 178K   │ ░░░░░░░░░░░░░░░░░░░ 49.4                                    │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.65K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ achilles-csv-parser    │ 173K   │ ░░░░░░░░░░░░░░░░░░░ 48                                      │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.66K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ SheetJS                │ 157K   │ ░░░░░░░░░░░░░░░░░ 43.6                                      │ ░░░░░░░░░░░░░░░░░░░░░ 1.48K       │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ CSVtoJSON              │ 157K   │ ░░░░░░░░░░░░░░░░░ 43.4                                      │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.63K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ @gregoranders/csv      │ 151K   │ ░░░░░░░░░░░░░░░░ 41.7                                       │ ░░░░░░░░░░░░ 872                  │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ dekkai                 │ 146K   │ ░░░░░░░░░░░░░░░░ 40.5                                       │ ░░░░░░░░ 569                      │ string │ [["1370045100","4869044.81","4630605.41","382.8270 │
│ @vanillaes/csv         │ 143K   │ ░░░░░░░░░░░░░░░ 39.6                                        │ ░░░░░░░░░░░░ 871                  │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ node-csvtojson         │ 120K   │ ░░░░░░░░░░░░░ 33.2                                          │ ░░░░░░░░░░░░ 845                  │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-parser (neat-csv)  │ 109K   │ ░░░░░░░░░░░░ 30.1                                           │ ░░░░░░░░░░░░░░░ 1.07K             │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ csv-parse/sync         │ 70.9K  │ ░░░░░░░░ 19.7                                               │ ░░░░░░░░░ 594                     │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ jquery-csv             │ 44.5K  │ ░░░░░ 12.3                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.99K │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ @fast-csv/parse        │ 43.8K  │ ░░░░░ 12.1                                                  │ ░░░░░░░░░░░░ 839                  │ string │ [{"A0":"1370045100","B1":"4869044.81","C2":"463060 │
│ utils-dsv-base-parse   │ 38.2K  │ ░░░░░ 10.6                                                  │ ░░░░░ 336                         │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴───────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Notes:

- With this 36MB dataset, all the faster libs bump into the 2GB memory limit. With GC'd/JIT'ed runtimes, lower peak memory does not imply faster perf (as was the correlation in the synthetic runs).
- uDSV is not faster by the same huge margin over PapaParse as in the synthetic `litmus_ints.csv` case  where it was 251 MiB/s vs 74 MiB/s.


**USA ZIP Codes**

https://simplemaps.com/data/us-zips<br>
https://simplemaps.com/static/data/us-zips/1.82/basic/simplemaps_uszips_basicv1.82.zip<br>

- 6 MB
- 18 cols x 34K rows
- everything quoted
- strings, numbers, booleans, JSON (with escaped quotes)

```csv
"zip","lat","lng","city","state_id","state_name","zcta","parent_zcta","population","density","county_fips","county_name","county_weights","county_names_all","county_fips_all","imprecise","military","timezone"
"00601","18.18027","-66.75266","Adjuntas","PR","Puerto Rico","TRUE","","17126","102.6","72001","Adjuntas","{""72001"": 98.73, ""72141"": 1.27}","Adjuntas|Utuado","72001|72141","FALSE","FALSE","America/Puerto_Rico"
"00602","18.36075","-67.17541","Aguada","PR","Puerto Rico","TRUE","","37895","482.5","72003","Aguada","{""72003"": 100}","Aguada","72003","FALSE","FALSE","America/Puerto_Rico"
"00603","18.45744","-67.12225","Aguadilla","PR","Puerto Rico","TRUE","","49136","552.4","72005","Aguadilla","{""72005"": 99.76, ""72099"": 0.24}","Aguadilla|Moca","72005|72099","FALSE","FALSE","America/Puerto_Rico"
"00606","18.16585","-66.93716","Maricao","PR","Puerto Rico","TRUE","","5751","50.1","72093","Maricao","{""72093"": 82.26, ""72153"": 11.68, ""72121"": 6.06}","Maricao|Yauco|Sabana Grande","72093|72153|72121","FALSE","FALSE","America/Puerto_Rico"
"00610","18.2911","-67.12243","Anasco","PR","Puerto Rico","TRUE","","26153","272.1","72011","Añasco","{""72011"": 96.71, ""72099"": 2.81, ""72083"": 0.37, ""72003"": 0.11}","Añasco|Moca|Las Marías|Aguada","72011|72099|72083|72003","FALSE","FALSE","America/Puerto_Rico"
"00611","18.27698","-66.80688","Angeles","PR","Puerto Rico","TRUE","","1283","46.5","72141","Utuado","{""72141"": 100}","Utuado","72141","FALSE","FALSE","America/Puerto_Rico"
"00612","18.41283","-66.7051","Arecibo","PR","Puerto Rico","TRUE","","64090","325.0","72013","Arecibo","{""72013"": 98.86, ""72065"": 0.94, ""72017"": 0.2}","Arecibo|Hatillo|Barceloneta","72013|72065|72017","FALSE","FALSE","America/Puerto_Rico"
"00616","18.41878","-66.6679","Bajadero","PR","Puerto Rico","TRUE","","10186","361.3","72013","Arecibo","{""72013"": 100}","Arecibo","72013","FALSE","FALSE","America/Puerto_Rico"
"00617","18.44598","-66.56006","Barceloneta","PR","Puerto Rico","TRUE","","22803","479.7","72017","Barceloneta","{""72017"": 99.63, ""72054"": 0.37}","Barceloneta|Florida","72017|72054","FALSE","FALSE","America/Puerto_Rico"
"00622","17.98892","-67.1566","Boqueron","PR","Puerto Rico","TRUE","","7751","96.0","72023","Cabo Rojo","{""72023"": 100}","Cabo Rojo","72023","FALSE","FALSE","America/Puerto_Rico"
"00623","18.08429","-67.15336","Cabo Rojo","PR","Puerto Rico","TRUE","","39652","390.6","72023","Cabo Rojo","{""72023"": 100}","Cabo Rojo","72023","FALSE","FALSE","America/Puerto_Rico"
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                                                                                                                                           │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬───────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 120 MiB baseline (MiB)  │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 754K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 135 │ ░░░░░░░░ 375                      │ string │ [["00602","18.36075","-67.17541","Aguada","PR","Pu │
│ achilles-csv-parser    │ 474K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 84.7                    │ ░░░░░░░░ 354                      │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ d3-dsv                 │ 433K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 77.3                       │ ░░░░░░░░░ 420                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-rex                │ 361K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 64.4                            │ ░░░░░░░░ 388                      │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ PapaParse              │ 310K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 55.5                                │ ░░░░░░░░░ 393                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-js                 │ 296K   │ ░░░░░░░░░░░░░░░░░░░░░░ 52.8                                 │ ░░░░░░░░░░ 449                    │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv42                  │ 285K   │ ░░░░░░░░░░░░░░░░░░░░░ 50.9                                  │ ░░░░░░ 262                        │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ comma-separated-values │ 258K   │ ░░░░░░░░░░░░░░░░░░░ 46.1                                    │ ░░░░░░░░ 357                      │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ CSVtoJSON              │ 247K   │ ░░░░░░░░░░░░░░░░░░░ 44.2                                    │ ░░░░░░░░░ 432                     │ string │ [{"\"zip\"":"00602","\"lat\"":"18.36075","\"lng\"" │
│ csv-simple-parser      │ 245K   │ ░░░░░░░░░░░░░░░░░░ 43.8                                     │ ░░░░░░ 267                        │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ dekkai                 │ 244K   │ ░░░░░░░░░░░░░░░░░░ 43.6                                     │ ░░░░░░░░░░ 442                    │ string │ [["00602","18.36075","-67.17541","Aguada","PR","Pu │
│ csv-parser (neat-csv)  │ 229K   │ ░░░░░░░░░░░░░░░░░ 40.9                                      │ ░░░░░░ 282                        │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ ACsv                   │ 223K   │ ░░░░░░░░░░░░░░░░░ 39.8                                      │ ░░░░░░ 259                        │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ SheetJS                │ 207K   │ ░░░░░░░░░░░░░░░░ 36.9                                       │ ░░░░░░░░░░░░ 540                  │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ @vanillaes/csv         │ 199K   │ ░░░░░░░░░░░░░░░ 35.5                                        │ ░░░░░░░░ 366                      │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ node-csvtojson         │ 170K   │ ░░░░░░░░░░░░░ 30.4                                          │ ░░░░░░░ 315                       │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-parse/sync         │ 123K   │ ░░░░░░░░░ 22                                                │ ░░░░░░ 275                        │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ @fast-csv/parse        │ 80K    │ ░░░░░░ 14.3                                                 │ ░░░░░░░ 301                       │ string │ [{"zip0":"00602","lat1":"18.36075","lng2":"-67.175 │
│ jquery-csv             │ 55.1K  │ ░░░░░ 9.84                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.32K │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ but-csv                │ ---    │ Wrong row count! Expected: 33790, Actual: 1                 │ ---                               │ ---    │ ---                                                │
│ @gregoranders/csv      │ ---    │ Invalid CSV at 1:109                                        │ ---                               │ ---    │ ---                                                │
│ utils-dsv-base-parse   │ ---    │ unexpected error. Encountered an invalid record. Field 17 o │ ---                               │ ---    │ ---                                                │
│ json-2-csv             │ ---    │ Wrong row count! Expected: 33790, Actual: 0                 │ ---                               │ ---    │ ---                                                │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴───────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```


**House Price Index**

https://www.fhfa.gov/DataTools/Downloads/Pages/House-Price-Index-Datasets.aspx<br>
https://www.fhfa.gov/HPI_master.csv<br>

- 10 MB
- 10 cols x 120K rows
- only necessary things quoted
- sometimes empty last col
- strings, numbers

```csv
hpi_type,hpi_flavor,frequency,level,place_name,place_id,yr,period,index_nsa,index_sa
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,1,100.00,100.00
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,2,100.91,100.96
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,3,101.31,100.92
...
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2005,3,163.58,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2005,4,165.64,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2006,1,167.68,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2006,2,173.22,
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HPI_master.csv (10 MB, 10 cols x 120K rows)                                                                                                                                                     │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬───────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 149 MiB baseline (MiB)  │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.74M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 147 │ ░░░░░░░░░░░░░ 676                 │ string │ [["traditional","purchase-only","monthly","USA or  │
│ d3-dsv                 │ 1.38M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 116            │ ░░░░░░░░░ 472                     │ string │ [["traditional","purchase-only","monthly","USA or  │
│ PapaParse              │ 1.35M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 113             │ ░░░░░░░░░░░░ 623                  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ but-csv                │ 1.34M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 113             │ ░░░░░░░░░░ 507                    │ string │ [["traditional","purchase-only","monthly","USA or  │
│ ACsv                   │ 1.24M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 105                │ ░░░░░░░░░░░ 571                   │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-rex                │ 1.11M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 93.1                    │ ░░░░░░░░░░░ 562                   │ string │ [["traditional","purchase-only","monthly","USA or  │
│ achilles-csv-parser    │ 1.1M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 92.5                    │ ░░░░░░░░░░ 525                    │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv42                  │ 1.06M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 89.4                     │ ░░░░░░░░░░ 539                    │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ comma-separated-values │ 590K   │ ░░░░░░░░░░░░░░░░░░░ 49.6                                    │ ░░░░░░░░░░░ 574                   │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-simple-parser      │ 572K   │ ░░░░░░░░░░░░░░░░░░░ 48.1                                    │ ░░░░░░░░░░ 515                    │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-js                 │ 530K   │ ░░░░░░░░░░░░░░░░░ 44.6                                      │ ░░░░░░░░░░░░░ 680                 │ string │ [["traditional","purchase-only","monthly","USA or  │
│ SheetJS                │ 524K   │ ░░░░░░░░░░░░░░░░░ 44.1                                      │ ░░░░░░░░░░░░░░░░░ 891             │ string │ [["traditional","purchase-only","monthly","USA or  │
│ @vanillaes/csv         │ 484K   │ ░░░░░░░░░░░░░░░░ 40.6                                       │ ░░░░░░░░ 405                      │ string │ [["traditional","purchase-only","monthly","USA or  │
│ CSVtoJSON              │ 477K   │ ░░░░░░░░░░░░░░░░ 40.1                                       │ ░░░░░░░░░░░░░ 682                 │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-parser (neat-csv)  │ 433K   │ ░░░░░░░░░░░░░░ 36.4                                         │ ░░░░░░░░░ 442                     │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ dekkai                 │ 432K   │ ░░░░░░░░░░░░░░ 36.3                                         │ ░░░░░░░░░░ 542                    │ string │ [["traditional","purchase-only","monthly","USA or  │
│ @gregoranders/csv      │ 393K   │ ░░░░░░░░░░░░░ 33                                            │ ░░░░░░░░░░░ 581                   │ string │ [["traditional","purchase-only","monthly","USA or  │
│ node-csvtojson         │ 355K   │ ░░░░░░░░░░░░ 29.9                                           │ ░░░░░░░░░░░░░ 667                 │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-parse/sync         │ 243K   │ ░░░░░░░░ 20.4                                               │ ░░░░░░ 318                        │ string │ [["traditional","purchase-only","monthly","USA or  │
│ jquery-csv             │ 177K   │ ░░░░░░ 14.9                                                 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.47K │ string │ [["traditional","purchase-only","monthly","USA or  │
│ @fast-csv/parse        │ 169K   │ ░░░░░░ 14.2                                                 │ ░░░░░░░░ 426                      │ string │ [{"hpi_type0":"traditional","hpi_flavor1":"purchas │
│ utils-dsv-base-parse   │ 146K   │ ░░░░░ 12.3                                                  │ ░░░░ 190                          │ string │ [["traditional","purchase-only","monthly","USA or  │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴───────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```


**Earthquakes**

https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php<br>
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv<br>
https://github.com/mafintosh/csv-parser/blob/master/test/fixtures/large-dataset.csv<br>

- 1.1 MB
- 15 cols x 7.3K rows
- only necessary things quoted
- empty cols
- strings, numbers, dates

```csv
time,latitude,longitude,depth,mag,magType,nst,gap,dmin,rms,net,id,updated,place,type
2015-12-22T18:45:11.000Z,59.9988,-152.7191,100,3,ml,,,,0.54,ak,ak12293661,2015-12-22T19:09:29.736Z,"54km S of Redoubt Volcano, Alaska",earthquake
2015-12-22T18:38:34.000Z,62.9616,-148.7532,65.4,1.9,ml,,,,0.51,ak,ak12293651,2015-12-22T18:47:23.287Z,"48km SSE of Cantwell, Alaska",earthquake
2015-12-22T18:38:01.820Z,19.2129993,-155.4179993,33.79,2.56,ml,56,142,0.03113,0.21,hv,hv61132446,2015-12-22T18:44:13.729Z,"6km E of Pahala, Hawaii",earthquake
2015-12-22T18:38:00.000Z,63.7218,-147.083,56.8,2.4,ml,,,,0.95,ak,ak12293653,2015-12-22T18:54:45.265Z,"75km WSW of Delta Junction, Alaska",earthquake
2015-12-22T18:28:57.000Z,64.0769,-148.8226,14.2,2,ml,,,,0.8,ak,ak12293626,2015-12-22T18:40:06.324Z,"25km NNE of Healy, Alaska",earthquake
2015-12-22T18:25:40.000Z,61.4715,-150.7697,55,1.6,ml,,,,0.17,ak,ak12293627,2015-12-22T18:40:07.276Z,"43km W of Big Lake, Alaska",earthquake
2015-12-22T18:13:01.786Z,38.6879,-118.6035,7.8,1.6,ml,10,105.79,0.087,0.0799,nn,nn00523604,2015-12-22T18:26:07.654Z,"18km N of Hawthorne, Nevada",earthquake
2015-12-22T18:08:44.630Z,19.3326664,-155.1049957,4.52,1.92,md,39,152,0.05121,0.28,hv,hv61132431,2015-12-22T18:11:59.980Z,"17km SE of Volcano, Hawaii",earthquake
2015-12-22T18:04:36.240Z,19.4381676,-155.326004,1.12,2.05,ml,14,314,0.03707,0.33,hv,hv61132421,2015-12-22T18:10:19.220Z,"9km W of Volcano, Hawaii",earthquake
2015-12-22T17:47:04.720Z,36.0003319,-120.5598297,2.18,1.74,md,20,86,0.0209,0.06,nc,nc72570651,2015-12-22T17:48:42.120Z,"23km SW of Coalinga, California",earthquake
```

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ large-dataset.csv (1.1 MB, 15 cols x 7.3K rows)                                                                                                                                               │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 62 MiB baseline (MiB) │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 2.47M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 369 │ ░░░░░░ 43.4                     │ string │ [["2015-12-22T18:38:34.000Z","62.9616","-148.7532" │
│ but-csv                │ 1.6M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 240                    │ ░░░░░░ 41.5                     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ d3-dsv                 │ 1.52M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 227                      │ ░░░░░░ 47.3                     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ ACsv                   │ 1.42M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 212                        │ ░░░░░░ 42.5                     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ achilles-csv-parser    │ 946K   │ ░░░░░░░░░░░░░░░░░░░░░░ 141                                  │ ░░░░░░ 44.4                     │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ PapaParse              │ 876K   │ ░░░░░░░░░░░░░░░░░░░░ 131                                    │ ░░░░░░░░░░░░░░ 108              │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv42                  │ 858K   │ ░░░░░░░░░░░░░░░░░░░░ 128                                    │ ░░░░░░ 48                       │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ csv-rex                │ 857K   │ ░░░░░░░░░░░░░░░░░░░░ 128                                    │ ░░░░░░░░░░░░░░ 110              │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ node-csvtojson         │ 602K   │ ░░░░░░░░░░░░░░ 89.9                                         │ ░░░░░░░░░░░░░░ 109              │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ comma-separated-values │ 572K   │ ░░░░░░░░░░░░░ 85.5                                          │ ░░░░░░ 45.6                     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ SheetJS                │ 396K   │ ░░░░░░░░░ 59.1                                              │ ░░░░░░░░░░░░░░░░░░ 143          │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ @vanillaes/csv         │ 350K   │ ░░░░░░░░ 52.4                                               │ ░░░░░░░░░░░░░ 104               │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-simple-parser      │ 292K   │ ░░░░░░░ 43.6                                                │ ░░░░░░░░░░░░░░░ 122             │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-parser (neat-csv)  │ 272K   │ ░░░░░░░ 40.6                                                │ ░░░░░░░░░░░░░░░░░░░ 152         │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ csv-js                 │ 266K   │ ░░░░░░ 39.7                                                 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 208  │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ CSVtoJSON              │ 220K   │ ░░░░░ 32.9                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░ 195    │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ @gregoranders/csv      │ 220K   │ ░░░░░ 32.9                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 204   │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ dekkai                 │ 213K   │ ░░░░░ 31.8                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 221 │ string │ [["2015-12-22T18:38:34.000Z","62.9616","-148.7532" │
│ csv-parse/sync         │ 161K   │ ░░░░ 24                                                     │ ░░░░░░░ 54                      │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ jquery-csv             │ 128K   │ ░░░ 19.1                                                    │ ░░░░░░░░░░░░░░░░░░░░░░ 178      │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ @fast-csv/parse        │ 118K   │ ░░░ 17.7                                                    │ ░░░░░░░░░░░░░░░░ 124            │ string │ [{"time0":"2015-12-22T18:38:34.000Z","latitude1":" │
│ utils-dsv-base-parse   │ 86.2K  │ ░░ 12.9                                                     │ ░░░░░░ 41                       │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

---
### Typed Parsing

If you have numeric data, booleans, dates, or embedded JSON, you'll likely want to convert these from strings to native JS types.

Each parser does this differently:

1. Some provide a setting for this natively
2. Others expose a user-defined, per-value callback that leaves conversion to the user
3. The rest expect you to convert the output yourself

Thing is, due to crappy built-in implementations, the fastest option is _usually_ the last one...if you know what you're doing.
Consequently, very few users will actually reap the full performance of #3; most will pick #1 or seek out libraries that offer it.

For example, here's the difference with PapaParse (untyped, natively-typed, manually-typed):

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ data-large2.csv (36 MB, 37 cols x 130K rows)                                                                                                                                                       │
├─────────────────────────────┬────────┬────────────────────────────────────────────────────────┬──────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                        │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 47 MiB baseline (MiB)      │ Types  │ Sample                                             │
├─────────────────────────────┼────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ PapaParse                   │ 387K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 107 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.93K │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ PapaParse typed [] (manual) │ 257K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 71.1                │ ░░░░░░░░░░░░░░░░░░ 1.16K             │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ PapaParse typed [] (native) │ 117K   │ ░░░░░░░░░░░░░░░░ 32.4                                  │ ░░░░░░░░░░░░░░░░░░ 1.12K             │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
└─────────────────────────────┴────────┴────────────────────────────────────────────────────────┴──────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Option #3 (manually post-processed) integer conversion is more than 2x faster than using the official `dynamicTyping: true` (Option #1).
This route is available to all libs, but performance fully depends on user competence.
Since we're here to assess libs and not users, we'll only compare libs with some kind of type conversion API.

**Sensors Time Series**

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ data-large2.csv (36 MB, 37 cols x 130K rows)                                                                                                                                                             │
├─────────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬───────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 280 MiB baseline (MiB)  │ Types  │ Sample                                             │
├─────────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 440K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 122 │ ░░░░░░░░ 389                      │ number │ [[1370045100,4869044.81,4630605.41,382.8270592,382 │
│ csv-simple-parser typed []      │ 285K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 79.1                   │ ░░░░░░░░░░░ 529                   │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ csv-rex typed []                │ 275K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 76.2                    │ ░░░░░░ 276                        │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ d3-dsv typed []                 │ 231K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 64                            │ ░░░░░░░░░░░░ 565                  │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ comma-separated-values typed {} │ 195K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 54.1                              │ ░░░░░░░░░░░░░░░░░ 807             │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ csv42 typed {}                  │ 154K   │ ░░░░░░░░░░░░░░░░░░░░ 42.8                                   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.26K  │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ achilles-csv-parser typed {}    │ 149K   │ ░░░░░░░░░░░░░░░░░░░ 41.3                                    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.26K  │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ dekkai typed []                 │ 149K   │ ░░░░░░░░░░░░░░░░░░░ 41.3                                    │ ░░░░░░░ 320                       │ number │ [[1370045100,4869044.81,4630605.41,382.8270592,382 │
│ @vanillaes/csv typed []         │ 123K   │ ░░░░░░░░░░░░░░░░ 34.2                                       │ ░░░░░ 223                         │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ csv-js typed []                 │ 121K   │ ░░░░░░░░░░░░░░░░ 33.6                                       │ ░░░░░░ 252                        │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ CSVtoJSON typed {}              │ 118K   │ ░░░░░░░░░░░░░░░ 32.7                                        │ ░░░░░░░░░░░░░░░░░░░░░░ 1.03K      │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ PapaParse typed []              │ 114K   │ ░░░░░░░░░░░░░░░ 31.6                                        │ ░░░░░░░░░░░░░░░░░░░ 893           │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ SheetJS typed {}                │ 99.6K  │ ░░░░░░░░░░░░░ 27.6                                          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.32K │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ csv-parser (neat-csv) typed {}  │ 88.7K  │ ░░░░░░░░░░░░ 24.6                                           │ ░░░░░░░░░░░░░░░░░░ 842            │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ csv-parse/sync typed []         │ 56.5K  │ ░░░░░░░░ 15.7                                               │ ░░░░░ 235                         │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
└─────────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴───────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Notes:

- uDSV offers the simplicity of Option #1 with the performance of Option #3.
- I could not find typing options for these parsers: `but-csv`, `@fast-csv/parse`, `jquery-csv`, `@gregoranders/csv`, `@stdlib/utils-dsv-base-parse`.
- `ACsv.js` and `node-csvtojson` provide typing only via [static column config](https://github.com/Keyang/node-csvtojson#column-parser), so they're excluded for not being generic.


**USA ZIP Codes**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                                                                                                                                                                               │
├─────────────────────────────────┬────────┬──────────────────────────────────────────────────────────────┬──────────────────────────────────┬───────────────────────────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                           │ RSS above 118 MiB baseline (MiB) │ Types                             │ Sample                                             │
├─────────────────────────────────┼────────┼──────────────────────────────────────────────────────────────┼──────────────────────────────────┼───────────────────────────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 519K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 92.8 │ ░░░░░░░░░░░░░░░░░░░░ 261         │ boolean,null,number,object,string │ [[602,18.36075,-67.17541,"Aguada","PR","Puerto Ric │
│ achilles-csv-parser typed {}    │ 328K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 58.6                     │ ░░░░░░░░░░░░░░░░░░ 235           │ boolean,null,number,object,string │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ csv-simple-parser typed []      │ 290K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 51.7                         │ ░░░░░░░░░░░░░░░░░ 229            │ boolean,null,number,object,string │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ d3-dsv typed []                 │ 273K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 48.8                           │ ░░░░░░░░░░░░░░░░░░░░░░░░ 323     │ null,number,string                │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ csv-rex typed []                │ 257K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 46                              │ ░░░░░░░░░░░░░░░░░░░░░ 276        │ boolean,null,number,object,string │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ comma-separated-values typed {} │ 249K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 44.4                             │ ░░░░░░░░░░░░░░░░░ 230            │ number,string                     │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ dekkai typed []                 │ 236K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 42.2                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 351   │ NaN,number,string                 │ [[602,18.36075,-67.17541,"Aguada","PR","Puerto Ric │
│ CSVtoJSON typed {}              │ 219K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 39.1                                │ ░░░░░░░░░░░░░░░░░ 231            │ number,string                     │ [{"\"zip\"":602,"\"lat\"":18.36075,"\"lng\"":-67.1 │
│ csv-js typed []                 │ 219K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 39.1                                │ ░░░░░░░░░░░░░░░░░░░░░░░░ 323     │ boolean,number,string             │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ csv42 typed {}                  │ 200K   │ ░░░░░░░░░░░░░░░░░░░░░░ 35.6                                  │ ░░░░░░░░░░░░░░░░░░ 234           │ number,object,string              │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ csv-parser (neat-csv) typed {}  │ 179K   │ ░░░░░░░░░░░░░░░░░░░ 32                                       │ ░░░░░░░░░░░░░░░░░░░ 247          │ boolean,null,number,object,string │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ PapaParse typed []              │ 171K   │ ░░░░░░░░░░░░░░░░░░░ 30.6                                     │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 364  │ boolean,null,number,string        │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ @vanillaes/csv typed []         │ 157K   │ ░░░░░░░░░░░░░░░░░ 28                                         │ ░░░░░░░░░░░░░░░░░ 228            │ NaN,number,string                 │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ SheetJS typed {}                │ 93.8K  │ ░░░░░░░░░░ 16.8                                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 368  │ boolean,number,string             │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ csv-parse/sync typed []         │ 20.7K  │ ░░░ 3.69                                                     │ ░░░░░░░░░░░░░░░░░░░░░░░░ 316     │ number,string                     │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
└─────────────────────────────────┴────────┴──────────────────────────────────────────────────────────────┴──────────────────────────────────┴───────────────────────────────────┴────────────────────────────────────────────────────┘
```

Notes:

- The values in the Types column are important. All parsers that show `object` (except SheetJS) ran `JSON.parse()` on the embedded JSON strings for each of 34K rows in this dataset. Additionally, there are 3 columns of boolean values here, so those without `boolean` did not do the work of converting 3 * 34k TRUE/FALSE strings.


**House Price Index**

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HPI_master.csv (10 MB, 10 cols x 120K rows)                                                                                                                                                                        │
├─────────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬──────────────────────────────────┬───────────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 147 MiB baseline (MiB) │ Types             │ Sample                                             │
├─────────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────┼───────────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 1.44M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 121 │ ░░░░░░░░░░░░░░░░░░░ 543          │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
│ csv42 typed {}                  │ 931K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 78.2                   │ ░░░░░░░░░░░░░░░░ 458             │ number,string     │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ achilles-csv-parser typed {}    │ 847K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 71.2                      │ ░░░░░░░░░░░░░░░░░░ 504           │ number,string     │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-rex typed []                │ 813K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 68.3                       │ ░░░░░░░░░░░░░░░░░░ 508           │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
│ d3-dsv typed []                 │ 641K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 53.9                              │ ░░░░░░░░░░░░░ 382                │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
│ comma-separated-values typed {} │ 567K   │ ░░░░░░░░░░░░░░░░░░░░░░ 47.6                                 │ ░░░░░░░░░░░░░░░░░░ 515           │ number,string     │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-simple-parser typed []      │ 533K   │ ░░░░░░░░░░░░░░░░░░░░░ 44.8                                  │ ░░░░░░░░░░░░░ 369                │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
│ PapaParse typed []              │ 492K   │ ░░░░░░░░░░░░░░░░░░░ 41.4                                    │ ░░░░░░░░░░░░░░░░░░░░ 591         │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
│ CSVtoJSON typed {}              │ 448K   │ ░░░░░░░░░░░░░░░░░░ 37.6                                     │ ░░░░░░░░░░░░░░ 392               │ number,string     │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-js typed []                 │ 430K   │ ░░░░░░░░░░░░░░░░░ 36.1                                      │ ░░░░░░░░░░░░░░░ 429              │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
│ dekkai typed []                 │ 400K   │ ░░░░░░░░░░░░░░░░ 33.6                                       │ ░░░░░░░░░░░░░░░░░░ 515           │ NaN,number,string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-parser (neat-csv) typed {}  │ 382K   │ ░░░░░░░░░░░░░░░ 32.1                                        │ ░░░░░░░░░░░░░░ 394               │ number,string     │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ @vanillaes/csv typed []         │ 378K   │ ░░░░░░░░░░░░░░░ 31.8                                        │ ░░░░░░░░░░░░░░ 390               │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
│ SheetJS typed {}                │ 199K   │ ░░░░░░░░ 16.7                                               │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 800  │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
│ csv-parse/sync typed []         │ 38.7K  │ ░░ 3.25                                                     │ ░░░░░░░░░░░░░░░░░ 493            │ number,string     │ [["traditional","purchase-only","monthly","USA or  │
└─────────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴──────────────────────────────────┴───────────────────┴────────────────────────────────────────────────────┘
```


**Earthquakes**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ large-dataset.csv (1.1 MB, 15 cols x 7.3K rows)                                                                                                                                                                         │
├─────────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬─────────────────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 61 MiB baseline (MiB) │ Types                   │ Sample                                             │
├─────────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 875K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 131 │ ░░░░░░░ 55.1                    │ date,null,number,string │ [["2015-12-22T18:38:34.000Z",62.9616,-148.7532,65. │
│ csv42 typed {}                  │ 576K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 86.1                  │ ░░░░░░ 42.6                     │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ achilles-csv-parser typed {}    │ 556K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 83.2                    │ ░░░░░░ 46.3                     │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ csv-rex typed []                │ 537K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 80.3                     │ ░░░░░░░░░░░░░ 96.9              │ null,number,string      │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ comma-separated-values typed {} │ 494K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 73.8                       │ ░░░░░░ 45.9                     │ number,string           │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ d3-dsv typed []                 │ 335K   │ ░░░░░░░░░░░░░░░░░░░░░░ 50                                   │ ░░░░░░░ 52.7                    │ date,null,number,string │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ PapaParse typed []              │ 265K   │ ░░░░░░░░░░░░░░░░░ 39.6                                      │ ░░░░░░░░░░░░░░░░ 126            │ date,null,number,string │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ csv-simple-parser typed []      │ 244K   │ ░░░░░░░░░░░░░░░░ 36.4                                       │ ░░░░░░░░░░░░░░░░ 123            │ null,number,string      │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ csv-parser (neat-csv) typed {}  │ 230K   │ ░░░░░░░░░░░░░░░ 34.4                                        │ ░░░░░░░░░░░░░░░ 117             │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ @vanillaes/csv typed []         │ 229K   │ ░░░░░░░░░░░░░░░ 34.2                                        │ ░░░░░░░░░░░░ 94.6               │ NaN,number,string       │ [[2015,59.9988,-152.7191,100,3,"ml",null,null,null │
│ csv-js typed []                 │ 226K   │ ░░░░░░░░░░░░░░░ 33.7                                        │ ░░░░░░░░░░░░░░░ 117             │ number,string           │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ CSVtoJSON typed {}              │ 214K   │ ░░░░░░░░░░░░░░ 32                                           │ ░░░░░░░░░░░░░░░ 112             │ number,string           │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ dekkai typed []                 │ 189K   │ ░░░░░░░░░░░░ 28.2                                           │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 215 │ NaN,number,string       │ [["2015-12-22T18:38:34.000Z",62.9616,-148.7532,65. │
│ SheetJS typed {}                │ 89.4K  │ ░░░░░░ 13.4                                                 │ ░░░░░░░░░░░░░░░ 115             │ number,string           │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ csv-parse/sync typed []         │ 27.8K  │ ░░ 4.16                                                     │ ░░░░░░░░░░░░░░░ 118             │ date,number,string      │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
└─────────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴─────────────────────────┴────────────────────────────────────────────────────┘
```

Notes:

- Creating `Date` objects is really expensive, and there are 2 * 7.3K of them here. Parsers without `date` listed in Types column have not done this work. For instance, if we omit `Date` conversion from uDSV typing:
  ```
  ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ large-dataset.csv (1.1 MB, 15 cols x 7.3K rows)                                                                                                                                                   │
  ├───────────────┬────────┬─────────────────────────────────────────────────────────────┬──────────────────────────────────┬────────────────────┬────────────────────────────────────────────────────┤
  │ Name          │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 63 MiB baseline (MiB)  │ Types              │ Sample                                             │
  ├───────────────┼────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────┼────────────────────┼────────────────────────────────────────────────────┤
  │ uDSV typed [] │ 1.29M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 193 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 46.5 │ null,number,string │ [["2015-12-22T18:38:34.000Z",62.9616,-148.7532,65. │
  └───────────────┴────────┴─────────────────────────────────────────────────────────────┴──────────────────────────────────┴────────────────────┴────────────────────────────────────────────────────┘
  ```


---
### Streaming

There are two categories for streaming: retained and non-retained.

Streaming that retains will keep all parsed output in memory while non-retained will discard the parsed data after running some reducer on each chunk, such as sum or filter.

#### Retained

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ data-large2.csv (36 MB, 37 cols x 130K rows)                                                                                                                                                           │
├───────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬───────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                          │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 280 MiB baseline (MiB)  │ Types  │ Sample                                             │
├───────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ PapaParse (stream)            │ 374K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 104 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.58K  │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ uDSV (stream)                 │ 357K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 99    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.68K │ string │ [["1370045100","4869044.81","4630605.41","382.8270 │
│ node-csvtojson (stream)       │ 282K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 78.1             │ ░░░░░░░░░░░░░░░░░░░░░░ 1.32K      │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-rex (stream)              │ 245K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 67.8                   │ ░░░░░░░░░░░░░░░░░░░░ 1.23K        │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ ya-csv (stream)               │ 164K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 45.5                              │ ░░░░░░░░░░░░░░░ 873               │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ dekkai (stream)               │ 160K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 44.5                               │ ░░░░░░░░ 489                      │ string │ [["1370045100","4869044.81","4630605.41","382.8270 │
│ csv-parser (stream)           │ 97.2K  │ ░░░░░░░░░░░░░░░ 27                                          │ ░░░░░░░░░░░░░░░░░░░░░░ 1.32K      │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ utils-dsv-base-parse (stream) │ 33.8K  │ ░░░░░ 9.36                                                  │ ░░░░░░ 342                        │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
└───────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴───────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                                                                                                                                                  │
├───────────────────────────────┬────────┬──────────────────────────────────────────────────────────────┬──────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                          │ Rows/s │ Throughput (MiB/s)                                           │ RSS above 118 MiB baseline (MiB) │ Types  │ Sample                                             │
├───────────────────────────────┼────────┼──────────────────────────────────────────────────────────────┼──────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV (stream)                 │ 550K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 98.2 │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 422    │ string │ [["00602","18.36075","-67.17541","Aguada","PR","Pu │
│ dekkai (stream)               │ 296K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 52.9                          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 449   │ string │ [["00602","18.36075","-67.17541","Aguada","PR","Pu │
│ csv-rex (stream)              │ 262K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 46.8                             │ ░░░░░░░░░░░░░░░░░░░░░ 353        │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ PapaParse (stream)            │ 261K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 46.6                             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 470  │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ ya-csv (stream)               │ 239K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 42.6                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 451   │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-parser (stream)           │ 192K   │ ░░░░░░░░░░░░░░░░░░░░ 34.4                                    │ ░░░░░░░░░░░░░░░░ 274             │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ node-csvtojson (stream)       │ 180K   │ ░░░░░░░░░░░░░░░░░░░ 32.2                                     │ ░░░░░░░░░░░░░░░░░░░░░░ 365       │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ utils-dsv-base-parse (stream) │ ---    │ unexpected error. Encountered an invalid record. Field 17 o  │ ---                              │ ---    │ ---                                                │
└───────────────────────────────┴────────┴──────────────────────────────────────────────────────────────┴──────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HPI_master.csv (10 MB, 10 cols x 120K rows)                                                                                                                                                           │
├───────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬──────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                          │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 148 MiB baseline (MiB) │ Types  │ Sample                                             │
├───────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV (stream)                 │ 1.28M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 108 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 625  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ PapaParse (stream)            │ 1.06M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 89.3         │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 603  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-rex (stream)              │ 697K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 58.6                         │ ░░░░░░░░░░░░░░░░░░░░░░░ 512      │ string │ [["traditional","purchase-only","monthly","USA or  │
│ node-csvtojson (stream)       │ 642K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 54                             │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 572    │ string │ [["traditional","purchase-only","monthly","USA or  │
│ dekkai (stream)               │ 511K   │ ░░░░░░░░░░░░░░░░░░░░░░ 42.9                                 │ ░░░░░░░░░░░░░░░░░░░░░░░ 521      │ string │ [["traditional","purchase-only","monthly","USA or  │
│ ya-csv (stream)               │ 452K   │ ░░░░░░░░░░░░░░░░░░░░ 38                                     │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 584   │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-parser (stream)           │ 404K   │ ░░░░░░░░░░░░░░░░░░ 33.9                                     │ ░░░░░░░░░░░░░░░░░ 374            │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ utils-dsv-base-parse (stream) │ 135K   │ ░░░░░░ 11.3                                                 │ ░░░░░░░░░ 190                    │ string │ [["traditional","purchase-only","monthly","USA or  │
└───────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴──────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ large-dataset.csv (1.1 MB, 15 cols x 7.3K rows)                                                                                                                                                      │
├───────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                          │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 63 MiB baseline (MiB) │ Types  │ Sample                                             │
├───────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV (stream)                 │ 1.76M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 263 │ ░░░░░░░ 56.3                    │ string │ [["2015-12-22T18:38:34.000Z","62.9616","-148.7532" │
│ PapaParse (stream)            │ 766K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 115                                │ ░░░░░░░░░░░░░ 111               │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ node-csvtojson (stream)       │ 570K   │ ░░░░░░░░░░░░░░░░░░ 85.2                                     │ ░░░░░░░ 56.4                    │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-rex (stream)              │ 551K   │ ░░░░░░░░░░░░░░░░░░ 82.4                                     │ ░░░░░░░░░░░░░░ 120              │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-parser (stream)           │ 267K   │ ░░░░░░░░░ 40                                                │ ░░░░░░░ 58.7                    │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ dekkai (stream)               │ 258K   │ ░░░░░░░░░ 38.6                                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 243 │ string │ [["2015-12-22T18:38:34.000Z","62.9616","-148.7532" │
│ ya-csv (stream)               │ 246K   │ ░░░░░░░░ 36.7                                               │ ░░░░░░░░░░░░░░░░░░░░░░ 193      │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ utils-dsv-base-parse (stream) │ 78.4K  │ ░░░ 11.7                                                    │ ░░░░░░░░░░ 85                   │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
└───────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

#### Non-retained

We're going to use [Dekkai's benchmark](https://github.com/darionco/dekkai#benchmark), which sums a single parsed column of a 15-col x 3.6M-row dataset.
My _guess_ is what's being measured there is [this commented-out loop](https://github.com/darionco/dekkai/blob/9d086152b2b1a2c72986b04d201b0faa2aadd377/www/index.html#L256-L265).

**Airports**

https://www.kaggle.com/datasets/flashgordon/usa-airport-dataset

```csv
"Origin_airport","Destination_airport","Origin_city","Destination_city","Passengers","Seats","Flights","Distance","Fly_date","Origin_population","Destination_population","Org_airport_lat","Org_airport_long","Dest_airport_lat","Dest_airport_long"
"MHK","AMW","Manhattan, KS","Ames, IA",21,30,1,254,2008-10-01,122049,86219,39.140998840332,-96.6707992553711,NA,NA
"EUG","RDM","Eugene, OR","Bend, OR",41,396,22,103,1990-11-01,284093,76034,44.1245994567871,-123.21199798584,44.2541008,-121.1500015
"EUG","RDM","Eugene, OR","Bend, OR",88,342,19,103,1990-12-01,284093,76034,44.1245994567871,-123.21199798584,44.2541008,-121.1500015
"MFR","RDM","Medford, OR","Bend, OR",0,18,1,156,1990-02-01,147300,76034,42.3741989135742,-122.873001098633,44.2541008,-121.1500015
"MFR","RDM","Medford, OR","Bend, OR",11,18,1,156,1990-03-01,147300,76034,42.3741989135742,-122.873001098633,44.2541008,-121.1500015
"SEA","RDM","Seattle, WA","Bend, OR",8,18,1,228,1990-02-01,5154164,76034,47.4490013122559,-122.30899810791,44.2541008,-121.1500015
```

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Airports2.csv (510 MB, 1 cols x 2 rows)                                                                                                                   │
├─────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬───────────────┤
│ Name                    │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 49 MiB baseline (MiB) │ Types  │ Sample        │
├─────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼───────────────┤
│ uDSV (stream, sum)      │ 0.935  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 238 │ ░░░░░░░░░ 39                    │ number │ [[134277303]] │
│ dekkai (stream, sum)    │ 0.762  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 194           │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 117 │ number │ [[134277303]] │
│ PapaParse (stream, sum) │ 0.502  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 128                          │ ░░░░░░░░░░ 40.6                 │ number │ [[134277303]] │
└─────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴───────────────┘
```

Notes:

- When using logically-similar code, I'm not able to get the extremely slow performance numbers they show for Papa Parse in their bench results.


Here's a run with our numeric litmus dataset, which shows similar results:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_ints.csv (1 MB, 1 cols x 2 rows)                                                                                                                 │
├─────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬──────────────────────────────────┬────────┬────────────┤
│ Name                    │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 51 MiB baseline (MiB)  │ Types  │ Sample     │
├─────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────┼────────┼────────────┤
│ uDSV (stream, sum)      │ 265    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 136 │ ░░░░░░░░░░░░░ 37.8               │ number │ [[441296]] │
│ dekkai (stream, sum)    │ 246    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 126    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 79.8 │ number │ [[441296]] │
│ PapaParse (stream, sum) │ 229    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 118        │ ░░░░░░░░░░░░░░░░ 45.7            │ number │ [[441296]] │
└─────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴──────────────────────────────────┴────────┴────────────┘
```

---
### Output Formats

For libs that support different output formats (tuples, objects, columns, nested objects), there is often a performance penalty for when switching away from the default.

We're not going to look at every lib here, but switching PapaParse to object mode (`header: true`) looks like this:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_strings.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                     │
├──────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name         │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 68 MiB baseline (MiB) │ Types  │ Sample                                             │
├──────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ PapaParse    │ 649K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 124 │ ░░░░░░░░░░░░░░░░░░ 140          │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ PapaParse {} │ 237K   │ ░░░░░░░░░░░░░░░░░░░░░ 45.2                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 210 │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
└──────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Here are uDSV output formats compared:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_strings.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                   │
├───────────┬────────┬─────────────────────────────────────────────────────────────┬──────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name      │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 70 MiB baseline (MiB)  │ Types  │ Sample                                             │
├───────────┼────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV []   │ 1.32M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 251 │ ░░░░░░░░░░░░░░░░░░░░░░ 45.9      │ string │ [["m 2tn5AF","ywO","tecaOIw6K1XLXf","osxLRmM0A3Eo" │
│ uDSV {}   │ 1.3M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 247 │ ░░░░░░░░░░░░░░░░░░░░░░ 46        │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ uDSV cols │ 1.13M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 215        │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 57.9 │ string │ [["029","ywO","0Drg6JKS","2lkn","dsn","XgIzj","7Yg │
└───────────┴────────┴─────────────────────────────────────────────────────────────┴──────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

#### Nested Objects

[csv42](https://github.com/josdejong/csv42) was written to improve on parsing and stringifying nested JSON structures to and from CSV: https://jsoneditoronline.org/indepth/parse/csv-parser-javascript/

While uDSV does not currently offer CSV generation, it does offer ~4.5x faster deep parsing to structured objects:

**csv42_nested_10k.csv**

```csv
_type,name,description,location.city,location.street,location.geo[0],location.geo[1],speed,heading,size[0],size[1],size[2],"field with , delimiter","field with "" double quote"
item,Item 1,Item 1 description in text,Rotterdam,Main street,60.4770016,72.9305049,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
item,Item 2,Item 2 description in text,Rotterdam,Main street,91.9676756,14.0882905,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
item,Item 3,Item 3 description in text,Rotterdam,Main street,14.8318042,36.3390012,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
item,Item 4,Item 4 description in text,Rotterdam,Main street,25.8552221,94.8248616,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
item,Item 5,Item 5 description in text,Rotterdam,Main street,32.1099148,48.0531795,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
item,Item 6,Item 6 description in text,Rotterdam,Main street,32.2514711,92.7409621,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
```

```js
[
  {
    _type: 'item',
    name: 'Item 1',
    description: 'Item 1 description in text',
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
```

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ csv42_nested_10k.csv (1.6 MB, 9 cols x 10K rows)                                                                                                                                                               │
├─────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────────────────────────┬────────────────────────────────────────────────────┤
│ Name                │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 49 MiB baseline (MiB) │ Types                      │ Sample                                             │
├─────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────────────────────────┼────────────────────────────────────────────────────┤
│ uDSV typed deep {}  │ 1.14M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 178 │ ░░░░░░░░░░░░░ 62.5              │ array,number,object,string │ [{"_type":"item","name":"Item 2","description":"It │
│ csv42 typed deep {} │ 258K   │ ░░░░░░░░░░░░░ 40.5                                          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 131 │ array,number,object,string │ [{"_type":"item","name":"Item 2","description":"It │
└─────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────────────────────────┴────────────────────────────────────────────────────┘
```