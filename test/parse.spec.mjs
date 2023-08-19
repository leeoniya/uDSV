import { schema, parse } from '../src/uDSV.mjs';
import Papa from 'papaparse';

import { strict as assert } from 'node:assert';
import test from 'node:test';

// https://github.com/maxogden/csv-spectrum

// RFC 4180: https://www.ietf.org/rfc/rfc4180.txt
const rfc4180 = `
"Year ,"",d,",Make,Model,Description,Price
1997,Ford,E350,"ac, abs, moon",3000.00
1999,Chevy,"Venture ""Extended Edition""","",4900.00
1999,Chevy,"Venture ""Extended Edition, Very Large""",,5000.00
1996,Jeep,Grand Cherokee,"MUST SELL!\nair, moon roof, loaded",4799.00
"weird""""quotes ",true,false,123,45.6
.7,8.,9.1.2,null,undefined
Null, "ok whitespace outside quotes" ,trailing unquoted  ,   both   ,   leading
`.trim();


// numeric no quotes, empty first col header
const sensorData = `
,ESP01,ESP01,ESP01,ESP01,ESP01,ESP01,ESP02,ESP02,ESP02,ESP02,ESP02,ESP02,ESP03,ESP03,ESP03,ESP03,ESP03,ESP03,IC01,IC01,IC01,IC01,IC01,IC01,IC01,IC01,IC01,IC02,IC02,IC02,IC02,IC02,IC02,IC02,IC02,IC02
time,DISCHARGE_PRESSURE,INTAKE_PRESSURE,INTAKE_TEMPERATURE,MOTOR_TEMP,VSDFREQOUT,VSDMOTAMPS,DISCHARGE_PRESSURE,INTAKE_PRESSURE,INTAKE_TEMPERATURE,MOTOR_TEMP,VSDFREQOUT,VSDMOTAMPS,DISCHARGE_PRESSURE,INTAKE_PRESSURE,INTAKE_TEMPERATURE,MOTOR_TEMP,VSDFREQOUT,VSDMOTAMPS,CHOKE_POSITION,PRESSURE1,PRESSURE2,TEMPERATURE1,TEMPERATURE2,WATER_CUT,LIQUID_RATE,WATER_RATE,OIL_RATE,CHOKE_POSITION,PRESSURE1,PRESSURE2,TEMPERATURE1,TEMPERATURE2,WATER_CUT,LIQUID_RATE,WATER_RATE,OIL_RATE
s,psia,psia,K,K,Hz,A,psia,psia,K,K,Hz,A,psia,psia,K,K,Hz,A,%,psia,psia,degF,degF,%,bbl/d,bbl/d,bbl/d,%,psia,psia,degF,degF,%,bbl/d,bbl/d,bbl/d
1370044800,4819440.062,4645092.555,382.8436706,383.0596235,0,2,13935372.4,4230328.642,358.828813,375.6540512,45.01385132,191.3370908,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,192,197,0,0,0,0,0,2489,2485,196,193,0.2,0,0,0
1370045100,4869044.81,4630605.41,382.8270592,382.9445269,0,2,13064140.62,4141697.565,359.4253646,379.0754459,43.99295035,195.107323,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,194,196,0,0,0,0,0,2489,2485,198,196,0.2,0,0,0
1370045400,4824754.919,4684340.8,382.8626879,382.9402203,0,2,14110557.56,4430323.167,357.2496335,374.2655201,44.16140698,189.5892357,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,197,192,0,0,0,0,0,2489,2485,195,193,0.5,0,0,0
1370045700,4849769.046,4697244.12,382.862196,382.9384828,0,2,12781664.74,3917750.211,359.2356498,378.5094705,45.02241074,199.5982215,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,191,196,0,0,0,0,0,2489,2485,196,198,0.8,0,0,0
1370046000,4838199.888,4705090.494,382.855058,382.9485043,0,2,15252131.42,4355878.258,356.3494983,373.59845,44.04228406,209.9629697,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,197,191,0,0,0,0,0,2489,2485,195,196,0.3,0,0,0
1370046300,4874408.563,4669871.883,382.8602124,382.9429073,0,2,13265647.71,3927390.758,358.2028666,375.2891046,44.01957626,195.5540406,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,198,192,0,0,0,0,0,2489,2485,193,194,0.6,0,0,0
1370046600,4881519.006,4719413.687,382.8373211,383.0652267,0,2,13354581.73,4021439.193,356.7532733,374.0088882,44.96789158,198.5790972,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,194,190,0,0,0,0,0,2489,2485,195,194,0.2,0,0,0
1370046900,4882975.358,4734971.022,382.8473477,382.9573156,0,2,12820805.24,4391322.37,357.6601331,375.5044508,45.01236471,202.962082,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,191,194,0,0,0,0,0,2489,2485,198,194,0.1,0,0,0
1370047200,4920824.82,4713528.525,382.8364612,382.9488394,0,2,12916671.85,4193765.433,357.797535,375.9710373,43.87836996,199.9560819,5872264.787,5487537.33,346.35,351.65,0,0,1,2500,2498,197,194,0,0,0,0,0,2489,2485,198,195,0.9,0,0,0
1370047500,4901630.492,4740635.653,382.8488503,383.0369246,0,2,14485507.2,4348984.906,358.8850654,379.0349119,45.22189222,205.88019,5872264.787,5487537.33,346.35,351.65,46.41435621,94.93697826,2,2500,2498,195,195,0,0,0,0,0,2489,2485,194,198,0.9,0,0,0
1370047800,4873154.819,4715428.172,382.8591725,382.9416722,0,2,12881988.94,4099843.641,358.9779449,378.5537029,45.12071369,205.0244558,5872264.787,5487537.33,346.35,351.65,48.52343417,105.9977619,2,2500,2498,198,192,0,0,0,0,0,2489,2485,195,197,0.4,0,0,0
1370048100,4893390.571,4721426.526,382.867752,383.0599564,0,2,12765945.49,4309535.709,358.7054066,377.5425966,43.96431582,205.7460382,5872264.787,5487537.33,346.35,351.65,49.85407065,111.4877587,2,2500,2498,191,196,0,0,0,0,0,2489,2485,197,197,0.6,0,0,0
1370048400,4879048.085,4753184.975,382.849489,383.0353867,0,2,12720091.38,4224101.166,358.5955321,375.4658393,44.93806861,202.8163518,5872264.787,5487537.33,346.35,351.65,52.77793672,118.1129597,2,2500,2498,195,194,0,0,0,0,0,2489,2485,196,195,0.5,0,0,0
1370048700,4889960.69,4749390.417,382.9299731,382.9518153,0,2,13998945.42,4300883.438,359.3843395,378.215564,45.08556845,208.2422969,5872264.787,5487537.33,346.35,351.65,56.98651332,131.1547043,2,2500,2498,193,195,0,0,0,0,0,2489,2485,194,195,0.6,0,0,0
1370049000,4912249.84,4760800.279,382.8727797,382.9345629,0,2,12804967.56,3993107.051,359.4069211,378.9947543,43.95625215,206.0352794,5872264.787,5487537.33,346.35,351.65,60.02343919,145.5304819,2,2500,2498,191,194,0,0,0,0,0,2489,2485,196,198,0.7,0,0,0
1370049300,4900453.621,4729708.421,382.8358987,383.0393154,0,2,14310729.63,4289224.494,358.5877674,375.5965533,43.96980931,191.2742644,5872264.787,5487537.33,346.35,351.65,60.28357113,146.9820172,2,2500,2498,191,194,0,0,0,0,0,2489,2485,195,194,0.7,0,0,0
1370049600,4939002.977,4778221.328,382.8414627,383.0500122,0,2,13528428.52,4037010.298,359.0738023,378.225188,45.16165797,190.6073116,5872264.787,5487537.33,346.35,351.65,60.85867658,145.4443089,2,2500,2498,190,196,0,0,0,0,0,2489,2485,195,194,0.2,0,0,0
1370049900,4922707.917,4809135.887,382.8410027,382.9604459,0,2,13574199.69,3974790.385,360.3259102,380.4797949,44.03431386,179.2748913,5872264.787,5487537.33,346.35,351.65,60.44002399,153.8347625,3,2500,2498,193,191,0,0,0,0,0,2489,2485,195,193,0.5,0,0,0
1370050200,4910941.609,4780454.284,382.8410234,382.9398043,0,2,13406345.13,3798000.116,360.3041788,383.712515,44.88887882,180.5573077,5872264.787,5487537.33,346.35,351.65,61.59241152,149.6088084,3,2500,2498,198,195,0,0,0,0,0,2489,2485,195,194,0.7,0,0,0
1370050500,4946316.38,4778416.451,382.8371669,383.0457072,0,2,13442227.67,3903163.227,361.0196848,382.9446976,44.0386495,179.4264291,5872264.787,5487537.33,346.35,351.65,60.83991935,146.8514584,3,2500,2498,190,198,0,0,0,0,0,2489,2485,197,196,0.8,0,0,0
1370050800,4951813.766,4786864.863,382.8396436,382.9408234,0,2,13809745.92,4000950.576,361.9561805,382.3356796,44.8957251,182.9228008,5872264.787,5487537.33,346.35,351.65,60.69250902,147.1983924,3,2500,2498,195,191,0,0,0,0,0,2489,2485,198,198,0.4,0,0,0
1370051100,4967155.333,4784624.592,382.8502594,382.9566992,0,2,13367585.84,3912556.682,360.6252082,378.6537493,43.85860871,183.1704962,5872264.787,5487537.33,346.35,351.65,59.86964687,145.0114908,3,2500,2498,194,191,0,0,0,0,0,2489,2485,194,195,0.6,0,0,0
1370051400,4940622.7,4830090.932,382.8699804,382.8590136,0,2,13496536.56,3940891.504,360.1341286,377.3563129,44.02534738,186.3337538,5872264.787,5487537.33,346.35,351.65,60.24996413,145.425521,3,2500,2498,193,196,0,0,0,0,0,2489,2485,197,195,0.5,0,0,0
1370051700,5000496.95,4853236.38,382.8281477,382.9443469,0,2,13662189.11,4067157.513,359.0960086,376.3737599,44.93067717,194.5800985,5872264.787,5487537.33,346.35,351.65,60.48106623,143.8613302,3,2500,2498,193,191,0,0,0,0,0,2489,2485,196,194,0.9,0,0,0
1370052000,4961651.486,4824291.278,382.7524489,382.9677383,0,2,13516371.98,4005496.417,358.0673644,376.8632968,43.98775658,202.1211692,5872264.787,5487537.33,346.35,351.65,61.61521239,140.5460096,3,2500,2498,193,194,0,0,0,0,0,2489,2485,195,197,0.3,0,0,0
1370052300,5008480.781,4839693.694,382.7471395,382.9561597,0,2,13520973.86,3898156.909,357.4544188,376.8925375,44.9528483,202.4070669,5872264.787,5487537.33,346.35,351.65,61.72011281,134.9018258,3,2500,2498,191,197,0,0,0,0,0,2489,2485,194,196,0.5,0,0,0
1370052600,4980950.361,4855402.226,382.7576329,382.8428392,0,2,14734335.34,3998641.344,357.7688895,376.0863406,43.93592815,206.6430389,5872264.787,5487537.33,346.35,351.65,61.55804993,132.4816554,3,2500,2498,196,195,0,0,0,0,0,2489,2485,196,194,0.3,0,0,0
1370052900,4995109.512,4847432.5,382.7433349,382.8458938,0,2,12991935.98,4389161.827,356.1415746,373.9250924,43.98788311,199.9670325,5872264.787,5487537.33,346.35,351.65,60.56623651,132.5555831,3,2500,2498,190,193,0,0,0,0,0,2489,2485,196,194,0.9,0,0,0
1370053200,4998661.966,4869130.95,382.7655182,382.8496068,0,2,10395543.88,4362951.902,357.2426038,368.2357205,45.11377249,153.8049518,5872264.787,5487537.33,346.35,351.65,59.93342895,127.4241143,3,2500,2498,197,190,0,0,0,0,0,2489,2485,194,196,0.8,0,0,0
`.trim();


// https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv
// only necessary things quoted
// dates, empty cols
const earthquakes = `
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
2015-12-22T17:45:24.450Z,36.0003333,-120.5606667,2.42,1.51,md,33,86,0.02151,0.07,nc,nc72570646,2015-12-22T18:20:19.730Z,"23km SW of Coalinga, California",earthquake
2015-11-30T10:05:53.400Z,19.1539,-65.4257,11,3.2,Md,6,252,0.8525012,0.7,pr,pr15334005,2015-11-30T18:08:33.950Z,"91km NNE of Luquillo, Puerto Rico",earthquake
2015-11-30T10:03:06.000Z,60.1266,-141.6817,0,1.1,ml,11,161.999987040001,,0.28,ak,ak12094359,2015-12-08T18:26:55.691Z,"42km E of Cape Yakataga, Alaska",earthquake
2015-11-30T10:01:39.000Z,53.5475,-165.3041,53.6,1.9,ml,11,266.399978688002,,0.29,ak,ak12177787,2015-12-08T18:27:48.834Z,"72km SSE of Akutan, Alaska",earthquake
2015-11-30T10:01:08.000Z,53.5646,-165.3284,53.9,1.9,ml,12,262.799978976002,,0.26,ak,ak12094358,2015-12-08T18:26:54.859Z,"69km SSE of Akutan, Alaska",earthquake
2015-11-30T10:00:39.280Z,33.8098333,-117.0055,5.87,0.78,ml,21,68,0.03137,0.14,ci,ci37279271,2015-11-30T14:02:59.267Z,"5km WNW of San Jacinto, California",earthquake
2015-11-30T09:59:09.000Z,56.935,-154.5575,54.4,2,ml,8,158.399987328001,,0.52,ak,ak12177785,2015-12-08T18:27:43.017Z,"75km SSW of Larsen Bay, Alaska",earthquake
2015-11-30T09:51:26.000Z,52.6955,-168.7416,38.3,2.2,ml,10,230.399981568002,,0.23,ak,ak12177784,2015-12-08T18:27:40.268Z,"28km SSE of Nikolski, Alaska",earthquake
2015-11-30T09:49:33.000Z,61.5534,-146.4165,25.3,1.2,ml,16,68.3999945280004,,0.45,ak,ak12177783,2015-12-08T18:27:39.224Z,"47km N of Valdez, Alaska",earthquake
2015-11-30T09:49:13.490Z,36.7371,-98.0061,5,4.7,mwr,,67,0.163,0.56,us,us1000424d,2015-12-17T18:49:07.847Z,"25km WSW of Medford, Oklahoma",earthquake
2015-11-30T09:33:30.420Z,33.5821667,-116.8051667,9,0.29,ml,22,87,0.03616,0.1,ci,ci37279263,2015-12-01T00:31:59.582Z,"13km WNW of Anza, California",earthquake
`.trim();


// https://www.fhfa.gov/DataTools/Downloads/Pages/House-Price-Index-Datasets.aspx
// https://www.fhfa.gov/HPI_master.csv
// TODO: add disclaimer for streaming parsers that may have quotes in later chunks but not detected in schema
// only necessary things quoted
// empty last col
const housingPriceIndex = `
hpi_type,hpi_flavor,frequency,level,place_name,place_id,yr,period,index_nsa,index_sa
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,1,100.00,100.00
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,2,100.91,100.96
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,3,101.31,100.92
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,4,101.69,100.98
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,5,102.33,101.36
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,6,102.78,101.50
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,7,102.97,101.84
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,8,103.14,102.04
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,9,102.84,102.00
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,10,103.07,102.31
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,11,103.97,103.34
traditional,purchase-only,monthly,USA or Census Division,East North Central Division,DV_ENC,1991,12,103.74,103.40
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2005,3,163.58,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2005,4,165.64,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2006,1,167.68,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2006,2,173.22,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2006,3,176.77,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2006,4,180.39,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2007,1,184.53,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2007,2,189.97,
traditional,all-transactions,quarterly,MSA,"Austin-Round Rock-Georgetown, TX",12420,2007,3,191.83,
`.trim();

// https://simplemaps.com/data/us-zips
// https://simplemaps.com/static/data/us-zips/1.82/basic/simplemaps_uszips_basicv1.82.zip
// everything quoted
// JSON with escaped quotes
// booleans,numbers
const uszips = `
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
"00624","18.05905","-66.71932","Penuelas","PR","Puerto Rico","TRUE","","21912","180.2","72111","Peñuelas","{""72111"": 94.96, ""72113"": 5.04}","Peñuelas|Ponce","72111|72113","FALSE","FALSE","America/Puerto_Rico"
"00627","18.41905","-66.86037","Camuy","PR","Puerto Rico","TRUE","","32885","273.8","72027","Camuy","{""72027"": 100}","Camuy","72027","FALSE","FALSE","America/Puerto_Rico"
"00631","18.1852","-66.83169","Castaner","PR","Puerto Rico","TRUE","","1098","135.6","72081","Lares","{""72081"": 50.58, ""72001"": 49.42}","Lares|Adjuntas","72081|72001","FALSE","FALSE","America/Puerto_Rico"
"00636","18.16354","-67.08014","Rosario","PR","Puerto Rico","TRUE","","1174","1236.0","72125","San Germán","{""72125"": 100}","San Germán","72125","FALSE","FALSE","America/Puerto_Rico"
"00637","18.081","-66.94659","Sabana Grande","PR","Puerto Rico","TRUE","","23016","252.7","72121","Sabana Grande","{""72121"": 94.01, ""72125"": 4.2, ""72079"": 1.79}","Sabana Grande|San Germán|Lajas","72121|72125|72079","FALSE","FALSE","America/Puerto_Rico"
"00638","18.28462","-66.5137","Ciales","PR","Puerto Rico","TRUE","","17689","95.7","72039","Ciales","{""72039"": 91.88, ""72107"": 7.48, ""72091"": 0.64}","Ciales|Orocovis|Manatí","72039|72107|72091","FALSE","FALSE","America/Puerto_Rico"
"00641","18.26742","-66.70212","Utuado","PR","Puerto Rico","TRUE","","24915","114.4","72141","Utuado","{""72141"": 100}","Utuado","72141","FALSE","FALSE","America/Puerto_Rico"
"00646","18.43251","-66.28429","Dorado","PR","Puerto Rico","TRUE","","36142","662.9","72051","Dorado","{""72051"": 97.19, ""72143"": 2.81}","Dorado|Vega Alta","72051|72143","FALSE","FALSE","America/Puerto_Rico"
"00647","17.96667","-66.94266","Ensenada","PR","Puerto Rico","TRUE","","5198","126.9","72055","Guánica","{""72055"": 98.36, ""72079"": 1.64}","Guánica|Lajas","72055|72079","FALSE","FALSE","America/Puerto_Rico"
"00650","18.34487","-66.58347","Florida","PR","Puerto Rico","TRUE","","14301","174.1","72054","Florida","{""72054"": 47.43, ""72141"": 41.94, ""72091"": 4.26, ""72039"": 2.9, ""72013"": 2.41, ""72017"": 1.07}","Florida|Utuado|Manatí|Ciales|Arecibo|Barceloneta","72054|72141|72091|72039|72013|72017","FALSE","FALSE","America/Puerto_Rico"
"00652","18.45614","-66.60194","Garrochales","PR","Puerto Rico","TRUE","","3193","191.4","72013","Arecibo","{""72013"": 100}","Arecibo","72013","FALSE","FALSE","America/Puerto_Rico"
"00653","17.99413","-66.90266","Guanica","PR","Puerto Rico","TRUE","","9099","159.1","72055","Guánica","{""72055"": 97.54, ""72121"": 2.46}","Guánica|Sabana Grande","72055|72121","FALSE","FALSE","America/Puerto_Rico"
"00656","18.04186","-66.79123","Guayanilla","PR","Puerto Rico","TRUE","","18633","170.7","72059","Guayanilla","{""72059"": 96.96, ""72153"": 2.88, ""72111"": 0.16}","Guayanilla|Yauco|Peñuelas","72059|72153|72111","FALSE","FALSE","America/Puerto_Rico"
"00659","18.41036","-66.79691","Hatillo","PR","Puerto Rico","TRUE","","37525","352.9","72065","Hatillo","{""72065"": 100}","Hatillo","72065","FALSE","FALSE","America/Puerto_Rico"
"00660","18.13412","-67.11399","Hormigueros","PR","Puerto Rico","TRUE","","15630","533.2","72067","Hormigueros","{""72067"": 100}","Hormigueros","72067","FALSE","FALSE","America/Puerto_Rico"
"00662","18.46622","-67.01508","Isabela","PR","Puerto Rico","TRUE","","40503","378.9","72071","Isabela","{""72071"": 100}","Isabela","72071","FALSE","FALSE","America/Puerto_Rico"
"00664","18.21064","-66.59066","Jayuya","PR","Puerto Rico","TRUE","","15132","124.5","72073","Jayuya","{""72073"": 94.97, ""72141"": 5.03}","Jayuya|Utuado","72073|72141","FALSE","FALSE","America/Puerto_Rico"
"00667","18.01246","-67.0417","Lajas","PR","Puerto Rico","TRUE","","23665","151.8","72079","Lajas","{""72079"": 98.09, ""72125"": 1.91}","Lajas|San Germán","72079|72125","FALSE","FALSE","America/Puerto_Rico"
`.trim();

// https://www.kaggle.com/datasets/flashgordon/usa-airport-dataset
// Airports2.csv (509MB, 3.6M rows)
const airports = `
"Origin_airport","Destination_airport","Origin_city","Destination_city","Passengers","Seats","Flights","Distance","Fly_date","Origin_population","Destination_population","Org_airport_lat","Org_airport_long","Dest_airport_lat","Dest_airport_long"
"MHK","AMW","Manhattan, KS","Ames, IA",21,30,1,254,2008-10-01,122049,86219,39.140998840332,-96.6707992553711,NA,NA
"EUG","RDM","Eugene, OR","Bend, OR",41,396,22,103,1990-11-01,284093,76034,44.1245994567871,-123.21199798584,44.2541008,-121.1500015
"EUG","RDM","Eugene, OR","Bend, OR",88,342,19,103,1990-12-01,284093,76034,44.1245994567871,-123.21199798584,44.2541008,-121.1500015
"EUG","RDM","Eugene, OR","Bend, OR",11,72,4,103,1990-10-01,284093,76034,44.1245994567871,-123.21199798584,44.2541008,-121.1500015
"MFR","RDM","Medford, OR","Bend, OR",0,18,1,156,1990-02-01,147300,76034,42.3741989135742,-122.873001098633,44.2541008,-121.1500015
"MFR","RDM","Medford, OR","Bend, OR",11,18,1,156,1990-03-01,147300,76034,42.3741989135742,-122.873001098633,44.2541008,-121.1500015
"MFR","RDM","Medford, OR","Bend, OR",2,72,4,156,1990-01-01,147300,76034,42.3741989135742,-122.873001098633,44.2541008,-121.1500015
"MFR","RDM","Medford, OR","Bend, OR",7,18,1,156,1990-09-01,147300,76034,42.3741989135742,-122.873001098633,44.2541008,-121.1500015
"MFR","RDM","Medford, OR","Bend, OR",7,36,2,156,1990-11-01,147300,76034,42.3741989135742,-122.873001098633,44.2541008,-121.1500015
"SEA","RDM","Seattle, WA","Bend, OR",8,18,1,228,1990-02-01,5154164,76034,47.4490013122559,-122.30899810791,44.2541008,-121.1500015
"SEA","RDM","Seattle, WA","Bend, OR",453,3128,23,228,1990-01-01,5154164,76034,47.4490013122559,-122.30899810791,44.2541008,-121.1500015
"SEA","RDM","Seattle, WA","Bend, OR",784,2720,20,228,1990-02-01,5154164,76034,47.4490013122559,-122.30899810791,44.2541008,-121.1500015
"SEA","RDM","Seattle, WA","Bend, OR",749,2992,22,228,1990-03-01,5154164,76034,47.4490013122559,-122.30899810791,44.2541008,-121.1500015
"SEA","RDM","Seattle, WA","Bend, OR",11,18,1,228,1990-04-01,5154164,76034,47.4490013122559,-122.30899810791,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",349,851,23,116,1990-01-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1376,2898,161,116,1990-01-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",444,1110,30,116,1990-10-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1949,3261,187,116,1990-06-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",381,814,22,116,1990-02-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1559,2772,154,116,1990-02-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1852,3600,200,116,1990-10-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",483,925,25,116,1990-09-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1965,3492,194,116,1990-09-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",494,1036,28,116,1990-06-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",459,962,26,116,1990-03-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",553,1036,28,116,1990-08-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1887,3186,177,116,1990-03-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",773,1887,51,116,1990-11-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1800,3060,170,116,1990-04-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1173,1998,54,116,1990-12-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",462,999,27,116,1990-04-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",386,962,26,116,1990-05-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",2412,3654,203,116,1990-08-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1787,3222,179,116,1990-05-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1446,3042,169,116,1990-11-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",1922,3042,169,116,1990-12-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",523,962,26,116,1990-07-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"PDX","RDM","Portland, OR","Bend, OR",2333,3654,204,116,1990-07-01,1534762,76034,45.58869934,-122.5979996,44.2541008,-121.1500015
"LMT","RDM","Klamath Falls, OR","Bend, OR",139,396,22,147,1990-01-01,57948,76034,42.1561012268066,-121.733001708984,44.2541008,-121.1500015
"LMT","RDM","Klamath Falls, OR","Bend, OR",209,999,27,147,1990-08-01,57948,76034,42.1561012268066,-121.733001708984,44.2541008,-121.1500015
"LMT","RDM","Klamath Falls, OR","Bend, OR",189,414,23,147,1990-08-01,57948,76034,42.1561012268066,-121.733001708984,44.2541008,-121.1500015
"LMT","RDM","Klamath Falls, OR","Bend, OR",168,432,24,147,1990-04-01,57948,76034,42.1561012268066,-121.733001708984,44.2541008,-121.1500015
"LMT","RDM","Klamath Falls, OR","Bend, OR",166,925,25,147,1990-07-01,57948,76034,42.1561012268066,-121.733001708984,44.2541008,-121.1500015
`.trim();

// https://github.com/josdejong/csv42/tree/main/benchmark
// https://jsoneditoronline.org/indepth/parse/csv-parser-javascript/

// https://github.com/LeanyLabs/csv-parsers-benchmarks
// https://leanylabs.com/blog/js-csv-parsers-benchmarks/

// https://github.com/joelverhagen/NCsvPerf/tree/main/NCsvPerf/TestData
// https://www.joelverhagen.com/blog/2020/12/fastest-net-csv-parsers

// https://github.com/darionco/dekkai#benchmark

test('correctness using Papa as reference', (t) => {
    for (const csvStr of [rfc4180, sensorData, earthquakes, housingPriceIndex, uszips, airports]) {
        let ref = Papa.parse(csvStr).data;

        let _schema = schema(csvStr);
        let rows = [];

        parse(csvStr, _schema, (chunk, chunkNum) => {
            rows.push(...chunk);
        });

        assert.deepEqual(ref, rows);
    }
});

const deepObjs = `
_type,name,description,location.city,location.street,location.geo[0],location.geo[1],speed,heading,size[0],size[1],size[2],"field with , delimiter","field with "" double quote"
item,Item 0,Item 0 description in text,Rotterdam,Main street,51.9280712,4.4207888,5.4,128.3,3.4,5.1,0.9,"value with , delimiter","value with "" double quote"
`.trim();

/*
test('typed arrs', (t) => {
    let rows = [];
    let s = schema(csvStr);
    parse(csvStr, s, (chunk, chunkNum) => {
      rows.push(...s.toArrs(chunkNum === 0 ? chunk.slice(1) : chunk));
    });
    res(rows);
});

test('typed objs', (t) => {
    let rows = [];
    let _schema = schema(csvStr);
    parse(csvStr, schema, (chunk, chunkNum) => {
      rows.push(...schema.toObjs(chunkNum === 0 ? chunk.slice(1) : chunk));
    });
    res(rows);
});

test('typed cols', (t) => {
    let rows = [];
    let _schema = schema(csvStr);
    parse(csvStr, schema, (chunk, chunkNum) => {
      rows.push(...schema.toObjs(chunkNum === 0 ? chunk.slice(1) : chunk));
    });
    res(rows);
});
*/

test('typed objs (deep)', (t) => {
    let rows = [];
    let s = schema(deepObjs);
    parse(deepObjs, s, (chunk, chunkNum) => {
      rows.push(...s.toDeep(chunkNum === 0 ? chunk.slice(1) : chunk));
    });

    assert.deepEqual(rows, [{
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
        'field with , delimiter': 'value with , delimiter',
        'field with " double quote': 'value with " double quote'
      }]);
});

test('variable size chunks (incremental/streaming)', async (t) => {
    function chunkString(str, len) {
        return str.match(new RegExp(`.{1,${len}}`, 'gms'));
    }

    for (const csvStr of [rfc4180, sensorData, earthquakes, housingPriceIndex, uszips, airports]) {
        // reference non-iterative parse
        let _schema = schema(csvStr);
        let rows = [];

        parse(csvStr, _schema, (chunk, chunkNum) => {
            rows.push(...chunk);
        });

        // console.log(rows);

        // min chunk must contain full header for schema() to work
        let minChunkSize = csvStr.indexOf("\n");
        // 10-ish rows
        let maxChunkSize = minChunkSize * 10;

        // let dataKey = csvStr.slice(0, 10);

        for (let chunkSize = minChunkSize; chunkSize < maxChunkSize; chunkSize++) {
            let chunks = chunkString(csvStr, chunkSize);

            let rowsIncr = [];
            let prevPartial = '';
            chunks.forEach((chunk, i) => {
                parse(prevPartial + chunk, _schema, (_rows, chunkNum, partial) => {
                    rowsIncr.push(..._rows);
                    prevPartial = partial;
                }, i === chunks.length - 1);
            });

            // await t.test(`${dataKey}, chunkSize: ${chunkSize}`, t2 => {
                assert.deepEqual(rows, rowsIncr);
            // });
        }
    }
});

// TODO:
// tab and pipe delims
// "", ", """ (at EOL)
// also just ""
// single line with no linebreak
// empty lines?
// trim?
// single column
// '\r\n'