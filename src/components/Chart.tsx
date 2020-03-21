import React, { useState, useEffect } from 'react';
import { Chart as ReactChart } from 'react-charts';
import {
  ChartAttributes,
  ChartDataHelper,
  ChartTypes,
  ChartData,
} from '../helpers/ChartDataHelper';

function Chart() {
  const axes = [
    { primary: true, type: 'linear', position: 'bottom' },
    { type: 'linear', position: 'left' },
  ];

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    async function loadChartData() {
      const newChartData = await ChartDataHelper.getData(
        ChartTypes.Top,
        ChartAttributes.Confirmed,
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
      {isDataLoaded && <ReactChart data={chartData} axes={axes} />}
    </div>
  );
}

export default Chart;
