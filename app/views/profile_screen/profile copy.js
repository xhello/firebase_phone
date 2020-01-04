import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "react-native-firebase";
import ModalSelector from "react-native-modal-selector";
import Dialog from "react-native-dialog";
import ImagePicker from "react-native-image-picker";
import DrawerIcon from "../../navigation/drawer_icon";
import colors from "res/colors";
import strings from "res/strings";
import Spinner from "react-native-loading-spinner-overlay";
import SnackBar from "react-native-snackbar-component";

import styles from "./style";
var user = {};
export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      user: {},
      displayName: "",
      aboutMeText: "",
      priceToDisplay: null,
      priceToDisplayTemp: "",
      distanceToDisplay: null,
      distanceToDisplayTemp: "",
      isLoading: false,
      isShowError: false,
      errorToShow: "",
      typedName: "",
      typedAboutMe: "",
      isNameEditMode: false,
      isAboutEditMode: false,
      isPriceEditMode: false,
      isDistanceEditModeL: false,
      isLookingForTrainer: false,
      isGymAccess: false,
      avatarSource: null,
      userImageToDisplay: require("../../res/images/default_user.png"),
      snackColor: "green",
      uploading: false,
      progress: 0
    };
  }

  static navigationOptions = {
    title: strings.appStack.profile.navHeading,
    headerTitleStyle: {
      color: colors.header_text,
      fontFamily: "Helvetica Neue"
    },
    headerStyle: {
      backgroundColor: colors.header
    },
    headerLeft: <DrawerIcon />
  };

  componentWillMount() {
    this.setState({
      isLoading: true
    });
    user = firebase.auth().currentUser;
    console.log(user);
    firebase
      .database()
      .ref()
      .child("users/" + user._user.uid)
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          this.setState({
            user: snapshot.val(),
            displayName: snapshot.val().displayName,
            aboutMeText: snapshot.val().about,
            priceToDisplay: snapshot.val().price.toString(),
            distanceToDisplay: snapshot.val().distance.toString(),
            isLookingForTrainer: snapshot.val().isLookingForTrainer,
            isGymAccess: snapshot.val().isGymAccess
          });
          if (user._user.photoURL != null) {
            this.setState({
              avatarSource: { uri: user._user.photoURL }
            });
          }
          this.setState({
            isLoading: false
          });
        },
        error => {
          console.log("Error: " + error.code);
        }
      );
  }

  createStars = () => {
    let stars = [];
    let rating = this.state.user.rating;
    for (let i = 0; i < rating; i++) {
      stars.push(
        <Image
          source={require("../../res/images/star_filled.png")}
          style={styles.star}
          key={i}
        />
      );
    }
    for (let i = 0; i < 5 - rating; i++) {
      stars.push(
        <Image
          source={require("../../res/images/star_empty.png")}
          style={styles.star}
          key={i + 5}
        />
      );
    }
    return stars;
  };

  pickImage = () => {
    const options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        // console.log('Source', source);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
        this.updateUserPic();

        //TODO - change value on firebase
      }
    });
  };
  updateUserPic = () => {
    console.warn("Pic uptaed call");
    user = firebase.auth().currentUser;
    const ext = this.state.avatarSource.uri.split(".").pop(); // Extract image extension
    const filename = `${this.state.user.uid}.${ext}`; // Generate unique name
    this.setState({ uploading: true });

    firebase
      .storage()
      .ref(`users/images/${filename}`)
      .putFile(this.state.avatarSource.uri)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};
          state = {
            ...state,
            progress: Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            ) // Calculate progress percentage
          };
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            user
              .updateProfile({
                photoURL: snapshot.downloadURL
              })
              .then(function() {
                state = {
                  ...state,
                  uploading: false,
                  progress: 0
                };
                console.warn("Pic uptaed end");
              })
              .catch(function(error) {
                console.warn("failed");
              });
          }
          firebase
            .database()
            .ref()
            .child("users/" + this.state.user.uid)
            .update({ photoURL: snapshot.downloadURL })
            .then(res => {
              this.setState(state);
            })
            .catch(error => {});
        },
        error => {
          unsubscribe();
          this._showSnackBar("Something went wrong, please try again", "red");
        },
        () => {
          this.setState({
            uploading: false,
            progress: 0
          });
          this._showSnackBar("Profile picture updated successfully", "green");
        }
      );
  };

  editUserDisplayName = () => {
    this.setState({
      isNameEditMode: true,
      typedName: this.state.user.displayName
    });
  };
  updateUserDisplayName = () => {
    user = firebase.auth().currentUser;
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .update({ displayName: this.state.typedName })
      .then(res => {
        this.setState({
          displayName: this.state.typedName,
          isNameEditMode: false
        });
        user.updateProfile({
          displayName: this.state.typedName
        });
        this._showSnackBar("Display name updated successfully", "green");
      })
      .catch(error => {
        this._showSnackBar("Something went wrong, please try again", "red");
      });
  };

  editUserAboutMe = () => {
    this.setState({
      isAboutEditMode: true,
      typedAboutMe: this.state.user.about
    });
  };
  updateUserAboutMe = () => {
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .update({ about: this.state.typedAboutMe })
      .then(res => {
        this.setState({
          aboutMeText: this.state.typedAboutMe,
          isAboutEditMode: false
        });
        this._showSnackBar("About me updated successfully", "green");
      })
      .catch(error => {
        this._showSnackBar("Something went wrong, please try again", "red");
      });
  };

  setLookingForValue = val => {
    if (val.key == 1) {
      var newValue = true;
    } else {
      var newValue = false;
    }
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .update({ isLookingForTrainer: newValue })
      .then(res => {
        this.setState({
          isLookingForTrainer: newValue
        });
        this._setLocalStorageValue(
          "isUserLookingPT",
          newValue ? "true" : "false"
        );
        this._showSnackBar("Looking for value changed successfully", "green");
      })
      .catch(error => {
        this._showSnackBar("Something went wrong, please try again", "red");
      });
  };

  setGymAccessValue = val => {
    if (val.key == 1) {
      var newValue = true;
    } else {
      var newValue = false;
    }
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .update({ isGymAccess: newValue })
      .then(res => {
        this.setState({
          isGymAccess: newValue
        });
        this._showSnackBar("Gym access value changed successfully", "green");
      })
      .catch(error => {
        this._showSnackBar("Something went wrong, please try again", "red");
      });
  };

  setNewPrice = () => {
    this.setState({
      isPriceEditMode: false
    });
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .update({ price: this.state.priceToDisplayTemp })
      .then(res => {
        this.setState({
          priceToDisplay: this.state.priceToDisplayTemp
        });
        this._setLocalStorageValue("userPrice", this.state.priceToDisplayTemp);
        this._showSnackBar("Price changed successfully", "green");
      })
      .catch(error => {
        this._showSnackBar("Something went wrong, please try again", "red");
      });
  };

  setNewDistance = () => {
    this.setState({
      isDistanceEditMode: false
    });
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .update({ distance: this.state.distanceToDisplayTemp })
      .then(res => {
        this.setState({
          distanceToDisplay: this.state.distanceToDisplayTemp
        });
        this._setLocalStorageValue(
          "userLookingDistance",
          this.state.distanceToDisplayTemp
        );
        this._showSnackBar("Distance changed successfully", "green");
      })
      .catch(error => {
        this._showSnackBar("Something went wrong, please try again", "red");
      });
  };

  _setLocalStorageValue = async (token, value) => {
    var tokenName = token;
    try {
      await AsyncStorage.setItem(tokenName, value);
    } catch (e) {
      console.log(e);
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

  render() {
    let index_i = 0;
    const options_lookingFor = [
      { key: index_i++, section: true, label: "Select your option" },
      { key: index_i++, label: "Personal Trainer" },
      { key: index_i++, label: "Client" }
    ];
    let index_j = 0;
    const options_gymAccess = [
      { key: index_j++, section: true, label: "Select your option" },
      { key: index_j++, label: "YES" },
      { key: index_j++, label: "NO" }
    ];
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner
          visible={this.state.isLoading}
          textContent={"Loading ..."}
          textStyle={styles.spinnerTextStyle}
          color={"#FE007A"}
        />
        <SnackBar
          visible={this.state.isShowError}
          autoHidingTime={2000}
          backgroundColor={this.state.snackColor}
          textMessage={this.state.errorToShow}
        />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageRow}>
            <ImageBackground
              style={styles.profilePic}
              imageStyle={{ borderRadius: 10 }}
              source={
                this.state.avatarSource == null
                  ? this.state.userImageToDisplay
                  : this.state.avatarSource
              }
            >
              {!this.state.uploading && (
                <TouchableOpacity
                  onPress={this.pickImage}
                  style={styles.picEditTapArea}
                >
                  <Text style={{ color: "white" }}>Tap to edit</Text>
                </TouchableOpacity>
              )}

              {this.state.uploading && (
                <View style={styles.imageUploadStatusArea}>
                  <Text style={styles.loadingProgressFont}>
                    {this.state.progress} %
                  </Text>
                </View>
              )}
            </ImageBackground>
          </View>
          <View style={styles.nameRow}>
            {!this.state.isNameEditMode && (
              <Text style={styles.nameFont}>{this.state.displayName}</Text>
            )}
            {!this.state.isNameEditMode && (
              <TouchableOpacity onPress={this.editUserDisplayName}>
                <Image
                  source={require("../../res/images/pencil_icon.png")}
                  style={styles.pencilIcon}
                />
              </TouchableOpacity>
            )}
            {this.state.isNameEditMode && (
              <View style={styles.emailInputView}>
                <TextInput
                  style={styles.emailInput}
                  onChangeText={typedName => this.setState({ typedName })}
                  value={this.state.typedName}
                  placeholder="Display Name"
                  placeholderTextColor={"#9D9D9D"}
                  onSubmitEditing={() => this.updateUserDisplayName()}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={this.updateUserDisplayName}>
                  <Image
                    source={require("../../res/images/save_icon.png")}
                    style={styles.inputIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.ratingRow}>
            {this.state.user != null ? this.createStars() : ""}
          </View>
          <View style={styles.symbolRow}>
            <Image
              source={
                this.state.isGymAccess
                  ? require("../../res/images/gym_icon_enable.png")
                  : require("../../res/images/gym_icon_disable.png")
              }
              style={styles.gymIcon}
            />
            <Text style={styles.rateFont}>${this.state.priceToDisplay}</Text>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleFont}>About Me</Text>
          </View>
          {!this.state.isAboutEditMode && (
            <TouchableOpacity
              style={styles.aboutMeTextArea}
              onPress={this.editUserAboutMe}
            >
              <Text style={styles.aboutMeFont}>{this.state.aboutMeText}</Text>
            </TouchableOpacity>
          )}
          {this.state.isAboutEditMode && (
            <View style={styles.aboutMeInputView}>
              <TextInput
                style={styles.aboutMeInput}
                onChangeText={typedAboutMe => this.setState({ typedAboutMe })}
                value={this.state.typedAboutMe}
                placeholder="About Me Text"
                placeholderTextColor={"#9D9D9D"}
                onSubmitEditing={() => this.updateUserAboutMe()}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={this.updateUserAboutMe}>
                <Image
                  source={require("../../res/images/save_icon.png")}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleFont}>Settings</Text>
          </View>
          <View style={styles.settingItemRow}>
            <Text style={styles.sectionTitleFont}>Looking for</Text>
            <View style={styles.settingItemTapArea}>
              <ModalSelector
                data={options_lookingFor}
                selectedKey={this.state.isLookingForTrainer ? 1 : 2}
                onChange={val => {
                  this.setLookingForValue(val);
                }}
                optionTextStyle={{ color: "gray" }}
                selectedItemTextStyle={{ color: "#FE007A" }}
                overlayStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                optionContainerStyle={{ backgroundColor: "#FFF" }}
                cancelContainerStyle={{ backgroundColor: "#FFF" }}
                animationType={"fade"}
                ref={selector => {
                  this.lookingForSelector = selector;
                }}
                customSelector={
                  <Text
                    style={styles.settingValueFont}
                    onPress={() => this.lookingForSelector.open()}
                  >
                    {this.state.isLookingForTrainer
                      ? "Personal Trainer"
                      : "Client"}
                  </Text>
                }
              />

              <Image
                style={styles.settingItemForwardArrow}
                source={require("../../res/images/foward_arrow_icon.png")}
              />
            </View>
          </View>

          <View style={styles.settingItemRow}>
            <Text style={styles.sectionTitleFont}>Gym Access</Text>
            <View style={styles.settingItemTapArea}>
              <ModalSelector
                data={options_gymAccess}
                selectedKey={this.state.isGymAccess ? 1 : 2}
                onChange={val => {
                  this.setGymAccessValue(val);
                }}
                optionTextStyle={{ color: "gray" }}
                selectedItemTextStyle={{ color: "#FE007A" }}
                overlayStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                optionContainerStyle={{ backgroundColor: "#FFF" }}
                cancelContainerStyle={{ backgroundColor: "#FFF" }}
                animationType={"fade"}
                ref={selector => {
                  this.gymAccessSelector = selector;
                }}
                customSelector={
                  <Text
                    style={styles.settingValueFont}
                    onPress={() => this.gymAccessSelector.open()}
                  >
                    {this.state.isGymAccess ? "YES" : "NO"}
                  </Text>
                }
              />

              <Image
                style={styles.settingItemForwardArrow}
                source={require("../../res/images/foward_arrow_icon.png")}
              />
            </View>
          </View>

          <Dialog.Container visible={this.state.isPriceEditMode}>
            <Dialog.Title>Set your price</Dialog.Title>
            <Dialog.Description>
              Enter your price(without $) here.
            </Dialog.Description>
            <Dialog.Input
              onChangeText={priceToDisplayTemp =>
                this.setState({ priceToDisplayTemp })
              }
              value={this.state.priceToDisplayTemp}
              keyboardType="numeric"
              onSubmitEditing={() => this.setNewPrice()}
              returnKeyType="done"
            />
            <Dialog.Button
              label="Cancel"
              onPress={() => this.setState({ isPriceEditMode: false })}
            />
            <Dialog.Button label="Save" onPress={this.setNewPrice} />
          </Dialog.Container>

          <View style={styles.settingItemRow}>
            <Text style={styles.sectionTitleFont}>Price</Text>
            <View style={styles.settingItemTapArea}>
              <Text
                style={styles.settingValueFont}
                onPress={() => this.setState({ isPriceEditMode: true })}
              >
                ${this.state.priceToDisplay}
              </Text>
              <Image
                style={styles.settingItemForwardArrow}
                source={require("../../res/images/foward_arrow_icon.png")}
              />
            </View>
          </View>

          <Dialog.Container visible={this.state.isDistanceEditMode}>
            <Dialog.Title>Set your distance</Dialog.Title>
            <Dialog.Description>
              Enter your distance(without m) here.
            </Dialog.Description>
            <Dialog.Input
              onChangeText={distanceToDisplayTemp =>
                this.setState({ distanceToDisplayTemp })
              }
              value={this.state.distanceToDisplayTemp}
              keyboardType="numeric"
              onSubmitEditing={() => this.setNewDistance()}
              returnKeyType="done"
            />
            <Dialog.Button
              label="Cancel"
              onPress={() => this.setState({ isDistanceEditMode: false })}
            />
            <Dialog.Button label="Save" onPress={this.setNewDistance} />
          </Dialog.Container>
          <View style={styles.settingItemRow}>
            <Text style={styles.sectionTitleFont}>Distance</Text>
            <View style={styles.settingItemTapArea}>
              <Text
                style={styles.settingValueFont}
                onPress={() => this.setState({ isDistanceEditMode: true })}
              >
                {this.state.distanceToDisplay} m
              </Text>
              <Image
                style={styles.settingItemForwardArrow}
                source={require("../../res/images/foward_arrow_icon.png")}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
