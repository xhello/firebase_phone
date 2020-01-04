import React, { Component } from "react";
import { SafeAreaView, View, Image, Button, Text } from "react-native";
import BackIcon from "../../navigation/back_icon";
import colors from "res/colors";
import strings from "res/strings";

import styles from "./style";

export default class FAQScreen extends Component {
  static navigationOptions = {
    title: strings.appStack.info.navHeading,
    headerTitleStyle: {
      color: colors.header_text,
      fontFamily: "Helvetica Neue"
    },
    headerStyle: {
      backgroundColor: colors.header
    },
    headerLeft: <BackIcon />
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.sectionFont}>Everyone has their own unique taste of working out. At Tinfit we believe in connecting people in achieving an active and healthy life style</Text>
          <Text style={styles.listFont}>1. Tell us about yourself through about me, set your role, price and distance</Text>
          <Text style={styles.listFont}>2. Request, if there is a match !</Text>
          <Text style={styles.listFont}>3. Message and meet up to workout</Text>
          <View style={styles.imageArea}>
          <View style={styles.imageRow}>
            <Image style={styles.image} source={require('../../res/images/gym_icon_enable.png')}/>
            <Text style={styles.imageFont}>Provide gym access</Text>
          </View>

          <View style={styles.imageRow}>
            <Image style={styles.image} source={require('../../res/images/email_icon.png')}/>
            <Text style={styles.imageFont}>Message the user to provide more details</Text>
          </View>
          </View>
          
        </View>
              
      </SafeAreaView>
    );
  }
}
