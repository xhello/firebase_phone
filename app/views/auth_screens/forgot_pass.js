import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard
} from "react-native";
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import SnackBar from "react-native-snackbar-component";

import styles from "./style";

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      typedEmail: "",
      user: null,
      isLoading: false,
      isShowError: false,
      errorToShow: ""
    };
  }

  // componentDidMount() {
  //   this.unsubscriber = firebase.auth().onAuthStateChanged(changedUser => {
  //     this.setState({ user: changedUser });
  //   });
  // }

  didTapResetButton = () => {
    this.setState({
      isShowError: false
    });
    if (this.state.typedEmail == "") {
      setTimeout(() => {
        this.setState({
          isShowError: true,
          errorToShow: "Inputs can't be empty"
        });
      }, 500);
    } else {
      if (this.isValidEmail(this.state.typedEmail)) {
        this.sendEmail();        
      } else {
        setTimeout(() => {
          this.setState({
            isShowError: true,
            errorToShow: "Please type a valid email address"
          });
        }, 500);
      }
    }
  };

  sendEmail = () => {
    this.setState({
      isLoading: true,
      isShowError: false
    });
    
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.typedEmail)
      .then(result => {
        this.setState({
          isLoading:false
        });
        this._showSnackBar("Please check your email", "green");
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 2500);
        
      })
      .catch(error => {
        this.setState({
          isLoading:false
        });
        console.log(`Signed failed with error: ${error}`);
        if (error == "Error: There is no user record corresponding to this identifier. The user may have been deleted.") {
          this._showSnackBar("Email address not registered", "red");          
        } else {
          this._showSnackBar("Something went wrong, please try again", "red");          
        }
        
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

  _showSnackBar = (message, color) => {
    this.setState({
      isShowError: false
    });
    setTimeout(() => {
      this.setState({
        isShowError: true,
        errorToShow: message,
        snackColor: color
      });
    }, 100);
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner
          visible={this.state.isLoading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
          color={"#FE007A"}
        />
        <SnackBar
          visible={this.state.isShowError}
          autoHidingTime={2000}
          backgroundColor={this.state.snackColor}
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
          <Text style={styles.signUpFont_1}>Enter the registered email address</Text>
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
                Keyboard.dismiss();
                this.didTapResetButton();
              }}
              blurOnSubmit={false}
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity
            onPress={this.didTapResetButton}
            style={styles.signInButton}
          >
            <Text style={styles.signInText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.signUpTextRow}
          >
            <Text style={styles.signUpFont_1}>Remember password? </Text>
            <Text style={styles.signUpFont_2}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
