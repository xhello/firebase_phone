import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    paddingBottom: 50
  },
  imageRow: {
    // backgroundColor:'red',
    height: 200,
    alignItems: 'center'
  },
  nameRow: {
    flexDirection: 'row',
    marginTop: 5,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingRow: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  symbolRow: {
    flexDirection: 'row',
    marginTop: 5,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profilePic: {
    width: 200,
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  picEditTapArea: {
    height: 40,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  nameFont: {
    fontSize: 26,
    color: '#4D4D4D'
  },
  pencilIcon: {
    marginLeft: 10,
    width: 20,
    height: 20
  },
  // star:{
  //   width:15,
  //   height:15,
  //   marginRight:5
  // },
  gymIcon: {
    width: 30,
    height: 30,
    marginRight: 15
  },
  messageIcon: {
    width: 30,
    height: 30
  },
  rateFont: {
    fontSize: 26,
    color: '#4D4D4D',
    marginLeft: 10
  },
  sectionTitleRow: {
    marginTop: 20,
    width: '100%',
    height: 25,
    borderBottomWidth: 0.2,
    justifyContent: 'flex-start'
  },
  sectionTitleFont: {
    fontSize: 16,
    color: '#4D4D4D'
  },
  aboutMeTextArea: {
    width: '100%',
    borderWidth: 0.2,
    borderRadius: 10,
    marginTop: 10,
    padding: 10
  },
  aboutMeFont: {
    fontSize: 16,
    color: '#9D9D9D'
  },
  settingItemRow: {
    width: '100%',
    height: 48,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingTitleFont: {
    fontSize: 16,
    color: '#9D9D9D'
  },
  settingItemTapArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  settingValueFont: {
    fontSize: 16,
    color: '#4D4D4D'
  },
  settingItemForwardArrow: {
    width: 20,
    height: 20
  },
  reviewRow:{
    width:'100%',
    height:50,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    backgroundColor:'#EEEEEE',
    marginTop:5,
    borderRadius:5
  },
  leftArea:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    width:'90%'
  },
  rightArea:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingRight:15,
    // backgroundColor:'yellow',
    width:'10%'
  },
  reviewArea:{
    width:'100%',
    alignItems:'center'
  },
  commentArea:{
    minWidth:'100%',
    paddingLeft: 20,
    paddingRight:20,
    paddingTop:5,
    paddingBottom:5,
    backgroundColor:'#EEEEEE44',
    marginBottom:5    
  },
  userImageOnReview:{
    width:30,
    height:30,
    borderRadius:15,
    marginRight:20,
    marginLeft:20
  },
  arrowArea:{
    width:25,
    height:25,
    justifyContent:'center',
    alignItems:'center'
  },
  arrow:{
    width:25,
    height:25
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    width: '100%'
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
    marginTop: 10,
    marginBottom: 10

  },
  trainerSegment: {
    width: '50%',
    height: 45,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: '#FE007A',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
  clientSegment: {
    width: '50%',
    height: 45,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    borderColor: '#FE007A',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  trainerSegmentActive: {
    width: '50%',
    height: 45,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#FE007A',
    justifyContent: 'center',
    alignItems: 'center'

  },
  clientSegmentActive: {
    width: '50%',
    height: 45,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FE007A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  segmentText: {
    fontSize: 16,
    color: '#FE007A'
  },
  segmentTextActive: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  starRatingArea: {
    // backgroundColor:'red',
    width: 150,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  star: {
    width: 25,
    height: 25,
    marginRight: 2,
    marginLeft: 2
  },
  notFoundMessage:{
    alignItems:'center',
    justifyContent:'flex-end'
  },
  notFoundMessageFont:{
    fontSize:12,
    color:'#4D4D4D'
  }


});
