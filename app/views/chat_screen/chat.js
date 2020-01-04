import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import BackIcon from "../../navigation/back_icon";
import colors from "res/colors";
import strings from "res/strings";
import ModalDropdown from 'react-native-modal-dropdown';
import SnackBar from "react-native-snackbar-component";
import { GiftedChat } from "react-native-gifted-chat";
import firebase from "react-native-firebase";
import styles from "./style";
import Dialog from "react-native-dialog";
import { TextInput } from "react-native-gesture-handler";

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      user: {},
      messages: [],
      ratingValue: 0,
      typedUserCode: '',
      isShowDeleteAlert: false,
      isShowUserCodeAlert: false,
      isShowReviewAlert: false,
      isEligibleToReview: false,
      typedCommentText: '',
      isNewReview: true,
      oldRatingValue: 0,
      fcmToken: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.title) === 'undefined' ? 'Chat' : navigation.state.params.title,
      headerTitleStyle: {
        color: colors.header_text,
        fontFamily: "Helvetica Neue"
      },
      headerStyle: {
        backgroundColor: colors.header
      },
      headerLeft: <BackIcon />,
      headerRight: <ModalDropdown dropdownTextStyle={{ fontWeight: 'bold', fontSize: 13 }} dropdownStyle={{ marginRight: 0, width: 100, height: 37 * 4 }} options={["$" + navigation.state.params.price, 'Review', 'Profile', 'Disconnect']} onSelect={(index) => navigation.getParam("dropdownOnSelect")(index)}>
        <Image
          style={{ width: 30, height: 30, marginRight: 25 }}
          source={require("../../res/images/more_icon.png")}
        /></ModalDropdown>
      // headerRight: <TouchableOpacity style={styles.deleteIconArea} onPress={() => navigation.getParam("dropdownOnSelect")()}><Image style={styles.deleteIcon} source={require('../../res/images/delete_icon.png')} /></TouchableOpacity>
    }
  };

  selectOption = (index) => {

    switch (index) {
      case "0":
        this.showUserCode();
        break;
      case "1":
        this.showReviewModal();
        break;
      case "2":
        this.props.navigation.navigate("MatchUserDetail", { userId: this.state.chatUserId, userListedIn: this.state.userListedIn });
        break;
      case "3":
        this.askeToDelete();
        break;

      // code block
    }
  }

  askeToDelete = () => {
    this.setState({
      isShowDeleteAlert: true
    });
  }

  showUserCode = () => {
    this.checkIsEligibleToReview(this.state.userListedIn, this.state.loggedUserId, this.state.chatUserId);

    // if (this.state.isEligibleToReview) {
    //   this._showSnackBar("User code already aplied, you can review now", "green");
    // } else {
    //   this.setState({
    //     isShowUserCodeAlert: true
    //   })
    // }
  }

  showReviewModal = () => {
    this.getCurrentReview(this.state.userListedIn, this.state.loggedUserId, this.state.chatUserId);

    // if (this.state.isEligibleToReview) {
    //   this.setState({
    //     isShowReviewAlert: true
    //   });
    // } else {
    //   this.setState({
    //     isShowUserCodeAlert: true
    //   })
    // }
  }

  deleteConversation = () => { // NEED TO CHECK
    if (this.state.userListedIn == "Clients") {
      firebase
        .database()
        .ref("relationships/Trainers/" + this.state.loggedUserId + "/requestedBack")
        .child(this.state.chatUserId)
        .update({
          deleted: true
        })
        .then(() => {
          console.warn("USER DELETED");
        })
        .catch(function (error) {
          console.error(error);
        });

      this.setState({
        isShowDeleteAlert: false
      }, () => {
        this.props.navigation.goBack();
      });
    }
    else {
      firebase
        .database()
        .ref("relationships/Clients/" + this.state.loggedUserId + "/requested")
        .child(this.state.chatUserId)
        .update({
          deleted: true
        })
        .catch(function (error) {
          console.error(error);
        });
      // firebase
      //   .database()
      //   .ref("relationships/Trainers/" + this.state.chatUserId + "/requestedBack")
      //   .child(this.state.loggedUserId)
      //   .update({
      //     deleted: true
      //   })
      //   .then(() => {
      //     console.warn("USER DELETED");
      //   })
      //   .catch(function (error) {
      //     console.error(error);
      //   });

      this.setState({
        isShowDeleteAlert: false
      }, () => {
        this.props.navigation.goBack();
      });
    }


  };

  componentWillMount() {
    // const { navigation } = this.props;
    var userId = this.props.navigation.getParam("userId");
    var loggedUserId = this.props.navigation.getParam("loggedUserId");
    var userName = this.props.navigation.getParam("userName");
    var userAvatar = this.props.navigation.getParam("userAvatar");
    var userListedIn = this.props.navigation.getParam("userListedIn");
    var userCodeToShow = this.props.navigation.getParam("userCode");
    var codeToRequest = this.props.navigation.getParam("codeToRequest");
    var fcmToken = this.props.navigation.getParam("fcmToken", null)

    this.props.navigation.setParams({ title: userName, deleteConversation: this.askeToDelete, dropdownOnSelect: this.selectOption, userCodeToShow: userCodeToShow });
    console.warn("userListedIn #####", userListedIn);
    this.setState({
      isLoading: true,
      loggedUserId: loggedUserId,
      chatUserId: userId,
      userAvatar: userAvatar,
      userName: userName,
      userListedIn: userListedIn,
      userCodeToShow: userCodeToShow,
      codeToRequest: codeToRequest,
      fcmToken: fcmToken

    });
    user = firebase.auth().currentUser;
    console.log(user);
    firebase
      .database()
      .ref()
      .child(
        "/conversations/" + loggedUserId + "/" + userId + "/chats"
      )
      .limitToLast(20)
      .on(
        "value",
        snapshot => {
          this.setState({
            messages: []
          })
          snapshot.forEach(childSnapshot => {
            //console.log(childSnapshot.val());
            var message = this.parse(childSnapshot);
            console.log(message);
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, message)
            }));
            this.markRead(loggedUserId, userId)
          });
          console.log("####################", this.state.messages);
        },
        error => {
          console.log("Error: " + error.code);
        }
      );
    // this.checkIsEligibleToReview(userListedIn, loggedUserId, userId);

    this.markRead(loggedUserId, userId);
  }

  markRead = (loggedUserId, chatUserId) => {
    firebase.database()
      .ref()
      .child('/conversations/' + loggedUserId + '/' + chatUserId)
      .update({
        unread: 0
      })

  }

  checkIsEligibleToReview = (userListedIn, loggedUserId, chatUserId) => {
    console.warn("##############", userListedIn, loggedUserId, chatUserId);
    // console.log("db link ", "relationships/Clients/" + this.state.loggedUserId + "/requestedBack/"+ this.state.chatUserId);
    if (userListedIn == "Trainers") {
      firebase
        .database()
        .ref()
        .child("relationships/Clients/" + loggedUserId + "/requested/" + chatUserId)
        .once(
          "value",
          snapshot => {
            console.log("isEligibleToReview -------- ", snapshot.val().isEligibleToReview);
            this.setState({
              isEligibleToReview: snapshot.val().isEligibleToReview,
            });
            if (snapshot.val().isEligibleToReview == true) {
              this._showSnackBar("User code already aplied, you can review now", "green");
            } else {
              this.setState({
                isShowUserCodeAlert: true
              })
            }
          },
          error => {
            console.log("Error: " + error);
          }
        );
    } else {
      firebase
        .database()
        .ref()
        .child("relationships/Trainers/" + loggedUserId + "/requestedBack/" + chatUserId)
        .once(
          "value",
          snapshot => {
            console.log("isEligibleToReview -------- ", snapshot.val().isEligibleToReview);
            this.setState({
              isEligibleToReview: snapshot.val().isEligibleToReview,
            });
            if (snapshot.val().isEligibleToReview == true) {
              this._showSnackBar("User code already aplied, you can review now", "green");
            } else {
              this.setState({
                isShowUserCodeAlert: true
              })
            }
          },
          error => {
            console.log("Error: " + error);
          }
        );
    }
  }

  updateIsEligibleToReview = (userListedIn, loggedUserId, chatUserId) => {
    // console.log("isEligibleToReview - ", userListedIn);
    // console.log("db link ", "relationships/Clients/" + this.state.loggedUserId + "/requestedBack/"+ this.state.chatUserId);
    if (userListedIn == "Trainers") {
      firebase
        .database()
        .ref("relationships/Clients/" + loggedUserId + "/requested/")
        .child(chatUserId)
        .update({
          isEligibleToReview: true
        })
        .then(() => {
          console.warn("isEligibleToReview updated");
        })
        .catch(function (error) {
          console.error(error);
        });
      firebase
        .database()
        .ref("relationships/Trainers/" + chatUserId + "/requestedBack/")
        .child(loggedUserId)
        .update({
          isEligibleToReview: true
        })
        .then(() => {
          console.warn("isEligibleToReview updated");
          this.setState({
            isShowReviewAlert: true
          })
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      firebase
        .database()
        .ref("relationships/Trainers/" + loggedUserId + "/requestedBack/")
        .child(chatUserId)
        .update({
          isEligibleToReview: true
        })
        .then(() => {
          console.warn("isEligibleToReview updated");
        })
        .catch(function (error) {
          console.error(error);
        });
      firebase
        .database()
        .ref("relationships/Clients/" + chatUserId + "/requested/")
        .child(loggedUserId)
        .update({
          isEligibleToReview: true
        })
        .then(() => {
          console.warn("isEligibleToReview updated");
          this.setState({
            isShowReviewAlert: true
          })
        })
        .catch(function (error) {
          console.error(error);
        });
    }

  }

  getCurrentReview = (userListedIn, loggedUserId, chatUserId) => { // need to change   
    console.warn("##########################", userListedIn, loggedUserId, chatUserId);
    var totalStars = 0;
    var totalReviews = 0;
    if (userListedIn == "Trainers") {
      firebase
        .database()
        .ref()
        .child("relationships/Clients/" + loggedUserId + "/requested/" + chatUserId)
        .once(
          "value",
          snapshot => {
            // console.log("isEligibleToReview -------- ", snapshot.val().isEligibleToReview);
            this.setState({
              isEligibleToReview: snapshot.val().isEligibleToReview,
            });
            if (snapshot.val().isEligibleToReview == true) {
              firebase
                .database()
                .ref()
                .child("reviews/" + chatUserId + "/trainers/" + loggedUserId)
                .once(
                  "value",
                  snapshot => {
                    if (snapshot.val() == null) {
                      this.setState({
                        isShowReviewAlert: true,
                      });
                    } else {
                      if (snapshot.val().comment != null) {
                        console.log("comment -------- ", snapshot.val().comment);
                        console.warn("rating -------- ", snapshot.val().rating);
                        this.setState({
                          typedCommentText: snapshot.val().comment,
                          ratingValue: snapshot.val().rating != null ? snapshot.val().rating : 0,
                          oldRatingValue: snapshot.val().rating != null ? snapshot.val().rating : 0,
                          isShowReviewAlert: true,
                          isNewReview: false
                        });
                      } else {
                        this.setState({
                          isShowReviewAlert: true
                        });
                      }
                    }
                  },
                  error => {
                    console.log("Error: " + error);
                  }
                );
            } else {
              this.setState({
                isShowUserCodeAlert: true
              })
            }
          },
          error => {
            console.log("Error: " + error);
          }
        );

    } else {
      firebase
        .database()
        .ref()
        .child("relationships/Trainers/" + loggedUserId + "/requestedBack/" + chatUserId)
        .once(
          "value",
          snapshot => {
            console.log("isEligibleToReview -------- ", snapshot.val().isEligibleToReview);
            this.setState({
              isEligibleToReview: snapshot.val().isEligibleToReview,
            });
            if (snapshot.val().isEligibleToReview == true) {
              firebase
                .database()
                .ref()
                .child("reviews/" + chatUserId + "/clients/" + loggedUserId)
                .once(
                  "value",
                  snapshot => {
                    if (snapshot.val() == null) {
                      this.setState({
                        isShowReviewAlert: true
                      });
                    } else {

                      if (snapshot.val().comment != null) {
                        // console.log("comment -------- ", snapshot.val().comment);
                        console.warn("rating -------- ", snapshot.val().rating);
                        this.setState({
                          typedCommentText: snapshot.val().comment,
                          ratingValue: snapshot.val().rating != null ? snapshot.val().rating : 0,
                          oldRatingValue: snapshot.val().rating != null ? snapshot.val().rating : 0,
                          isShowReviewAlert: true,
                          isNewReview: false
                        });
                      } else {
                        this.setState({
                          isShowReviewAlert: true
                        });
                      }
                    }

                  },
                  error => {
                    console.log("Error: " + error);
                  }
                );
            } else {
              this.setState({
                isShowUserCodeAlert: true
              })
            }
          },
          error => {
            console.log("Error: " + error);
          }
        );
    }
  }

  updateReview = (userListedIn, loggedUserId, chatUserId) => { // need to change   
    var totalStars = 0;
    var totalReviews = 0;

    if (userListedIn == "Trainers") {
      firebase
        .database()
        .ref()
        .child("users/" + chatUserId + "/myTrainerProfile")
        .once(
          "value",
          snapshot => {
            if (snapshot.val() != null) {
              if (snapshot.val().totalStars != undefined) {
                totalStars = snapshot.val().totalStars;
              }
              if (snapshot.val().totalReviews != undefined) {
                totalReviews = snapshot.val().totalReviews;
              }
            }
            this.updateUserRating(userListedIn, totalStars, totalReviews, chatUserId);
          },
          error => {
            console.log("Error: " + error.code);
          }
        );
      firebase
        .database()
        .ref("reviews/" + chatUserId + "/trainers/")
        .child(loggedUserId)
        .update({
          rating: this.state.ratingValue,
          comment: this.state.typedCommentText,
          uid: loggedUserId
        })
        .then(() => {
          this.sendPushRating()

          this._showSnackBar("Your review added successfully", "green");
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      firebase
        .database()
        .ref()
        .child("users/" + chatUserId + "/myClientProfile")
        .once(
          "value",
          snapshot => {
            if (snapshot.val() != null) {
              if (snapshot.val().totalStars != undefined) {
                totalStars = snapshot.val().totalStars;
              }
              if (snapshot.val().totalReviews != undefined) {
                totalReviews = snapshot.val().totalReviews;
              }
            }
            this.updateUserRating(userListedIn, totalStars, totalReviews, chatUserId);
          },
          error => {
            console.log("Error: " + error.code);
          }
        );
      firebase
        .database()
        .ref("reviews/" + chatUserId + "/clients/")
        .child(loggedUserId)
        .update({
          rating: this.state.ratingValue,
          comment: this.state.typedCommentText,
          uid: loggedUserId
        })
        .then(() => {
          this.sendPushRating()
          this._showSnackBar("Your review added successfully", "green");
        })
        .catch(function (error) {
          console.error(error);
        });
    }

  }
  updateUserRating = (userListedIn, totalStars, totalReviews, chatUserId) => {

    if (this.state.isNewReview) {
      var ratingToUpdate = (totalStars + this.state.ratingValue) / (totalReviews + 1);
      var totalStarsToUpdate = totalStars + this.state.ratingValue;
      var totalReviewsToUpdate = totalReviews + 1;
    } else {
      var ratingToUpdate = (totalStars + (this.state.ratingValue - this.state.oldRatingValue)) / totalReviews;
      var totalStarsToUpdate = totalStars + (this.state.ratingValue - this.state.oldRatingValue);
      var totalReviewsToUpdate = totalReviews;
    }
    console.warn("this.state.ratingValu -", this.state.ratingValue);
    console.warn("this.state.oldRatingValue -", this.state.oldRatingValue);
    console.warn("totalStarsToUpdate -", totalStarsToUpdate);
    console.warn("totalReviewsToUpdate -", totalReviewsToUpdate);
    if (userListedIn == "Trainers") {
      firebase
        .database()
        .ref("users/" + chatUserId)
        .child("myTrainerProfile")
        .update({
          rating: Math.round(ratingToUpdate),
          totalStars: totalStarsToUpdate,
          totalReviews: totalReviewsToUpdate
        })
        .then(() => {

          this._showSnackBar("Your review added successfully", "green");
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      firebase
        .database()
        .ref("users/" + chatUserId)
        .child("myClientProfile")
        .update({
          rating: Math.round(ratingToUpdate),
          totalStars: totalStarsToUpdate,
          totalReviews: totalReviewsToUpdate

        })
        .then(() => {

          this._showSnackBar("Your review added successfully", "green");
        })
        .catch(function (error) {
          console.error(error);
        });
    }

  }


  sendPushRating = async () => {
    let name = firebase.auth().currentUser.displayName;
    let fcm_key = this.state.fcmToken
    console.warn("PUSH TYPE=REVIEW  KEY IS ", fcm_key)
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
              body: "You have a new Review from " + name,
              title: "New Review !",
              sound: "Enabled",
              icon: "default.png"
            },
            notification: {
              body: "You have a new Review from " + name,
              title: "New Review !",
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



  parse = snapshot => {
    console.log(snapshot.val());
    // const { timestamp: numberStamp, text, user } = snapshot.val();
    // const { key: id } = snapshot.val().id.toString();
    const _id = snapshot.key;
    const numberStamp = snapshot.val().createdAt;
    const text = snapshot.val().text;
    const user = snapshot.val().user;
    user.name = this.state.userName;
    user.avatar = this.state.userAvatar != undefined ? this.state.userAvatar : require("../../res/images/default_user.png")
    const createdAt = new Date(numberStamp);
    console.log("CreatedAT####", createdAt);
    const message = { _id, createdAt, text, user };
    return message;
  };

  timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  componentWillUnmount() {
    firebase
      .database()
      .ref()
      .off();
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      firebase
        .database()
        .ref()
        .child(
          "/conversations/" +
          this.state.loggedUserId +
          "/" +
          this.state.chatUserId +
          "/chats"
        )
        .push(message);

      firebase
        .database()
        .ref()
        .child(
          "/conversations/" +
          this.state.chatUserId +
          "/" +
          this.state.loggedUserId +
          "/chats"
        )
        .push(message);


      this.sendPush(message.text)
      //To increament other user's unread count
      var databaseRef = firebase.database()
        .ref("/conversations/" +
          this.state.chatUserId +
          "/" +
          this.state.loggedUserId
        )
        .child('unread');

      databaseRef.transaction(function (unread) {
        return (unread || 0) + 1;
      });
    }
  };

  submitUserCode = () => {

    if (this.state.typedUserCode == this.state.codeToRequest) {
      this.setState({
        isEligibleToReview: true,
        isShowUserCodeAlert: false
      })
      this._showSnackBar("The code correct, Now you can review", "green");
      this.updateIsEligibleToReview(this.state.userListedIn, this.state.loggedUserId, this.state.chatUserId);
    } else {
      this.setState({
        isShowUserCodeAlert: false
      });
      this._showSnackBar("The code you enter is incorrect, please try again", "red");

    }
    // this.setState({
    //   isShowReviewAlert: false
    // })
  }

  submitUserReview = () => {
    this.setState({
      isShowReviewAlert: false
    });
    if (this.state.ratingValue > 0 && this.state.typedCommentText.length > 0) {
      this.updateReview(this.state.userListedIn, this.state.loggedUserId, this.state.chatUserId);
    } else {
      if (this.state.ratingValue == 0) {
        this._showSnackBar("You need to select at least 1 star", "red");
      } else {
        this._showSnackBar("Review should be longer than 1 character", "red");
      }

    }

  }

  createStars = () => {
    let stars = [];
    let rating = 4;
    for (let i = 0; i < this.state.ratingValue; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => { this.setState({ ratingValue: (i + 1) }) }}>
          <Image
            source={require("../../res/images/star_filled.png")}
            style={styles.star}
            key={i}
          />
        </TouchableOpacity>
      );
    }
    for (let i = 0; i < 5 - this.state.ratingValue; i++) {
      stars.push(
        <TouchableOpacity key={i + 5} onPress={() => { this.setState({ ratingValue: (this.state.ratingValue + i + 1) }) }}>
          <Image
            source={require("../../res/images/star_empty.png")}
            style={styles.star}
            key={i + 5}
          />
        </TouchableOpacity>

      );
    }
    return stars;
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



  sendPush = async (message) => {
    let name = firebase.auth().currentUser.displayName;
    let fcm_key = this.state.fcmToken
    console.warn("KEY IS ", fcm_key)
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
              body: message,
              title: "New Message from " + name + "!",
              sound: "Enabled",
              icon: "default.png"
            },
            notification: {
              body: message,
              title: "New Message from " + name + "!",
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

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>

        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.send(messages)}
          user={{
            _id: this.props.navigation.getParam("loggedUserId")
          }}
        />
        <SnackBar
          visible={this.state.isShowError}
          autoHidingTime={2000}
          backgroundColor={this.state.snackColor}
          textMessage={this.state.errorToShow}
        />
        <Dialog.Container visible={this.state.isShowDeleteAlert}>
          <Dialog.Title>Remove user from matching</Dialog.Title>
          <Dialog.Description>
            Are you sure to remove this from matching list?
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => this.setState({ isShowDeleteAlert: false })}
          />
          <Dialog.Button label="Yes" onPress={this.deleteConversation} />
        </Dialog.Container>


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isShowReviewAlert}>
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View style={styles.modalBackground}>
              <KeyboardAvoidingView behavior="position">
                <View style={styles.reviewModal}>
                  <Text style={styles.reviewModalTitleFont}>Give your feedback</Text>

                  <View style={styles.starRatingArea}>{this.createStars()}</View>
                  <View style={styles.commentArea}>
                    <TextInput
                      placeholder={"How was the session? type your comment here"}
                      style={styles.commentBox}
                      multiline={true}
                      onChangeText={(text) => this.setState({ typedCommentText: text })}
                      value={this.state.typedCommentText}
                    />
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionButtons}
                      onPress={() => { this.submitUserReview() }}>
                      {this.state.isNewReview && <Text style={styles.rateText}>Rate</Text>}
                      {!this.state.isNewReview && <Text style={styles.rateText}>Update</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButtons}
                      onPress={() => {
                        this.setState({
                          isShowReviewAlert: false
                        })
                      }}>
                      {this.state.isNewReview && <Text style={styles.cancelText}>Rate Later</Text>}
                      {!this.state.isNewReview && <Text style={styles.cancelText}>Update Later</Text>}
                    </TouchableOpacity>
                  </View>
                </View>

              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isShowUserCodeAlert}>
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View style={styles.modalBackground}>
              <KeyboardAvoidingView behavior="position">
                <View style={styles.reviewModal}>
                  <Text style={styles.reviewModalTitleFont}>Your review code id {this.state.userCodeToShow}</Text>
                  <Text style={[styles.reviewModalTitleFont, { color: 'black' }]}>Please ask the user for their review code</Text>

                  <View style={styles.commentArea}>
                    <TextInput textAlign={'center'} value={this.state.typedUserCode} maxLength={4} placeholder={"Enter 4 digit code"} keyboardType='number-pad' style={styles.userCodeBox} onChangeText={(text) => { this.setState({ typedUserCode: text }) }} />
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionButtons}
                      onPress={() => this.submitUserCode()}>
                      <Text style={styles.rateText}>Submit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButtons}
                      onPress={() => {
                        this.setState({
                          isShowUserCodeAlert: false
                        })
                      }}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>


      </SafeAreaView>
    );
  }
}
