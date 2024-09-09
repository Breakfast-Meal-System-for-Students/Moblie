import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import OTPScreen from "./components/OTPScreen";
import WelcomeScreen from "./components/Welcome";
import BottomTabNavigator from "./components/BottomTabNavigator";
import HomeScreen from "./components/HomeScreen";
// import FavoritesScreen from "./components/FavoritesScreen";
// import ProfileScreen from "./components/ProfileScreen";
// import NotificationsScreen from "./components/NotificationsScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
