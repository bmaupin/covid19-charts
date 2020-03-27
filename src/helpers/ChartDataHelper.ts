import colours from './colours';

const API_URL = 'https://pomber.github.io/covid19/timeseries.json';

// TODO: is this the best term?
// Alternatives: attribute, measurement, characteristic, variable, factor, statistic, measure,
// criterion, property, element, metric, criteria
export enum ChartMetrics {
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

export interface ChartSeries {
  label: string;
  data: ChartDatum[];
  colour: string;
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
    chartMetric: ChartMetrics,
    numCountries: number,
    numDates: number
  ): Promise<ChartData> {
    switch (chartType) {
      default:
        return await ChartDataHelper.getTopChartData(
          chartMetric,
          numCountries,
          numDates
        );
    }
  }

  static async getTopChartData(
    chartMetric: ChartMetrics,
    numCountries: number,
    numDates: number
  ): Promise<ChartData> {
    const apiData = await ChartDataHelper.fetchData();
    const latestDateWithData = ChartDataHelper.getLatestDateWithData(
      apiData,
      chartMetric
    );
    const sortedCountries = ChartDataHelper.getTopChartCountries(
      apiData,
      chartMetric,
      latestDateWithData,
      numCountries
    );
    const chartData = ChartDataHelper.formatDataForChart(
      apiData,
      sortedCountries,
      chartMetric,
      latestDateWithData,
      numDates
    );

    // TODO
    console.log('apiData: ', apiData);

    return chartData;
  }

  static getLatestDateWithData(
    apiData: ApiData,
    chartMetric: ChartMetrics
  ): string | undefined {
    let i = 1;
    for (const country in apiData) {
      console.log(country);
      for (; i <= apiData[country].length; i++) {
        const countryData = apiData[country][apiData[country].length - i];
        if (countryData[chartMetric] !== null) {
          return countryData.date;
        }
      }
    }
  }

  static getTopChartCountries(
    apiData: ApiData,
    chartMetric: ChartMetrics,
    latestDateWithData: string | undefined,
    numCountries: number
  ): Array<string> {
    const sortedCountries = Object.keys(apiData).sort(function(a, b) {
      return (
        apiData[b].find(item => item.date === latestDateWithData)![
          chartMetric
        ] -
        apiData[a].find(item => item.date === latestDateWithData)![chartMetric]
      );
    });

    return sortedCountries.slice(0, numCountries);
  }

  static formatDataForChart(
    apiData: ApiData,
    sortedCountries: Array<string>,
    chartMetric: ChartMetrics,
    latestDateWithData: string | undefined,
    numDates: number
  ): ChartData {
    let chartData = [] as ChartData;

    for (const country of sortedCountries) {
      let chartSeries = {} as ChartSeries;
      chartSeries.label = country;
      chartSeries.colour = colours[country];

      chartSeries.data = [];

      const indexOfLatestDate = apiData[country].findIndex(
        countryData => countryData.date === latestDateWithData
      );

      // TODO: this assumes the data will always be in order
      for (const countryData of apiData[country].slice(
        indexOfLatestDate + 1 - numDates,
        indexOfLatestDate + 1
      )) {
        chartSeries.data.push({
          x: new Date(countryData.date),
          y: countryData[chartMetric],
        });
      }

      chartData.push(chartSeries);
    }

    return chartData;
  }
}
