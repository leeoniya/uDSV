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
    <th>Machine</th>
    <td>ThinkPad P14s, 48GB RAM, <a href="https://www.amd.com/en/products/apu/amd-ryzen-7-pro-5850u">AMD Ryzen 7 PRO 5850U</a><br>(1.9GHz / 7nm / 15W TDP)</td>
  </tr>
  <tr>
    <th>OS</th>
    <td>EndeavourOS (Arch Linux)<br>v6.4.11-arch2-1 x86_64</td>
  </tr>
  <tr>
    <th>Storage</th>
    <td>Samsung SSD 980 PRO 1TB (NVMe)</td>
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


Here's the output for each dataset:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_strings.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                             │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 47 MiB baseline (MiB)    │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.39M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 264 │ ░░░░░░░ 69.4                       │ string │ [["m 2tn5AF","ywO","tecaOIw6K1XLXf","osxLRmM0A3Eo" │
│ but-csv                │ 932K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 178                 │ ░░░░░░░░ 80                        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv-simple-parser      │ 831K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 158                     │ ░░░░░░░░░ 84.4                     │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ PapaParse              │ 639K   │ ░░░░░░░░░░░░░░░░░░░░░░░░ 122                           │ ░░░░░░░░░░░░░░░░░ 170              │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ d3-dsv                 │ 612K   │ ░░░░░░░░░░░░░░░░░░░░░░░ 117                            │ ░░░░░░░░░░░░░░░░░░ 174             │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ node-csvtojson         │ 405K   │ ░░░░░░░░░░░░░░░ 77.2                                   │ ░░░░░░░░░░░░░░░░░░░░░ 206          │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ SheetJS (native)       │ 323K   │ ░░░░░░░░░░░░ 61.5                                      │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 301 │ object │ [[{"t":"s","v":"HCbe"},{"t":"s","v":"029"},{"t":"s │
│ comma-separated-values │ 323K   │ ░░░░░░░░░░░░ 61.5                                      │ ░░░░░░░░░░░░░░░░░░░░░░ 217         │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ achilles-csv-parser    │ 305K   │ ░░░░░░░░░░░ 58.1                                       │ ░░░░░░░░░░░░░░░░░░░░░░░░ 234       │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ @vanillaes/csv         │ 252K   │ ░░░░░░░░░░ 48.1                                        │ ░░░░░░░░░░░░░░░░░░░ 184            │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv-js                 │ 238K   │ ░░░░░░░░░ 45.4                                         │ ░░░░░░░░░░░░░░░░░░░░░░░ 226        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ CSVtoJSON              │ 238K   │ ░░░░░░░░░ 45.4                                         │ ░░░░░░░░░░░░░░░░░░░░░░░ 224        │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ @gregoranders/csv      │ 216K   │ ░░░░░░░░ 41.1                                          │ ░░░░░░░░░░░░░░░░░░░░░░░ 222        │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ csv42                  │ 199K   │ ░░░░░░░░ 37.9                                          │ ░░░░░░░░░░░░░░░░░░░░░░░ 222        │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-parser (neat-csv)  │ 177K   │ ░░░░░░░ 33.8                                           │ ░░░░░░░░░░░░░░░░░░ 181             │ string │ [{"GtQ56taEqPynZE":"m 2tn5AF","wEAh":"ywO","f5z":" │
│ csv-parse/sync         │ 114K   │ ░░░░░ 21.8                                             │ ░░░░░░░░░░░░░░░░ 152               │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ jquery-csv             │ 95.5K  │ ░░░░ 18.2                                              │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 291  │ string │ [["HCbe","029","PP1kw","igSUIHib6H3t","Pd98sXAUBj" │
│ @fast-csv/parse        │ 75K    │ ░░░ 14.3                                               │ ░░░░░░░░░░░░░░░░░░░░░ 203          │ string │ [{"GtQ56taEqPynZE0":"m 2tn5AF","wEAh1":"ywO","f5z2 │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_ints.csv (1 MB, 20 cols x 10K rows)                                                                                                                                                  │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 47 MiB baseline (MiB)    │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 2.66M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 273 │ ░░░░░░ 54.4                        │ string │ [["6287","-60","7062","-3411","4613","-5840","209" │
│ csv-simple-parser      │ 1.6M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 165                    │ ░░░░░░░ 60.9                       │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ d3-dsv                 │ 1.31M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 135                          │ ░░░░░░░░ 74.8                      │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ but-csv                │ 981K   │ ░░░░░░░░░░░░░░░░░░░ 101                                │ ░░░░░░░ 68.3                       │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ PapaParse              │ 718K   │ ░░░░░░░░░░░░░░ 73.8                                    │ ░░░░░░░░░░░░░░░ 148                │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ @gregoranders/csv      │ 541K   │ ░░░░░░░░░░░ 55.6                                       │ ░░░░░░░░░░ 93.1                    │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ achilles-csv-parser    │ 504K   │ ░░░░░░░░░░ 51.9                                        │ ░░░░░░░░░░░░░░░░░░░ 188            │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ node-csvtojson         │ 501K   │ ░░░░░░░░░░ 51.5                                        │ ░░░░░░░░░░░░░░░░░ 168              │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-js                 │ 473K   │ ░░░░░░░░░ 48.6                                         │ ░░░░░░░░░░░░░░░░░░░ 182            │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ comma-separated-values │ 395K   │ ░░░░░░░░ 40.6                                          │ ░░░░░░░░░░░░░░░░░ 166              │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ SheetJS (native)       │ 369K   │ ░░░░░░░ 37.9                                           │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 302 │ object │ [[{"t":"s","v":"-8399"},{"t":"s","v":"-5705"},{"t" │
│ csv42                  │ 334K   │ ░░░░░░░ 34.3                                           │ ░░░░░░░░░░░░░░░░░ 171              │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ CSVtoJSON              │ 275K   │ ░░░░░░ 28.3                                            │ ░░░░░░░░░░░░░░░░░░░░░░ 215         │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ @vanillaes/csv         │ 268K   │ ░░░░░░ 27.5                                            │ ░░░░░░░░░░░░░░░░░ 164              │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ csv-parser (neat-csv)  │ 203K   │ ░░░░ 20.9                                              │ ░░░░░░░░░░░░░░░░░░░░░ 205          │ string │ [{"zYs0DQRw06":"6287","E5mPdSri":"-60","Cku78":"70 │
│ csv-parse/sync         │ 156K   │ ░░░ 16                                                 │ ░░░░░░░░░░░░░░░░ 154               │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ jquery-csv             │ 101K   │ ░░ 10.4                                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 272   │ string │ [["-8399","-5705","-5076","8780","8650","-55","741 │
│ @fast-csv/parse        │ 93K    │ ░░ 9.56                                                │ ░░░░░░░░░░░░░░░░░░░░ 193           │ string │ [{"zYs0DQRw060":"6287","E5mPdSri1":"-60","Cku782": │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ litmus_quoted.csv (1.9 MB, 20 cols x 10K rows)                                                                                                                                              │
├────────────────────────┬────────┬────────────────────────────────────────────────────────┬────────────────────────────────────┬────────┬────────────────────────────────────────────────────┤
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 47 MiB baseline (MiB)    │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 1.61M  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 298 │ ░░░░░░ 73.4                        │ string │ [["JitoL7gXbT","-3677"," NoqmZHgaSk14","1997","mtW │
│ csv-simple-parser      │ 1.2M   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 222             │ ░░░░░ 70.8                         │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ but-csv                │ 873K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 162                       │ ░░░░░░ 85.2                        │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ achilles-csv-parser    │ 401K   │ ░░░░░░░░░░░░░ 74.2                                     │ ░░░░░░░░ 106                       │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ d3-dsv                 │ 394K   │ ░░░░░░░░░░░░░ 72.9                                     │ ░░░░░░░░░░░░░ 183                  │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ PapaParse              │ 289K   │ ░░░░░░░░░░ 53.6                                        │ ░░░░░░░░░░░░░░ 196                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-js                 │ 283K   │ ░░░░░░░░░ 52.3                                         │ ░░░░░░░░░░░░░░░ 210                │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ SheetJS (native)       │ 238K   │ ░░░░░░░░ 44.1                                          │ ░░░░░░░░░░░░░░░░░░░░░ 293          │ object │ [[{"t":"s","v":"UPwF"},{"t":"s","v":"5742"},{"t":" │
│ comma-separated-values │ 229K   │ ░░░░░░░░ 42.4                                          │ ░░░░░░░░░░░░░░ 191                 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @vanillaes/csv         │ 205K   │ ░░░░░░░ 37.9                                           │ ░░░░░░░░░░░░ 167                   │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv42                  │ 193K   │ ░░░░░░░ 35.7                                           │ ░░░░░░░░░░░░░░░ 214                │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ node-csvtojson         │ 179K   │ ░░░░░░ 33.1                                            │ ░░░░░░░░░░░░░ 185                  │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ CSVtoJSON              │ 170K   │ ░░░░░░ 31.5                                            │ ░░░░░░░░░░░░░░░░ 221               │ string │ [{"\"DRadpUJ9TCnUO0\"":"JitoL7gXbT","\"92ZnE3J8IME │
│ csv-parser (neat-csv)  │ 155K   │ ░░░░░ 28.8                                             │ ░░░░░░░░░░░░░░░ 206                │ string │ [{"DRadpUJ9 TCnUO0":"JitoL7gXbT","92ZnE3J8IME4Ru": │
│ @gregoranders/csv      │ 114K   │ ░░░░ 21.1                                              │ ░░░░░░░░░░░░ 171                   │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ csv-parse/sync         │ 106K   │ ░░░░ 19.6                                              │ ░░░░░░░░░░░░ 161                   │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
│ @fast-csv/parse        │ 69.8K  │ ░░░ 12.9                                               │ ░░░░░░░░░░░░░░░ 209                │ string │ [{"DRadpUJ9 TCnUO00":"JitoL7gXbT","92ZnE3J8IME4Ru1 │
│ jquery-csv             │ 55.7K  │ ░░ 10.3                                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 437 │ string │ [["UPwF","5742","TWB88","-2020","ih2q9F5ijs","-864 │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Notes:

1. Bizzarely, the throughput of many parsers drops off a cliff with integer strings, even though we're not actually converting anything to integers, the memory usage is unchanged, and the dataset is 50% smaller.
2. A significant portion exhibits 40%-60% performance deterioration when quotes are introduced.
3. Despite enabling `.supportQuotedField(true)`, CSVtoJSON does not properly remove the wrapping quotes from column names.

---
### Real World Datasets

Synthetic datsets can be too uniform to extrapolate actual performance in production environments.
Testing with real data can surface inefficiencies in code paths that were either bypassed or infrequently executed.


Sensor data:

https://github.com/Schlumberger/hackathon/blob/master/backend/dataset/data-large.csv

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
│ Name                   │ Rows/s │ Throughput (MiB/s)                                     │ RSS above 49 MiB baseline (MiB)      │ Types  │ Sample                                             │
├────────────────────────┼────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────┼────────┼────────────────────────────────────────────────────┤
│ uDSV                   │ 511K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 142 │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 2.09K  │ string │ [["1370045100","4869044.81","4630605.41","382.8270 │
│ csv-simple-parser      │ 395K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 110            │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.92K     │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ d3-dsv                 │ 387K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 107             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.98K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ PapaParse              │ 382K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 106             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.93K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ but-csv                │ 367K   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 102               │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.93K    │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ comma-separated-values │ 221K   │ ░░░░░░░░░░░░░░░░░░░░░░ 61.3                            │ ░░░░░░░░░░░░░░░░░ 1.25K              │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ SheetJS (native)       │ 188K   │ ░░░░░░░░░░░░░░░░░░░ 52.2                               │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.98K    │ object │ [[{"t":"s","v":"1370044800"},{"t":"s","v":"4819440 │
│ csv-js                 │ 184K   │ ░░░░░░░░░░░░░░░░░░░ 51.1                               │ ░░░░░░░░░░░░░░░░░░ 1.28K             │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv42                  │ 179K   │ ░░░░░░░░░░░░░░░░░░ 49.6                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.89K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ achilles-csv-parser    │ 177K   │ ░░░░░░░░░░░░░░░░░░ 48.9                                │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.88K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ CSVtoJSON              │ 162K   │ ░░░░░░░░░░░░░░░░ 45                                    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.87K     │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ @gregoranders/csv      │ 150K   │ ░░░░░░░░░░░░░░░ 41.5                                   │ ░░░░░░░░░░░░░░░░ 1.11K               │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ @vanillaes/csv         │ 138K   │ ░░░░░░░░░░░░░░ 38.2                                    │ ░░░░░░░░░░░░░░░ 1.1K                 │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ node-csvtojson         │ 119K   │ ░░░░░░░░░░░░ 32.9                                      │ ░░░░░░░░░░░░░░░ 1.07K                │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ csv-parser (neat-csv)  │ 106K   │ ░░░░░░░░░░░ 29.3                                       │ ░░░░░░░░░░░░░░░░░░ 1.3K              │ string │ [{"A":"1370045100","B":"4869044.81","C":"4630605.4 │
│ csv-parse/sync         │ 73.2K  │ ░░░░░░░░ 20.3                                          │ ░░░░░░░░░░░░ 830                     │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
│ @fast-csv/parse        │ 45.3K  │ ░░░░░ 12.6                                             │ ░░░░░░░░░░░░░░░ 1.07K                │ string │ [{"A0":"1370045100","B1":"4869044.81","C2":"463060 │
│ jquery-csv             │ 43.7K  │ ░░░░░ 12.1                                             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 2.22K │ string │ [["1370044800","4819440.062","4645092.555","382.84 │
└────────────────────────┴────────┴────────────────────────────────────────────────────────┴──────────────────────────────────────┴────────┴────────────────────────────────────────────────────┘
```

Notes:

- With this 36MB dataset, all the faster libs bump into the 2GB memory limit. With GC'd/JIT'ed runtimes, lower peak memory does not imply faster perf (as was the correlation in the synthetic runs).
- uDSV is not faster by the same huge margin over PapaParse as in the synthetic `litmus_ints.csv` case  where it was 273 MiB/s vs 74 MiB/s.