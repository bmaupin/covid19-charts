import React, { useState } from 'react';

import './Main.css';
import Chart from './Chart';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { ChartIntervals, ChartMetrics } from '../helpers/ChartDataHelper';

function Main() {
  const [chartInterval, setChartInterval] = useState(ChartIntervals.Weekly);
  const [chartMetric, setChartMetric] = useState(ChartMetrics.New);

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
          active={chartMetric === ChartMetrics.New}
          onClick={() => _handleChartMetricButtonClick(ChartMetrics.New)}
        >
          New
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
        <Button
          active={chartInterval === ChartIntervals.Monthly}
          onClick={() =>
            _handleChartIntervalButtonClick(ChartIntervals.Monthly)
          }
        >
          Monthly
        </Button>
        <Button
          active={chartInterval === ChartIntervals.Quarterly}
          onClick={() =>
            _handleChartIntervalButtonClick(ChartIntervals.Quarterly)
          }
        >
          Quarterly
        </Button>
        {/* Enable the Monthly interval button after we have about 3 years of data (the data starts on 2020-01-22) */}
        {new Date() > new Date('2023-01-22') && (
          <Button
            active={chartInterval === ChartIntervals.Yearly}
            onClick={() =>
              _handleChartIntervalButtonClick(ChartIntervals.Yearly)
            }
          >
            Yearly
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
}

export default Main;
