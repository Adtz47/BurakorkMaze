import "../../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import * as Sentry from "@sentry/react-native";
import { Stack, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
// this is the publishable key for your Clerk frontend API, which is safe to expose to the public. It is used to initialize the ClerkProvider and enable authentication features in your app.
//the onwer of the Clerk account can find this key in the Clerk dashboard under API keys. It is important to keep this key secure and not share it with unauthorized parties, as it can be used to access sensitive user data and perform actions on behalf of users.
if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env file.");
}

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: "https://b60bbb4608e5ce41224f239be3b6d627@o4509813037137920.ingest.de.sentry.io/4511651472670800",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more info: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Capture all traces in development; sample down in production.
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,

  // Capture structured logs and send them to Sentry.
  enableLogs: true,

  // Session Replay: record a sample of sessions, and every session with an error.
  replaysSessionSampleRate: __DEV__ ? 0.1 : 0.05,
  replaysOnErrorSampleRate: __DEV__ ? 1.0 : 0.5,

  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration({
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
  ],
});

function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);
