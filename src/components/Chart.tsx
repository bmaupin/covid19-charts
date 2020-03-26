import React, { useState, useEffect } from 'react';
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  LineMarkSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';

import '../../node_modules/react-vis/dist/style.css';

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
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
    <div>
      {/* Don't render the chart until the data is loaded */}
      {isDataLoaded && (
        <XYPlot
          height={600}
          // Prevent tick labels from being cut off (https://github.com/uber/react-vis/issues/400)
          margin={{
            left: 40,
            right: 40,
          }}
          width={800}
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
            />
          ))}
        </XYPlot>
      )}
    </div>
  );
}

export default Chart;
