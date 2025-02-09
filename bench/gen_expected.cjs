const fs = require('fs');
const Papa = require('papaparse');

const DATA_CUSTOMERS    = 'customers-100000.csv';
const DATA_EARTHQUAKES  = 'large-dataset2.csv';
const DATA_ZIPCODES     = 'uszips.csv';
const DATA_SENSORS      = 'data-large.csv';
const DATA_SENSORS_1HDR = 'data-large2.csv';
const DATA_HOUSE_PRICES = 'HPI_master.csv';
const DATA_AIRPORTS2    = 'Airports2.csv';

const DATA_TAXIS        = 'nyc-taxi-data-100K.csv';
// https://github.com/lemire/CsharpCSVBench/tree/master/data
const DATA_PUB_AUTHORS  = 'Table_1_Authors_career_2023_pubs_since_1788_wopp_extracted_202408_justnames.csv';


let realData = [
  // DATA_SENSORS,
  DATA_SENSORS_1HDR,
  DATA_ZIPCODES,
  DATA_CUSTOMERS,
  DATA_HOUSE_PRICES,
  DATA_EARTHQUAKES,
  DATA_TAXIS,
  DATA_PUB_AUTHORS,
  // DATA_AIRPORTS2,
];

let expected = {};

realData.forEach(name => {
  let csvStr = fs.readFileSync('./data/' + name, 'utf8');
  const data = Papa.parse(csvStr).data;

  expected[name] = {
    rows: data.length,
    cols: Object.keys(data[0]).length,
  };
});

fs.writeFileSync('./expected.json', JSON.stringify(expected, null, 2));