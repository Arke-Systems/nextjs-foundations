import { registerWebVitals } from './lib/web-vitals'
 
// Initialize web vitals tracking before React hydration
// This ensures we capture metrics from the earliest possible moment
registerWebVitals()