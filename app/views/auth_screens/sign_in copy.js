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
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import SnackBar from "react-native-snackbar-component";
import styles from "./style";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.setIntroCompleted();
    this.state = {
      typedEmail: "",
      typedPassword: "",
      user: null,
      isLoading: false,
      isShowError: false,
      errorToShow: ""
    };
  }

  setIntroCompleted = async () => {
    console.warn("setIntroCompleted");
    try {
      await AsyncStorage.setItem("isIntroCompleted", "YES");
    } catch (e) {
      console.log(e);
    }
  }

  didTapSignInButton = () => {
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
          this.signIn();
        } else {
          setTimeout(() => {
            this.setState({
              isShowError: true,
              errorToShow: "Invalid credentials"
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

  signIn = () => {
    this.setState({
      isLoading: true,
      isShowError: false
    });
    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.typedEmail,
        this.state.typedPassword
      )
      .then(loggedUser => {
        this.setState(
          {
            user: loggedUser
          },
          () => {
            this.getUserMoreInfo();
          }
        );
        console.log(`Logged with user: ${JSON.stringify(loggedUser)}`);
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
        console.log(`Login failed with error: ${error}`);
        setTimeout(() => {
          this.setState({
            isShowError: true,
            errorToShow: "Invalid credentials"
          });
        }, 100);
      });
  };

  getUserMoreInfo = () => {
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.user.uid)
      .once(
        "value",
        snapshot => {
          if (!snapshot.val().isLookingForTrainer) {
            var priceToSet = snapshot.val().myTrainerProfile.price.toString();
          } else {
            var priceToSet = snapshot.val().myClientProfile.price.toString();
          }
          this._setLocalStorageValue([
            ["isUserLookingPT", snapshot.val().isLookingForTrainer ? "true" : "false"],
            ["userPrice", priceToSet]]);
        },
        error => {
          console.log("Error: " + error.code);
        }
      );
  };
  signInToApp = async () => {
    console.warn("signInToApp");
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

  _setLocalStorageValue = async (array) => {
    try {
      await AsyncStorage.multiSet(array, () => {
        this.signInToApp();
      });
    } catch (e) {
      console.log(e);
    }
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
          textContent={"Sign in ..."}
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
              onSubmitEditing={() => this.didTapSignInButton()}
              returnKeyType="go"
            />
          </View>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPassText}>Forgot Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.didTapSignInButton}
            style={styles.signInButton}
          >
            <Text style={styles.signInText}>SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignUp")}
            style={styles.signUpTextRow}
          >
            <Text style={styles.signUpFont_1}>New User? </Text>
            <Text style={styles.signUpFont_2}>Sign up with email</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
