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
    const sortedCountries = ChartDataHelper.getTopChartCountries(
      apiData,
      chartMetric,
      numCountries
    );
    const chartData = ChartDataHelper.formatDataForChart(
      apiData,
      sortedCountries,
      chartMetric,
      numDates
    );

    // TODO
    console.log(apiData);

    return chartData;
  }

  static formatDataForChart(
    apiData: ApiData,
    sortedCountries: Array<string>,
    chartMetric: ChartMetrics,
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
          y: countryData[chartMetric],
        });
      }

      chartData.push(chartSeries);
    }

    return chartData;
  }

  static getTopChartCountries(
    apiData: ApiData,
    chartMetric: ChartMetrics,
    numCountries: number
  ): Array<string> {
    const latestDate = apiData['Canada'][apiData['Canada'].length - 1].date;

    const sortedCountries = Object.keys(apiData).sort(function(a, b) {
      return (
        apiData[b].find(item => item.date === latestDate)![chartMetric] -
        apiData[a].find(item => item.date === latestDate)![chartMetric]
      );
    });

    return sortedCountries.slice(0, numCountries);
  }
}
