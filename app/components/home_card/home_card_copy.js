import React, { Component } from "react";
import { Button, View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

import styles from "./style";
// import { TouchableOpacity } from "react-native-gesture-handler";

class HomeCard extends Component {
  createStars = () => {
    let stars = [];
    let rating = this.props.rating;
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

  didTapPhoto = () => {
    this.props.onPressPhoto(this.props.id, this.props.userID);
  };

  didTapRequest = () => {
    this.props.onPressRequest(this.props.id);
  };

  didTapMessage = () => {
    this.props.onPressMessage(this.props.id);
  };

  render() {
    console.log("Props price: ",this.props.price)  

    
    return (



      
      <View style={styles.card}>
        <View style={styles.cardTopSection}>
          <TouchableOpacity
            style={styles.pictureCol}
            onPress={this.didTapPhoto}
          >
            <Image style={styles.picture} source={this.props.userImage} />
          </TouchableOpacity>
          <View style={styles.detailCol}>
            <View style={styles.nameRow}>
              <Text style={styles.nameFont}>{this.props.name}</Text>
            </View>
            <View style={styles.secondRow}>
              <View style={styles.ratingRow}>
                {this.createStars(this.props.rating)}
              </View>
              <View>
                {!this.props.isClientListing && (
                  <View>
                    <Text style={styles.priceFont}>{this.props.price}</Text>
                  </View>
                )}
                
                {this.props.isClientListing && (
                  <TouchableOpacity onPress={this.didTapMessage}>
                    <Image
                      source={require("../../res/images/email_icon.png")}
                      style={styles.messageIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={this.didTapRequest}
              >
                <Text style={styles.requestButtonFont}>REQUEST</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  this.props.isGymEnable
                    ? styles.gymButtonEnable
                    : styles.gymButtonDisable
                }
              >
                <View>
                  <Image
                    source={
                      this.props.isGymEnable
                        ? require("../../res/images/gym_icon_enable.png")
                        : require("../../res/images/gym_icon_disable.png")
                    }
                    style={styles.gymButtonIcon}
                  />
                </View>
                <View>
                  <Text
                    style={
                      this.props.isGymEnable
                        ? styles.gymButtonEnableFont
                        : styles.gymButtonDisableFont
                    }
                  >
                    GYM
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this.props.isShowMessage && (
          <View>
            <Text style={styles.messageFont}>{this.props.messageText}</Text>
          </View>
        )}
      </View>
    );
  }
}

export default HomeCard;

