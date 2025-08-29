import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'alarm-app',
  webDir: 'out',
  // hmr
  server: {
    url: 'http://192.168.56.1:3000',
    // hostname: '192.168.1.100',
    cleartext: true,
    // androidScheme: 'http'
  }
};

export default config;
