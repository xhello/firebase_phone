import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 0
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 60
  },
  inputIcon:{
    width: 20,
    height:20
  },
  emailInputView: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    width:"100%",
    height: 40,
    borderColor: "#9D9D9D",
    borderWidth: 0.8,
    borderRadius:10,
    paddingLeft:10,
    paddingRight:10,
    marginTop:30

  },
  emailInput:{
    flex:1,
    marginLeft:10,
    width:'100%'
  },
  passwordInputView: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    width:"100%",
    height: 40,
    borderColor: "#9D9D9D",
    borderWidth: 0.8,
    borderRadius:10,
    paddingLeft:10,
    paddingRight:10,
    marginTop:15

  },
  passwordInput: {
    flex:1,
    marginLeft:10
  },
  intoText: {
    // marginTop:10,
    fontSize:14,
    color:"#9D9D9D",
    // marginBottom:10
  },
  signInButton: {
    width:"100%",
    height: 45,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FE007A',
    borderRadius:10,
    marginTop:70
  },
  introImage1:{
    marginTop:20,
    // width:'70%',
    height:350,
    resizeMode:'contain'
  },
  introImage2:{
    marginTop:20,
    // width:'70%',
    height:350,
    resizeMode:'contain'
  },
  introImage3:{
    marginTop:20,
    // width:'70%',
    height:300,
    resizeMode:'contain',    
    marginBottom:50
  },
  introNextButton: {
    width:"70%",
    height: 45,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FE007A',
    borderRadius:10,
    marginTop:50
  },
  titileFont:{
    marginTop:10,
    fontSize:32,
    color:'#FE007A',
    fontWeight:'bold'
  },
  titileFont2:{
    marginTop:20,
    fontSize:22,
    color:'#9D9D9D'
  },
  titileFont3:{
    marginTop:20,
    marginLeft:30,
    marginRight:30,
    textAlign: 'center',
    fontSize:16,
    color:'#9D9D9D'
  },
  titileFont4:{
    marginTop:10,
    marginLeft:30,
    marginRight:30,
    textAlign: 'center',
    fontSize:12,
    color:'#9D9D9D'
  },
  signInText:{
    fontSize:16,
    color:'#FFFFFF'
  },
  socialButtonRow: {
    width:'100%',
    height:45,
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:20
  },
  facebookLoginButton: {
    flexDirection:'row',
    width:'47%',
    height:45,
    backgroundColor:'#3B5998',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10
  },
  googleLoginButton: {
    flexDirection:'row',
    width:'47%',
    height:45,
    backgroundColor:'#DB3236',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10
  },
  socialButtonText:{
    marginLeft:10,
    fontSize:16,
    color:'#FFFFFF'
  },
  socialIcon:{
    width:20,
    height:20
  },
  signUpTextRow: {
    flexDirection:'row',
    marginTop: 30,
    height:20,
    justifyContent:'space-between',
    alignItems:'center'
  },
  skipTextRow: {
    flexDirection:'row',
    marginTop: 25,
    height:20,
    justifyContent:'space-between',
    alignItems:'center'
  },
  signUpFont_1: {
    fontSize:14,
    color:'#9D9D9D'
  },
  signUpFont_2: {
    fontSize:14,
    color:'#FE007A'
  },
  spinnerTextStyle:{
    fontSize:14,
    color:'#FE007A'
  }
});
