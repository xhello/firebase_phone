import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity, AsyncStorage } from 'react-native'
import styles from "./style";
import firebase from 'react-native-firebase';


export default class CustomDrawer extends Component {
    state = {
        reviews: 0,
    }

    componentDidMount() {

        console.warn("PROPS", this.props.screenProps)
        const user = firebase.auth().currentUser

    }
    componentWillReceiveProps(nextProps) {
        console.warn("NEW PROPS", nextProps.screenProps.loggedUserId)
        if (nextProps.screenProps.loggedUserId) {
            firebase.database().ref("reviews/" + nextProps.screenProps.loggedUserId + "/trainers/").once('value')
                .then(snap => {
                    console.warn("Childs=", snap.numChildren())
                    firebase.database().ref("reviews/" + nextProps.screenProps.loggedUserId + "/clients/").once('value')
                        .then(snap1 => {
                            console.warn("Childs=", snap1.numChildren())
                            this.setState({
                                reviews: snap.numChildren() + snap1.numChildren()
                            })
                        })
                })
        }


    }

    signOutAsync = async () => {
        firebase.auth().signOut();
        await AsyncStorage.multiRemove(["userToken", "isUserLookingPT", "userLookingDistance", "fcmToken"]);

        this.props.navigation.navigate("SignIn");
    };

    render() {
        let props = this.props;
        return (
            <ScrollView>
                <View style={styles.topGrayArea}>
                    <Image
                        source={
                            props.screenProps.userImageUrl == null
                                ? require("../res/images/default_user.png")
                                : { uri: props.screenProps.userImageUrl }
                        }
                        style={styles.profilePic}
                    />
                    <Text style={styles.userNameText}>{props.screenProps.userId}</Text>
                    {/* <View style={styles.ratingRow}>
                  {createStars(props.screenProps.userRating)}
                </View> */}
                    <View style={styles.symbolRow}>
                        <Image
                            source={
                                props.screenProps.userIsGymAccess
                                    ? require("../res/images/gym_icon_enable.png")
                                    : require("../res/images/gym_icon_disable.png")
                            }
                            style={styles.gymIcon}
                        />
                        <Text style={styles.rateFont}>
                            ${props.screenProps.userPrice}
                        </Text>
                    </View>
                </View>
                <View style={styles.drawerBottomArea}>
                    <View style={styles.menuArea}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                props.navigation.navigate("Info");
                                props.navigation.closeDrawer();
                            }}
                        >
                            <Text style={styles.menuText}>Info</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.menuItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                            onPress={() => {
                                props.navigation.navigate("Reviews");
                                props.navigation.closeDrawer();
                            }}
                        >
                            <Text style={styles.menuText}>My Reviews</Text>
                            <View style={{ height: 24, width: 24, backgroundColor: '#FE007A', borderRadius: 12, marginRight: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{this.state.reviews}</Text>
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      props.navigation.navigate("Other");
                      props.navigation.closeDrawer();
                    }}
                  >
                    <Text style={styles.menuText}>OtherScreen</Text>
                  </TouchableOpacity> */}
                    </View>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => this.signOutAsync()}
                    >
                        <Text style={styles.logoutButtonFont}>LOGOUT</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
