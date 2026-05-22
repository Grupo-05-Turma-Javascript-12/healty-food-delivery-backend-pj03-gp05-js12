import tracer from 'dd-trace';

tracer.init({
  service: 'healthyfood-api',
  env: process.env.NODE_ENV ?? 'development',
  version: process.env.DD_VERSION ?? '1.0.0',
  logInjection: true,
  runtimeMetrics: true,
  profiling: false,
});

export default tracer;
