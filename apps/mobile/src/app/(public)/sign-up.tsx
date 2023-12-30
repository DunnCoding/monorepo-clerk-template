import * as React from "react";
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import Button from "../../components/Button/Button";
import TextInputField from "../../components/TextInputField/TextInputField";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const SignUpSchema = z.object({
  emailAddress: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
});

type SignUpFormData = z.infer<typeof SignUpSchema>;

export default function SignUpScreen() {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const { isLoaded, signUp, setActive } = useSignUp();

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

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
  const onSignUpPress = async (data: SignUpFormData) => {
    if (!isLoaded) {
      return;
    }

    const { emailAddress, password } = data;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <FormProvider {...methods}>
      <SafeAreaView>
        {!pendingVerification && (
          <View className="w-screen gap-10 px-10">
            <Text className="text-center text-2xl font-bold">
              Create an account
            </Text>
            <View>
              <Button
                title="Sign up with Google"
                onPressHandler={handleSignUpWithGooglePress}
              />
              {Platform.OS === "ios" && (
                <Button
                  title="Sign up with Apple"
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
              title="Sign up"
              variant="primary"
              onPressHandler={handleSubmit(onSignUpPress)}
            />
            <View>
              <Link asChild href="/login">
                <Pressable>
                  <Text className="text-center">
                    Already have an account? Login
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        )}
        {pendingVerification && (
          <View>
            <View>
              <TextInput
                value={code}
                placeholder="Code..."
                onChangeText={(code) => setCode(code)}
              />
            </View>
            <TouchableOpacity onPress={onPressVerify}>
              <Text>Verify Email</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </FormProvider>
  );
}
