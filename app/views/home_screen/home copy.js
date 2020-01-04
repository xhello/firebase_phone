import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Switch,
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
      userLat: 0,
      userLon: 0
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
      headerRight: navigation.getParam("isUserLookingPT") ? (
        <Switch
          onValueChange={() => navigation.getParam("showMessagedUsers")()}
          value={navigation.getParam("switchValue")}
          style={{
            marginRight: 15
          }}
        />
      ) : (
        <View />
      )
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
      isLoading: true
    });
    this.readChangeData();
  };

  componentDidMount() {
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
            fcmToken:fcmToken
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

  updateUserLocation = () => {
    // user = firebase.auth().currentUser;
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
          switchValue: false,
          isUserLookingPT: this.state.isUserLookingPT
        });
        this.updateUserLocation();
        // this.getHomeData();
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
              return user.user.price > this.state.userPrice;
            });
          } else {
            _.remove(users, user => {
              return user.user.price < this.state.userPrice;
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
          firebase
            .database()
            .ref()
            .child("relationships/" + this.state.user.uid + "/requested")
            .once(
              "value",
              snapshot => {
                const requestedUsers = _.map(snapshot.val(), user => {
                  return { user };
                });
                var filteredUsers = _.differenceBy(
                  users,
                  requestedUsers,
                  "user.uid"
                );
                this.setState({
                  allUsersToShow: filteredUsers,
                  userList: filteredUsers
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
          console.log("Error: " + error.code);
        }
      );

    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .once(
        "value",
        snapshot => {
          this.props.screenProps.userPrice = snapshot.val().price.toString();
          this.props.screenProps.userIsGymAccess = snapshot.val().isGymAccess;
          this.props.screenProps.userPriceToDisplay = snapshot
            .val()
            .price.toString();
          this.props.screenProps.userRating = snapshot.val().rating.toString();
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
    console.warn(id);
    console.warn(this.state.user.uid);
    console.warn(this.state.isUserLookingPT);
    console.warn('currentPrice', currentPrice); // TODO

    firebase
      .database()
      .ref("relationships/" + this.state.user.uid + "/requested")
      .child(id)
      .set({
        currentRole: this.state.isUserLookingPT ? "client" : "trainer",
        uid: id,
        currentPrice: this.state.isUserLookingPT ? currentPrice : '' //this.state.userPrice //CHECK
      })
      .then(() => {
        this._showSnackBar("Request sent successfully", "green");
        this.readChangeData();
      })
      .catch(function(error) {
        console.error(error);
      });

    firebase
      .database()
      .ref("relationships/" + id + "/requestedBack")
      .child(this.state.user.uid)
      .set({
        currentRole: this.state.isUserLookingPT ? "client" : "trainer",
        uid: this.state.user.uid,
        currentPrice: this.state.isUserLookingPT ? currentPrice : '' //this.state.userPrice //CHECK
      })
      .catch(function(error) {
        console.error(error);
      });
      
      firebase
      .database()
      .ref()
      .child("relationships/" + id + "/requested/" + this.state.user.uid)
      .once(
        "value",
        snapshot => {
          let isExist = snapshot.exists();
          if (isExist) {
            this.sendPush(fcm_key,name);        
          }
        },
        error => {
          console.log("Error: " + error.code);
        }
      );
    
  };

  sendPush = async (fcm_key, name) => {
    
    if(fcm_key!= null){
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

  sendMessage = (id, fcm_key, name, currentPrice) => {
    firebase
      .database()
      .ref("messages/" + this.state.user.uid + "/sent")
      .child(id)
      .set({
        uid: id,
        message: this.state.textMessage
      })
      .catch(function(error) {
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
        _.map(this.state.messagedUserList, function(obj) {
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
    var price = this.state.isUserLookingPT ? currentPrice : this.state.userPrice;    
    this.props.navigation.navigate("UserDetail", { userId: id, loggedUserId: loggedId, isUserLookingPT: this.state.isUserLookingPT, currentPriceToSet: price});
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
  submitMessage = () => {
    console.warn("submitMessage");
    this.sendMessage(this.state.selectedUserIdToMessage, this.state.selectedUserFCMKey, this.state.selectedUserName, this.state.selectedUserCurrentPrice);
    this.setState({
      isMessageSendingMode: false
    });
  };
  renderItem = ({ item }) => {
    return (
      <HomeCard
        onPressPhoto={() => this.didTapPhoto(item.user.uid, this.state.user.uid, item.user.price)}
        onPressRequest={() => this.didTapRequestButton(item.user.uid, item.user.fcmToken, item.user.displayName, item.user.price)}
        onPressMessage={() => this.didTapMessageButton(item.user.uid, item.user.fcmToken, item.user.displayName, item.user.price)}
        userImage={
          item.user.photoURL
            ? { uri: item.user.photoURL }
            : require("../../res/images/default_user.png")
        }
        name={item.user.displayName}
        isGymEnable={item.user.isGymAccess}
        rating={item.user.rating}
        isClientListing={!this.state.isUserLookingPT}
        price={"$" + item.user.price}
        messageText={item.user.message}
        isShowMessage={!this.state.isShowAllUsers}
      />
    );
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents onWillFocus={this.onTabFocus} />
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
        />
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
        {this.state.allUsersToShow.length == 0 && !this.state.isLoading && (
          <View style={styles.notFoundMessage}>
            <Text style={styles.notFoundMessageFont}>
              No users found with your settings,
            </Text>
            <Text style={styles.notFoundMessageFont}>
              Change your price, distance and try again
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
