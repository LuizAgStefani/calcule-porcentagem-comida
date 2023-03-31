import "react-native-gesture-handler";
import { StyleSheet, StatusBar } from "react-native";
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/navigator/Navigator";

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <PaperProvider>
        <StatusBar backgroundColor="#FC6767" />
        <Navigator />
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
