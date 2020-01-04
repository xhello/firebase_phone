import { StyleSheet, Dimensions } from "react-native";
var { height, width } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    reviewModal: {
        backgroundColor: '#fff',
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    modalBackground: {
        justifyContent: 'flex-end',
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
    },

})