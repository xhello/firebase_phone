import React, { Component } from "react";
import { SafeAreaView, Image, Button, Text } from "react-native";

import styles from "./style";

export default class OtherScreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>OtherScreen</Text>
        <Button title="Back" onPress={() => this.props.navigation.goBack()} />
      </SafeAreaView>
    );
  }
}