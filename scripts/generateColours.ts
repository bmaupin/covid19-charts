// Run using: npx ts-node --compiler-options '{"isolatedModules": false}' scripts/generateColours.ts | sponge src/helpers/colours.json

const https = require('https');
const { promisify } = require('util');

interface Colours {
  [key: string]: string;
}

const existingColours: Colours = require('../src/helpers/colours.json');

function generateColoursObject() {
  // Copied from https://material.io/design/color/
  const materialColours = `Red 50\n#FFEBEE\n100\n#FFCDD2\n200\n#EF9A9A\n300\n#E57373\n400\n#EF5350\n500\n#F44336\n600\n#E53935\n700\n#D32F2F\n800\n#C62828\n900\n#B71C1C\nA100\n#FF8A80\nA200\n#FF5252\nA400\n#FF1744\nA700\n#D50000
    Pink 50\n#FCE4EC\n100\n#F8BBD0\n200\n#F48FB1\n300\n#F06292\n400\n#EC407A\n500\n#E91E63\n600\n#D81B60\n700\n#C2185B\n800\n#AD1457\n900\n#880E4F\nA100\n#FF80AB\nA200\n#FF4081\nA400\n#F50057\nA700\n#C51162
    Purple 50\n#F3E5F5\n100\n#E1BEE7\n200\n#CE93D8\n300\n#BA68C8\n400\n#AB47BC\n500\n#9C27B0\n600\n#8E24AA\n700\n#7B1FA2\n800\n#6A1B9A\n900\n#4A148C\nA100\n#EA80FC\nA200\n#E040FB\nA400\n#D500F9\nA700\n#AA00FF
    Deep purple 50\n#EDE7F6\n100\n#D1C4E9\n200\n#B39DDB\n300\n#9575CD\n400\n#7E57C2\n500\n#673AB7\n600\n#5E35B1\n700\n#512DA8\n800\n#4527A0\n900\n#311B92\nA100\n#B388FF\nA200\n#7C4DFF\nA400\n#651FFF\nA700\n#6200EA
    Indigo 50\n#E8EAF6\n100\n#C5CAE9\n200\n#9FA8DA\n300\n#7986CB\n400\n#5C6BC0\n500\n#3F51B5\n600\n#3949AB\n700\n#303F9F\n800\n#283593\n900\n#1A237E\nA100\n#8C9EFF\nA200\n#536DFE\nA400\n#3D5AFE\nA700\n#304FFE
    Blue 50\n#E3F2FD\n100\n#BBDEFB\n200\n#90CAF9\n300\n#64B5F6\n400\n#42A5F5\n500\n#2196F3\n600\n#1E88E5\n700\n#1976D2\n800\n#1565C0\n900\n#0D47A1\nA100\n#82B1FF\nA200\n#448AFF\nA400\n#2979FF\nA700\n#2962FF
    Light Blue 50\n#E1F5FE\n100\n#B3E5FC\n200\n#81D4FA\n300\n#4FC3F7\n400\n#29B6F6\n500\n#03A9F4\n600\n#039BE5\n700\n#0288D1\n800\n#0277BD\n900\n#01579B\nA100\n#80D8FF\nA200\n#40C4FF\nA400\n#00B0FF\nA700\n#0091EA
    Cyan 50\n#E0F7FA\n100\n#B2EBF2\n200\n#80DEEA\n300\n#4DD0E1\n400\n#26C6DA\n500\n#00BCD4\n600\n#00ACC1\n700\n#0097A7\n800\n#00838F\n900\n#006064\nA100\n#84FFFF\nA200\n#18FFFF\nA400\n#00E5FF\nA700\n#00B8D4
    Teal 50\n#E0F2F1\n100\n#B2DFDB\n200\n#80CBC4\n300\n#4DB6AC\n400\n#26A69A\n500\n#009688\n600\n#00897B\n700\n#00796B\n800\n#00695C\n900\n#004D40\nA100\n#A7FFEB\nA200\n#64FFDA\nA400\n#1DE9B6\nA700\n#00BFA5
    Green 50\n#E8F5E9\n100\n#C8E6C9\n200\n#A5D6A7\n300\n#81C784\n400\n#66BB6A\n500\n#4CAF50\n600\n#43A047\n700\n#388E3C\n800\n#2E7D32\n900\n#1B5E20\nA100\n#B9F6CA\nA200\n#69F0AE\nA400\n#00E676\nA700\n#00C853
    Light Green 50\n#F1F8E9\n100\n#DCEDC8\n200\n#C5E1A5\n300\n#AED581\n400\n#9CCC65\n500\n#8BC34A\n600\n#7CB342\n700\n#689F38\n800\n#558B2F\n900\n#33691E\nA100\n#CCFF90\nA200\n#B2FF59\nA400\n#76FF03\nA700\n#64DD17
    Lime 50\n#F9FBE7\n100\n#F0F4C3\n200\n#E6EE9C\n300\n#DCE775\n400\n#D4E157\n500\n#CDDC39\n600\n#C0CA33\n700\n#AFB42B\n800\n#9E9D24\n900\n#827717\nA100\n#F4FF81\nA200\n#EEFF41\nA400\n#C6FF00\nA700\n#AEEA00
    Yellow 50\n#FFFDE7\n100\n#FFF9C4\n200\n#FFF59D\n300\n#FFF176\n400\n#FFEE58\n500\n#FFEB3B\n600\n#FDD835\n700\n#FBC02D\n800\n#F9A825\n900\n#F57F17\nA100\n#FFFF8D\nA200\n#FFFF00\nA400\n#FFEA00\nA700\n#FFD600
    Amber 50\n#FFF8E1\n100\n#FFECB3\n200\n#FFE082\n300\n#FFD54F\n400\n#FFCA28\n500\n#FFC107\n600\n#FFB300\n700\n#FFA000\n800\n#FF8F00\n900\n#FF6F00\nA100\n#FFE57F\nA200\n#FFD740\nA400\n#FFC400\nA700\n#FFAB00
    Orange 50\n#FFF3E0\n100\n#FFE0B2\n200\n#FFCC80\n300\n#FFB74D\n400\n#FFA726\n500\n#FF9800\n600\n#FB8C00\n700\n#F57C00\n800\n#EF6C00\n900\n#E65100\nA100\n#FFD180\nA200\n#FFAB40\nA400\n#FF9100\nA700\n#FF6D00
    Deep Orange 50\n#FBE9E7\n100\n#FFCCBC\n200\n#FFAB91\n300\n#FF8A65\n400\n#FF7043\n500\n#FF5722\n600\n#F4511E\n700\n#E64A19\n800\n#D84315\n900\n#BF360C\nA100\n#FF9E80\nA200\n#FF6E40\nA400\n#FF3D00\nA700\n#DD2C00
    Brown 50\n#EFEBE9\n100\n#D7CCC8\n200\n#BCAAA4\n300\n#A1887F\n400\n#8D6E63\n500\n#795548\n600\n#6D4C41\n700\n#5D4037\n800\n#4E342E\n900\n#3E2723
    Gray 50\n#FAFAFA\n100\n#F5F5F5\n200\n#EEEEEE\n300\n#E0E0E0\n400\n#BDBDBD\n500\n#9E9E9E\n600\n#757575\n700\n#616161\n800\n#424242\n900\n#212121
    Blue Gray 50\n#ECEFF1\n100\n#CFD8DC\n200\n#B0BEC5\n300\n#90A4AE\n400\n#78909C\n500\n#607D8B\n600\n#546E7A\n700\n#455A64\n800\n#37474F\n900\n#263238`;

  let odd = true;
  let key = '';
  let value = '';
  let colourFamily = '';
  let coloursObject = {} as {
    [colourFamily: string]: {
      [colourTone: string]: string;
    };
  };
  for (let item of materialColours.split('\n')) {
    if (odd) {
      key = item;
      odd = false;
    } else {
      value = item;
      odd = true;
    }
    if (item.search(' ') !== -1) {
      colourFamily = item.replace(' 50', '').trim();
    }
    if (key.search(' ') === -1) {
      if (!coloursObject.hasOwnProperty(colourFamily)) {
        coloursObject[colourFamily] = {};
      }
      coloursObject[colourFamily][key] = value;
    }
  }

  return coloursObject;
}

function getEveryNthElement(
  array: Array<any>,
  n: number,
  startingElement: number
): Array<any> {
  let newArray = [];
  for (let i = startingElement; i < array.length; i += n) {
    newArray.push(array[i]);
  }
  return newArray;
}

function mixColourFamilies(colourFamilies: Array<string>) {
  const n = 4;
  let newColourFamilies = [] as Array<string>;

  for (let i = 0; i < n; i++) {
    newColourFamilies = newColourFamilies.concat(
      // Ignore blue grey to avoid too much blue
      // TODO: Just remove Blue Grey from materialColours?
      getEveryNthElement(
        colourFamilies.slice(0, colourFamilies.length - 1),
        n,
        i
      )
    );
  }

  return newColourFamilies;
}

// Convert the colours from colourObject into a list
function generateColourList() {
  // Mix up the tones a little bit and pick the nicest tones first
  const colourTones = [
    'A400',
    'A700',
    'A200',
    'A100',
    '500',
    '900',
    '400',
    '800',
    '300',
    '700',
    '200',
    '600',
    '100',
  ];
  const coloursObject = generateColoursObject();
  // Mix up the colour families as well
  const colourFamilies = mixColourFamilies(Object.keys(coloursObject));

  // console.log(JSON.stringify(Object.keys(coloursObject), null, 2));
  // console.log(JSON.stringify(colourFamilies, null, 2));
  // require('process').exit();

  let colourList = [] as Array<string>;

  for (let colourTone of colourTones) {
    for (let colourFamily of colourFamilies) {
      let colourCode = coloursObject[colourFamily][colourTone];
      if (colourTone.endsWith(colourTone) && !colourList.includes(colourCode)) {
        colourList.push(colourCode);
      }
    }
  }

  return colourList;
}

function getTopChartCountries(apiData: any, chartMetric: string) {
  const latestDate = apiData['Canada'][apiData['Canada'].length - 1].date;

  const sortedCountries = Object.keys(apiData).sort(function (a, b) {
    return (
      apiData[b].find((item: { date: string }) => item.date === latestDate)[
        chartMetric
      ] -
      apiData[a].find((item: { date: string }) => item.date === latestDate)[
        chartMetric
      ]
    );
  });

  return sortedCountries;
}

function fetchData() {
  const API_URL = 'https://pomber.github.io/covid19/timeseries.json';

  return new Promise((resolve, reject) => {
    https
      .get(API_URL, (resp: any) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk: string) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', (err: Error) => {
        reject(err);
      });
  });
}

async function generateColoursByCountry() {
  const colourList = generateColourList();
  const apiData = await fetchData();
  const lastUsedColourIndex = Object.keys(existingColours).length;

  let coloursByCountry: Colours = {};

  for (const country in existingColours) {
    coloursByCountry[country] = existingColours[country];

    delete existingColours[country];
  }

  let i = 1;
  for (const country of getTopChartCountries(apiData, 'confirmed')) {
    if (!coloursByCountry.hasOwnProperty(country)) {
      coloursByCountry[country] = colourList[lastUsedColourIndex + i];
      i++;
    }
  }

  console.log(JSON.stringify(coloursByCountry, null, 2));

  let extraColours = [];
  for (; i < colourList.length; i++) {
    extraColours.push(colourList[i]);
  }

  // console.log('extraColours:', JSON.stringify(extraColours, null, 2));
}

generateColoursByCountry();
