import React, { useState, useEffect } from 'react';
import { Chart as ReactChart } from 'react-charts';

import './Chart.css';
import {
  ChartMetrics,
  ChartDataHelper,
  ChartTypes,
  ChartData,
  ChartIntervals,
} from '../helpers/ChartDataHelper';

interface IProps {
  chartInterval: ChartIntervals;
  chartMetric: ChartMetrics;
}

function Chart(props: IProps) {
  const axes = [
    { primary: true, type: 'time', position: 'bottom' },
    { type: 'linear', position: 'left' },
  ];

  const [chartData, setChartData] = useState<ChartData | null>(null);

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
        props.chartInterval,
        10,
        10
      );

      setChartData(newChartData);
    }

    loadChartData();
  }, [props.chartInterval, props.chartMetric]);

  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div className="ChartContainer">
      <ReactChart
        axes={axes}
        data={chartData ? chartData : {}}
        getSeriesStyle={_getSeriesStyle}
        tooltip
      />
    </div>
  );
}

export default Chart;
