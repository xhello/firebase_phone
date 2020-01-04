import { StyleSheet } from "react-native";

export default StyleSheet.create({
  deleteIcon: {
    width: 30,
    height: 30
  },
  deleteIconArea: {
    width: 44,
    height: 44,
    marginRight: 5
  },
  modalBackground:{
    justifyContent:'flex-end',
    height:'100%',
    width:'100%',
    backgroundColor:'transparent',
  },
  reviewModal: { 
    backgroundColor: '#fff',
    height: 250, 
    width: '100%',
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent:'flex-start',
    alignItems:'center',
    padding:20,
    paddingBottom:120
  },
  reviewModalTitleFont:{
    fontSize:16,
    color:'#FE007A'
  },
  starRatingArea:{
    // backgroundColor:'red',
    width:160,
    height:40,
    marginTop:10,
    marginBottom:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  commentArea:{
    alignItems:'flex-start',
    width:'100%',
    // height:100,
    alignItems:'center'
  },
  userCodeBox:{
    width:'50%',
    height:60,
    borderWidth:1,
    borderColor:'#9D9D9D',
    borderRadius:5,
    paddingLeft:5,
    marginBottom:40,
    marginTop:40,
    fontSize:20
  },
  commentBox:{
    width:'100%',
    height:80,
    borderWidth:1,
    borderColor:'#9D9D9D',
    borderRadius:5,
    paddingLeft:5,
    marginBottom:20
  },
  actionRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    // marginBottom:100,
    height:30
  },
  actionButtons:{
    width:'50%',
    alignItems:'center'
  },
  star:{
    width:30,
    height:30,
    marginRight:2,
    marginLeft:2
  },
  rateText:{
    color:'#FE007A',
    fontSize:16
  },
  cancelText:{
    color:'#9D9D9D',
    fontSize:16
  }
});
