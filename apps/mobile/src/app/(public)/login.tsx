import * as React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import Button from "../../components/Button/Button";
import TextInputField from "../../components/TextInputField/TextInputField";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";

const LoginSchema = z.object({
  emailAddress: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  password: z.string(),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginScreen() {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const { isLoaded, signIn, setActive } = useSignIn();

  useWarmUpBrowser();

  const { startOAuthFlow: startGoogleOauth } = useOAuth({
    strategy: "oauth_google",
    redirectUrl: "exp://192.168.0.17:8081",
  });

  const { startOAuthFlow: startAppleOauth } = useOAuth({
    strategy: "oauth_apple",
    redirectUrl: "exp://192.168.0.17:8081",
  });

  const handleSignUpWithGooglePress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOauth();

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      } else {
        // Modify this code to use signIn or signUp to set this missing requirements you set in your dashboard.
        throw new Error(
          "There are unmet requirements, modify this else to handle them",
        );
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  }, [startGoogleOauth]);

  const handleSignUpWithApplePress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startAppleOauth();
      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      } else {
        // Modify this code to use signIn or signUp to set this missing requirements you set in your dashboard.
        throw new Error(
          "There are unmet requirements, modify this else to handle them",
        );
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  }, [startAppleOauth]);

  // start the sign up process.
  const onSignUpPress = async (data: LoginFormData) => {
    if (!isLoaded) {
      return;
    }

    const { emailAddress, password } = data;

    try {
      await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: signIn.createdSessionId });
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <FormProvider {...methods}>
      <SafeAreaView>
        <View className="w-screen gap-10 px-10">
          <Text className="text-center text-2xl font-bold">
            Login to your account
          </Text>
          <View>
            <Button
              title="Login with Google"
              onPressHandler={handleSignUpWithGooglePress}
            />
            {Platform.OS === "ios" && (
              <Button
                title="Login with Apple"
                onPressHandler={handleSignUpWithApplePress}
              />
            )}
          </View>
          <View className="max-w-lg flex-row items-center gap-4">
            <View className="h-[1px] flex-1 bg-slate-200" />
            <Text>or</Text>
            <View className="h-[1px] flex-1 bg-slate-200" />
          </View>
          <View className="max-w-lg gap-4">
            <TextInputField name="emailAddress" label="Email address" />
            <TextInputField name="password" label="Password" />
          </View>
          <Button
            title="Login"
            onPressHandler={handleSubmit(onSignUpPress)}
            variant="primary"
          />
          <View>
            <Link asChild href="/sign-up">
              <Pressable>
                <Text className="text-center">
                  Don&apos;t have an account? Sign up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </FormProvider>
  );
}
