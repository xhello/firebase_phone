import React, { Component } from "react";
import { Image } from "react-native";
import { withNavigation } from "react-navigation";
import { TouchableOpacity } from "react-native-gesture-handler";

class DrawerIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          width: 44,
          height: 44,
          marginLeft: 20
        }}
        onPress={() => {
          this.props.navigation.goBack();
        }}
      >
        <Image
          style={{ width: 30, height: 30 }}
          source={require("../res/images/back_icon.png")}
        />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(DrawerIcon);
