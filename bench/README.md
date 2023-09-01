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
Parsing here is from CSV strings loaded into memory (no file streaming) and the output is string values, avoiding any addional overhead of conversion to numbers, booleans, dates, etc.
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
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_strings.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                             │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 40 MiB baseline (MiB)    │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.32M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 252 │ ░░░░░░░ 68.3                       │ string │ [["m 2tn5AF","ywO","tecaOIw6K1XLXf","osxLRmM0A3Eo" │
│ but-csv                │ 916K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 174                │ ░░░░░░░░ 75.8                      │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv-simple-parser      │ 820K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 156                    │ ░░░░░░░░ 77.7                      │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ PapaParse              │ 643K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 123                          │ ░░░░░░░░░░░░░░░░░ 163              │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ ACsv                   │ 619K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 118                           │ ░░░░░░░░░░░░░░░░░░ 170             │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ d3-dsv                 │ 613K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 117                           │ ░░░░░░░░░░░░░░░░░░ 172             │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ node-csvtojson         │ 412K   │ ░░░░░░░░░░░░░░░░ 78.4                                  │ ░░░░░░░░░░░░░░░░░░░░░ 207          │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ SheetJS (native)       │ 325K   │ ░░░░░░░░░░░░░ 61.9                                     │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 295 │ object │ [[{"t":"s","v":"HCbe"},{"t":"s","v":"029"},{"t":"s │
│ comma-separated-values │ 318K   │ ░░░░░░░░░░░░░ 60.5                                     │ ░░░░░░░░░░░░░░░░░░░░░ 205          │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ achilles-csv-parser    │ 308K   │ ░░░░░░░░░░░░ 58.6                                      │ ░░░░░░░░░░░░░░░░░░░░░░░░ 229       │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ @vanillaes/csv         │ 254K   │ ░░░░░░░░░░ 48.5                                        │ ░░░░░░░░░░░░░░░░░░░ 178            │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ CSVtoJSON              │ 239K   │ ░░░░░░░░░░ 45.6                                        │ ░░░░░░░░░░░░░░░░░░░░░░░ 219        │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-js                 │ 239K   │ ░░░░░░░░░░ 45.5                                        │ ░░░░░░░░░░░░░░░░░░░░░░░ 217        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ @gregoranders/csv      │ 213K   │ ░░░░░░░░░ 40.5                                         │ ░░░░░░░░░░░░░░░░░░░░░░░ 217        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv42                  │ 201K   │ ░░░░░░░░ 38.2                                          │ ░░░░░░░░░░░░░░░░░░░░░░ 214         │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-parser (neat-csv)  │ 177K   │ ░░░░░░░ 33.7                                           │ ░░░░░░░░░░░░░░░░░░ 176             │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-parse/sync         │ 116K   │ ░░░░░ 22.1                                             │ ░░░░░░░░░░░░░░░ 145                │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ jquery-csv             │ 97.5K  │ ░░░░ 18.6                                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 286  │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ @fast-csv/parse        │ 75.7K  │ ░░░ 14.4                                               │ ░░░░░░░░░░░░░░░░░░░░░ 198          │ string │ [{"GtQ56taEqPynZE0":"m 2tn5AF","wEAh1":"ywO","f5z2 │
│ utils-dsv-base-parse   │ 59.3K  │ ░░░ 11.3                                               │ ░░░░░░░░░░░░░░ 136                 │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
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
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_ints.csv (1 MB, 20 cols x 10K rows)                                                                                                                                                  │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 40 MiB baseline (MiB)    │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 2.44M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 251 │ ░░░░░░ 55.3                        │ string │ [["6287","-60","7062","-3411","4613","-5840","209" │
│ csv-simple-parser      │ 1.6M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 165                  │ ░░░░░░░ 65.2                       │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ d3-dsv                 │ 1.31M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 135                        │ ░░░░░░░░░ 80.7                     │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ but-csv                │ 994K   │ ░░░░░░░░░░░░░░░░░░░░░ 102                              │ ░░░░░░░░ 69.1                      │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ PapaParse              │ 724K   │ ░░░░░░░░░░░░░░░ 74.4                                   │ ░░░░░░░░░░░░░░░░ 152               │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ ACsv                   │ 700K   │ ░░░░░░░░░░░░░░░ 72                                     │ ░░░░░░░░░░░░░░░░░░ 170             │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ @gregoranders/csv      │ 538K   │ ░░░░░░░░░░░░ 55.4                                      │ ░░░░░░░░░░ 95.5                    │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ node-csvtojson         │ 499K   │ ░░░░░░░░░░░ 51.3                                       │ ░░░░░░░░░░░░░░░░░░░ 174            │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-js                 │ 478K   │ ░░░░░░░░░░ 49.2                                        │ ░░░░░░░░░░░░░░░░░░░░ 188           │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ achilles-csv-parser    │ 474K   │ ░░░░░░░░░░ 48.8                                        │ ░░░░░░░░░░░░░░░░░░░░ 183           │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ comma-separated-values │ 402K   │ ░░░░░░░░░ 41.3                                         │ ░░░░░░░░░░░░░░░░░░░░ 189           │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ SheetJS (native)       │ 382K   │ ░░░░░░░░ 39.3                                          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 288 │ object │ [[{"t":"s","v":"-8399"},{"t":"s","v":"-5705"},{"t" │
│ csv42                  │ 329K   │ ░░░░░░░ 33.9                                           │ ░░░░░░░░░░░░░░░░░░░ 174            │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ CSVtoJSON              │ 272K   │ ░░░░░░ 28                                              │ ░░░░░░░░░░░░░░░░░░░░░░░ 220        │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ @vanillaes/csv         │ 266K   │ ░░░░░░ 27.3                                            │ ░░░░░░░░░░░░░░░░░░ 167             │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-parser (neat-csv)  │ 205K   │ ░░░░░ 21.1                                             │ ░░░░░░░░░░░░░░░░░░░░░░ 206         │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ csv-parse/sync         │ 155K   │ ░░░░ 15.9                                              │ ░░░░░░░░░░░░░░░░░ 155              │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ jquery-csv             │ 99.6K  │ ░░░ 10.2                                               │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 278  │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ utils-dsv-base-parse   │ 98.7K  │ ░░░ 10.1                                               │ ░░░░░░░░░░░░░░░ 140                │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ @fast-csv/parse        │ 97.7K  │ ░░ 10.1                                                │ ░░░░░░░░░░░░░░░░░░░░░ 196          │ string │ [{"zYs0DQRw060":"6287","E5mPdSri1":"-60","Cku782": │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
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
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_quoted.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                              │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 40 MiB baseline (MiB)    │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.6M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 297 │ ░░░░░ 73                           │ string │ [["JitoL7gXbT","-3677"," NoqmZHgaSk14","1997","mtW │
│ csv-simple-parser      │ 1.21M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 225             │ ░░░░░ 69.8                         │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ but-csv                │ 884K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 164                       │ ░░░░░░ 86.3                        │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ achilles-csv-parser    │ 387K   │ ░░░░░░░░░░░░░ 71.6                                     │ ░░░░░░░░ 108                       │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ d3-dsv                 │ 364K   │ ░░░░░░░░░░░░ 67.3                                      │ ░░░░░░░░░░░░░ 185                  │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ PapaParse              │ 296K   │ ░░░░░░░░░░ 54.8                                        │ ░░░░░░░░░░░░░░ 200                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-js                 │ 275K   │ ░░░░░░░░░ 51                                           │ ░░░░░░░░░░░░░░ 203                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ SheetJS (native)       │ 239K   │ ░░░░░░░░ 44.3                                          │ ░░░░░░░░░░░░░░░░░░░░░ 296          │ object │ [[{"t":"s","v":"UPwF"},{"t":"s","v":"5742"},{"t":" │
│ comma-separated-values │ 232K   │ ░░░░░░░░ 43                                            │ ░░░░░░░░░░░░░░ 191                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @vanillaes/csv         │ 207K   │ ░░░░░░░ 38.3                                           │ ░░░░░░░░░░░ 161                    │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ ACsv                   │ 203K   │ ░░░░░░░ 37.5                                           │ ░░░░░░░░░░░░░░ 193                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv42                  │ 188K   │ ░░░░░░ 34.8                                            │ ░░░░░░░░░░░░░░░ 213                │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ node-csvtojson         │ 184K   │ ░░░░░░ 34.1                                            │ ░░░░░░░░░░░░░░ 203                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ CSVtoJSON              │ 174K   │ ░░░░░░ 32.2                                            │ ░░░░░░░░░░░░░░░░ 224               │ string │ [{"\"DRadpUJ9TCnUO0\"":"JitoL7gXbT","\"92ZnE3J8IME │
│ csv-parser (neat-csv)  │ 160K   │ ░░░░░ 29.6                                             │ ░░░░░░░░░░░░░░░░ 224               │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ utils-dsv-base-parse   │ 116K   │ ░░░░ 21.5                                              │ ░░░░░░░░░░░ 152                    │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @gregoranders/csv      │ 116K   │ ░░░░ 21.5                                              │ ░░░░░░░░░░░░ 172                   │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-parse/sync         │ 106K   │ ░░░░ 19.6                                              │ ░░░░░░░░░░░ 153                    │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @fast-csv/parse        │ 69.4K  │ ░░░ 12.8                                               │ ░░░░░░░░░░░░░░░ 215                │ string │ [{"DRadpUJ9 TCnUO00":"JitoL7gXbT","92ZnE3J8IME4Ru1 │
│ jquery-csv             │ 55.4K  │ ░░ 10.3                                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 441 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Notes:

- Bizzarely, the throughput of many parsers drops off a cliff with integer strings, even though we're not actually converting anything to integers, the memory usage is unchanged, and the dataset is 50% smaller.
- A significant portion exhibits 40%-60% performance deterioration when quotes are introduced.
- Despite enabling `.supportQuotedField(true)`, CSVtoJSON does not properly remove the wrapping quotes from column names.

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
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ data-large.csv (36 MB, 37 cols x 130K rows)                                                                                                                                                   │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬──────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 40 MiB baseline (MiB)      │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 486K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 135 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 2.1K   │ string │ [["1370045100","4869044.81","4630605.41","382.8270 │
│ csv-simple-parser      │ 388K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 108           │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.92K     │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ d3-dsv                 │ 382K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 106           │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.98K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ ACsv                   │ 375K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 104            │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.99K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ PapaParse              │ 372K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 103            │ ░░░░░░░░░░░░░░░░░░░░░░░░ 1.76K       │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ but-csv                │ 355K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 98.3             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.93K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ comma-separated-values │ 210K   │ ░░░░░░░░░░░░░░░░░░░░░░ 58.3                            │ ░░░░░░░░░░░░░░░░░ 1.25K              │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-js                 │ 182K   │ ░░░░░░░░░░░░░░░░░░░ 50.4                               │ ░░░░░░░░░░░░░░░░░░ 1.29K             │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ SheetJS (native)       │ 178K   │ ░░░░░░░░░░░░░░░░░░░ 49.4                               │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.99K    │ object │ [[{"t":"s","v":"1370044800"},{"t":"s","v":"4819440 │
│ csv42                  │ 172K   │ ░░░░░░░░░░░░░░░░░░ 47.6                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.89K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ achilles-csv-parser    │ 171K   │ ░░░░░░░░░░░░░░░░░░ 47.3                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.89K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ CSVtoJSON              │ 157K   │ ░░░░░░░░░░░░░░░░░ 43.6                                 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.87K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ @gregoranders/csv      │ 148K   │ ░░░░░░░░░░░░░░░░ 41.1                                  │ ░░░░░░░░░░░░░░░ 1.11K                │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ @vanillaes/csv         │ 140K   │ ░░░░░░░░░░░░░░░ 38.9                                   │ ░░░░░░░░░░░░░░░ 1.11K                │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ node-csvtojson         │ 116K   │ ░░░░░░░░░░░░ 32.3                                      │ ░░░░░░░░░░░░░░░ 1.08K                │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-parser (neat-csv)  │ 105K   │ ░░░░░░░░░░░ 29.1                                       │ ░░░░░░░░░░░░░░░░░░ 1.3K              │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ csv-parse/sync         │ 72.2K  │ ░░░░░░░░ 20                                            │ ░░░░░░░░░░░░ 831                     │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ @fast-csv/parse        │ 44K    │ ░░░░░ 12.2                                             │ ░░░░░░░░░░░░░░░ 1.08K                │ string │ [{"A0":"1370045100","B1":"4869044.81","C2":"463060 │
│ jquery-csv             │ 41.9K  │ ░░░░░ 11.6                                             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 2.22K │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ utils-dsv-base-parse   │ 38.2K  │ ░░░░ 10.6                                              │ ░░░░░░░░ 571                         │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴──────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
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
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                                                                                                                                         │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬──────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 42 MiB baseline (MiB)      │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 754K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 135 │ ░░░░░░░░░░░░░░░ 529                  │ string │ [["00602","18.36075","-67.17541","Aguada","PR","Pu │
│ achilles-csv-parser    │ 448K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 80                      │ ░░░░░░░░░░░░ 428                     │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ d3-dsv                 │ 424K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 75.7                     │ ░░░░░░░░░░ 366                       │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ PapaParse              │ 307K   │ ░░░░░░░░░░░░░░░░░░░░░ 54.9                             │ ░░░░░░░░░░░░░ 465                    │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv42                  │ 283K   │ ░░░░░░░░░░░░░░░░░░░ 50.5                               │ ░░░░░░░░░░░ 404                      │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ csv-js                 │ 275K   │ ░░░░░░░░░░░░░░░░░░░ 49.1                               │ ░░░░░░░░░░░░░░░░░ 611                │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ comma-separated-values │ 247K   │ ░░░░░░░░░░░░░░░░░ 44.2                                 │ ░░░░░░░░░░░ 398                      │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ CSVtoJSON              │ 243K   │ ░░░░░░░░░░░░░░░░░ 43.4                                 │ ░░░░░░░░░░░░░░ 507                   │ string │ [{"\"zip\"":"00602","\"lat\"":"18.36075","\"lng\"" │
│ SheetJS (native)       │ 240K   │ ░░░░░░░░░░░░░░░░ 42.8                                  │ ░░░░░░░░░░░░░░░░░░░ 701              │ object │ [[{"t":"s","v":"00601"},{"t":"s","v":"18.18027"},{ │
│ csv-simple-parser      │ 237K   │ ░░░░░░░░░░░░░░░░ 42.3                                  │ ░░░░░░░░░░░░ 415                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-parser (neat-csv)  │ 226K   │ ░░░░░░░░░░░░░░░░ 40.4                                  │ ░░░░░░░░░ 325                        │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ ACsv                   │ 215K   │ ░░░░░░░░░░░░░░░ 38.4                                   │ ░░░░░░░░░░░░ 421                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ @vanillaes/csv         │ 194K   │ ░░░░░░░░░░░░░ 34.7                                     │ ░░░░░░░░░░░░ 440                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ node-csvtojson         │ 163K   │ ░░░░░░░░░░░ 29.1                                       │ ░░░░░░░░░░░░░ 469                    │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-parse/sync         │ 122K   │ ░░░░░░░░░ 21.9                                         │ ░░░░░░░░░░ 357                       │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ @fast-csv/parse        │ 76.7K  │ ░░░░░░ 13.7                                            │ ░░░░░░░░░ 330                        │ string │ [{"zip0":"00602","lat1":"18.36075","lng2":"-67.175 │
│ jquery-csv             │ 53.3K  │ ░░░░ 9.53                                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.13K │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ but-csv                │ ---    │ ---                                                    │ ---                                  │ ---    │ ERR: Wrong row count, expected: 33790, actual: 1.  │
│ @gregoranders/csv      │ ---    │ ---                                                    │ ---                                  │ ---    │ ERR: Invalid CSV at 1:109                          │
│ utils-dsv-base-parse   │ ---    │ ---                                                    │ ---                                  │ ---    │ ERR: unexpected error. Encountered an invalid reco │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴──────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
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
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HPI_master.csv (10 MB, 10 cols x 120K rows)                                                                                                                                                   │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬──────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 42 MiB baseline (MiB)      │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.66M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 139 │ ░░░░░░░░░░░░░░░░░░ 729               │ string │ [["traditional","purchase-only","monthly","USA or  │
│ d3-dsv                 │ 1.32M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 111           │ ░░░░░░░░░░░░░░░░░░░ 783              │ string │ [["traditional","purchase-only","monthly","USA or  │
│ PapaParse              │ 1.28M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 108            │ ░░░░░░░░░░░░░░░░ 674                 │ string │ [["traditional","purchase-only","monthly","USA or  │
│ but-csv                │ 1.27M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 107            │ ░░░░░░░░░░░░░░░ 611                  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ ACsv                   │ 1.17M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 98.3              │ ░░░░░░░░░░░░░░░░░ 677                │ string │ [["traditional","purchase-only","monthly","USA or  │
│ achilles-csv-parser    │ 1.05M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 88.1                  │ ░░░░░░░░░░░░░░░░ 670                 │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv42                  │ 1.04M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 87.8                  │ ░░░░░░░░░░░░░░░░ 637                 │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ SheetJS (native)       │ 666K   │ ░░░░░░░░░░░░░░░░░░░░░ 56                               │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 1.02K      │ object │ [[{"t":"s","v":"traditional"},{"t":"s","v":"purcha │
│ csv-simple-parser      │ 561K   │ ░░░░░░░░░░░░░░░░░ 47.2                                 │ ░░░░░░░░░░░░░░░ 613                  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ comma-separated-values │ 554K   │ ░░░░░░░░░░░░░░░░░ 46.6                                 │ ░░░░░░░░░░░░░░░░ 649                 │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-js                 │ 508K   │ ░░░░░░░░░░░░░░░░ 42.7                                  │ ░░░░░░░░░░░░░░░░░░░ 782              │ string │ [["traditional","purchase-only","monthly","USA or  │
│ @vanillaes/csv         │ 495K   │ ░░░░░░░░░░░░░░░ 41.6                                   │ ░░░░░░░░░░░░ 505                     │ string │ [["traditional","purchase-only","monthly","USA or  │
│ CSVtoJSON              │ 468K   │ ░░░░░░░░░░░░░░░ 39.3                                   │ ░░░░░░░░░░░░░░░░░░░ 784              │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-parser (neat-csv)  │ 432K   │ ░░░░░░░░░░░░░░ 36.3                                    │ ░░░░░░░░░░░░░ 544                    │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ @gregoranders/csv      │ 383K   │ ░░░░░░░░░░░░ 32.2                                      │ ░░░░░░░░░░░░░░░░░ 683                │ string │ [["traditional","purchase-only","monthly","USA or  │
│ node-csvtojson         │ 349K   │ ░░░░░░░░░░░ 29.3                                       │ ░░░░░░░░░░░░░░░░░░░ 780              │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-parse/sync         │ 229K   │ ░░░░░░░ 19.2                                           │ ░░░░░░░░░░ 420                       │ string │ [["traditional","purchase-only","monthly","USA or  │
│ jquery-csv             │ 167K   │ ░░░░░░ 14                                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.27K │ string │ [["traditional","purchase-only","monthly","USA or  │
│ @fast-csv/parse        │ 166K   │ ░░░░░░ 13.9                                            │ ░░░░░░░░░░░░░ 527                    │ string │ [{"hpi_type0":"traditional","hpi_flavor1":"purchas │
│ utils-dsv-base-parse   │ 148K   │ ░░░░░ 12.4                                             │ ░░░░░░░ 292                          │ string │ [["traditional","purchase-only","monthly","USA or  │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴──────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
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
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ large-dataset.csv (1.1 MB, 15 cols x 7.3K rows)                                                                                                                                             │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 42 MiB baseline (MiB)    │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 2.45M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 366 │ ░░░░░░░░░ 60.8                     │ string │ [["2015-12-22T18:38:34.000Z","62.9616","-148.7532" │
│ but-csv                │ 1.61M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 240                  │ ░░░░░░░░ 59                        │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ ACsv                   │ 1.39M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 208                      │ ░░░░░░░░ 56.2                      │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ d3-dsv                 │ 966K   │ ░░░░░░░░░░░░░░░░░░░░ 144                               │ ░░░░░░░░░░░░░░░░ 112               │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ achilles-csv-parser    │ 918K   │ ░░░░░░░░░░░░░░░░░░░ 137                                │ ░░░░░░░░░ 60.1                     │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ PapaParse              │ 859K   │ ░░░░░░░░░░░░░░░░░░ 128                                 │ ░░░░░░░░░░░░░░░░░ 124              │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv42                  │ 857K   │ ░░░░░░░░░░░░░░░░░░ 128                                 │ ░░░░░░░░░ 61.1                     │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ SheetJS (native)       │ 765K   │ ░░░░░░░░░░░░░░░░ 114                                   │ ░░░░░░░░░░░░░ 92.7                 │ object │ [[{"t":"s","v":"2015-12-22T18:45:11.000Z"},{"t":"s │
│ node-csvtojson         │ 604K   │ ░░░░░░░░░░░░░ 90.3                                     │ ░░░░░░░░░░░░░░░░░ 126              │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ comma-separated-values │ 568K   │ ░░░░░░░░░░░░ 84.9                                      │ ░░░░░░░░░ 60.3                     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ @vanillaes/csv         │ 337K   │ ░░░░░░░ 50.4                                           │ ░░░░░░░░░░░░░░░░░ 120              │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-simple-parser      │ 288K   │ ░░░░░░ 43                                              │ ░░░░░░░░░░░░░░░░░░░░░ 153          │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-parser (neat-csv)  │ 263K   │ ░░░░░░ 39.2                                            │ ░░░░░░░░░░░░░░░░░░░░░░░ 167        │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ csv-js                 │ 255K   │ ░░░░░░ 38.1                                            │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 223 │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ CSVtoJSON              │ 218K   │ ░░░░░ 32.5                                             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 211  │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ @gregoranders/csv      │ 210K   │ ░░░░░ 31.5                                             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 209  │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-parse/sync         │ 148K   │ ░░░░ 22.1                                              │ ░░░░░░░░░░░░░░░░░ 121              │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ jquery-csv             │ 125K   │ ░░░ 18.7                                               │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 188     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ @fast-csv/parse        │ 115K   │ ░░░ 17.1                                               │ ░░░░░░░░░░░░░░░░ 114               │ string │ [{"time0":"2015-12-22T18:38:34.000Z","latitude1":" │
│ utils-dsv-base-parse   │ 87.1K  │ ░░ 13                                                  │ ░░░░░░░░ 58.2                      │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
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
│ data-large.csv (36 MB, 37 cols x 130K rows)                                                                                                                                                        │
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
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ data-large.csv (36 MB, 37 cols x 130K rows)                                                                                                                                                            │
├─────────────────────────────────┬────────┬────────────────────────────────────────────────────────┬──────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 38 MiB baseline (MiB)      │ Types  │ Sample                                             │
├─────────────────────────────────┼────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 443K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 123 │ ░░░░░░░░░░░ 627                      │ number │ [[1370045100,4869044.81,4630605.41,382.8270592,382 │
│ csv-simple-parser typed []      │ 278K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 77                    │ ░░░░░░░░░░░░░ 764                    │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ d3-dsv typed []                 │ 228K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 63.1                        │ ░░░░░░░░░░░░░░ 802                   │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ comma-separated-values typed {} │ 190K   │ ░░░░░░░░░░░░░░░░░░░░░░ 52.7                            │ ░░░░░░░░░░░░░░░░░░ 1.04K             │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ csv42 typed {}                  │ 150K   │ ░░░░░░░░░░░░░░░░░ 41.7                                 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.5K      │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ achilles-csv-parser typed {}    │ 149K   │ ░░░░░░░░░░░░░░░░░ 41.3                                 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.5K      │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ @vanillaes/csv typed []         │ 122K   │ ░░░░░░░░░░░░░░ 33.7                                    │ ░░░░░░░░ 459                         │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ csv-js typed []                 │ 118K   │ ░░░░░░░░░░░░░░ 32.8                                    │ ░░░░░░░░░ 492                        │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ CSVtoJSON typed {}              │ 116K   │ ░░░░░░░░░░░░░░ 32.1                                    │ ░░░░░░░░░░░░░░░░░░░░░░ 1.27K         │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ SheetJS (native) typed          │ 115K   │ ░░░░░░░░░░░░░░ 32                                      │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.78K │ object │ [[{"t":"n","w":"1370044800","v":1370044800},{"t":" │
│ PapaParse typed []              │ 113K   │ ░░░░░░░░░░░░░ 31.2                                     │ ░░░░░░░░░░░░░░░░░░░░ 1.13K           │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ csv-parser (neat-csv) typed {}  │ 88.9K  │ ░░░░░░░░░░░ 24.7                                       │ ░░░░░░░░░░░░░░░░░░░ 1.08K            │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ csv-parse/sync typed []         │ 57.8K  │ ░░░░░░░ 16                                             │ ░░░░░░░░░ 476                        │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
└─────────────────────────────────┴────────┴────────────────────────────────────────────────────────┴──────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Notes:

- uDSV offers the simplicity of Option #1 with the performance of Option #3.
- I could not find typing options for these parsers: `but-csv`, `@fast-csv/parse`, `jquery-csv`, `@gregoranders/csv`, `@stdlib/utils-dsv-base-parse`.
- `ACsv.js` and `node-csvtojson` provide typing only via [static column config](https://github.com/Keyang/node-csvtojson#column-parser), so they're excluded for not being generic.


**USA ZIP Codes**

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                                                                                                                                                                            │
├─────────────────────────────────┬────────┬─────────────────────────────────────────────────────────┬────────────────────────────────────┬───────────────────────────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                      │ RSS above 42 MiB baseline (MiB)    │ Types                             │ Sample                                             │
├─────────────────────────────────┼────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────┼───────────────────────────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 504K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 90.1 │ ░░░░░░░░░░░░░░ 332                 │ boolean,null,number,object,string │ [[602,18.36075,-67.17541,"Aguada","PR","Puerto Ric │
│ achilles-csv-parser typed {}    │ 324K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 57.8                  │ ░░░░░░░░░░░░░ 305                  │ boolean,null,number,object,string │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ csv-simple-parser typed []      │ 296K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 52.8                     │ ░░░░░░░░░░░░░ 319                  │ boolean,null,number,object,string │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ d3-dsv typed []                 │ 271K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 48.4                        │ ░░░░░░░░░░░░░░░░ 395               │ null,number,string                │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ comma-separated-values typed {} │ 252K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 45.1                         │ ░░░░░░░░░░░░░░░░ 378               │ number,string                     │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ csv-js typed []                 │ 219K   │ ░░░░░░░░░░░░░░░░░░░░░░ 39.1                             │ ░░░░░░░░░░░░░░░ 369                │ boolean,number,string             │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ CSVtoJSON typed {}              │ 209K   │ ░░░░░░░░░░░░░░░░░░░░░ 37.4                              │ ░░░░░░░░░░░░ 292                   │ number,string                     │ [{"\"zip\"":602,"\"lat\"":18.36075,"\"lng\"":-67.1 │
│ csv42 typed {}                  │ 188K   │ ░░░░░░░░░░░░░░░░░░░ 33.5                                │ ░░░░░░░░░░░░░ 306                  │ number,object,string              │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ csv-parser (neat-csv) typed {}  │ 183K   │ ░░░░░░░░░░░░░░░░░░░ 32.7                                │ ░░░░░░░░░░░░░░░ 366                │ boolean,null,number,object,string │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ PapaParse typed []              │ 171K   │ ░░░░░░░░░░░░░░░░░ 30.5                                  │ ░░░░░░░░░░░░░░░░░░ 437             │ boolean,null,number,string        │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ @vanillaes/csv typed []         │ 158K   │ ░░░░░░░░░░░░░░░░ 28.2                                   │ ░░░░░░░░░░░░░ 303                  │ NaN,number,string                 │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ SheetJS (native) typed          │ 102K   │ ░░░░░░░░░░░ 18.3                                        │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 745 │ object                            │ [[{"t":"n","w":"00601","v":601},{"t":"n","w":"18.1 │
│ csv-parse/sync typed []         │ 20.1K  │ ░░ 3.59                                                 │ ░░░░░░░░░░░░░░░░░░░ 447            │ number,string                     │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
└─────────────────────────────────┴────────┴─────────────────────────────────────────────────────────┴────────────────────────────────────┴───────────────────────────────────┴────────────────────────────────────────────────────┘
```

Notes:

- The values in the Types column are important. All parsers that show `object` (except SheetJS) ran `JSON.parse()` on the embedded JSON strings for each of 34K rows in this dataset. Additionally, there are 3 columns of boolean values here, so those without `boolean` did not do the work of converting 3 * 34k TRUE/FALSE strings.


**House Price Index**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HPI_master.csv (10 MB, 10 cols x 120K rows)                                                                                                                                                                 │
├─────────────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬───────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 42 MiB baseline (MiB)    │ Types         │ Sample                                             │
├─────────────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼───────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 1.35M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 113 │ ░░░░░░░░░░░░░░░░░░░ 602            │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ csv42 typed {}                  │ 877K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 73.7                 │ ░░░░░░░░░░░░░░░░░░ 560             │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ achilles-csv-parser typed {}    │ 812K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 68.3                   │ ░░░░░░░░░░░░░░░░░░ 563             │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ d3-dsv typed []                 │ 632K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 53.1                          │ ░░░░░░░░░░░░░░░░░ 518              │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ comma-separated-values typed {} │ 544K   │ ░░░░░░░░░░░░░░░░░░░░░ 45.8                             │ ░░░░░░░░░░░░░░░░░░░░ 618           │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-simple-parser typed []      │ 527K   │ ░░░░░░░░░░░░░░░░░░░░ 44.3                              │ ░░░░░░░░░░░░░░░ 473                │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ PapaParse typed []              │ 479K   │ ░░░░░░░░░░░░░░░░░░ 40.3                                │ ░░░░░░░░░░░░░░░░░░░░░░ 694         │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ CSVtoJSON typed {}              │ 447K   │ ░░░░░░░░░░░░░░░░░ 37.6                                 │ ░░░░░░░░░░░░░░░░ 496               │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-js typed []                 │ 434K   │ ░░░░░░░░░░░░░░░░░ 36.4                                 │ ░░░░░░░░░░░░░░░░░ 532              │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ @vanillaes/csv typed []         │ 390K   │ ░░░░░░░░░░░░░░░ 32.8                                   │ ░░░░░░░░░░░░░░░░ 492               │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-parser (neat-csv) typed {}  │ 385K   │ ░░░░░░░░░░░░░░░ 32.4                                   │ ░░░░░░░░░░░░░░░░ 495               │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ SheetJS (native) typed          │ 222K   │ ░░░░░░░░░ 18.7                                         │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 966 │ object        │ [[{"t":"s","v":"traditional"},{"t":"s","v":"purcha │
│ csv-parse/sync typed []         │ 38.2K  │ ░░ 3.21                                                │ ░░░░░░░░░░░░░░░░░░░ 595            │ number,string │ [["traditional","purchase-only","monthly","USA or  │
└─────────────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴───────────────┴────────────────────────────────────────────────────┘
```


**Earthquakes**

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ large-dataset.csv (1.1 MB, 15 cols x 7.3K rows)                                                                                                                                                                       │
├─────────────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬─────────────────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 42 MiB baseline (MiB)    │ Types                   │ Sample                                             │
├─────────────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 873K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 131 │ ░░░░░░░░░░░░░ 71.1                 │ date,null,number,string │ [["2015-12-22T18:38:34.000Z",62.9616,-148.7532,65. │
│ csv42 typed {}                  │ 581K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 86.8                │ ░░░░░░░░░░░ 59.2                   │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ achilles-csv-parser typed {}    │ 566K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 84.5                 │ ░░░░░░░░░░░ 59.6                   │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ comma-separated-values typed {} │ 497K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 74.3                     │ ░░░░░░░░░░░░ 63                    │ number,string           │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ d3-dsv typed []                 │ 336K   │ ░░░░░░░░░░░░░░░░░░░░ 50.3                              │ ░░░░░░░░░░░░ 67                    │ date,null,number,string │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ PapaParse typed []              │ 265K   │ ░░░░░░░░░░░░░░░░ 39.7                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 143     │ date,null,number,string │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ @vanillaes/csv typed []         │ 247K   │ ░░░░░░░░░░░░░░░ 36.9                                   │ ░░░░░░░░░░░░░░░░░░░░ 109           │ NaN,number,string       │ [[2015,59.9988,-152.7191,100,3,"ml",null,null,null │
│ csv-simple-parser typed []      │ 243K   │ ░░░░░░░░░░░░░░ 36.4                                    │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 137      │ null,number,string      │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ csv-js typed []                 │ 231K   │ ░░░░░░░░░░░░░░ 34.5                                    │ ░░░░░░░░░░░░░░░░░░░░░░░░ 133       │ number,string           │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ csv-parser (neat-csv) typed {}  │ 227K   │ ░░░░░░░░░░░░░ 33.9                                     │ ░░░░░░░░░░░░░░░░░░░░░░░░ 137       │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ CSVtoJSON typed {}              │ 220K   │ ░░░░░░░░░░░░░ 32.8                                     │ ░░░░░░░░░░░░░░░░░░░░░░░░ 133       │ number,string           │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ SheetJS (native) typed          │ 96.4K  │ ░░░░░░ 14.4                                            │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 171 │ object                  │ [[{"t":"s","v":"2015-12-22T18:45:11.000Z"},{"t":"n │
│ csv-parse/sync typed []         │ 28.4K  │ ░░ 4.24                                                │ ░░░░░░░░░░░░░░░░░░░░░░░ 127        │ date,number,string      │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
└─────────────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴─────────────────────────┴────────────────────────────────────────────────────┘
```

Notes:

- Creating `Date` objects is really expensive, and there are 2 * 7.3K of them here. Parsers without `date` in Types have not done this work. For instance, if we omit `Date` conversion from uDSV typing:
  ```
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ large-dataset.csv (1.1 MB, 15 cols x 7.3K rows)                                                                                                                                                 │
  ├───────────────┬────────┬────────────────────────────────────────────────────────┬─────────────────────────────────────┬────────────────────┬────────────────────────────────────────────────────┤
  │ Name          │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 40 MiB baseline (MiB)     │ Types              │ Sample                                             │
  ├───────────────┼────────┼────────────────────────────────────────────────────────┼─────────────────────────────────────┼────────────────────┼────────────────────────────────────────────────────┤
  │ uDSV typed [] │ 1.26M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 188 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 66.9 │ null,number,string │ [["2015-12-22T18:38:34.000Z",62.9616,-148.7532,65. │
  └───────────────┴────────┴────────────────────────────────────────────────────────┴─────────────────────────────────────┴────────────────────┴────────────────────────────────────────────────────┘
  ```


---
### Streaming

There are two categories for streaming: retained and non-retained.

Streaming that retains will keep all parsed output in memory while non-retained will discard the parsed data after running some reducer on each chunk, such as sum or filter.


---
### Output Formats

#### Nested Objects