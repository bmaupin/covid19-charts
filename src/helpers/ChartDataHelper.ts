interface Colours {
  [key: string]: string;
}

const colours: Colours = require('./colours.json');

const API_URL = 'https://pomber.github.io/covid19/timeseries.json';

export enum ChartIntervals {
  Daily = 1,
  Weekly = 7,
  // Not technically a month but it's a much simpler implementation and should be good enough...
  Monthly = 30,
}

export enum ChartMetrics {
  Active = 'active',
  Confirmed = 'confirmed',
  Deaths = 'deaths',
  New = 'new',
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

export class ChartDataHelper {
  static async getData(
    chartType: ChartTypes,
    chartMetric: ChartMetrics,
    chartInterval: ChartIntervals,
    numCountries: number,
    numDates: number
  ): Promise<ChartData> {
    switch (chartType) {
      default:
        return await this.getTopChartData(
          chartMetric,
          chartInterval,
          numCountries,
          numDates
        );
    }
  }

  private static async getTopChartData(
    chartMetric: ChartMetrics,
    chartInterval: ChartIntervals,
    numCountries: number,
    numDates: number
  ): Promise<ChartData> {
    const apiData = await this.fetchData();
    const latestDateWithData = this.getLatestDateWithData(apiData, chartMetric);
    const sortedCountries = this.getTopChartCountries(
      apiData,
      chartMetric,
      chartInterval,
      latestDateWithData,
      numCountries
    );
    const chartData = this.formatDataForChart(
      apiData,
      sortedCountries,
      chartMetric,
      chartInterval,
      latestDateWithData,
      numDates
    );

    return chartData;
  }

  private static async fetchData() {
    const response = await fetch(API_URL);

    return response.json();
  }

  private static getLatestDateWithData(
    apiData: ApiData,
    chartMetric: ChartMetrics
  ): string | undefined {
    if (chartMetric === ChartMetrics.Active) {
      chartMetric = ChartMetrics.Recovered;
    } else if (chartMetric === ChartMetrics.New) {
      chartMetric = ChartMetrics.Confirmed;
    }

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

  private static calculateActiveMetric(countryData: ApiCountryData): number {
    return countryData.confirmed - countryData.recovered;
  }

  private static calculateNewMetric(
    apiData: ApiData,
    country: string,
    index: number,
    interval: ChartIntervals
  ) {
    let previousValue = 0;
    const previousIndex = index - 1 * interval;
    if (previousIndex >= 0) {
      previousValue = apiData[country][previousIndex].confirmed;
    }

    return apiData[country][index].confirmed - previousValue;
  }

  private static getTopChartCountries(
    apiData: ApiData,
    chartMetric: ChartMetrics,
    chartInterval: ChartIntervals,
    latestDateWithData: string | undefined,
    numCountries: number
  ): Array<string> {
    const sortedCountries = Object.keys(apiData).sort((a, b) => {
      if (chartMetric === ChartMetrics.Active) {
        return (
          this.calculateActiveMetric(
            apiData[b].find((item) => item.date === latestDateWithData)!
          ) -
          this.calculateActiveMetric(
            apiData[a].find((item) => item.date === latestDateWithData)!
          )
        );
      } else if (chartMetric === ChartMetrics.New) {
        const indexOfLatestDate = apiData[b].findIndex(
          (countryData) => countryData.date === latestDateWithData
        );
        return (
          this.calculateNewMetric(
            apiData,
            b,
            indexOfLatestDate,
            chartInterval
          ) -
          this.calculateNewMetric(apiData, a, indexOfLatestDate, chartInterval)
        );
      } else {
        return (
          apiData[b].find((item) => item.date === latestDateWithData)![
            chartMetric
          ] -
          apiData[a].find((item) => item.date === latestDateWithData)![
            chartMetric
          ]
        );
      }
    });

    return sortedCountries.slice(0, numCountries);
  }

  private static formatDataForChart(
    apiData: ApiData,
    sortedCountries: Array<string>,
    chartMetric: ChartMetrics,
    chartInterval: ChartIntervals,
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
        (countryData) => countryData.date === latestDateWithData
      );

      // TODO: this assumes the data will always be in order
      for (let i = 0; i < numDates; i++) {
        const countryData =
          apiData[country][indexOfLatestDate - i * chartInterval];
        // countryData could be undefined if we try to get data before the first date due to a large interval
        if (countryData) {
          let yValue;
          if (chartMetric === ChartMetrics.Active) {
            yValue = this.calculateActiveMetric(countryData);
          } else if (chartMetric === ChartMetrics.New) {
            yValue = this.calculateNewMetric(
              apiData,
              country,
              indexOfLatestDate - i * chartInterval,
              chartInterval
            );
          } else {
            yValue = countryData[chartMetric];
          }

          // Sometimes the number of total confirmed cases goes down, perhaps as a country corrects its data?
          // Just set it to zero to keep from throwing the chart scale off
          if (yValue < 0) {
            yValue = 0;
          }

          chartSeries.data.push({
            x: new Date(countryData.date),
            y: yValue,
          });
        }
      }

      chartData.push(chartSeries);
    }

    return chartData;
  }
}
