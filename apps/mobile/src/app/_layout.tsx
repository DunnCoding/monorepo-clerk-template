import Constants from "expo-constants";
import { Slot, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

import { TRPCProvider } from "../utils/trpc";

import "../styles.css";

import { useEffect } from "react";
import { View } from "react-native";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  console.log({ isLoaded, isSignedIn });
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/home");
    } else {
      router.replace("/sign-up");
    }
  }, [isLoaded, isSignedIn, router]);
  return (
    <>
      <View className="flex-1 items-center justify-center bg-white">
        <Slot />
      </View>
    </>
  );
};

export default function Root() {
  const publishableKey = Constants.expoConfig?.extra
    ?.clerkPublishableKey as string;
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <TRPCProvider>
        <InitialLayout />
      </TRPCProvider>
    </ClerkProvider>
  );
}
