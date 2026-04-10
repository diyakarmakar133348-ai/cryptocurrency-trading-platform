import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const Chart = ({ data, symbol }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          backgroundColor: '#0a0e1a',
          textColor: '#e0e3eb',
        },
        grid: {
          vertLines: { color: '#1a1f2e' },
          horzLines: { color: '#1a1f2e' },
        },
        crosshair: {
          mode: 0,
        },
        rightPriceScale: {
          borderColor: '#2d3748',
        },
        timeScale: {
          borderColor: '#2d3748',
          timeVisible: true,
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
      });

      // ✅ Correct way: addCandlestickSeries()
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#10b981',
        wickDownColor: '#ef4444',
        wickUpColor: '#10b981',
      });

      candlestickSeries.setData(data);
      chart.timeScale().fitContent();

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };
      window.addEventListener('resize', handleResize);

      chartRef.current = chart;

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [data]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{symbol} Price Chart</h3>
      </div>
      <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default Chart;