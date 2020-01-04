import React, { Component } from "react";
import { Image } from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";

import HomeScreen from "../views/home_screen/home";
import ProfileScreen from "../views/profile_screen/profile";
import MatchScreen from "../views/match_screen/match";
import UserDetailScreen from "../views/user_detail_screen/user_detail";
import MatchUserDetailScreen from "../views/user_detail_screen/match_user_detail";
import UserChatScreen from "../views/chat_screen/chat";
import MatchUserDetailUnmatchedScreen from "../views/userDetailUnmatchedScreen/match_user_detail";

const HomeTab = createStackNavigator(
  {
    Home: HomeScreen,
    UserDetail: UserDetailScreen,
    MatchUserDetailUnmatched: MatchUserDetailUnmatchedScreen
  },
  {
    headerLayoutPreset: "center"
  }
);

const ProfileTab = createStackNavigator(
  {
    Profile: ProfileScreen
  },
  {
    headerLayoutPreset: "center"
  }
);

const MatchTab = createStackNavigator(
  {
    Match: MatchScreen,
    UserDetail: UserDetailScreen,
    MatchUserDetail: MatchUserDetailScreen,
    UserChat: UserChatScreen
  },
  {
    headerLayoutPreset: "center"
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Profile: ProfileTab,
    Home: HomeTab,
    Match: MatchTab
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        if (routeName === "Home") {
          if (focused) {
            return (
              <Image
                source={require("../res/images/home_icon_active.png")}
                style={{ width: 25, height: 25 }}
              />
            );
          } else {
            return (
              <Image
                source={require("../res/images/home_icon.png")}
                style={{ width: 25, height: 25 }}
              />
            );
          }
        } else if (routeName === "Profile") {
          if (focused) {
            return (
              <Image
                source={require("../res/images/profile_icon_active.png")}
                style={{ width: 25, height: 25 }}
              />
            );
          } else {
            return (
              <Image
                source={require("../res/images/profile_icon.png")}
                style={{ width: 25, height: 25 }}
              />
            );
          }
        } else if (routeName === "Match") {
          if (focused) {
            return (
              <Image
                source={require("../res/images/match_icon_active.png")}
                style={{ width: 25, height: 25 }}
              />
            );
          } else {
            return (
              <Image
                source={require("../res/images/match_icon.png")}
                style={{ width: 25, height: 25 }}
              />
            );
          }
        }

        // You can return any component that you like here!
      }
    }),
    tabBarOptions: {
      activeTintColor: "#FE007A",
      inactiveTintColor: "#FDD8EA"
    },
    initialRouteName: 'Home'
  }
);

MatchTab.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if (routeName == 'UserChat') {
    tabBarVisible = false
  }

  return {
    tabBarVisible,
  }
}

export default createAppContainer(TabNavigator);
