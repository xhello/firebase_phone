import React, { Component } from 'react'
import { Text, View, Image, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import styles from './style'
import MapView, { Marker, Callout, MarkerAnimated } from 'react-native-maps';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
import HomeCard from '../../components/home_card/home_card';
import SnackBar from "react-native-snackbar-component";
import _ from "lodash";



class MapScreen extends Component {
    state = {
        markers: [],
        showDetailsModal: false,
        selectedItem: null,
        isShowError: false,
        errorToShow: "",
        snackColor: "red"
    }


    didTapRequestButton = (id, fcm_key, name, currentPrice) => {
        console.warn("called")
        var randomUserCode = Math.floor(1000 + Math.random() * 9000);
        var listToAddLoggedUser = this.props.isUserLookingPT ? "Clients" : "Trainers";
        var listToAddUser = this.props.isUserLookingPT ? "Trainers" : "Clients";

        if (this.props.isUserLookingPT) {
            firebase
                .database()
                .ref("relationships/" + listToAddLoggedUser + "/" + this.props.uid + "/requested")
                .child(id)
                .set({
                    uid: id,
                    currentPrice: currentPrice, //CHECK
                    userCode: randomUserCode
                })
                .then(() => {
                    // Get Requested back list
                    firebase
                        .database()
                        .ref()
                        .child("relationships/" + listToAddLoggedUser + "/" + this.props.uid + "/requestedBack")
                        .once(
                            "value",
                            snapshot => {
                                const requestedBackUsers = _.map(snapshot.val(), user => {
                                    return { user };
                                });
                                var index = _.findIndex(requestedBackUsers, (o) => { return o.user.uid == id; });
                                console.log("----ID----", index);
                                if (index > -1) {
                                    this._showSnackBar("You have a match with " + name, "#4c8bf5");
                                    this.sendPush(fcm_key);
                                } else {
                                    this._showSnackBar("Request sent successfully", "green");
                                }
                                this.props.readChangeData();
                            },
                            error => {
                                console.warn("Error: " + error.message);
                            }
                        );
                })
                .catch(function (error) {
                    console.error(error);
                });

            firebase
                .database()
                .ref("relationships/" + listToAddUser + "/" + id + "/requestedBack")
                .child(this.props.uid)
                .set({
                    uid: this.props.uid,
                    currentPrice: currentPrice, //CHECK
                    userCode: randomUserCode
                })
                .catch(function (error) {
                    console.error(error);
                });
        } else {
            firebase
                .database()
                .ref("relationships/" + listToAddLoggedUser + "/" + this.props.uid + "/requested")
                .child(id)
                .set({
                    uid: id,
                    userCode: randomUserCode
                })
                .then(() => {
                    // Get Requested back list
                    firebase
                        .database()
                        .ref()
                        .child("relationships/" + listToAddLoggedUser + "/" + this.props.uid + "/requestedBack")
                        .once(
                            "value",
                            snapshot => {
                                const requestedBackUsers = _.map(snapshot.val(), user => {
                                    return { user };
                                });
                                var index = _.findIndex(requestedBackUsers, (o) => { return o.user.uid == id; });
                                if (index > -1) {
                                    this._showSnackBar("You have a match with " + name, "#4c8bf5");
                                    this.sendPush(fcm_key);
                                } else {
                                    this._showSnackBar("Request sent successfully", "green");
                                }
                                this.props.readChangeData();
                            },
                            error => {
                                console.warn("Error: " + error.message);
                            }
                        );
                })
                .catch(function (error) {
                    console.error(error);
                });

            firebase
                .database()
                .ref("relationships/" + listToAddUser + "/" + id + "/requestedBack")
                .child(this.props.uid)
                .set({
                    uid: this.props.uid,
                    userCode: randomUserCode
                })
                .catch(function (error) {
                    console.error(error);
                });
        }


    };

    _showSnackBar = (message, color) => {
        this.setState({
            isShowError: false
        });
        setTimeout(() => {
            this.setState({
                isShowError: true,
                errorToShow: message,
                snackColor: color
            });
        }, 100);
    };





    sendPush = async (fcm_key) => {
        let name = firebase.auth().currentUser
        console.log("------------SEND PUSH------------");
        if (fcm_key != null) {
            try {
                const response = await fetch("https://fcm.googleapis.com/fcm/send", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "key=AAAAsUTas5I:APA91bFQjCfp9qQh-QTU9IypqrWmuh98SJTJmH6bCieoWuV38VDDeKeiPbwGU5EwdkC5ZlPdMqXr1FRk5zALHBdT0MAHNykg6R8e23pupk6WmnRMrkd5ccFRqrZGZPRL35-y00zwL7fe"
                    },
                    body: JSON.stringify({
                        to: fcm_key,
                        data: {
                            body: "We found a new matching for you with " + name,
                            title: "New Matching for you!",
                            sound: "Enabled",
                            icon: "default.png"
                        },
                        notification: {
                            body: "We found a new matching for you with " + name,
                            title: "New Matching for you!",
                            sound: "Enabled",
                            icon: "default.png"
                        }
                    })
                });
                const responseJson = await response.json();
                console.log("----------------RESPONSE--------- ", responseJson);
                return responseJson;
            }
            catch (error) {
                console.error(error);
            }
        }
    };


    crossUser = (userId) => {

        // const filteredUser = this.state.allUsersToShow.filter((user)=>{
        //   console.log("User Id: ",user.user.uid)
        //   return user.user.uid !== id1
        // })


        var role = this.props.isUserLookingPT
            ? "Trainers"
            : "Clients";



        // console.log("crossUser called: ", isUserLookingPT)

        firebase
            .database()
            .ref()
            .child("users/" + this.props.uid + `/ignore/${role}`)
            .child(userId)
            .set({
                uid: userId
            })
            .then((res) => {

                this.props.readChangeData();

                console.log("Crossed response is: ", res)
            }).catch((err) => {
                console.log("Crossed Error: ", err)
            })

    }



    renderItem = () => {
        let item = this.state.selectedItem;
        console.log("#####################@@@@@@@@@@@@@ - ", item.user.myTrainerProfile.price);
        var ratingToShow = 0;
        let ratingCount = 0;

        if (this.props.isUserLookingPT) {
            if (item.user.myTrainerProfile != undefined) {
                console.log("#####################@@@@@@@@@@@@@****** - ");
                ratingToShow = item.user.myTrainerProfile.rating != null ? item.user.myTrainerProfile.rating : 0
                ratingCount = item.user.myTrainerProfile.totalReviews !== null ? item.user.myTrainerProfile.totalReviews : 0

            }
        } else {
            if (item.user.myClientProfile != undefined) {
                ratingToShow = item.user.myClientProfile.rating != null ? item.user.myClientProfile.rating : 0
                ratingCount = item.user.myClientProfile.totalReviews !== null ? item.user.myClientProfile.totalReviews : 0

            }
        }
        if (this.props.isUserLookingPT) {
            var price = item.user.myTrainerProfile.price
        } else {
            var price = item.user.myClientProfile.price
        }
        console.warn("IMAGE URL", item.user.photoURL)

        return (

            <HomeCard
                onPressPhoto={() => {
                    this.props.didTapPhoto(item.user.uid, this.props.uid, price);
                    this.setState({
                        showDetailsModal: false,
                        selectedItem: null
                    })
                }}
                onPressRequest={() => {
                    this.didTapRequestButton(item.user.uid, item.user.fcmToken, item.user.displayName, price)
                    this.setState({
                        showDetailsModal: false,
                        selectedItem: null
                    })
                }}
                onPressMessage={() => {
                    this.props.didTapMessageButton(item.user.uid, item.user.fcmToken, item.user.displayName, price)
                    this.setState({
                        showDetailsModal: false,
                        selectedItem: null
                    })
                }}
                onPressCrossUser={() => {
                    this.props.crossUser(item.user.uid, this.props.uid)
                    this.setState({
                        showDetailsModal: false,
                        selectedItem: null
                    })
                }}




                userImage={
                    item.user.photoURL
                        ? { uri: item.user.photoURL }
                        : require("../../res/images/default_user.png")
                }
                name={item.user.displayName}
                isGymEnable={item.user.isGymAccess}
                rating={ratingToShow}
                isClientListing={!this.props.isUserLookingPT}
                price={"$" + price}
                messageText={item.user.message}
                isShowMessage={!this.state.isShowAllUsers}
                ratingCount={ratingCount}

            />
        );



    };

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    // followsUserLocation={true}
                    initialRegion={{
                        latitude: this.props.lat,
                        longitude: this.props.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {this.props.userList.map(marker => (
                        marker.user.photoURL ?
                            (
                                <Marker
                                    coordinate={{ latitude: marker.user.location.lat, longitude: marker.user.location.lon }}
                                    onPress={() => {
                                        // this.props.navigation.navigate("MatchUserDetailUnmatched", { userId: marker.user.uid, userListedIn: "Trainer" });
                                        this.setState({
                                            showDetailsModal: true,
                                            selectedItem: marker
                                        })
                                    }}
                                // title={marker.title}
                                // description={marker.description}
                                >
                                    <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: marker.user.photoURL }}
                                            style={{ width: 44, height: 44, borderRadius: 22, }}
                                        />
                                    </View>


                                </Marker>
                            )
                            :
                            null
                    ))
                    }

                </MapView>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showDetailsModal}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            showDetailsModal: false,
                            selectedItem: null
                        })
                    }}>
                        <View style={styles.modalBackground}>
                            <KeyboardAvoidingView behavior="position">
                                <View style={styles.reviewModal}>
                                    {this.state.selectedItem ?
                                        this.renderItem()
                                        :
                                        null}
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <SnackBar
                    visible={this.state.isShowError}
                    autoHidingTime={2000}
                    backgroundColor={this.state.snackColor}
                    textMessage={this.state.errorToShow}
                />
            </View>
        )
    }
}

export default withNavigation(MapScreen)