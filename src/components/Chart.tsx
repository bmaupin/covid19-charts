import React, { useState, useEffect } from 'react';
import { Chart as ReactChart } from 'react-charts';

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
  const axes = [
    { primary: true, type: 'time', position: 'bottom' },
    { type: 'linear', position: 'left' },
  ];

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const _getSeriesStyle = (series: any) => {
    return {
      color: series.originalSeries.colour,
    };
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
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div className="ChartContainer">
      {/* The axes won't show correctly if the chart is rendered before the data is loaded */}
      {isDataLoaded && (
        <ReactChart
          axes={axes}
          data={chartData}
          getSeriesStyle={_getSeriesStyle}
          tooltip
        />
      )}
    </div>
  );
}

export default Chart;
