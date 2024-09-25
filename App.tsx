import React from "react";
import { Image, StyleSheet } from "react-native";
import { Provider, ProviderProps } from "react-redux";
import { store } from "./src/redux";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { LogBox } from "react-native";

import { SearchScreen } from "./src/screens/SearchScreen";
import { RestaurantScreen } from "./src/screens/RestaurantScreen";
import { FoodDetailScreen } from "./src/screens/FoodDetailScreen";
import { OrderDetailScreen } from "./src/screens/OrderDetailScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LandingScreen } from "./src/screens/LandingScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { CartScreen } from "./src/screens/CartScreen";
import { OrderScreen } from "./src/screens/OrderScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { OfferScreen } from "./src/screens/OfferScreen";
import { LocationScreen } from "./src/screens/LocationScreen";
import { StripeProvider } from "@stripe/stripe-react-native";

//*********************************************************************************
//Ignoring warnings-------------------------------------------------------
//In order to spin the project I had to ignore the warnings. If I have free time I will update the packages and code it for the current version of react.
LogBox.ignoreLogs(["It appears that you are using old version of react-navigation library."]);
const originalWarn = console.warn;
console.warn = (message: string, ...args) => {
  if (!message.includes("It appears that you are using old version of react-navigation library")) {
    originalWarn(message, ...args);
  }
};
//Ignoring  warnings-------------------------------------------------------
//*********************************************************************************

const switchNavigator = createSwitchNavigator({
  landingStack: {
    screen: createStackNavigator(
      {
        Landing: LandingScreen,
        LocationPage: LocationScreen,
      },
      {
        defaultNavigationOptions: {
          headerShown: false,
        },
      }
    ),
  },

  homeStack: createBottomTabNavigator({
    // Home tab Icon
    Keşfet: {
      screen: createStackNavigator(
        {
          HomePage: HomeScreen,
          SearchPage: SearchScreen,
          RestaurantPage: RestaurantScreen,
          FoodDetailPage: FoodDetailScreen,
          LocationPage: LocationScreen,
        },
        {
          defaultNavigationOptions: {
            headerShown: false,
          },
        }
      ),
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          let icon = focused == true ? require("./src/images/home_icon.png") : require("./src/images/home_n_icon.png");
          return <Image source={icon} style={styles.tabIcon} />;
        },
      },
    },

    // Home tab Icon
    Kampanyalar: {
      screen: createStackNavigator(
        {
          OfferPage: OfferScreen, //
        },
        {
          defaultNavigationOptions: {
            headerShown: false,
          },
        }
      ),
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          let icon = focused == true ? require("./src/images/offer_icon.png") : require("./src/images/offer_n_icon.png");
          return <Image source={icon} style={styles.tabIcon} />;
        },
      },
    },

    // Home tab Icon
    Sepetim: {
      screen: createStackNavigator(
        {
          CartPage: CartScreen,
          LoginPage: LoginScreen,
          OrderPage: OrderScreen,
          OrderDetailPage: OrderDetailScreen,
          CartOfferPage: OfferScreen,
        },
        {
          defaultNavigationOptions: {
            headerShown: false,
          },
        }
      ),
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          let icon = focused == true ? require("./src/images/cart_icon.png") : require("./src/images/cart_n_icon.png");
          return <Image source={icon} style={styles.tabIcon} />;
        },
      },
    },
    // Home tab Icon
    Hesap: {
      screen: createStackNavigator(
        {
          AccountPage: AccountScreen,
          LoginPage: LoginScreen,
          AccountOrderPage: OrderScreen,
          OrderDetailPage: OrderDetailScreen,
        },
        {
          defaultNavigationOptions: {
            headerShown: false,
          },
        }
      ),

      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          let icon = focused == true ? require("./src/images/account_icon.png") : require("./src/images/account_n_icon.png");
          return <Image source={icon} style={styles.tabIcon} />;
        },
      },
    },
  }),
});

const AppNavigation = createAppContainer(switchNavigator);
const providerProps: ProviderProps = {
  store: store,
};

export default function App() {
  console.log("App started");
  return (
    <Provider {...providerProps}>
      <StripeProvider
        publishableKey="pk_test_51NMaLLBGSryYkAxAy283e2UyXGJvXkmhuXUDUNvrNOKVTbCtGfqOMe04L6cdX83uZGNlaB5jdxpnVjKYPXx7YrFR00yHFRZZrC"
        merchantIdentifier="com.octopusdev.online_food_order_app"
        threeDSecureParams={{ backgroundColor: "#FFF", timeout: 5 }}
      >
        <AppNavigation />
      </StripeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 30,
    height: 30,
  },
});
