import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: "kr.co.nbread.app",
  appName: "엔빵",
  webDir: "capacitor-shell",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith("http://"),
      }
    : undefined,
  android: {
    allowMixedContent: false,
  },
};

export default config;
