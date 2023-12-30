import React from "react";
import { Slot } from "expo-router";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return <Slot />;
};

export default RootLayout;
