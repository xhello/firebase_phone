import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import styles from "./style";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this._checkFirstLoading();

  }

  // Fetch the token from storage then navigate to our appropriate place
  _checkFirstLoading = async () => {
    const isIntroCompleted = await AsyncStorage.getItem("isIntroCompleted");
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    console.warn("isIntroCompleted #### ", isIntroCompleted);

    if(isIntroCompleted == "YES"){
      this.props.navigation.navigate("SignIn");
    }
    
  };

  didTapNextButton = () =>{
    this.props.navigation.navigate("Intro2");
  }

  didTapSkipButton = () =>{
    this.props.navigation.navigate("SignIn");
  }



  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >

          <Text style={styles.titileFont}>TinFit</Text>
          <Text style={styles.titileFont3}>You are welcome to the world of fitness, Tell us your self through about me, set your role, price and distance</Text>
            <Image source={require('../../res/images/intro_1.png')} style={styles.introImage1} />
        
          <TouchableOpacity
            onPress={this.didTapNextButton}
            style={styles.introNextButton}
          >
            <Text style={styles.signInText}>NEXT</Text>
          </TouchableOpacity>

          {/* <View style={styles.socialButtonRow}>
            <TouchableOpacity
              style={styles.facebookLoginButton}
              onPress={this.didTapFBLoginButton}
            >
              <Image
                style={styles.socialIcon}
                source={require("../../res/images/facebook_icon.png")}
              />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleLoginButton}>
              <Image
                style={styles.socialIcon}
                source={require("../../res/images/google_icon.png")}
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity
            onPress={() => this.didTapSkipButton()}
            style={styles.skipTextRow}
          >
            
            <Text style={styles.signUpFont_2}>Skip</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
