const API_URL = 'https://pomber.github.io/covid19/timeseries.json';

// TODO: is 'attribute the best term??
// attribute, measurement, characteristic, variable, factor, statistic, measure
// criterion, property, element
export enum ChartAttributes {
  Confirmed = 'confirmed',
  Deaths = 'deaths',
  Recovered = 'recovered',
}

export enum ChartTypes {
  Top,
}

interface ChartDatum {
  x: Date;
  y: number;
}

interface ChartSeries {
  label: string;
  data: ChartDatum[];
}

export interface ChartData extends Array<ChartSeries> {}

interface ApiCountryData {
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
}

interface ApiData {
  [key: string]: Array<ApiCountryData>;
}

// TODO: do we really need a class here?
export class ChartDataHelper {
  static async fetchData() {
    const response = await fetch(API_URL);

    return response.json();
  }

  static async getData(
    chartType: ChartTypes,
    chartAttribute: ChartAttributes,
    numCountries: number,
    numDates: number
  ): Promise<ChartData> {
    switch (chartType) {
      default:
        return await ChartDataHelper.getTopChartData(
          chartAttribute,
          numCountries,
          numDates
        );
    }
  }

  static async getTopChartData(
    chartAttribute: ChartAttributes,
    numCountries: number,
    numDates: number
  ): Promise<ChartData> {
    const apiData = await ChartDataHelper.fetchData();
    const sortedCountries = await ChartDataHelper.getTopChartCountries(
      apiData,
      chartAttribute,
      numCountries
    );
    const chartData = ChartDataHelper.formatDataForChart(
      apiData,
      sortedCountries,
      chartAttribute,
      numDates
    );

    // TODO
    console.log(apiData);

    return chartData;
  }

  static formatDataForChart(
    apiData: ApiData,
    sortedCountries: Array<string>,
    chartAttribute: ChartAttributes,
    numDates: number
  ): ChartData {
    let chartData = [] as ChartData;

    for (const country of sortedCountries) {
      let chartSeries = {} as ChartSeries;
      chartSeries.label = country;

      chartSeries.data = [];

      // TODO: this assumes the data will always be in order
      for (const countryData of apiData[country].slice(
        apiData[country].length - numDates,
        apiData[country].length
      )) {
        chartSeries.data.push({
          x: new Date(countryData.date),
          y: countryData[chartAttribute],
        });
      }

      chartData.push(chartSeries);
    }

    return chartData;
  }

  static async getTopChartCountries(
    apiData: ApiData,
    chartAttribute: ChartAttributes,
    numCountries: number
  ): Promise<Array<string>> {
    const latestDate = apiData['Canada'][apiData['Canada'].length - 1].date;

    const sortedCountries = Object.keys(apiData).sort(function(a, b) {
      return (
        apiData[b].find(item => item.date === latestDate)![chartAttribute] -
        apiData[a].find(item => item.date === latestDate)![chartAttribute]
      );
    });

    return sortedCountries.slice(0, numCountries);
  }
}
