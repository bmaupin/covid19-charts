import React, { useState, useEffect } from 'react';
import { Chart as ReactChart } from 'react-charts';
import {
  ChartMetrics,
  ChartDataHelper,
  ChartTypes,
  ChartData,
} from '../helpers/ChartDataHelper';

function Chart() {
  const axes = [
    { primary: true, type: 'time', position: 'bottom' },
    { type: 'linear', position: 'left' },
  ];

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    async function loadChartData() {
      const newChartData = await ChartDataHelper.getData(
        ChartTypes.Top,
        ChartMetrics.Confirmed,
        10,
        10
      );

      setChartData(newChartData);
      setIsDataLoaded(true);
    }

    loadChartData();
  }, []);

  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div
      style={{
        width: '400px',
        height: '300px',
      }}
    >
      {/* The axes won't show correctly if the chart is rendered before the data is loaded */}
      {isDataLoaded && <ReactChart data={chartData} axes={axes} tooltip />}
    </div>
  );
}

export default Chart;
