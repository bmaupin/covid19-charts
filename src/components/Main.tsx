import React, { useState } from 'react';

import './Main.css';
import Chart from './Chart';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { ChartMetrics } from '../helpers/ChartDataHelper';

function Main() {
  const [chartMetric, setChartMetric] = useState(ChartMetrics.Confirmed);

  function handleChartMetricButtonClick(newMetric: ChartMetrics) {
    setChartMetric(newMetric);
  }

  return (
    <div className="Main">
      <ButtonGroup className="ButtonGroup">
        <Button
          active={chartMetric === ChartMetrics.Confirmed}
          onClick={() => handleChartMetricButtonClick(ChartMetrics.Confirmed)}
        >
          Confirmed
        </Button>
        <Button
          active={chartMetric === ChartMetrics.Deaths}
          onClick={() => handleChartMetricButtonClick(ChartMetrics.Deaths)}
        >
          Deaths
        </Button>
        <Button
          active={chartMetric === ChartMetrics.Recovered}
          onClick={() => handleChartMetricButtonClick(ChartMetrics.Recovered)}
        >
          Recovered
        </Button>
      </ButtonGroup>
      <Chart chartMetric={chartMetric} />
    </div>
  );
}

export default Main;
