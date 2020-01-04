import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import firebase from "react-native-firebase";
import Dialog from "react-native-dialog";
import SnackBar from "react-native-snackbar-component";
import BackIcon from "../../navigation/back_icon";
import colors from "res/colors";
import strings from "res/strings";

import styles from "./style";

export default class UserDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      displayName: "",
      aboutMeText: "",
      priceToDisplay: "",
      distanceToDisplay: "",
      isLookingForTrainer: false,
      isMessageSendingMode: false,
      isGymAccess: false,
      userImageToDisplay: require("../../res/images/default_user.png"),
      avatarSource: null
    };
  }

  static navigationOptions = {
    title: strings.appStack.userDetail.navHeading,
    headerTitleStyle: {
      color: colors.header_text,
      fontFamily: "Helvetica Neue"
    },
    headerStyle: {
      backgroundColor: colors.header
    },
    headerLeft: <BackIcon />
  };
  componentWillMount() {
    var profileId = this.props.navigation.getParam("userId");
    var loggedUserId = this.props.navigation.getParam("loggedUserId");
    var isUserLookingPT = this.props.navigation.getParam("isUserLookingPT");
    var currentPriceToSet = this.props.navigation.getParam("currentPriceToSet");
    firebase
      .database()
      .ref()
      .child("users/" + profileId)
      .once(
        "value",
        snapshot => {
          if (isUserLookingPT) {
            var aboutMe = snapshot.val().myTrainerProfile.about;
          } else {
            var aboutMe = snapshot.val().myClientProfile.about;
          }
          console.log(snapshot.val());
          this.setState({
            user: snapshot.val(),
            userId: loggedUserId,
            profileId: profileId,
            displayName: snapshot.val().displayName,
            aboutMeText: aboutMe,
            priceToDisplay: currentPriceToSet,
            distanceToDisplay: snapshot.val().distance.toString(),
            isLookingForTrainer: snapshot.val().isLookingForTrainer,
            isUserLookingPT: isUserLookingPT,
            isGymAccess: snapshot.val().isGymAccess
          });
          if (snapshot.val().photoURL != null) {
            this.setState({
              avatarSource: { uri: snapshot.val().photoURL }
            });
          }
        },
        error => {
          console.log("Error: " + error.code);
        }
      );
  }

  createStars = () => {
    let stars = [];
    let rating = this.state.user.rating;
    for (let i = 0; i < rating; i++) {
      stars.push(
        <Image
          source={require("../../res/images/star_filled.png")}
          style={styles.star}
          key={i}
        />
      );
    }
    for (let i = 0; i < 5 - rating; i++) {
      stars.push(
        <Image
          source={require("../../res/images/star_empty.png")}
          style={styles.star}
          key={i + 5}
        />
      );
    }
    return stars;
  };
  didTapMessageButton = (id, fcm_key, name, currentPrice) => {
    console.warn("message to - ", id, fcm_key, name);
    this.setState({
      isMessageSendingMode: true,
      selectedUserIdToMessage: id,
      selectedUserFCMKey: fcm_key,
      selectedUserName: name,
      selectedUserCurrentPrice: currentPrice
    });
    // this.sendMessage(id);
  };
  submitMessage = () => {
    console.warn("submitMessage");
    this.sendMessage(this.state.selectedUserIdToMessage, this.state.selectedUserFCMKey, this.state.selectedUserName, this.state.selectedUserCurrentPrice);
    this.setState({
      isMessageSendingMode: false
    });
  };
  sendMessage = (id, fcm_key, name, currentPrice) => {
    firebase
      .database()
      .ref("messages/" + this.state.userId + "/sent")
      .child(id)
      .set({
        uid: id,
        message: this.state.textMessage
      })
      .catch(function (error) {
        this._showSnackBar("Something went wrong, please try again", "red");
      });

    firebase
      .database()
      .ref("messages/" + id + "/received")
      .child(this.state.userId)
      .set({
        uid: this.state.userId,
        message: this.state.textMessage
      })
      .then(() => {
        // this._showSnackBar("Message sent successfully", "green");
        this.didTapRequestButton(id, fcm_key, name, currentPrice);
      })
      .catch(error => {
        this._showSnackBar("Something went wrong, please try again", "red");
      });
  };
  didTapRequestButton = (id, fcm_key, name, currentPrice) => {
    var randomUserCode = Math.floor(1000 + Math.random() * 9000);
    var listToAddLoggedUser = this.state.isUserLookingPT ? "Clients" : "Trainers";
    var listToAddUser = this.state.isUserLookingPT ? "Trainers" : "Clients";
    if (this.state.isUserLookingPT) {
      firebase
        .database()
        .ref("relationships/" + listToAddLoggedUser + "/" + this.state.userId + "/requested")
        .child(id)
        .set({
          uid: id,
          currentPrice: currentPrice, //CHECK
          userCode: randomUserCode
        })
        .then(() => {
          this._showSnackBar("Request sent successfully", "green");
        })
        .catch(function (error) {
          console.error(error);
        });

      firebase
        .database()
        .ref("relationships/" + listToAddUser + "/" + id + "/requestedBack")
        .child(this.state.userId)
        .set({
          uid: this.state.userId,
          currentPrice: currentPrice, //CHECK
          userCode: randomUserCode
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      firebase
        .database()
        .ref("relationships/" + listToAddLoggedUser + "/" + this.state.userId + "/requested")
        .child(id)
        .set({
          uid: id,
          userCode: randomUserCode
        })
        .then(() => {
          this._showSnackBar("Request sent successfully", "green");
        })
        .catch(function (error) {
          console.error(error);
        });

      firebase
        .database()
        .ref("relationships/" + listToAddUser + "/" + id + "/requestedBack")
        .child(this.state.userId)
        .set({
          uid: this.state.userId,
          userCode: randomUserCode
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    firebase
      .database()
      .ref()
      .child("relationships/" + listToAddLoggedUser + "/" + id + "/requested/" + this.state.userId)
      .once(
        "value",
        snapshot => {
          let isExist = snapshot.exists();
          if (isExist) {
            this.sendPush(fcm_key, name);
          }
        },
        error => {
          console.log("Error: " + error.code);
        }
      );
  };

  sendPush = async (fcm_key, name) => {
    if (fcm_key != null) {
      try {
        const response = await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "key=AAAAsUTas5I:APA91bFQjCfp9qQh-QTU9IypqrWmuh98SJTJmH6bCieoWuV38VDDeKeiPbwGU5EwdkC5ZlPdMqXr1FRk5zALHBdT0MAHNykg6R8e23pupk6WmnRMrkd5ccFRqrZGZPRL35-y00zwL7fe"
          },
          body: JSON.stringify({
            to: fcm_key,
            data: {
              body: "We found a new matching for you with " + name,
              title: "New Matching for you!",
              sound: "Enabled",
              icon: "default.png"
            },
            notification: {
              body: "We found a new matching for you with " + name,
              title: "New Matching for you!",
              sound: "Enabled",
              icon: "default.png"
            }
          })
        });
        const responseJson = await response.json();
        console.log(responseJson);
        return responseJson;
      }
      catch (error) {
        console.error(error);
      }
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
          <View style={styles.imageRow}>
            <ImageBackground
              style={styles.profilePic}
              imageStyle={{ borderRadius: 10 }}
              source={
                this.state.avatarSource == null
                  ? this.state.userImageToDisplay
                  : this.state.avatarSource
              }
            />
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.nameFont}>{this.state.displayName}</Text>
          </View>
          {/* <View style={styles.ratingRow}>{this.createStars()}</View> */}
          <View style={styles.symbolRow}>
            {/* <Image
              source={
                this.state.isGymAccess
                  ? require("../../res/images/gym_icon_enable.png")
                  : require("../../res/images/gym_icon_disable.png")
              }
              style={styles.gymIcon}
            /> */}
            {!this.state.isUserLookingPT && (
              <TouchableOpacity onPress={() => this.didTapMessageButton(this.state.profileId, this.state.user.fcmToken, this.state.displayName, this.state.priceToDisplay)}>
                <Image
                  source={require("../../res/images/email_icon.png")}
                  style={styles.messageIcon}
                />
              </TouchableOpacity>
            )}
            {this.state.isUserLookingPT && <Text style={styles.rateFont}>${this.state.priceToDisplay}</Text>}
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleFont}>About Me</Text>
          </View>
          <View style={styles.aboutMeTextArea}>
            <Text style={styles.aboutMeFont}>{this.state.aboutMeText}</Text>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleFont}>More Info</Text>
          </View>
          <View style={styles.settingItemRow}>
            <Text style={styles.sectionTitleFont}>Looking for</Text>
            <View style={styles.settingItemTapArea}>
              <Text style={styles.settingValueFont}>
                {this.state.isLookingForTrainer ? "Personal Trainer" : "Client"}
              </Text>
            </View>
          </View>

          <View style={styles.settingItemRow}>
            <Text style={styles.sectionTitleFont}>Gym Access</Text>
            <View style={styles.settingItemTapArea}>
              <Text style={styles.settingValueFont}>
                {this.state.isGymAccess ? "YES" : "NO"}
              </Text>
            </View>
          </View>
        </ScrollView>
        <Dialog.Container visible={this.state.isMessageSendingMode}>
          <Dialog.Title>Send message with request</Dialog.Title>
          <Dialog.Description>
            Enter your message to your client
          </Dialog.Description>
          <Dialog.Input
            onChangeText={textMessage => this.setState({ textMessage })}
            value={this.state.textMessage}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => this.setState({ isMessageSendingMode: false })}
          />
          <Dialog.Button label="Request" onPress={this.submitMessage} />
        </Dialog.Container>
      </SafeAreaView>
    );
  }
}
