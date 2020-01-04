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
import styles from "./style";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);  
  }

  didTapNextButton = () =>{
    this.props.navigation.navigate("SignIn");
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
          <Text style={styles.titileFont3}>If it is a match, message and meet up to workout from Match screen.</Text>
            <Image source={require('../../res/images/intro_3.png')} style={styles.introImage3} />
        
          <TouchableOpacity
            onPress={this.didTapNextButton}
            style={styles.introNextButton}
          >
            <Text style={styles.signInText}>SIGN IN</Text>
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

          {/* <TouchableOpacity
            onPress={() => this.didTapSkipButton()}
            style={styles.skipTextRow}
          >
            
            <Text style={styles.signUpFont_2}>Skip</Text>
          </TouchableOpacity> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
