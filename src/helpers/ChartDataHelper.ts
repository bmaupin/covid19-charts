const API_URL = 'https://pomber.github.io/covid19/timeseries.json';

// TODO: is 'attribute the best term??
// attribute, measurement, characteristic, variable, factor, statistic, measure
// criterion, property
export enum ChartAttributes {
  Confirmed = 'confirmed',
  Deaths = 'deaths',
  Recoverdd = 'recovered',
}

export enum ChartTypes {
  Top,
}

// TODO
// interface ChartDatum {
//   x: number;
//   y: number;
// }

interface ChartSeries {
  label: string;
  data: number[][];
}

export interface ChartData extends Array<ChartSeries> {}

// TODO
// export interface ChartData extends Array {
//   label: string;
//   data: number[][];
// }
// [];

export class ChartDataHelper {
  static async fetchData() {
    const response = await fetch(API_URL);

    return response.json();
  }

  static async getData(
    chartType: ChartTypes,
    chartAttribute: ChartAttributes,
    numCountries: number
  ): Promise<ChartData> {
    return [
      {
        label: 'Series 1',
        data: [
          [0, 1],
          [1, 2],
          [2, 4],
          [3, 2],
          [4, 7],
        ],
      },
      {
        label: 'Series 2',
        data: [
          [0, 3],
          [1, 1],
          [2, 5],
          [3, 6],
          [4, 4],
        ],
      },
    ];
  }
}
