import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft:20,
    marginRight:20,
    marginTop:30,
    paddingBottom:50
  },
  sectionFont:{
    fontSize: 16,
    color:'#4D4D4D'
  },
  listFont:{
    fontSize: 16,
    color:'#4D4D4D',
    marginLeft:25,
    marginTop:10
  },
  icon: {
    width: 24,
    height: 24,
  },
  imageArea:{
    marginTop:20
  },
  imageRow:{
    flexDirection:'row',
    // height:50,  
    width:'90%',
    marginTop:15,
    marginLeft:25,
  },
  image:{
    height:30,
    width:30
  },
  imageFont:{
    fontSize: 18,
    color:'#4D4D4D',
    fontWeight:'bold',
    marginLeft:10
  }
});
