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
import Accordion from 'react-native-collapsible/Accordion';
import SnackBar from "react-native-snackbar-component";
import BackIcon from "../../navigation/back_icon";
import colors from "res/colors";
import strings from "res/strings";
import _ from "lodash";

import styles from "./style";

export default class MatchUserDetailUnmatchedScreen extends Component {
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
      avatarSource: null,
      reviewsByTrainers: [],
      reviewsByClients: [],
      selectedTabIndex: 0,
      activeSections: [],
      collapsed: true,
      multipleSelect: false,
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
    var userListedIn = this.props.navigation.getParam("userListedIn");
    firebase
      .database()
      .ref()
      .child("users/" + profileId)
      .once(
        "value",
        snapshot => {
          console.log("------------------", snapshot.val());
          var aboutMe = snapshot.val().myClientProfile.about;

          // if (userListedIn == 'Trainers') {
          //   var aboutMe = snapshot.val().myTrainerProfile.about;
          // } else {
          //   var aboutMe = snapshot.val().myClientProfile.about;
          // }
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
            isGymAccess: snapshot.val().isGymAccess,
            trainerAbout: snapshot.val().myTrainerProfile.about,
            clientAbout: snapshot.val().myClientProfile.about
          });
          console.log("#####", snapshot.val().myTrainerProfile.rating);
          if (snapshot.val().myTrainerProfile != undefined) {
            // this.warn("snapshot.val().myTrainerProfile.rating", snapshot.val().myTrainerProfile.rating);
            this.setState({
              summaryTrainerRating: snapshot.val().myTrainerProfile.rating != null ? snapshot.val().myTrainerProfile.rating : 0
            })
          }
          if (snapshot.val().myClientProfile != undefined) {
            // this.warn("snapshot.val().myClientProfile.rating", snapshot.val().myClientProfile.rating);
            this.setState({
              summaryClientRating: snapshot.val().myClientProfile.rating != null ? snapshot.val().myClientProfile.rating : 0
            })
          }
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
    firebase
      .database()
      .ref("/users")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const users = _.map(snapshot.val(), user => {
            return user;
          });
          console.log(users);
          this.setState({
            allUsers: users
          }, (() => {
            this.getAllReviews(profileId);
          }));
        },
        error => {
          console.log("Error: " + error);
        }
      );
  }

  createStars = () => {
    let stars = [];
    let rating = this.state.selectedTabIndex == 0 ? this.state.summaryTrainerRating : this.state.summaryClientRating;
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
  createStarsToList = (count) => {
    let stars = [];
    let rating = count;
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
        this._showSnackBar("Message sent successfully", "green");
        this.didTapRequestButton(id, fcm_key, name, currentPrice);
      })
      .catch(error => {
        this._showSnackBar("Something went wrong, please try again", "red");
      });
  };
  didTapRequestButton = (id, fcm_key, name, currentPrice) => {
    console.warn('reciver ID ', id);
    console.warn('sender ID ', this.state.userId);
    console.warn('isUserLookingPT ', this.state.isUserLookingPT);
    console.warn('currentPrice', currentPrice); //TODO

    var listToAddLoggedUser = this.state.isUserLookingPT ? "Clients" : "Trainers";
    var listToAddUser = this.state.isUserLookingPT ? "Trainers" : "Clients";

    firebase
      .database()
      .ref("relationships/" + listToAddLoggedUser + "/" + this.state.user.uid + "/requested")
      .child(id)
      .set({
        // currentRole: this.state.isUserLookingPT ? "client" : "trainer",
        uid: id,
        currentPrice: currentPrice //CHECK
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
        // currentRole: this.state.isUserLookingPT ? "client" : "trainer",
        uid: this.state.userId,
        currentPrice: currentPrice // CHECK
      })
      .catch(function (error) {
        console.error(error);
      });

    firebase
      .database()
      .ref()
      .child("relationships/" + id + "/requested/" + this.state.userId)
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
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSections = sections => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  getAllReviews = (profileId) => {
    firebase
      .database()
      .ref("reviews/" + profileId + "/trainers/")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const reviews = _.map(snapshot.val(), review => {
            return review;
          });
          console.log(reviews);
          this.generateTrainerReviews(reviews)
        },
        error => {
          console.log("Error: " + error);
        }
      );

    firebase
      .database()
      .ref("reviews/" + profileId + "/clients/")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const reviews = _.map(snapshot.val(), review => {
            return review;
          });
          console.log(reviews);
          this.generateCreditReviews(reviews);
        },
        error => {
          console.log("Error: " + error);
        }
      );
  }

  generateTrainerReviews = (reviews) => {
    var all_users = this.state.allUsers;
    reviews.forEach((item) => {
      var index = _.findIndex(reviews, (o) => { return o.uid == item.uid; });
      var indexInAllUserList = _.findIndex(all_users, (o) => { return o.uid == item.uid; });
      if (index > -1) {
        reviews[index].photoURL = all_users[indexInAllUserList].photoURL;
      }
    });
    this.setState({
      reviewsByTrainers: reviews
    });
  }

  generateCreditReviews = (reviews) => {
    var all_users = this.state.allUsers;
    reviews.forEach(function (item) {
      var index = _.findIndex(reviews, (o) => { return o.uid == item.uid; });
      var indexInAllUserList = _.findIndex(all_users, (o) => { return o.uid == item.uid; });
      if (index > -1) {
        reviews[index].photoURL = all_users[indexInAllUserList].photoURL;
      }
    });
    this.setState({
      reviewsByClients: reviews
    });
  }


  renderHeader = (section, _, isActive) => {
    return (
      <View style={styles.reviewRow}>
        <View style={styles.leftArea}>
          <Image
            source={section.photoURL ? { uri: section.photoURL } : require("../../res/images/default_user.png")}
            style={styles.userImageOnReview} />
          <View style={styles.starRatingArea}>
            {this.createStarsToList(section.rating)}
          </View>
        </View>
        <View style={styles.rightArea}>
          <View style={styles.arrowArea}>
            <Image style={styles.arrow} source={isActive ? require("../../res/images/up_arrow_icon.png") : require("../../res/images/down_arrow_icon.png")} />
          </View>
        </View>
      </View>
    );
  };

  renderContent(section, _, isActive) {
    return (
      <View style={styles.commentArea}>
        <Text>
          {section.comment}
        </Text>
      </View>
    );
  }

  render() {
    const { activeSections, multipleSelect } = this.state;
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
          <View style={styles.ratingRow}>
            {this.createStars()}
            <Text style={{ paddingHorizontal: 5, fontWeight: 'bold' }}>
              {this.state.selectedTabIndex == 0 ? this.state.reviewsByTrainers.length : this.state.reviewsByClients.length}
            </Text>
          </View>
          {/* <View style={styles.symbolRow}>
            <Text>{this.state.summaryRating}</Text>
          </View> */}

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleFont}>About Me</Text>
          </View>
          <View style={styles.aboutMeTextArea}>
            <Text style={styles.aboutMeFont}>{this.state.aboutMeText}</Text>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleFont}>Ratings</Text>
          </View>

          <View style={styles.segmentRow}>
            <TouchableOpacity
              onPress={() => this.setState({ selectedTabIndex: 0, aboutMeText: this.state.clientAbout })}
              style={
                this.state.selectedTabIndex == 0
                  ? styles.trainerSegmentActive
                  : styles.trainerSegment
              }
            >
              <Text
                style={
                  this.state.selectedTabIndex == 0
                    ? styles.segmentTextActive
                    : styles.segmentText
                }
              >
                Trainers
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ selectedTabIndex: 1, aboutMeText: this.state.trainerAbout })}
              style={
                this.state.selectedTabIndex == 1
                  ? styles.clientSegmentActive
                  : styles.clientSegment
              }
            >
              <Text
                style={
                  this.state.selectedTabIndex == 1
                    ? styles.segmentTextActive
                    : styles.segmentText
                }
              >
                Clients
            </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewArea}>
            {(this.state.selectedTabIndex == 0 && this.state.reviewsByTrainers.length > 0) &&
              <Accordion
                activeSections={activeSections}
                sections={this.state.reviewsByTrainers}
                touchableComponent={TouchableOpacity}
                expandMultiple={multipleSelect}
                renderHeader={this.renderHeader.bind(this)}
                renderContent={this.renderContent}
                duration={400}
                onChange={this.setSections}
              />
            }
            {(this.state.selectedTabIndex == 0 && this.state.reviewsByTrainers.length == 0) && (
              <View style={styles.notFoundMessage}>
                <Text style={styles.notFoundMessageFont}>
                  No reviews by trainers yet.
            </Text>
              </View>
            )}
            {(this.state.selectedTabIndex == 1 && this.state.reviewsByClients.length > 0) &&
              <Accordion
                activeSections={activeSections}
                sections={this.state.reviewsByClients}
                touchableComponent={TouchableOpacity}
                expandMultiple={multipleSelect}
                renderHeader={this.renderHeader.bind(this)}
                renderContent={this.renderContent}
                duration={400}
                onChange={this.setSections}
              />
            }
            {(this.state.selectedTabIndex == 1 && this.state.reviewsByClients.length == 0) && (
              <View style={styles.notFoundMessage}>
                <Text style={styles.notFoundMessageFont}>
                  No reviews by clients yet.
            </Text>
              </View>
            )}
          </View>

        </ScrollView>

      </SafeAreaView>
    );
  }
}
