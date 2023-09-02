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
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_strings.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                               │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 47 MiB baseline (MiB) │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.33M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 253 │ ░░░░░░░ 67.8                    │ string │ [["m 2tn5AF","ywO","tecaOIw6K1XLXf","osxLRmM0A3Eo" │
│ but-csv                │ 924K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 176                 │ ░░░░░░░░ 87.3                   │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv-simple-parser      │ 818K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 156                      │ ░░░░░░░ 75.2                    │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ PapaParse              │ 644K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 123                             │ ░░░░░░░░░░░░░░░░ 167            │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ ACsv                   │ 627K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 119                             │ ░░░░░░░░░░░░░░░░ 170            │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ d3-dsv                 │ 616K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 117                              │ ░░░░░░░░░░░░░░░░ 172            │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv-rex                │ 546K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 104                                 │ ░░░░░░░░░░░░░░░░░░ 193          │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ node-csvtojson         │ 419K   │ ░░░░░░░░░░░░░░░░░░ 79.9                                     │ ░░░░░░░░░░░░░░░░░░░ 203         │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ comma-separated-values │ 335K   │ ░░░░░░░░░░░░░░ 63.7                                         │ ░░░░░░░░░░░░░░░░░░░░ 212        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ SheetJS (native)       │ 331K   │ ░░░░░░░░░░░░░░ 63.1                                         │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 296 │ object │ [[{"t":"s","v":"HCbe"},{"t":"s","v":"029"},{"t":"s │
│ achilles-csv-parser    │ 295K   │ ░░░░░░░░░░░░░ 56.3                                          │ ░░░░░░░░░░░░░░░░░░░░░ 225       │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ @vanillaes/csv         │ 259K   │ ░░░░░░░░░░░ 49.4                                            │ ░░░░░░░░░░░░░░░░░ 179           │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ CSVtoJSON              │ 240K   │ ░░░░░░░░░░ 45.7                                             │ ░░░░░░░░░░░░░░░░░░░░░░ 231      │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-js                 │ 240K   │ ░░░░░░░░░░ 45.6                                             │ ░░░░░░░░░░░░░░░░░░░░ 217        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ @gregoranders/csv      │ 215K   │ ░░░░░░░░░ 41                                                │ ░░░░░░░░░░░░░░░░░░░░ 215        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv42                  │ 203K   │ ░░░░░░░░░ 38.7                                              │ ░░░░░░░░░░░░░░░░░░░░ 211        │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-parser (neat-csv)  │ 177K   │ ░░░░░░░░ 33.7                                               │ ░░░░░░░░░░░░░░░░░░░░░ 222       │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-parse/sync         │ 118K   │ ░░░░░ 22.5                                                  │ ░░░░░░░░░░░░░ 141               │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ jquery-csv             │ 97.6K  │ ░░░░░ 18.6                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 282  │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ @fast-csv/parse        │ 78K    │ ░░░░ 14.9                                                   │ ░░░░░░░░░░░░░░░░░░ 192          │ string │ [{"GtQ56taEqPynZE0":"m 2tn5AF","wEAh1":"ywO","f5z2 │
│ utils-dsv-base-parse   │ 59.1K  │ ░░░ 11.3                                                    │ ░░░░░░░░░░░░░ 135               │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
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
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 47 MiB baseline (MiB) │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 2.46M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 253 │ ░░░░░░ 55.9                     │ string │ [["6287","-60","7062","-3411","4613","-5840","209" │
│ csv-simple-parser      │ 1.56M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 160                     │ ░░░░░░ 61.8                     │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ d3-dsv                 │ 1.3M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 134                          │ ░░░░░░░░ 77.4                   │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ but-csv                │ 975K   │ ░░░░░░░░░░░░░░░░░░░░░░ 100                                  │ ░░░░░░░ 70.4                    │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ PapaParse              │ 717K   │ ░░░░░░░░░░░░░░░░░ 73.7                                      │ ░░░░░░░░░░░░░░ 147              │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ ACsv                   │ 707K   │ ░░░░░░░░░░░░░░░░ 72.7                                       │ ░░░░░░░░░░░░░░░░ 167            │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-rex                │ 598K   │ ░░░░░░░░░░░░░░ 61.5                                         │ ░░░░░░░░░░░░░░░░░░ 183          │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ @gregoranders/csv      │ 541K   │ ░░░░░░░░░░░░░ 55.6                                          │ ░░░░░░░░░ 87.2                  │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ node-csvtojson         │ 503K   │ ░░░░░░░░░░░░ 51.7                                           │ ░░░░░░░░░░░░░░░░░ 174           │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-js                 │ 474K   │ ░░░░░░░░░░░ 48.7                                            │ ░░░░░░░░░░░░░░░░░░ 186          │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ achilles-csv-parser    │ 469K   │ ░░░░░░░░░░░ 48.2                                            │ ░░░░░░░░░░░░░░░░░░░ 191         │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ comma-separated-values │ 397K   │ ░░░░░░░░░ 40.8                                              │ ░░░░░░░░░░░░░░░░ 166            │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ SheetJS (native)       │ 387K   │ ░░░░░░░░░ 39.7                                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 285 │ object │ [[{"t":"s","v":"-8399"},{"t":"s","v":"-5705"},{"t" │
│ csv42                  │ 334K   │ ░░░░░░░░ 34.3                                               │ ░░░░░░░░░░░░░░░░░ 171           │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ CSVtoJSON              │ 279K   │ ░░░░░░░ 28.7                                                │ ░░░░░░░░░░░░░░░░░░░░░ 220       │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ @vanillaes/csv         │ 273K   │ ░░░░░░░ 28                                                  │ ░░░░░░░░░░░░░░░░ 165            │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-parser (neat-csv)  │ 207K   │ ░░░░░ 21.3                                                  │ ░░░░░░░░░░░░░░░░░░░░ 207        │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ csv-parse/sync         │ 154K   │ ░░░░ 15.8                                                   │ ░░░░░░░░░░░░░░░ 155             │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ jquery-csv             │ 101K   │ ░░░ 10.4                                                    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 275 │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ @fast-csv/parse        │ 96.6K  │ ░░░ 9.93                                                    │ ░░░░░░░░░░░░░░░░░ 174           │ string │ [{"zYs0DQRw060":"6287","E5mPdSri1":"-60","Cku782": │
│ utils-dsv-base-parse   │ 96.1K  │ ░░░ 9.88                                                    │ ░░░░░░░░░░░░░░ 137              │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
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
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 47 MiB baseline (MiB) │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.62M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 300 │ ░░░░░ 72.2                      │ string │ [["JitoL7gXbT","-3677"," NoqmZHgaSk14","1997","mtW │
│ csv-simple-parser      │ 1.22M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 227              │ ░░░░░ 68.6                      │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ but-csv                │ 893K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 165                         │ ░░░░░░ 83.2                     │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ achilles-csv-parser    │ 392K   │ ░░░░░░░░░░░░░░ 72.5                                         │ ░░░░░░░ 110                     │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ d3-dsv                 │ 363K   │ ░░░░░░░░░░░░░ 67.2                                          │ ░░░░░░░░░░░░ 182                │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-rex                │ 354K   │ ░░░░░░░░░░░░ 65.4                                           │ ░░░░░░░░░░░░ 191                │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ PapaParse              │ 294K   │ ░░░░░░░░░░ 54.5                                             │ ░░░░░░░░░░░░░ 197               │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-js                 │ 286K   │ ░░░░░░░░░░ 52.9                                             │ ░░░░░░░░░░░░░░ 221              │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ SheetJS (native)       │ 242K   │ ░░░░░░░░░ 44.7                                              │ ░░░░░░░░░░░░░░░░░░ 293          │ object │ [[{"t":"s","v":"UPwF"},{"t":"s","v":"5742"},{"t":" │
│ comma-separated-values │ 234K   │ ░░░░░░░░ 43.3                                               │ ░░░░░░░░░░░░ 193                │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @vanillaes/csv         │ 209K   │ ░░░░░░░░ 38.7                                               │ ░░░░░░░░░░ 161                  │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ ACsv                   │ 205K   │ ░░░░░░░ 37.9                                                │ ░░░░░░░░░░░░ 190                │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv42                  │ 203K   │ ░░░░░░░ 37.6                                                │ ░░░░░░░░░░░░░░ 212              │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ node-csvtojson         │ 183K   │ ░░░░░░░ 33.9                                                │ ░░░░░░░░░░░░░ 198               │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ CSVtoJSON              │ 174K   │ ░░░░░░ 32.2                                                 │ ░░░░░░░░░░░░░░ 222              │ string │ [{"\"DRadpUJ9TCnUO0\"":"JitoL7gXbT","\"92ZnE3J8IME │
│ csv-parser (neat-csv)  │ 164K   │ ░░░░░░ 30.4                                                 │ ░░░░░░░░░░░░░ 205               │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ utils-dsv-base-parse   │ 117K   │ ░░░░ 21.7                                                   │ ░░░░░░░░░░ 158                  │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @gregoranders/csv      │ 116K   │ ░░░░ 21.5                                                   │ ░░░░░░░░░░░ 171                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-parse/sync         │ 102K   │ ░░░░ 19                                                     │ ░░░░░░░░░░ 154                  │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @fast-csv/parse        │ 70K    │ ░░░ 13                                                      │ ░░░░░░░░░░░░░░░░ 258            │ string │ [{"DRadpUJ9 TCnUO00":"JitoL7gXbT","92ZnE3J8IME4Ru1 │
│ jquery-csv             │ 59.1K  │ ░░░ 10.9                                                    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 441 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
└────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
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
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ data-large2.csv (36 MB, 37 cols x 130K rows)                                                                                                                                                    │
├────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬───────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 49 MiB baseline (MiB)   │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 510K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 141 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 2.09K  │ string │ [["1370045100","4869044.81","4630605.41","382.8270 │
│ d3-dsv                 │ 387K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 107              │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 1.98K   │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-simple-parser      │ 385K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 107              │ ░░░░░░░░░░░░░░░░░░░░░░░░ 1.92K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ PapaParse              │ 383K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 106              │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 1.98K   │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ ACsv                   │ 379K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 105               │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 1.98K   │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ but-csv                │ 359K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 99.6                │ ░░░░░░░░░░░░░░░░░░░░░░░░ 1.92K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-rex                │ 324K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 89.8                    │ ░░░░░░░░░░░░░░░░░░░░░░ 1.8K       │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ comma-separated-values │ 216K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 59.8                               │ ░░░░░░░░░░░░░░░░ 1.25K            │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-js                 │ 183K   │ ░░░░░░░░░░░░░░░░░░░░ 50.7                                   │ ░░░░░░░░░░░░░░░░ 1.29K            │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ SheetJS (native)       │ 178K   │ ░░░░░░░░░░░░░░░░░░░░ 49.4                                   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 1.98K   │ object │ [[{"t":"s","v":"1370044800"},{"t":"s","v":"4819440 │
│ achilles-csv-parser    │ 175K   │ ░░░░░░░░░░░░░░░░░░░ 48.4                                    │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.88K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ csv42                  │ 174K   │ ░░░░░░░░░░░░░░░░░░░ 48.2                                    │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.89K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ CSVtoJSON              │ 158K   │ ░░░░░░░░░░░░░░░░░░ 43.8                                     │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.87K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ @gregoranders/csv      │ 148K   │ ░░░░░░░░░░░░░░░░░ 41.2                                      │ ░░░░░░░░░░░░░░ 1.11K              │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ @vanillaes/csv         │ 140K   │ ░░░░░░░░░░░░░░░░ 38.8                                       │ ░░░░░░░░░░░░░░ 1.11K              │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ node-csvtojson         │ 118K   │ ░░░░░░░░░░░░░ 32.6                                          │ ░░░░░░░░░░░░░░ 1.08K              │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-parser (neat-csv)  │ 105K   │ ░░░░░░░░░░░░ 29                                             │ ░░░░░░░░░░░░░░░░ 1.3K             │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ csv-parse/sync         │ 70.5K  │ ░░░░░░░░ 19.5                                               │ ░░░░░░░░░░░ 829                   │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ jquery-csv             │ 43.7K  │ ░░░░░ 12.1                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 2.22K │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ @fast-csv/parse        │ 41.8K  │ ░░░░░ 11.6                                                  │ ░░░░░░░░░░░░░░ 1.07K              │ string │ [{"A0":"1370045100","B1":"4869044.81","C2":"463060 │
│ utils-dsv-base-parse   │ 36.6K  │ ░░░░ 10.1                                                   │ ░░░░░░░ 568                       │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
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
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 47 MiB baseline (MiB)   │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 745K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 133 │ ░░░░░░░░░ 458                     │ string │ [["00602","18.36075","-67.17541","Aguada","PR","Pu │
│ achilles-csv-parser    │ 448K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 80.1                     │ ░░░░░░░░░ 436                     │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ d3-dsv                 │ 413K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 73.8                        │ ░░░░░░░░░ 460                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-rex                │ 350K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 62.5                             │ ░░░░░░░░░ 461                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ PapaParse              │ 316K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 56.5                               │ ░░░░░░░░ 371                      │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-js                 │ 290K   │ ░░░░░░░░░░░░░░░░░░░░░░ 51.8                                 │ ░░░░░░░░░░░ 520                   │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv42                  │ 289K   │ ░░░░░░░░░░░░░░░░░░░░░░ 51.6                                 │ ░░░░░░░ 329                       │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ comma-separated-values │ 253K   │ ░░░░░░░░░░░░░░░░░░░ 45.2                                    │ ░░░░░░░░░ 429                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ CSVtoJSON              │ 248K   │ ░░░░░░░░░░░░░░░░░░░ 44.3                                    │ ░░░░░░░░░░ 504                    │ string │ [{"\"zip\"":"00602","\"lat\"":"18.36075","\"lng\"" │
│ csv-simple-parser      │ 247K   │ ░░░░░░░░░░░░░░░░░░░ 44.1                                    │ ░░░░░░░░ 385                      │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ SheetJS (native)       │ 239K   │ ░░░░░░░░░░░░░░░░░░ 42.7                                     │ ░░░░░░░░░░░░░ 635                 │ object │ [[{"t":"s","v":"00601"},{"t":"s","v":"18.18027"},{ │
│ csv-parser (neat-csv)  │ 229K   │ ░░░░░░░░░░░░░░░░░ 41                                        │ ░░░░░░░ 355                       │ string │ [{"zip":"00602","lat":"18.36075","lng":"-67.17541" │
│ ACsv                   │ 214K   │ ░░░░░░░░░░░░░░░░ 38.2                                       │ ░░░░░░░░░ 419                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ @vanillaes/csv         │ 194K   │ ░░░░░░░░░░░░░░░ 34.6                                        │ ░░░░░░░░░ 441                     │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ node-csvtojson         │ 166K   │ ░░░░░░░░░░░░░ 29.6                                          │ ░░░░░░░░░░ 466                    │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ csv-parse/sync         │ 121K   │ ░░░░░░░░░ 21.7                                              │ ░░░░░░░ 355                       │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ @fast-csv/parse        │ 78.5K  │ ░░░░░░ 14                                                   │ ░░░░░░░ 327                       │ string │ [{"zip0":"00602","lat1":"18.36075","lng2":"-67.175 │
│ jquery-csv             │ 53.8K  │ ░░░░ 9.6                                                    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.38K │ string │ [["00601","18.18027","-66.75266","Adjuntas","PR"," │
│ but-csv                │ ---    │ Wrong row count! Expected: 33790, Actual: 1                 │ ---                               │ ---    │ ---                                                │
│ @gregoranders/csv      │ ---    │ Invalid CSV at 1:109                                        │ ---                               │ ---    │ ---                                                │
│ utils-dsv-base-parse   │ ---    │ unexpected error. Encountered an invalid record. Field 17 o │ ---                               │ ---    │ ---                                                │
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
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 47 MiB baseline (MiB)   │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.67M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 140 │ ░░░░░░░░░░░░░ 728                 │ string │ [["traditional","purchase-only","monthly","USA or  │
│ d3-dsv                 │ 1.32M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 111            │ ░░░░░░░░░░░░ 678                  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ PapaParse              │ 1.3M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 109             │ ░░░░░░░░░░░░░ 727                 │ string │ [["traditional","purchase-only","monthly","USA or  │
│ but-csv                │ 1.3M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 109             │ ░░░░░░░░░░░ 607                   │ string │ [["traditional","purchase-only","monthly","USA or  │
│ ACsv                   │ 1.2M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 101                │ ░░░░░░░░░░░░ 674                  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ achilles-csv-parser    │ 1.07M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 90                     │ ░░░░░░░░░░░ 630                   │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-rex                │ 1.06M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 88.7                    │ ░░░░░░░░░░░░░ 716                 │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv42                  │ 1.05M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 88.1                    │ ░░░░░░░░░░░ 638                   │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ comma-separated-values │ 676K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 56.8                                │ ░░░░░░░░░░░ 615                   │ string │ [["traditional","purchase-only","monthly","USA or  │
│ SheetJS (native)       │ 674K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 56.6                                │ ░░░░░░░░░░░░░░░░░░ 1.02K          │ object │ [[{"t":"s","v":"traditional"},{"t":"s","v":"purcha │
│ csv-simple-parser      │ 561K   │ ░░░░░░░░░░░░░░░░░░░ 47.1                                    │ ░░░░░░░░░░░ 614                   │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-js                 │ 521K   │ ░░░░░░░░░░░░░░░░░░ 43.8                                     │ ░░░░░░░░░░░░░░ 782                │ string │ [["traditional","purchase-only","monthly","USA or  │
│ @vanillaes/csv         │ 493K   │ ░░░░░░░░░░░░░░░░░ 41.4                                      │ ░░░░░░░░░ 509                     │ string │ [["traditional","purchase-only","monthly","USA or  │
│ CSVtoJSON              │ 471K   │ ░░░░░░░░░░░░░░░░ 39.6                                       │ ░░░░░░░░░░░░░░ 783                │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-parser (neat-csv)  │ 433K   │ ░░░░░░░░░░░░░░░ 36.4                                        │ ░░░░░░░░░░ 545                    │ string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ @gregoranders/csv      │ 375K   │ ░░░░░░░░░░░░░ 31.5                                          │ ░░░░░░░░░░░░ 683                  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ node-csvtojson         │ 345K   │ ░░░░░░░░░░░░ 29                                             │ ░░░░░░░░░░░░ 680                  │ string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-parse/sync         │ 237K   │ ░░░░░░░░ 19.9                                               │ ░░░░░░░░ 414                      │ string │ [["traditional","purchase-only","monthly","USA or  │
│ jquery-csv             │ 169K   │ ░░░░░░ 14.2                                                 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.57K │ string │ [["traditional","purchase-only","monthly","USA or  │
│ @fast-csv/parse        │ 167K   │ ░░░░░░ 14                                                   │ ░░░░░░░░░░ 530                    │ string │ [{"hpi_type0":"traditional","hpi_flavor1":"purchas │
│ utils-dsv-base-parse   │ 150K   │ ░░░░░ 12.6                                                  │ ░░░░░░ 293                        │ string │ [["traditional","purchase-only","monthly","USA or  │
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
│ Name                   │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 49 MiB baseline (MiB) │ Types  │ Sample                                             │
├────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 2.46M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 367 │ ░░░░░░░ 56.4                    │ string │ [["2015-12-22T18:38:34.000Z","62.9616","-148.7532" │
│ but-csv                │ 1.61M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 241                   │ ░░░░░░░░ 58                     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ d3-dsv                 │ 1.56M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 233                     │ ░░░░░░░░ 60                     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ ACsv                   │ 1.42M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 212                        │ ░░░░░░░ 53.1                    │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ achilles-csv-parser    │ 935K   │ ░░░░░░░░░░░░░░░░░░░░░ 140                                   │ ░░░░░░░ 56.3                    │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ PapaParse              │ 861K   │ ░░░░░░░░░░░░░░░░░░░░ 129                                    │ ░░░░░░░░░░░░░░░ 123             │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv42                  │ 856K   │ ░░░░░░░░░░░░░░░░░░░░ 128                                    │ ░░░░░░░░ 62.3                   │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ csv-rex                │ 844K   │ ░░░░░░░░░░░░░░░░░░░ 126                                     │ ░░░░░░░░░░░░░░░░ 126            │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ SheetJS (native)       │ 762K   │ ░░░░░░░░░░░░░░░░░░ 114                                      │ ░░░░░░░░░░░░ 90.2               │ object │ [[{"t":"s","v":"2015-12-22T18:45:11.000Z"},{"t":"s │
│ node-csvtojson         │ 605K   │ ░░░░░░░░░░░░░░ 90.4                                         │ ░░░░░░░░░░░░░░░ 122             │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ comma-separated-values │ 570K   │ ░░░░░░░░░░░░░ 85.2                                          │ ░░░░░░░░ 60.5                   │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ @vanillaes/csv         │ 329K   │ ░░░░░░░░ 49.2                                               │ ░░░░░░░░░░░░░░░ 117             │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-simple-parser      │ 290K   │ ░░░░░░░ 43.3                                                │ ░░░░░░░░░░░░░░░░░░░ 148         │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-parser (neat-csv)  │ 265K   │ ░░░░░░ 39.7                                                 │ ░░░░░░░░░░░░░░░░░░░░░ 167       │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ csv-js                 │ 251K   │ ░░░░░░ 37.5                                                 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 221 │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ CSVtoJSON              │ 219K   │ ░░░░░ 32.7                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 206  │ string │ [{"time":"2015-12-22T18:38:34.000Z","latitude":"62 │
│ @gregoranders/csv      │ 213K   │ ░░░░░ 31.9                                                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 205  │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ csv-parse/sync         │ 146K   │ ░░░░ 21.9                                                   │ ░░░░░░░░░░░░░░░ 122             │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ jquery-csv             │ 126K   │ ░░░ 18.8                                                    │ ░░░░░░░░░░░░░░░░░░░░░░░ 186     │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
│ @fast-csv/parse        │ 105K   │ ░░░ 15.7                                                    │ ░░░░░░░░░░░░░░░ 121             │ string │ [{"time0":"2015-12-22T18:38:34.000Z","latitude1":" │
│ utils-dsv-base-parse   │ 86.2K  │ ░░ 12.9                                                     │ ░░░░░░░ 54.2                    │ string │ [["2015-12-22T18:45:11.000Z","59.9988","-152.7191" │
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
│ Name                            │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 49 MiB baseline (MiB)   │ Types  │ Sample                                             │
├─────────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼───────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 444K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 123 │ ░░░░░░░░░░ 626                    │ number │ [[1370045100,4869044.81,4630605.41,382.8270592,382 │
│ csv-simple-parser typed []      │ 278K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 77.2                    │ ░░░░░░░░░░░░ 764                  │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ csv-rex typed []                │ 274K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 75.9                     │ ░░░░░░░░ 506                      │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ d3-dsv typed []                 │ 220K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 60.9                           │ ░░░░░░░░░░░░░ 798                 │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ comma-separated-values typed {} │ 191K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 52.9                               │ ░░░░░░░░░░░░░░░░ 1.04K            │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ csv42 typed {}                  │ 151K   │ ░░░░░░░░░░░░░░░░░░░ 42                                      │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.5K      │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ achilles-csv-parser typed {}    │ 148K   │ ░░░░░░░░░░░░░░░░░░░ 41.1                                    │ ░░░░░░░░░░░░░░░░░░░░░░░ 1.49K     │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ @vanillaes/csv typed []         │ 122K   │ ░░░░░░░░░░░░░░░░ 33.9                                       │ ░░░░░░░ 456                       │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ CSVtoJSON typed {}              │ 119K   │ ░░░░░░░░░░░░░░░ 32.9                                        │ ░░░░░░░░░░░░░░░░░░░░ 1.26K        │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ SheetJS (native) typed          │ 118K   │ ░░░░░░░░░░░░░░░ 32.7                                        │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.77K │ object │ [[{"t":"n","w":"1370044800","v":1370044800},{"t":" │
│ csv-js typed []                 │ 118K   │ ░░░░░░░░░░░░░░░ 32.6                                        │ ░░░░░░░░ 484                      │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ PapaParse typed []              │ 113K   │ ░░░░░░░░░░░░░░ 31.3                                         │ ░░░░░░░░░░░░░░░░░░ 1.12K          │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
│ csv-parser (neat-csv) typed {}  │ 89.6K  │ ░░░░░░░░░░░░ 24.8                                           │ ░░░░░░░░░░░░░░░░░ 1.07K           │ number │ [{"A":1370045100,"B":4869044.81,"C":4630605.41,"D" │
│ csv-parse/sync typed []         │ 56.9K  │ ░░░░░░░░ 15.8                                               │ ░░░░░░░░ 469                      │ number │ [[1370044800,4819440.062,4645092.555,382.8436706,3 │
└─────────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴───────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Notes:

- uDSV offers the simplicity of Option #1 with the performance of Option #3.
- I could not find typing options for these parsers: `but-csv`, `@fast-csv/parse`, `jquery-csv`, `@gregoranders/csv`, `@stdlib/utils-dsv-base-parse`.
- `ACsv.js` and `node-csvtojson` provide typing only via [static column config](https://github.com/Keyang/node-csvtojson#column-parser), so they're excluded for not being generic.


**USA ZIP Codes**

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ uszips.csv (6 MB, 18 cols x 34K rows)                                                                                                                                                                                            │
├─────────────────────────────────┬────────┬────────────────────────────────────────────────────────────┬─────────────────────────────────┬───────────────────────────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                         │ RSS above 49 MiB baseline (MiB) │ Types                             │ Sample                                             │
├─────────────────────────────────┼────────┼────────────────────────────────────────────────────────────┼─────────────────────────────────┼───────────────────────────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 510K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 91 │ ░░░░░░░░░░░░░░ 369              │ boolean,null,number,object,string │ [[602,18.36075,-67.17541,"Aguada","PR","Puerto Ric │
│ achilles-csv-parser typed {}    │ 325K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 58.1                  │ ░░░░░░░░░░░░ 304                │ boolean,null,number,object,string │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ csv-simple-parser typed []      │ 298K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 53.3                     │ ░░░░░░░░░░░░ 318                │ boolean,null,number,object,string │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ csv-rex typed []                │ 260K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 46.5                         │ ░░░░░░░░░░░░░ 348               │ boolean,null,number,object,string │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ comma-separated-values typed {} │ 256K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 45.7                          │ ░░░░░░░░░░░░░░ 378              │ number,string                     │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ d3-dsv typed []                 │ 245K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 43.7                           │ ░░░░░░░░░░░░░░░ 392             │ null,number,string                │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ CSVtoJSON typed {}              │ 217K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 38.8                              │ ░░░░░░░░░░░ 291                 │ number,string                     │ [{"\"zip\"":602,"\"lat\"":18.36075,"\"lng\"":-67.1 │
│ csv-js typed []                 │ 214K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 38.3                              │ ░░░░░░░░░░░░░░░ 393             │ boolean,number,string             │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ csv42 typed {}                  │ 191K   │ ░░░░░░░░░░░░░░░░░░░░░ 34.2                                 │ ░░░░░░░░░░░░ 307                │ number,object,string              │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ csv-parser (neat-csv) typed {}  │ 182K   │ ░░░░░░░░░░░░░░░░░░░░ 32.5                                  │ ░░░░░░░░░░░░ 314                │ boolean,null,number,object,string │ [{"zip":602,"lat":18.36075,"lng":-67.17541,"city": │
│ PapaParse typed []              │ 172K   │ ░░░░░░░░░░░░░░░░░░░ 30.7                                   │ ░░░░░░░░░░░░░░░░ 436            │ boolean,null,number,string        │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ @vanillaes/csv typed []         │ 162K   │ ░░░░░░░░░░░░░░░░░░ 28.9                                    │ ░░░░░░░░░░░ 301                 │ NaN,number,string                 │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
│ SheetJS (native) typed          │ 105K   │ ░░░░░░░░░░░░ 18.7                                          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 744 │ object                            │ [[{"t":"n","w":"00601","v":601},{"t":"n","w":"18.1 │
│ csv-parse/sync typed []         │ 20.5K  │ ░░░ 3.66                                                   │ ░░░░░░░░░░░░░░ 382              │ number,string                     │ [[601,18.18027,-66.75266,"Adjuntas","PR","Puerto R │
└─────────────────────────────────┴────────┴────────────────────────────────────────────────────────────┴─────────────────────────────────┴───────────────────────────────────┴────────────────────────────────────────────────────┘
```

Notes:

- The values in the Types column are important. All parsers that show `object` (except SheetJS) ran `JSON.parse()` on the embedded JSON strings for each of 34K rows in this dataset. Additionally, there are 3 columns of boolean values here, so those without `boolean` did not do the work of converting 3 * 34k TRUE/FALSE strings.


**House Price Index**

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HPI_master.csv (10 MB, 10 cols x 120K rows)                                                                                                                                                                   │
├─────────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬───────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 49 MiB baseline (MiB) │ Types         │ Sample                                             │
├─────────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼───────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 1.37M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 115 │ ░░░░░░░░░░░░░░░░░ 607           │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ csv42 typed {}                  │ 890K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 74.8                   │ ░░░░░░░░░░░░░░░ 523             │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ achilles-csv-parser typed {}    │ 826K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 69.4                     │ ░░░░░░░░░░░░░░░░ 566            │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-rex typed []                │ 804K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 67.5                      │ ░░░░░░░░░░░░░░░░░ 604           │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ comma-separated-values typed {} │ 655K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 55                              │ ░░░░░░░░░░░░░░░░ 564            │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ d3-dsv typed []                 │ 635K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 53.4                             │ ░░░░░░░░░░░░░░░ 518             │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-simple-parser typed []      │ 530K   │ ░░░░░░░░░░░░░░░░░░░░░░ 44.6                                 │ ░░░░░░░░░░░░░░ 469              │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ PapaParse typed []              │ 478K   │ ░░░░░░░░░░░░░░░░░░░░ 40.2                                   │ ░░░░░░░░░░░░░░░░░░░░ 693        │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ CSVtoJSON typed {}              │ 443K   │ ░░░░░░░░░░░░░░░░░░ 37.2                                     │ ░░░░░░░░░░░░░░░ 501             │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ csv-js typed []                 │ 430K   │ ░░░░░░░░░░░░░░░░░░ 36.2                                     │ ░░░░░░░░░░░░░░░ 529             │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ @vanillaes/csv typed []         │ 393K   │ ░░░░░░░░░░░░░░░░ 33                                         │ ░░░░░░░░░░░░░░ 490              │ number,string │ [["traditional","purchase-only","monthly","USA or  │
│ csv-parser (neat-csv) typed {}  │ 385K   │ ░░░░░░░░░░░░░░░░ 32.4                                       │ ░░░░░░░░░░░░░░░ 504             │ number,string │ [{"hpi_type":"traditional","hpi_flavor":"purchase- │
│ SheetJS (native) typed          │ 221K   │ ░░░░░░░░░ 18.6                                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 964 │ object        │ [[{"t":"s","v":"traditional"},{"t":"s","v":"purcha │
│ csv-parse/sync typed []         │ 38.5K  │ ░░ 3.24                                                     │ ░░░░░░░░░░░░░░░░░ 574           │ number,string │ [["traditional","purchase-only","monthly","USA or  │
└─────────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴───────────────┴────────────────────────────────────────────────────┘
```


**Earthquakes**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ large-dataset.csv (1.1 MB, 15 cols x 7.3K rows)                                                                                                                                                                         │
├─────────────────────────────────┬────────┬─────────────────────────────────────────────────────────────┬─────────────────────────────────┬─────────────────────────┬────────────────────────────────────────────────────┤
│ Name                            │ Rows/s │ Throughput (MiB/s)                                          │ RSS above 49 MiB baseline (MiB) │ Types                   │ Sample                                             │
├─────────────────────────────────┼────────┼─────────────────────────────────────────────────────────────┼─────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────┤
│ uDSV typed []                   │ 869K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 130 │ ░░░░░░░░░░░ 68.4                │ date,null,number,string │ [["2015-12-22T18:38:34.000Z",62.9616,-148.7532,65. │
│ csv42 typed {}                  │ 589K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 88.1                 │ ░░░░░░░░░░ 57.9                 │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ achilles-csv-parser typed {}    │ 562K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 84                     │ ░░░░░░░░░░ 60.2                 │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ csv-rex typed []                │ 547K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 81.8                    │ ░░░░░░░░░░░░░░░░░░ 112          │ null,number,string      │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ comma-separated-values typed {} │ 498K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 74.4                       │ ░░░░░░░░░░ 58.8                 │ number,string           │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ d3-dsv typed []                 │ 337K   │ ░░░░░░░░░░░░░░░░░░░░░░ 50.3                                 │ ░░░░░░░░░░░ 64.9                │ date,null,number,string │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ PapaParse typed []              │ 264K   │ ░░░░░░░░░░░░░░░░░ 39.5                                      │ ░░░░░░░░░░░░░░░░░░░░░░░ 139     │ date,null,number,string │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ csv-simple-parser typed []      │ 245K   │ ░░░░░░░░░░░░░░░░ 36.7                                       │ ░░░░░░░░░░░░░░░░░░░░░░ 134      │ null,number,string      │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ @vanillaes/csv typed []         │ 240K   │ ░░░░░░░░░░░░░░░░ 35.8                                       │ ░░░░░░░░░░░░░░░░░░ 109          │ NaN,number,string       │ [[2015,59.9988,-152.7191,100,3,"ml",null,null,null │
│ csv-js typed []                 │ 229K   │ ░░░░░░░░░░░░░░░ 34.2                                        │ ░░░░░░░░░░░░░░░░░░░░░░ 135      │ number,string           │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
│ csv-parser (neat-csv) typed {}  │ 225K   │ ░░░░░░░░░░░░░░░ 33.6                                        │ ░░░░░░░░░░░░░░░░░░░░░░ 134      │ null,number,string      │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ CSVtoJSON typed {}              │ 220K   │ ░░░░░░░░░░░░░░ 32.8                                         │ ░░░░░░░░░░░░░░░░░░░░░░ 136      │ number,string           │ [{"time":"2015-12-22T18:38:34.000Z","latitude":62. │
│ SheetJS (native) typed          │ 97K    │ ░░░░░░░ 14.5                                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 168 │ object                  │ [[{"t":"s","v":"2015-12-22T18:45:11.000Z"},{"t":"n │
│ csv-parse/sync typed []         │ 28.1K  │ ░░ 4.2                                                      │ ░░░░░░░░░░░░░░░░░░░░░ 127       │ date,number,string      │ [["2015-12-22T18:45:11.000Z",59.9988,-152.7191,100 │
└─────────────────────────────────┴────────┴─────────────────────────────────────────────────────────────┴─────────────────────────────────┴─────────────────────────┴────────────────────────────────────────────────────┘
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