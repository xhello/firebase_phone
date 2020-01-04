import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Switch,
  RefreshControl,
  PermissionsAndroid,
  Platform
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-community/async-storage";
import Dialog from "react-native-dialog";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "react-native-firebase";
import DrawerIcon from "../../navigation/drawer_icon";
import HomeCard from "../../components/home_card/home_card";
import colors from "res/colors";
import strings from "res/strings";
import _ from "lodash";
import { NavigationEvents } from "react-navigation";
import SnackBar from "react-native-snackbar-component";

import styles from "./style";
import MapScreen from "../map_screen/MapScreen";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      allUsersToShow: [],
      userList: [],
      messagedUserList: [],
      isUserLookingPT: false,
      isRefreshing: false,
      isLoading: false,
      isShowAllUsers: true,
      textMessage: "",
      isMessageSendingMode: false,
      selectedUserIdToMessage: "",
      crossedUser: [],
      userLat: 0,
      userLon: 0,
      mapScreen: false
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: strings.appStack.home.navHeading,
      headerTitleStyle: {
        color: colors.header_text,
        fontFamily: "Helvetica Neue"
      },
      headerStyle: {
        backgroundColor: colors.header
      },
      headerLeft: <DrawerIcon />,
      headerRight:
        <Switch
          onValueChange={() => {
            navigation.setParams({
              switchValue: !navigation.getParam("switchValue"),

            })
            navigation.getParam("renderMap")()
          }}
          value={navigation.getParam("switchValue")}
          style={{
            marginRight: 15
          }}
        />
      // navigation.getParam("isUserLookingPT") ? (
      //   // <Switch
      //   //   onValueChange={() => navigation.getParam("showMessagedUsers")()}
      //   //   value={navigation.getParam("switchValue")}
      //   //   style={{
      //   //     marginRight: 15
      //   //   }}
      //   // />

      //   <View />
      // ) : (
      //     <View />
      //   )
    };
  };
  // componentWillMount() {
  //   this.setState({
  //     isLoading: true
  //   });
  //   this.readChangeData();
  // }

  onTabFocus = () => {
    this.setState({
      isLoading: true,
      mapScreen: false

    }, () => {
      this.props.navigation.setParams({
        switchValue: false,
        renderMap: this.renderMap,
      });
    });
    this.readChangeData();
  };

  componentDidMount() {


    // this.notificationListener = firebase.notifications().onNotification((Notification) => {
    //   console.warn("########--------", Notification);
    //   firebase.notifications().setBadge(parseInt(firebase.notifications().getBadge()) + 1)

    // });

    // firebase.notifications().onNotificationOpened((notification) => {
    //   firebase.notifications().setBadge(parseInt(firebase.notifications().getBadge()) + 1)

    // })


    firebase.notifications().onNotification((notification) => {
      console.warn(firebase.notifications().getBadge())
      firebase.notifications().getBadge().then(val => {
        console.warn(val)
        console.warn(notification.data)
        if (notification.data.title.search('New Message from') > -1) {
          if (val > 0)
            firebase.notifications().setBadge(val + 1)
          else
            firebase.notifications().setBadge(1)
        }


      })

    })
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("########### USER HAS PERMISSION TO NOTIFICATIONS");
          this.getToken();
          // firebase.notifications().onNotificationOpened(notificationOpen => {
          //   const data = Platform.OS === 'android' ? notificationOpen.notification.data.customDataKeyName : notificationOpen.customDataKeyName;
          //   this.navigate(data);
          // });
        } else {
          console.log("########### USER HAS NO PERMISSION TO NOTIFICATIONS");
          try {
            firebase
              .messaging()
              .requestPermission()
              .then(() => {
                console.log("########### PERMISSION GAVE for NOTIFICATIONS");
                this.getToken();

              })
              .catch(error => {
                console.log("########### NO PERMISSION GAVE for NOTIFICATIONS");
              });
            // User has authorised
          } catch (error) {
            console.log("error");
          }
        }
      });



  }


  getUnreadMessageCount = () => {
    firebase.database().ref()
      .child("conversations/" + this.state.user.uid).on('value', snap => {
        let totalUnreadCount = 0;
        console.warn(snap.val())
        if (snap.val()) {
          let keys = Object.keys(snap.val())
          console.warn(keys)
          for (let i = 0; i < keys.length; i++) {
            if (snap.val()[keys[i]].unread) {
              totalUnreadCount += parseInt(snap.val()[keys[i]].unread)
            }
          }
        }
        if (totalUnreadCount) {
          firebase.notifications().setBadge(totalUnreadCount)

        }
      })
  }
  getCrossedUsers = () => {
    var role = !this.state.isUserLookingPT
      ? "Clients"
      : "Trainers";


    firebase
      .database()
      .ref()
      .child(
        "users/" +
        this.state.user.uid +
        `/ignore/${role}`
      )
      .once(
        "value",
        snapshot => {
          const removedUser = _.map(snapshot.val(), user => {
            console.log("Ignored User: ", user)
            return { user }

          })
          console.log("Ignored User: ", removedUser)
          this.setState({ crossedUser: removedUser })
        })



  }

  // componentWillUnmount() {
  //   this.messageListener();
  // }

  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    console.log("FCM TOKEN ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
        firebase
          .database()
          .ref()
          .child("users/" + this.state.user.uid)
          .update({
            fcmToken: fcmToken
          })
          .then(res => {
            console.warn("User FCM token updated");
          })
          .catch(error => {
            console.warn(error);
          });
      }
    }
  };

  updateUserLocation = async () => {
    // user = firebase.auth().currentUser;
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "TinFit needs access to your location " +
            "so you we can find your perfect match.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        Geolocation.getCurrentPosition(
          position => {
            console.warn("Position -------", position);
            firebase
              .database()
              .ref()
              .child("users/" + this.state.user.uid + "/location")
              .update({
                lat: position.coords.latitude,
                lon: position.coords.longitude
              })
              .then(res => {
                console.warn("UserLocation updated successfully");
                this.setState(
                  {
                    userLat: position.coords.latitude,
                    userLon: position.coords.longitude
                  },
                  () => {
                    this.getHomeData();
                  }
                );
              })
              .catch(error => {
                console.warn(error);
              });
          },
          error => {
            // See error code charts below.
            console.warn("Position -----ERROR--", error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        console.log("Camera permission denied");
      }
    }
    Platform.OS === "ios" &&
      Geolocation.getCurrentPosition(
        position => {
          console.warn("Position -------", position);
          firebase
            .database()
            .ref()
            .child("users/" + this.state.user.uid + "/location")
            .update({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            })
            .then(res => {
              console.warn("UserLocation updated successfully");
              this.setState(
                {
                  userLat: position.coords.latitude,
                  userLon: position.coords.longitude
                },
                () => {
                  this.getHomeData();
                }
              );
            })
            .catch(error => {
              console.warn(error);
            });
        },
        error => {
          // See error code charts below.
          console.warn("Position -----ERROR--", error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
  };

  readChangeData = async () => {
    isUserLookingPT = (await AsyncStorage.getItem("isUserLookingPT")) || "true";
    userPrice = (await AsyncStorage.getItem("userPrice")) || 0;
    userLookingDistance =
      (await AsyncStorage.getItem("userLookingDistance")) || 50;

    console.warn("isUserLookingPT ---", isUserLookingPT);
    console.warn("userPrice ---", userPrice);
    console.warn("userLookingDistance ---", userLookingDistance);
    currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    if (currentUser._user.displayName != null) {
      this.props.screenProps.userId = currentUser._user.displayName;
    } else {
      this.props.screenProps.userId = "No Display Name";
    }
    this.props.screenProps.loggedUserId = currentUser._user.uid; // Check with new user
    this.props.screenProps.userImageUrl = currentUser._user.photoURL;

    this.setState(
      {
        user: currentUser._user,
        isUserLookingPT: isUserLookingPT == "true" ? true : false,
        userPrice: parseInt(userPrice),
        userLookingDistance: parseInt(userLookingDistance)
      },
      () => {
        const { navigation } = this.props;
        navigation.setParams({
          showMessagedUsers: this.showMessagedUsers,
          // switchValue: false,
          isUserLookingPT: this.state.isUserLookingPT
        });
        this.updateUserLocation();
        // this.getHomeData();
        this.getCrossedUsers();
        this.getUnreadMessageCount();

      }
    );
  };

  getHomeData = () => {
    this.setState({
      isRefreshing: true
    });
    firebase
      .database()
      .ref("/users")
      .orderByChild("isLookingForTrainer")
      .equalTo(!this.state.isUserLookingPT)
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const users = _.map(snapshot.val(), user => {

            console.log(user);
            return { user };
          });
          console.log(users);

          _.remove(users, user => {
            console.log(user);
            return user.user.uid == this.state.user.uid;
          });
          if (this.state.isUserLookingPT) {
            _.remove(users, user => {
              return user.user.myTrainerProfile.price > this.state.userPrice;
            });
          } else {
            _.remove(users, user => {
              return user.user.myClientProfile.price < this.state.userPrice;
            });
          }

          _.remove(users, user => {
            if (user.user.location != null) {
              var userLat = user.user.location.lat;
              var userLon = user.user.location.lon;
              var distance = this.calDistance(
                userLat,
                userLon,
                this.state.userLat,
                this.state.userLon
              );
              console.warn(
                "Location ----",
                this.state.userLat,
                this.state.userLon
              );
              console.warn("Distance ----", distance);
              return distance > this.state.userLookingDistance;
            } else {
              return false;
            }
          });

          // get request sent user list;
          var listToAddLoggedUser = this.state.isUserLookingPT
            ? "Clients"
            : "Trainers";
          // var listToAddUser = this.state.isUserLookingPT? "Trainers" : "Clients"
          firebase
            .database()
            .ref()
            .child(
              "relationships/" +
              listToAddLoggedUser +
              "/" +
              this.state.user.uid +
              "/requested"
            )
            .once(
              "value",
              snapshot => {


                const requestedUsers = _.map(snapshot.val(), user => {
                  return { user };
                });

                //Removing Already Requested Users
                var filteredUsers = _.differenceBy(
                  users,
                  requestedUsers,
                  "user.uid"
                );



                //Removing Crossed-Out Users
                var filteredAndCrossedUsers = _.differenceBy(
                  filteredUsers,
                  this.state.crossedUser,
                  "user.uid"
                );

                //Updating Filtered Out Users in state
                ///REMOVING USERS WITH NO IMAGE
                for (let k = 0; k < filteredAndCrossedUsers.length; k++) {

                  if (!filteredAndCrossedUsers[k].user.photoURL) {
                    filteredAndCrossedUsers.splice(k, 1)
                  }
                }
                ///REMOVING USERS WITH NO IMAGE


                this.setState({
                  allUsersToShow: filteredAndCrossedUsers,
                  userList: filteredAndCrossedUsers
                });

                firebase
                  .database()
                  .ref("messages/" + this.state.user.uid + "/received")
                  .once(
                    "value",
                    snapshot => {
                      const messagedUsers = _.map(snapshot.val(), user => {
                        return { user };
                      });
                      var filteredMessagedUsers = _.differenceBy(
                        messagedUsers,
                        requestedUsers,
                        "user.uid"
                      );
                      console.log("requestedUsers #####", requestedUsers);
                      console.log("messagedUsers #####", messagedUsers);
                      console.log(
                        "filteredMessagedUsers #####",
                        filteredMessagedUsers
                      );
                      this.setState({
                        messagedUserList: filteredMessagedUsers,
                        isRefreshing: false,
                        isLoading: false
                      });
                    },
                    error => {
                      console.log("Error: " + error.code);
                    }
                  );
              },
              error => {
                console.log("Error: " + error.code);
              }
            );
        },
        error => {
          console.log("Error: " + error);
        }
      );

    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .once(
        "value",
        snapshot => {
          if (this.state.isUserLookingPT) {
            this.props.screenProps.userPrice = snapshot.val().myClientProfile.price.toString();
            this.props.screenProps.userPriceToDisplay = snapshot.val().myClientProfile.price.toString();
          } else {
            this.props.screenProps.userPrice = snapshot.val().myTrainerProfile.price.toString();
            this.props.screenProps.userPriceToDisplay = snapshot.val().myTrainerProfile.price.toString();
          }
          this.props.screenProps.userIsGymAccess = snapshot.val().isGymAccess;
          // this.props.screenProps.userRating = snapshot.val().rating.toString();
          if (snapshot.val().myTrainerProfile != null) {
            this.props.screenProps.userRating = snapshot.val().myTrainerProfile.rating != null ? snapshot.val().myTrainerProfile.rating : 0
          }
          if (snapshot.val().myClientProfile != null) {
            this.props.screenProps.userRating = snapshot.val().myClientProfile.rating != null ? snapshot.val().myClientProfile.rating : 0
          }
        },
        error => {
          console.log("Error: " + error.code);
        }
      );
  };

  calDistance = (lat1, lon1, lat2, lon2) => {
    var R = 3958.8; // 6371; // km (change this constant to get miles)
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };

  didTapRequestButton = (id, fcm_key, name, currentPrice) => {
    // console.warn(id);
    // console.warn(this.state.user.uid);
    // console.warn(this.state.isUserLookingPT);
    // console.warn('currentPrice', currentPrice); // TODO
    var randomUserCode = Math.floor(1000 + Math.random() * 9000);
    var listToAddLoggedUser = this.state.isUserLookingPT ? "Clients" : "Trainers";
    var listToAddUser = this.state.isUserLookingPT ? "Trainers" : "Clients";

    if (this.state.isUserLookingPT) {
      firebase
        .database()
        .ref("relationships/" + listToAddLoggedUser + "/" + this.state.user.uid + "/requested")
        .child(id)
        .set({
          uid: id,
          currentPrice: currentPrice, //CHECK
          userCode: randomUserCode
        })
        .then(() => {
          // Get Requested back list
          firebase
            .database()
            .ref()
            .child("relationships/" + listToAddLoggedUser + "/" + this.state.user.uid + "/requestedBack")
            .once(
              "value",
              snapshot => {
                const requestedBackUsers = _.map(snapshot.val(), user => {
                  return { user };
                });
                var index = _.findIndex(requestedBackUsers, (o) => { return o.user.uid == id; });
                console.log("----ID----", index);
                if (index > -1) {
                  this._showSnackBar("You have a match with " + name, "#4c8bf5");
                  this.sendPush(fcm_key, this.state.user.displayName);
                } else {
                  this._showSnackBar("Request sent successfully", "green");
                }
                this.readChangeData();
              },
              error => {
                console.log("Error: " + error.code);
              }
            );
        })
        .catch(function (error) {
          console.error(error);
        });

      firebase
        .database()
        .ref("relationships/" + listToAddUser + "/" + id + "/requestedBack")
        .child(this.state.user.uid)
        .set({
          uid: this.state.user.uid,
          currentPrice: currentPrice, //CHECK
          userCode: randomUserCode
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      firebase
        .database()
        .ref("relationships/" + listToAddLoggedUser + "/" + this.state.user.uid + "/requested")
        .child(id)
        .set({
          uid: id,
          userCode: randomUserCode
        })
        .then(() => {
          // Get Requested back list
          firebase
            .database()
            .ref()
            .child("relationships/" + listToAddLoggedUser + "/" + this.state.user.uid + "/requestedBack")
            .once(
              "value",
              snapshot => {
                const requestedBackUsers = _.map(snapshot.val(), user => {
                  return { user };
                });
                var index = _.findIndex(requestedBackUsers, (o) => { return o.user.uid == id; });
                if (index > -1) {
                  this._showSnackBar("You have a match with " + name, "#4c8bf5");
                  this.sendPush(fcm_key, this.state.user.displayName);
                } else {
                  this._showSnackBar("Request sent successfully", "green");
                }
                this.readChangeData();
              },
              error => {
                console.log("Error: " + error.code);
              }
            );
        })
        .catch(function (error) {
          console.error(error);
        });

      firebase
        .database()
        .ref("relationships/" + listToAddUser + "/" + id + "/requestedBack")
        .child(this.state.user.uid)
        .set({
          uid: this.state.user.uid,
          userCode: randomUserCode
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    // firebase
    //   .database()
    //   .ref()
    //   .child("relationships/" + listToAddLoggedUser + "/" + id + "/requested/" + this.state.user.uid)
    //   .once(
    //     "value",
    //     snapshot => {
    //       let isExist = snapshot.exists();
    //       console.log("-------isExist-------", isExist);
    //       if (isExist) {
    //         this.sendPush(fcm_key, name);
    //       }
    //     },
    //     error => {
    //       console.log("Error: " + error.code);
    //     }
    //   );

  };

  sendPush = async (fcm_key, name) => {
    console.log("------------SEND PUSH------------");
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
        console.log("----------------RESPONSE--------- ", responseJson);
        return responseJson;
      }
      catch (error) {
        console.error(error);
      }
    }
  };

  sendMessage = (id, fcm_key, name, currentPrice) => {
    firebase
      .database()
      .ref("messages/" + this.state.user.uid + "/sent")
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
      .child(this.state.user.uid)
      .set({
        uid: this.state.user.uid,
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

  showMessagedUsers = () => {
    const { navigation } = this.props;
    var currentState = this.state.isShowAllUsers;
    this.setState({
      isShowAllUsers: !currentState
    });
    if (currentState) {
      this._showSnackBar("Showing users who messaged you", "green");
      const filterMessagedUsers = _.intersectionBy(
        this.state.allUsersToShow,
        this.state.messagedUserList,
        "user.uid"
      );

      var filterMessagedUsersWithMessages = _.merge(
        filterMessagedUsers,
        _.map(this.state.messagedUserList, function (obj) {
          return _.pick(obj, "user.uid", "user.message");
        })
      );

      this.setState({
        userList: filterMessagedUsersWithMessages
      });
      navigation.setParams({
        switchValue: true
      });
    } else {
      this.setState({
        userList: this.state.allUsersToShow
      });
      navigation.setParams({
        switchValue: false
      });
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

  onTapCard() {
    console.warn("onTapCard");
    // this.props.navigation.navigate("UserDetail")
  }
  didTapPhoto = (id, loggedId, currentPrice) => {

    console.log("id: ", id)
    console.log("id: ", loggedId)
    var price = this.state.isUserLookingPT ? currentPrice : this.state.userPrice;
    // this.props.navigation.navigate("UserDetail", { userId: id, loggedUserId: loggedId, isUserLookingPT: this.state.isUserLookingPT, currentPriceToSet: price });
    this.props.navigation.navigate("MatchUserDetailUnmatched", { userId: id, userListedIn: "Trainer" });

  };

  didTapMessageButton = (id, fcm_key, name, currentPrice) => {
    // console.warn("message to - ", id);
    this.setState({
      isMessageSendingMode: true,
      selectedUserIdToMessage: id,
      selectedUserFCMKey: fcm_key,
      selectedUserName: name,
      selectedUserCurrentPrice: currentPrice
    });
    // this.sendMessage(id);
  };

  crossUser = (userId) => {

    // const filteredUser = this.state.allUsersToShow.filter((user)=>{
    //   console.log("User Id: ",user.user.uid)
    //   return user.user.uid !== id1
    // })


    var role = this.state.isUserLookingPT
      ? "Trainers"
      : "Clients";



    // console.log("crossUser called: ", isUserLookingPT)

    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid + `/ignore/${role}`)
      .child(userId)
      .set({
        uid: userId
      })
      .then((res) => {

        this.readChangeData()

        console.log("Crossed response is: ", res)
      }).catch((err) => {
        console.log("Crossed Error: ", err)
      })

  }

  submitMessage = () => {
    console.warn("submitMessage");
    this.sendMessage(this.state.selectedUserIdToMessage, this.state.selectedUserFCMKey, this.state.selectedUserName, this.state.selectedUserCurrentPrice);
    this.setState({
      isMessageSendingMode: false
    });
  };
  renderItem = ({ item }) => {
    console.log("#####################@@@@@@@@@@@@@ - ", item.user.myTrainerProfile.price);
    var ratingToShow = 0;
    let ratingCount = 0;
    if (this.state.isUserLookingPT) {
      if (item.user.myTrainerProfile != undefined) {
        console.log("#####################@@@@@@@@@@@@@****** - ");
        ratingToShow = item.user.myTrainerProfile.rating != null ? item.user.myTrainerProfile.rating : 0
        ratingCount = item.user.myTrainerProfile.totalReviews !== null ? item.user.myTrainerProfile.totalReviews : 0
      }
    } else {
      if (item.user.myClientProfile != undefined) {
        ratingToShow = item.user.myClientProfile.rating != null ? item.user.myClientProfile.rating : 0
        ratingCount = item.user.myClientProfile.totalReviews !== null ? item.user.myClientProfile.totalReviews : 0
      }
    }
    if (this.state.isUserLookingPT) {
      var price = item.user.myTrainerProfile.price
    } else {
      var price = item.user.myClientProfile.price
    }
    console.warn("IMAGE URL", item.user.photoURL)
    if (item.user.photoURL) {

      return (

        <HomeCard
          onPressPhoto={() => this.didTapPhoto(item.user.uid, this.state.user.uid, price)}
          onPressRequest={() => this.didTapRequestButton(item.user.uid, item.user.fcmToken, item.user.displayName, price)}
          onPressMessage={() => this.didTapMessageButton(item.user.uid, item.user.fcmToken, item.user.displayName, price)}
          onPressCrossUser={() => this.crossUser(item.user.uid, this.state.user.uid)}




          userImage={
            item.user.photoURL
              ? { uri: item.user.photoURL }
              : require("../../res/images/default_user.png")
          }
          name={item.user.displayName}
          isGymEnable={item.user.isGymAccess}
          rating={ratingToShow}
          isClientListing={!this.state.isUserLookingPT}
          price={"$" + price}
          messageText={item.user.message}
          isShowMessage={!this.state.isShowAllUsers}
          ratingCount={ratingCount}
        />
      );

    }

  };

  renderEmptyContainer = () => {
    return (
      <View style={styles.notFoundMessage} refreshing={this.state.isRefreshing} onRefresh={() => this.readChangeData()}>
        <Text style={styles.notFoundMessageFont}>No users found with your settings,</Text>
        <Text style={styles.notFoundMessageFont}>Change your price, distance and try again</Text>
      </View>
    )
  }



  renderMap = () => {
    this.setState({ mapScreen: !this.state.mapScreen, })
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents onWillFocus={this.onTabFocus} />

        {this.state.mapScreen ? (
          <MapScreen
            lat={this.state.userLat}
            lng={this.state.userLon}
            userList={this.state.userList}
            didTapPhoto={(v1, v2, v3) => this.didTapPhoto(v1, v2, v3)}
            didTapRequestButton={(v1, v2, v3, v4) => { this.didTapRequestButton(v1, v2, v3, v4) }}
            didTapMessageButton={(v1, v2, v3, v4) => { this.didTapMessageButton(v1, v2, v3, v4) }}
            crossUser={(v1, v2) => { this.crossUser(v1, v2) }}
            uid={this.state.user.uid}
            isUserLookingPT={this.state.isUserLookingPT}
            readChangeData={() => this.readChangeData()}
          />
        )
          :
          (
            <View style={{ width: '100%', padding: 0, margin: 0, height: '100%' }}>
              <Spinner
                visible={this.state.isLoading}
                textContent={"Loading ..."}
                textStyle={styles.spinnerTextStyle}
                color={"#FE007A"}
              />
              <SnackBar
                visible={this.state.isShowError}
                autoHidingTime={2000}
                backgroundColor={this.state.snackColor}
                textMessage={this.state.errorToShow}
              />
              <FlatList
                data={this.state.userList}
                renderItem={this.renderItem}
                keyExtractor={item => item.user.uid}
                onRefresh={() => this.readChangeData()}
                refreshing={this.state.isRefreshing}
                showsVerticalScrollIndicator={false}
                style={styles.listView}
                ListEmptyComponent={this.renderEmptyContainer()}
              />
            </View>
          )}

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
