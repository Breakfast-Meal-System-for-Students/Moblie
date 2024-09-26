import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import OTPScreen from "./components/OTPScreen";
import WelcomeScreen from "./components/Welcome";
import HomeScreen from "./components/HomeScreen";
import ShopScreen from "./components/ShopScreen";
import OrdersScreen from "./components/OrdersScreen";
import FavoritesScreen from "./components/FavoritesScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import ProfileScreen from "./components/ProfileScreen";
import BottomNavigationBar from "./components/BottomNavigationBar";
import ProductDetailScreen from "./components/ProductDetailScreen";
import CheckoutScreen from "./components/CheckoutScreen";
import DrinkScreen from "./components/DrinkScreen";
import FoodScreen from "./components/FoodScreen";
import CakeScreen from "./components/CakeScreen";
import SnackScreen from "./components/SnackScreen";
import SeeAllScreen from "./components/SeeAllScreen";
import EditProfile from "./components/EditProfile";
import LogoutScreen from "./components/LogoutScreen";
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
          name="Orders"
          component={OrdersScreen}
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

        {/* Di chuyển CheckoutScreen vào trong Stack.Navigator */}
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Drink"
          component={DrinkScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Food"
          component={FoodScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cake"
          component={CakeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Snack"
          component={SnackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="See All"
          component={SeeAllScreen}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
