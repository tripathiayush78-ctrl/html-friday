import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // ApexCharts ships both an ESM and CJS build. Without this, Vite can
    // load two separate copies of the library (one via react-apexcharts,
    // one direct) and the chart silently fails to mount. Deduping forces
    // a single shared instance.
    dedupe: ['apexcharts'],
  },
});
