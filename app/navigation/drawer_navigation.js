import React from "react";
import {
  ScrollView,
  Text,
  Button,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "react-native-firebase";
import {
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
} from "react-navigation";

import AuthLoadingScreen from "../views/auth_screens/auth_loading";
import SignInScreen from "../views/auth_screens/sign_in";
import SignUpScreen from "../views/auth_screens/sign_up";
import ForgotPassScreen from "../views/auth_screens/forgot_pass";
import InfoScreen from "../views/info_screen/info";
import MyReviewsScreen from "../views/myrates_screen/myrates";
import OtherScreen from "../views/other_screen/other";
import BottomNav from "./tab_navigation";
import IntroScreen1 from "../views/auth_screens/intro_screen_1";
import IntroScreen2 from "../views/auth_screens/intro_screen_2";
import IntroScreen3 from "../views/auth_screens/intro_screen_3";

import styles from "./style";
import CustomDrawer from "./CustomDrawer";

const createStars = userRating => {
  let stars = [];
  let rating = userRating;
  for (let i = 0; i < rating; i++) {
    stars.push(
      <Image
        source={require("../res/images/star_filled.png")}
        style={styles.star}
        key={i}
      />
    );
  }
  for (let i = 0; i < 5 - rating; i++) {
    stars.push(
      <Image
        source={require("../res/images/star_empty.png")}
        style={styles.star}
        key={i + 5}
      />
    );
  }
  return stars;
};



const AuthStack = createStackNavigator(
  {
    Intro1: IntroScreen1,
    Intro2: IntroScreen2,
    Intro3: IntroScreen3,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ForgotPassword: ForgotPassScreen
  },
  {
    headerMode: "none"
  }
);



const DrawerNavigator = createDrawerNavigator(
  {
    Tabs: BottomNav
  },
  {
    initialRouteName: "Tabs",
    contentComponent: CustomDrawer
  }
);

const AppStack = createStackNavigator({
  Drawer: {
    screen: DrawerNavigator,
    navigationOptions: {
      header: null
    }
  },
  Info: InfoScreen,
  Reviews: MyReviewsScreen,
  Other: OtherScreen
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
