import { StyleSheet, Dimensions } from "react-native";
var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft:15,
    marginRight:15
  },
  segmentRow:{
    flexDirection:'row' ,
    height:45,
    width:'100%',
    marginTop:10
  },
  trainerSegment:{
    width:'50%',
    height:45,
    borderBottomLeftRadius:10,
    borderTopLeftRadius:10,
    borderColor:'#FE007A',
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center'

  },
  clientSegment:{
    width:'50%',
    height:45,
    borderBottomRightRadius:10,
    borderTopRightRadius:10,
    borderColor:'#FE007A',
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center'
  },
  trainerSegmentActive:{
    width:'50%',
    height:45,
    borderBottomLeftRadius:10,
    borderTopLeftRadius:10,
    backgroundColor:'#FE007A',
    justifyContent:'center',
    alignItems:'center'

  },
  clientSegmentActive:{
    width:'50%',
    height:45,
    borderBottomRightRadius:10,
    borderTopRightRadius:10,
    backgroundColor:'#FE007A',
    justifyContent:'center',
    alignItems:'center'
  },
  segmentText:{
    fontSize:16,
    color:'#FE007A'
  },
  segmentTextActive:{
    fontSize:16,
    color:'#FFFFFF'
  },
  trainerView:{
    width:'100%',
    height:'100%',
    marginTop:10
  },
  clientView:{
    width:'100%',
    height:'100%',
    marginTop:10
  },
  cardView:{
    flexDirection:'row',
    height:80,
    width:'100%',
    backgroundColor:'#EFEFEF',
    borderRadius:10,
    marginTop:10,
    alignItems:'center',
    justifyContent:'space-between',
    padding:10
  },
  cardViewLeftSideArea:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  cardViewRightSideArea:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  userPic:{
    height:60,
    width:60,
    borderRadius:10
  },
  userName:{
    fontSize:16,
    color:'#9D9D9D',
    marginLeft:10
  },
  price:{
    fontSize:16,
    color:'#4D4D4D',
    marginRight:5
  },
  forwardArrow:{
    width:20,
    height:20
  },
  spinnerTextStyle:{
    fontSize:14,
    color:'#FE007A'
  },
  notFoundMessage:{
    marginTop: height*0.4 - 50,
    alignItems:'center',
    height:200
  },
  notFoundMessageFont:{
    fontSize:12,
    color:'#4D4D4D'
  }

});
