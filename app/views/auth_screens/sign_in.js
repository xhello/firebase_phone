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
import PhoneInput from 'react-native-phone-input'

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.setIntroCompleted();
    this.state = {
      selectedCountryCode:"+1",
      typedMobileNumber: "",
      typedPassword: "",
      user: null,
      isLoading: false,
      isShowError: false,
      errorToShow: "",
      isMobileNumberSubmitted: false
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

  didTapSubmitButton = () => {
    var typedNumber = this.phone.getValue();
    console.warn(typedNumber);

    this.setState({
      isShowError: false,
      typedMobileNumber: typedNumber
    });
    if (typedNumber == "" | typedNumber == "+1") {
      setTimeout(() => {
        this.setState({
          isShowError: true,
          errorToShow: "Input can't be empty"
        });
      }, 100);
    } else {
      if (this.phone.isValidNumber()) {
        this.submitMobileNumber(typedNumber);  
      } else {
        setTimeout(() => {
          this.setState({
            isShowError: true,
            errorToShow: "Please use a valid phone number"
          });
        }, 100);
      }
      
    }
  };

  submitMobileNumber = (typedNumber) => {
    console.warn("VALID -----", typedNumber)
    this.setState({
      isLoading: true
    })
    firebase.auth().signInWithPhoneNumber(typedNumber)
      .then(confirmResult => {
        setTimeout(() => {
          this.setState({ confirmResult, message: 'Code has been sent!', isLoading: false, isMobileNumberSubmitted: true });
        }, 1000);
        
        console.warn(confirmResult);
      })
      .catch(error => console.log(error));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!', user: user });
          console.log("Code Confirmed!", user)
          this.getUserMoreInfo(user._user.uid, user._user.phoneNumber);
        })
        .catch(error => {
          setTimeout(() => {
            this.setState({
              isShowError: true,
              errorToShow: "Invalid Code, Please try again!"
            });
          }, 100);
          console.log(error);
        });
    }
  };

  getUserMoreInfo = (uid, mobile) => {
    firebase
      .database()
      .ref()
      .child("users/" + uid)
      .once(
        "value",
        snapshot => {
          console.warn(snapshot.val());
          if (snapshot.val() != null) {
            if (!snapshot.val().isLookingForTrainer) {
              var priceToSet = snapshot.val().myTrainerProfile.price.toString();
            } else {
              var priceToSet = snapshot.val().myClientProfile.price.toString();
            }
            this._setLocalStorageValue([
              ["isUserLookingPT", snapshot.val().isLookingForTrainer ? "true" : "false"],
              ["userPrice", priceToSet]]);
          } else {
            this.signUp(uid, mobile);
          }

        },
        error => {
          this.setState({isLoading:false})
          console.log("Error: " + error);
        }
      );
  };

  signUp = (uid, mobile) => {
    console.log('signUp called')
    this.setState({
      isLoading: true,
      isShowError: false
    });

    firebase
      .database()
      .ref("users")
      .child(uid)
      .set({
        mobile: mobile,
        uid: uid,
        rating: 0,
        distance: 0,
        displayName: "Edit Your Name",
        isGymAccess: false,
        isLookingForTrainer: true,
        myTrainerProfile: { about: "", price: "" },
        myClientProfile: { about: "", price: "" }
      })
      .catch(function (error) {
        this.setState({isLoading:false})
        console.error("Error while updating fields to db in signup mehtod: ",error);
      });
    this.signUpToApp();
    // console.log(`Signed with user: ${JSON.stringify(loggedUser)}`);
  };

  signUpToApp = async () => {
    console.log('signUpToApp called')
    console.log(this.state.user);
    try {
      await AsyncStorage.setItem(
        "userToken",
        this.state.user._user.phoneNumber
      );
      this.props.navigation.navigate("Profile");
    } catch (e) {
      this.setState({
        isLoading: false
      });
      console.log(e);
    }
    this.setState({
      isLoading: false
    });
    
  }
  
  signInToApp = async () => {
    console.log('signInToApp called')
    try {
      await AsyncStorage.setItem(
        "userToken",
        this.state.user._user.phoneNumber
      );
      this.props.navigation.navigate("Profile");
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
  selectCountry(country){
    var countrySelected =  this.phone.getCountryCode(country.iso2)
    console.warn(countrySelected);
    this.setState({
      selectedCountryCode:'+'+countrySelected
    })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner
          visible={this.state.isLoading}
          textContent={"Loading ..."}
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
          {!this.state.isMobileNumberSubmitted && <Text style={styles.intoText}>Enter your mobile number to login or join</Text>}
          {this.state.isMobileNumberSubmitted && <Text style={styles.intoText}>Enter 6-digit code you received via SMS</Text>}
          {!this.state.isMobileNumberSubmitted &&
          
            <View style={styles.emailInputView}>
              <PhoneInput
                ref={(ref) => { this.phone = ref; }}
                value={this.state.selectedCountryCode}
                onSelectCountry = {(country)=>this.selectCountry(country)}
                textProps={{placeholder: 'Phone number with country code (+1)'}}              
            />
              {/* <Image
                source={require("../../res/images/phone_icon.png")}
                style={styles.inputIcon}
              />*/}
              {/* <TextInput
                style={styles.emailInput}
                onChangeText={typedMobileNumber => this.setState({ typedMobileNumber })}
                value={this.state.typedMobileNumber}
                placeholder="Mobile Number"
                placeholderTextColor={"#9D9D9D"}
                keyboardType="phone-pad"
                onSubmitEditing={() => {
                  this.passwordInput.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              /> */}
            </View>
          }
          {this.state.isMobileNumberSubmitted &&
            <View style={styles.passwordInputView}>
              <Image
                source={require("../../res/images/password_icon.png")}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.emailInput}
                onChangeText={codeInput => this.setState({ codeInput })}
                value={this.state.codeInput}
                placeholder="6 Digit Code"
                placeholderTextColor={"#9D9D9D"}
                keyboardType="number-pad"
                secureTextEntry={true}
                ref={input => {
                  this.passwordInput = input;
                }}
                onSubmitEditing={() => this.confirmCode()}
                returnKeyType="go"
              />
            </View>
          }
          {!this.state.isMobileNumberSubmitted &&
            <TouchableOpacity
              onPress={this.didTapSubmitButton}
              style={styles.signInButton}
            >
              <Text style={styles.signInText}>SUBMIT</Text>
            </TouchableOpacity>
          }
          {this.state.isMobileNumberSubmitted &&
            <TouchableOpacity
              onPress={this.confirmCode}
              style={styles.signInButton}
            >
              <Text style={styles.signInText}>CONFIRM</Text>
            </TouchableOpacity>
          }
        </ScrollView>
      </SafeAreaView>
    );
  }
}
