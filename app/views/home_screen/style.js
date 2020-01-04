import { StyleSheet, Dimensions } from "react-native";
var {height, width} = Dimensions.get('window');
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  listView: {
    paddingLeft: 15,
    paddingRight: 15
  },
  spinnerTextStyle: {
    fontSize: 14,
    color: '#FE007A'
  },
  notFoundMessage: {
    marginTop: height*0.4,
    alignItems: 'center'
  },
  notFoundMessageFont: {
    fontSize: 12,
    color: '#4D4D4D'
  }
});
