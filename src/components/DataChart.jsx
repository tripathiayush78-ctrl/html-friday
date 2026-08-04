import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * DataChart
 * ---------
 * Renders one stacked column chart. `series` is already filtered to the
 * active Segmented option by the parent (ChatMessageCard) — this component
 * only knows how to draw whatever series it's handed.
 *
 * WHY THE useMemo MATTERS HERE (this is the single most important
 * performance concept in the whole app):
 * `options` below is a plain object literal. If it were built inline in
 * the JSX return (no useMemo), JavaScript would allocate a BRAND NEW object
 * on every render of this component — and this component re-renders every
 * time ANY message re-renders, including every keystroke in the chat input
 * up in App.jsx, because React re-renders a whole subtree by default.
 * ApexCharts treats a new `options` object reference as "the config
 * changed" and tears down + rebuilds the entire SVG chart to be safe. With
 * several charts in a long chat history, that's a visible stutter on every
 * keystroke. useMemo pins `options` to the same object reference across
 * renders until `categories` actually changes, so ApexCharts can tell
 * nothing meaningful changed and skips the rebuild.
 */
export default function DataChart({ series, categories, title }) {
  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: { show: false }, // matches the clean Figma aesthetic — no export/zoom icons
        fontFamily: 'inherit',
      },
      plotOptions: {
        bar: {
          horizontal: false, // vertical columns, not horizontal bars
          borderRadius: 4,
          columnWidth: '55%',
        },
      },
      colors: ['#775DD0', '#B7A9EA'],
      dataLabels: { enabled: false },
      xaxis: { categories },
      legend: { position: 'top', horizontalAlign: 'left' },
      grid: { borderColor: '#F0F0F0' },
    }),
    [categories],
  );

  return (
    <div>
      {title && <p style={{ fontWeight: 500, marginBottom: 8 }}>{title}</p>}
      <ReactApexChart options={options} series={series} type="bar" height={260} />
    </div>
  );
}
