import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./components/LogScreen/LoginScreen";
import RegisterScreen from "./components/RegisterScreen/RegisterScreen";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen/ForgotPasswordScreen";
import OTPScreen from "./components/OTPScreen/OTPScreen";
import WelcomeScreen from "./components/Welcome/Welcome";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import ShopScreen from "./components/ShopScreen/ShopScreen";
import CategoriesScreen from "./components/Categories/CategoriesScreen";
import FavoritesScreen from "./components/FavoritesScreen/FavoritesScreen";
import NotificationsScreen from "./components/NotificationsScreen/NotificationsScreen";
import ProfileScreen from "./components/ProfileScreen/ProfileScreen";
import BottomNavigationBar from "./components/BottomNavigationBar/BottomNavigationBar";
import ProductDetailScreen from "./components/ProductDetailScreen/ProductDetailScreen";
import CartScreen from "./components/CartScreen/CartScreen";
import MapScreen from "./components/MapScreen/MapScreen";
import EditProfile from "./components/EditProfile/EditProfile";
import LogoutScreen from "./components/LogScreen/LogoutScreen";

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
        <Stack.Screen
          name="Shop"
          component={ShopScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="BottomNavigationBar"
          component={BottomNavigationBar}
        />
        <Stack.Screen
          name="CategoriesScreen"
          component={CategoriesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ headerShown: false }}
        />

        {/* Di chuyển CartScreen vào trong Stack.Navigator */}
        <Stack.Screen
          name="Checkout"
          component={CartScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Logout"
          component={LogoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
            <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
    </NavigationContainer>
  );
}

export default App;
