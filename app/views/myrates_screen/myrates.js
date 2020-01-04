import React, { Component } from "react";
import { SafeAreaView, View, Image, Button, Text, TouchableOpacity } from "react-native";
import Accordion from 'react-native-collapsible/Accordion';
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "react-native-firebase";
import BackIcon from "../../navigation/back_icon";
import colors from "res/colors";
import strings from "res/strings";
import _ from "lodash";

import styles from "./style";

export default class RateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      collapsed: true,
      multipleSelect: false,
      reviewsByTrainers: [],
      reviewsByClients: [],
      selectedTabIndex: 0,
      allUsers: []
    };
  }
  static navigationOptions = {
    title: strings.appStack.review.navHeading,
    headerTitleStyle: {
      color: colors.header_text,
      fontFamily: "Helvetica Neue"
    },
    headerStyle: {
      backgroundColor: colors.header
    },
    headerLeft: <BackIcon />
  };

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSections = sections => {
    console.warn(sections);
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <View style={styles.reviewRow}>
        <View style={styles.leftArea}>
          <Image
            source={section.photoURL ? { uri: section.photoURL } : require("../../res/images/default_user.png")}
            style={styles.userImageOnReview} />
          <View style={styles.starRatingArea}>
            {this.createStars(section.rating)}
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
  createStars = (count) => {
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

  componentWillMount() {
    this.setState({
      isLoading: true
    })
    console.warn(this.props.screenProps.loggedUserId);
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
            this.getAllReviews();
          }));
        },
        error => {
          console.log("Error: " + error);
        }
      );
  }

  getAllReviews = () => {
    firebase
      .database()
      .ref("reviews/" + this.props.screenProps.loggedUserId + "/trainers/")
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
      .ref("reviews/" + this.props.screenProps.loggedUserId + "/clients/")
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
      reviewsByTrainers: reviews,
      isLoading: false
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
      reviewsByClients: reviews,
      isLoading: false
    });
  }

  createStarsHeader = () => {
    let reviews;
    if (this.state.selectedTabIndex == 0) {
      reviews = this.state.reviewsByTrainers
    }
    else {
      reviews = this.state.reviewsByClients;
    }
    let rating = 0
    for (let i = 0; i < reviews.length; i++) {
      console.warn(reviews[i])
      rating += reviews[i].rating;
    }
    let stars = [];
    if (rating > 0) {
      rating = rating / reviews.length

    }

    console.warn("rating is ", rating)
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

  }


  render() {
    const { activeSections, multipleSelect } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.isLoading}
          textContent={"Loading ..."}
          textStyle={styles.spinnerTextStyle}
          color={"#FE007A"}
        />
        <View style={styles.ratingRow}>{this.createStarsHeader()}
          <Text style={{ paddingHorizontal: 5, fontWeight: 'bold' }}>
            {this.state.selectedTabIndex == 0 ? this.state.reviewsByTrainers.length : this.state.reviewsByClients.length}
          </Text>
        </View>
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

      </SafeAreaView>
    );
  }
}
