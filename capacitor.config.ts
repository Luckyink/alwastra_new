import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alwastra.invoice',
  appName: 'android',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
