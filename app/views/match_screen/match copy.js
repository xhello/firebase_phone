import React, { Component } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "react-native-firebase";
import DrawerIcon from "../../navigation/drawer_icon";
import colors from "res/colors";
import strings from "res/strings";
import _ from "lodash";

import styles from "./style";

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedTabIndex: 0, // 0 = trainerTab, 1 = clientTab
      allUsers: [],
      trainerList: [],
      clientList: [],
      requestedList: [],
      requestedBackList: [],
      userImageToDisplay: require("../../res/images/default_user.png"),
      isLoading: false,
      isRefreshing: false
    };
  }

  static navigationOptions = {
    title: strings.appStack.match.navHeading,
    headerTitleStyle: {
      color: colors.header_text,
      fontFamily: "Helvetica Neue"
    },
    headerStyle: {
      backgroundColor: colors.header
    },
    headerLeft: <DrawerIcon />
  };

  componentWillMount() {
    this.setState({
      isLoading: true
    });
    this.readChangeData();
  }

  onTabFocus = () => {
    console.warn('############', this.state.clientList.length);
    this.setState({
      isLoading: true
    });
    this.readChangeData();
  };

  readChangeData = async () => {
    isUserLookingPT = await AsyncStorage.getItem("isUserLookingPT") || false;
    currentUser = firebase.auth().currentUser;
    // console.log(currentUser);
    if (currentUser._user.price != null) {
      this.props.screenProps.userPrice = currentUser._user.price;
    } else {
      this.props.screenProps.userPrice = 0;
    }
    this.setState(
      {
        user: currentUser._user,
        isUserLookingPT: isUserLookingPT == 'true' ? true : false,
        selectedTabIndex: isUserLookingPT == 'true' ? 0 : 1
      },
      () => {
        this.getMatchingData();
      }
    );
  };

  getMatchingData = () => {
    this.setState({
      isRefreshing: true
    });
    firebase
      .database()
      .ref("/users")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const users = _.map(snapshot.val(), user => {
            return  user ;
          });
          console.log(users);
          this.setState({
            allUsers: users
          });
        },
        error => {
          console.log("Error: " + error);
        }
      );

    firebase
      .database()
      .ref("/relationships/" + this.state.user.uid + "/requestedBack")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const requestedBackList = _.map(snapshot.val(), user => {
            return user;
          });
          console.log(requestedBackList);
          this.setState({
            requestedBackList: requestedBackList
          });
        },
        error => {
          console.log("Error: " + error);
        }
      );

    firebase
      .database()
      .ref("/relationships/" + this.state.user.uid + "/requested")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const requestedList = _.map(snapshot.val(), user => {
            return  user;
          });
          console.log(requestedList);
          this.setState({
            requestedList: requestedList
          });
          this.createMatchedUsers();
        },
        error => {
          console.log("Error: " + error);
        }
      );
    this.setState({
      isRefreshing: false
    });
  };

  createMatchedUsers = () => {
    // console.warn("createMatchedUsers");
    const requestedUserList = this.state.requestedList;
    console.log("requestedBackList", this.state.requestedBackList);
    console.log("requestedList", this.state.requestedList);
    // console.log("allUsers", this.state.allUsers);
    const matchingUsersTemp = _.intersectionBy(
      this.state.requestedBackList,
      this.state.requestedList,
      "uid"
    );
    // const matchingUsers = _.intersectionBy(
    //   this.state.allUsers,
    //   matchingUsersTemp,
    //   "user.uid"
    // );
    

    // console.log("requestedBackList ", this.state.requestedBackList);
    console.log("matchingUsersTemp ", matchingUsersTemp);
    console.log("requestedUserList ", requestedUserList);

    // const trainerList = matchingUsers;
    // const clientList = matchingUsers;
    // const trainerList = _.map(matchingUsers, user => {
    //   return { user };
    // });
    // const clientList = _.map(matchingUsers, user => {
    //   return { user };
    // });
    // _.remove(trainerList, user => {
    //   return user.user.isLookingForTrainer;
    // });

    // _.remove(clientList, user => {
    //   return !user.user.isLookingForTrainer
    // });

    _.remove(matchingUsersTemp, user => {
      console.log(user);
      return user.deleted == true;
    });

    const trainerListTemp = _.map(matchingUsersTemp, user => {
      return user;
    });
    const clientListTemp = _.map(matchingUsersTemp, user => {
      return user;
    });
    _.remove(trainerListTemp, user => {
      return user.currentRole === "client";
    });

    _.remove(clientListTemp, user => {
      return user.currentRole === "trainer"
    });

    console.log("trainerListTemp", trainerListTemp);
    console.log("clientListTemp", clientListTemp);
    console.log("this.state.allUsers", this.state.allUsers);

    var trainerList = [];
    if (trainerListTemp.length > 0) {
      trainerList = _.intersectionBy(
        this.state.allUsers,
        trainerListTemp,
        "uid"
      );
    }

    var clientList = [];
    if (clientListTemp.length > 0) {
      clientList = _.intersectionBy(
        this.state.allUsers,
        clientListTemp,
        "uid"
      );
    }

    clientListTemp.forEach(function(item){
      var index = _.findIndex(clientList, (o)=> { return o.uid == item.uid; });
      if(index > -1){
        clientList[index].price = item.currentPrice;
      }      
    });

    trainerListTemp.forEach(function(item){
      var index = _.findIndex(trainerList, (o)=> { return o.uid == item.uid; });
      var indexInRequestedList = _.findIndex(requestedUserList, (o)=> { return o.uid == item.uid; });
      console.log("indexInRequestedList - ", indexInRequestedList);
      if(index > -1 && indexInRequestedList > -1){
        trainerList[index].price = requestedUserList[indexInRequestedList].currentPrice;
      }      
    });

    console.log("trainerList", trainerList);
    console.log("clientList", clientList);

    this.setState({
      trainerList: trainerList,
      clientList: clientList,
      isLoading: false
    });

  };

  didTapPhoto = (id, name, photo) => {
    // updater functions are preferred for transactional updates
    // console.warn(id);
    this.props.navigation.navigate("UserChat", { userId: id, loggedUserId: this.state.user.uid, userName: name, userAvatar: photo });
  };
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardView}
        onPress={() => this.didTapPhoto(item.uid, item.displayName, item.photoURL)}
      >
        <View style={styles.cardViewLeftSideArea}>
          <Image
            source={
              item.photoURL == null
                ? this.state.userImageToDisplay
                : { uri: item.photoURL }
            }
            style={styles.userPic}
          />
          <Text style={styles.userName}>{item.displayName}</Text>
        </View>

        <View style={styles.cardViewRightSideArea}>
          <Text style={styles.price}>${item.price}</Text>
          <Image
            style={styles.forwardArrow}
            source={require("../../res/images/foward_arrow_icon.png")}
          />
        </View>
      </TouchableOpacity>
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
        <View style={styles.segmentRow}>
          <TouchableOpacity
            onPress={() => this.setState({ selectedTabIndex: 0 })}
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
            onPress={() => this.setState({ selectedTabIndex: 1, })}
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
        {(this.state.selectedTabIndex == 0 && this.state.trainerList.length > 0) && (
          <View style={styles.trainerView}>
            <FlatList
              data={this.state.trainerList}
              renderItem={this.renderItem}
              keyExtractor={item => item.uid}
              onRefresh={() => this.readChangeData()}
              refreshing={this.state.isRefreshing}
            />
          </View>
        )}

        {(this.state.selectedTabIndex == 0 && this.state.trainerList.length == 0) && (
          <View style={styles.notFoundMessage}>
            <Text style={styles.notFoundMessageFont}>
              No matching trainers found yet
            </Text>
          </View>
        )}

        {(this.state.selectedTabIndex == 1 && this.state.clientList.length > 0) && (
          <View style={styles.clientView}>
            <FlatList
              data={this.state.clientList}
              renderItem={this.renderItem}
              keyExtractor={item => item.uid}
              onRefresh={() => this.readChangeData()}
              refreshing={this.state.isRefreshing}
            />
          </View>
        )}

        {(this.state.selectedTabIndex == 1 && this.state.clientList.length == 0) && (
          <View style={styles.notFoundMessage}>
            <Text style={styles.notFoundMessageFont}>
              No matching clients found yet
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
