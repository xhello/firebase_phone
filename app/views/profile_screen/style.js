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
    alignItems: 'center',
  },
  profilePicLoader: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 10
  },
  imageUploadStatusArea: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10
  },
  loadingProgressFont: {
    fontSize: 16,
    color: '#FFFFFF'
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
  star: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  gymIcon: {
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
  aboutMeInput: {
    flex: 1,
  },
  aboutMeInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
    height: 40,
    borderBottomColor: "#9D9D9D",
    borderBottomWidth: 0.8,
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
  settingItemRowLarge: {
    width: '100%',
    height: 80,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingItemRowLargeContent: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
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
  emailInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "80%",
    height: 35,
    borderBottomColor: "#9D9D9D",
    borderBottomWidth: 0.8,
  },
  emailInput: {
    flex: 1,
    marginLeft: 10
  },
  inputIcon: {
    width: 20,
    height: 20
  },
  spinnerTextStyle: {
    fontSize: 14,
    color: '#FE007A'
  },
  settingModal: {
    width: '100%',
    height: 120,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center'
  },
  sliderBar: {
    width: '100%',
    height: 30
  },
  modalButtonRow: {
    flexDirection: 'row',
    height: 50,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 50,
    paddingRight: 50
  },
  modalTitleFont: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10
  },
  modalValue: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalButtonSaveFont: {
    color: '#FE007A'
  },
  modalButtonCancelFont: {
    color: '#9D9D9D'
  }


});
