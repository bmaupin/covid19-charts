import React, { useState, useEffect } from 'react';
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  LineMarkSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
  Crosshair,
} from 'react-vis';

import '../../node_modules/react-vis/dist/style.css';

import './Chart.css';
import {
  ChartMetrics,
  ChartDataHelper,
  ChartTypes,
  ChartData,
} from '../helpers/ChartDataHelper';

interface IProps {
  chartMetric: ChartMetrics;
}

function Chart(props: IProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [crosshairValues, setCrossHairValues] = useState<any[] | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  /**
   * Event handler for chart onNearestX.
   *
   * This will set the crosshair values based on the x coordinate closest to the user's mouse.
   * @param {Object} value Selected value.
   * @param {number} index Index of the series.
   * @private
   */
  const _onNearestX = (value: any, { index }: any) => {
    console.log('_onNearestX');
    setCrossHairValues(chartData!.map(entry => entry.data[index]));
  };

  const _xAxisLabelFormatter = (tick: number): string => {
    return new Date(chartData![0].dates[tick]).toLocaleString('default', {
      month: 'short',
      day: 'numeric',
    });
  };

  const _yAxisLabelFormatter = (tick: number): string => {
    // Pray we never need this...
    if (chartData![0].data[chartData![0].data.length - 1].y > 10000000) {
      return String(tick / 1000000) + 'm';
    } else if (chartData![0].data[chartData![0].data.length - 1].y > 10000) {
      return String(tick / 1000) + 'k';
    } else {
      return String(tick);
    }
  };

  useEffect(() => {
    async function loadChartData() {
      const newChartData = await ChartDataHelper.getData(
        ChartTypes.Top,
        props.chartMetric,
        10,
        10
      );

      setChartData(newChartData);
      setIsDataLoaded(true);
    }

    loadChartData();
  }, [props.chartMetric]);

  return (
    <div className="ChartContainer">
      {/* Don't render the chart until the data is loaded */}
      {isDataLoaded && (
        <FlexibleWidthXYPlot
          height={600}
          // Prevent tick labels from being cut off (https://github.com/uber/react-vis/issues/400)
          margin={{
            left: 40,
            right: 40,
          }}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis
            tickFormat={_xAxisLabelFormatter}
            // Only one tick per date (without this react-vis may create ticks and labels between dates)
            tickTotal={chartData![0].data.length}
          />
          <YAxis tickFormat={_yAxisLabelFormatter} />
          {chartData!.map((entry: any) => (
            <LineMarkSeries
              data={entry.data}
              // Don't render null y values; by default react-vis will convert them to 0
              getNull={d => d.y !== null}
              key={entry.title}
              onNearestX={_onNearestX}
            />
          ))}
          <Crosshair values={crosshairValues!} />
        </FlexibleWidthXYPlot>
      )}
    </div>
  );
}

export default Chart;
