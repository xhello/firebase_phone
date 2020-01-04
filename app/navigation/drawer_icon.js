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
          marginLeft: 15
        }}
        onPress={() => {
          this.props.navigation.openDrawer();
        }}
      >
        <Image
          style={{ width: 30, height: 30 }}
          source={require("../res/images/menu_icon.png")}
        />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(DrawerIcon);
