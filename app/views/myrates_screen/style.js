import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center'
  },
  ratingRow: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  reviewRow: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#EEEEEE',
    marginTop: 5,
    borderRadius: 5
  },
  leftArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%'
  },
  rightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15,
    // backgroundColor:'yellow',
    width: '10%'
  },
  reviewArea: {
    width: '90%',
    alignItems: 'center'
  },
  commentArea: {
    minWidth: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#EEEEEE44',
    marginBottom: 5
  },
  userImageOnReview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 20,
    marginLeft: 20
  },
  arrowArea: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrow: {
    width: 25,
    height: 25
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
    width: '90%',
    marginTop: 10,
    marginBottom: 20

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
  spinnerTextStyle: {
    fontSize: 14,
    color: '#FE007A'
  },
  notFoundMessage: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
    height: 200,
    justifyContent: 'flex-end'
  },
  notFoundMessageFont: {
    fontSize: 12,
    color: '#4D4D4D'
  }
});
