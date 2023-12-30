import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import Post from "../../components/Post";

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={async () => {
          await signOut();
        }}
      />
    </View>
  );
};
export default function App() {
  return (
    <View style={styles.container}>
      <Post />
      <SignOut />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
