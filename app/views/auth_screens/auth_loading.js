import React, { Component } from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken_localDB = await AsyncStorage.getItem("userToken");
    const isIntroCompleted = await AsyncStorage.getItem("isIntroCompleted");
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if(isIntroCompleted == "YES" && userToken_localDB == null){
      this.props.navigation.navigate("SignIn");
    }else{
      // this.props.navigation.navigate(userToken_localDB ? "Profile" : "Auth");
      this.props.navigation.navigate(userToken_localDB ? "App" : "Auth");
    }
    
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
