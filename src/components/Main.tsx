import React, { useState } from 'react';

import './Main.css';
import Chart from './Chart';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { ChartIntervals, ChartMetrics } from '../helpers/ChartDataHelper';

function Main() {
  const [chartInterval, setChartInterval] = useState(ChartIntervals.Daily);
  const [chartMetric, setChartMetric] = useState(ChartMetrics.Active);

  function _handleChartIntervalButtonClick(newInterval: ChartIntervals) {
    setChartInterval(newInterval);
  }

  function _handleChartMetricButtonClick(newMetric: ChartMetrics) {
    setChartMetric(newMetric);
  }

  return (
    <div className="Main">
      <ButtonGroup className="ButtonGroup">
        <Button
          active={chartMetric === ChartMetrics.Active}
          onClick={() => _handleChartMetricButtonClick(ChartMetrics.Active)}
        >
          Active
        </Button>
        <Button
          active={chartMetric === ChartMetrics.Confirmed}
          onClick={() => _handleChartMetricButtonClick(ChartMetrics.Confirmed)}
        >
          Confirmed
        </Button>
        <Button
          active={chartMetric === ChartMetrics.Deaths}
          onClick={() => _handleChartMetricButtonClick(ChartMetrics.Deaths)}
        >
          Deaths
        </Button>
        <Button
          active={chartMetric === ChartMetrics.Recovered}
          onClick={() => _handleChartMetricButtonClick(ChartMetrics.Recovered)}
        >
          Recovered
        </Button>
      </ButtonGroup>
      <Chart chartInterval={chartInterval} chartMetric={chartMetric} />
      <ButtonGroup className="ButtonGroup">
        <Button
          active={chartInterval === ChartIntervals.Daily}
          onClick={() => _handleChartIntervalButtonClick(ChartIntervals.Daily)}
        >
          Daily
        </Button>
        <Button
          active={chartInterval === ChartIntervals.Weekly}
          onClick={() => _handleChartIntervalButtonClick(ChartIntervals.Weekly)}
        >
          Weekly
        </Button>
        {/* Enable the Monthly interval button after we have about 3 months of data (the data starts on 2020-01-22) */}
        {new Date() > new Date('2020-04-22') && (
          <Button
            active={chartInterval === ChartIntervals.Monthly}
            onClick={() =>
              _handleChartIntervalButtonClick(ChartIntervals.Monthly)
            }
          >
            Monthly
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
}

export default Main;
