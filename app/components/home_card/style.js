import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#EFEFEF',
    marginTop: 10,
    borderRadius: 10,
    paddingBottom: 8
  },
  cardTopSection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor:'red'
    // marginBottom:10    
  },
  pictureCol: {
    width: '35%',
    height: 120,
    paddingLeft: 10,
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "flex-start",

  },
  profilePicLoader: {
    width: '100%',
    height: 225,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#EFEFEF',
    borderRadius: 10
  },
  detailCol: {
    width: '65%',
    height: 120,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    justifyContent: 'center'
  },
  picture: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  nameRow: {
    height: 25
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ratingRow: {
    height: 15,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 45,
    marginTop: 10
  },
  nameFont: {
    fontSize: 20,
    color: '#4D4D4D'
  },
  priceFont: {
    fontSize: 20,
    color: '#4D4D4D'
  },
  star: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  requestButton: {
    height: 40,
    width: 95,
    borderWidth: 1,
    borderColor: '#FE007A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  gymButtonEnable: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: '#0F9819',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  gymButtonDisable: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: '#9D9D9D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },

  requestButtonFont: {
    fontSize: 16,
    color: '#FE007A'
  },
  gymButtonEnableFont: {
    fontSize: 15,
    color: '#0F9819'
  },
  gymButtonDisableFont: {
    fontSize: 15,
    color: '#9D9D9D'
  },
  gymButtonIcon: {
    width: 20,
    height: 20
  },
  messageIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  gymImageView: {
    height: 20,
    backgroundColor: 'red'
  },
  messageFont: {
    fontSize: 14,
    color: '#9D9D9D',
    marginLeft: 10,
    marginRight: 10
  }
});