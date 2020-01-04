import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import SnackBar from "react-native-snackbar-component";

import styles from "./style";

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      typedEmail: "",
      typedPassword: "",
      user: null,
      isLoading: false,
      isShowError: false,
      errorToShow: ""
    };
    this.setIntroCompleted();
  }
  setIntroCompleted = async()=>{
    console.warn("setIntroCompleted");
    try {
      await AsyncStorage.setItem("isIntroCompleted", "YES");
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged(changedUser => {
      this.setState({ user: changedUser });
    });
  }

  didTapSignUpButton = async () => {
    this.setState({
      isShowError: false
    });
    if (this.state.typedEmail == "" || this.state.typedPassword == "") {
      setTimeout(() => {
        this.setState({
          isShowError: true,
          errorToShow: "Inputs can't be empty"
        });
      }, 100);
    } else {
      if (this.isValidEmail(this.state.typedEmail)) {
        if (this.isValidPassword(this.state.typedPassword)) {
          this.signUp();
        } else {
          setTimeout(() => {
            this.setState({
              isShowError: true,
              errorToShow: "Password must have at least 8 characters"
            });
          }, 100);  
        }
      } else {
        setTimeout(() => {
          this.setState({
            isShowError: true,
            errorToShow: "Please type a valid email address"
          });
        }, 100);
      }
    }
  };

  signUp = () => {
    this.setState({
      isLoading: true,
      isShowError: false
    });

    firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.state.typedEmail,
        this.state.typedPassword
      )
      .then(loggedUser => {
        this.setState({
          user: loggedUser
        });
        var uid = loggedUser.user.uid;
        var email = loggedUser.user._user.email;
        firebase
          .database()
          .ref("users")
          .child(uid)
          .set({
            email: email,
            uid: uid,
            rating: 0,
            price: 0,
            distance: 0,
            displayName: "Name",
            isGymAccess: false,
            isLookingForTrainer: true,
            about: "",
            myTrainerProfile:{about: "" , price:0},
            myClientProfile:{about: "" , price:0}
          })
          .catch(function(error) {
            console.error(error);
          });
        this.signUpToApp();
        console.log(`Signed with user: ${JSON.stringify(loggedUser)}`);
      })
      .catch(error => {
        console.log(`Signed failed with error: ${error}`);
        if (error == "Error: The email address is already in use by another account.") {
          setTimeout(() => {
            this.setState({
              isLoading:false,
              isShowError: true,
              errorToShow: "The email address is already in use"
            });
          }, 100);  
        } else {
          setTimeout(() => {
            this.setState({
              isLoading:false,
              isShowError: true,
              errorToShow: "Something went wrong, please try again"
            });
          }, 100);  
        }
        
      });
  };

  signUpToApp = async () => {
    console.log(this.state.user);
    try {
      await AsyncStorage.setItem(
        "userToken",
        this.state.user.user._user.refreshToken
      );
      this.props.navigation.navigate("App");
    } catch (e) {
      console.log(e);
    }
    this.setState({
      isLoading: false
    });
  };

  isValidEmail = email => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true;
    }
  };

  isValidPassword = password => {
    if (password.length < 8) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner
          visible={this.state.isLoading}
          textContent={"Sign up ..."}
          textStyle={styles.spinnerTextStyle}
          color={"#FE007A"}
        />
        <SnackBar
          visible={this.state.isShowError}
          autoHidingTime={2000}
          backgroundColor={"red"}
          textMessage={this.state.errorToShow}
        />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../res/images/logo.png")}
            style={styles.logo}
          />
          <View style={styles.emailInputView}>
            <Image
              source={require("../../res/images/email_icon.png")}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.emailInput}
              onChangeText={typedEmail => this.setState({ typedEmail })}
              value={this.state.typedEmail}
              placeholder="Email"
              placeholderTextColor={"#9D9D9D"}
              keyboardType="email-address"
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              blurOnSubmit={false}
              returnKeyType="next"
            />
          </View>
          <View style={styles.passwordInputView}>
            <Image
              source={require("../../res/images/password_icon.png")}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.emailInput}
              onChangeText={typedPassword => this.setState({ typedPassword })}
              value={this.state.typedPassword}
              placeholder="Password"
              placeholderTextColor={"#9D9D9D"}
              secureTextEntry={true}
              ref={input => {
                this.passwordInput = input;
              }}
              onSubmitEditing={() => this.didTapSignUpButton()}
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity
            onPress={this.didTapSignUpButton}
            style={styles.signInButton}
          >
            <Text style={styles.signInText}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignIn")}
            style={styles.signUpTextRow}
          >
            <Text style={styles.signUpFont_1}>Already a member? </Text>
            <Text style={styles.signUpFont_2}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
