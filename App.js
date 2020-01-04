/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, } from 'react-native';
import DrawerNav from "./app/navigation/drawer_navigation";
//console.disableYellowBox = true;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {

      }
    };
  }

  render() {
    return <DrawerNav screenProps={this.state.loggedInUser} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
