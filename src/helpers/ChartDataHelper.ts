const API_URL = 'https://pomber.github.io/covid19/timeseries.json';

export enum ChartMetrics {
  Confirmed = 'confirmed',
  Deaths = 'deaths',
  Recovered = 'recovered',
}

export enum ChartTypes {
  Top,
}

interface ChartDatum {
  x: number;
  y: number;
}

interface ChartSeries {
  data: ChartDatum[];
  dates: Date[];
  title: string;
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
    const sortedCountries = await ChartDataHelper.getTopChartCountries(
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
    console.log('apiData: ', apiData);
    console.log('chartData: ', chartData);

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
      chartSeries.data = [];
      chartSeries.dates = [];
      chartSeries.title = country;

      // TODO: this assumes the data will always be in order
      for (let i = 0; i < numDates; i++) {
        const countryData =
          apiData[country][apiData[country].length - numDates + i];
        chartSeries.data.push({
          x: i,
          y: countryData[chartMetric],
        });
        chartSeries.dates.push(new Date(countryData.date));
      }

      chartData.push(chartSeries);
    }

    return chartData;
  }

  static async getTopChartCountries(
    apiData: ApiData,
    chartMetric: ChartMetrics,
    numCountries: number
  ): Promise<Array<string>> {
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
