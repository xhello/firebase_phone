import React, { Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "react-native-firebase";
import ModalSelector from "react-native-modal-selector";
import ImagePicker from "react-native-image-picker";
import DrawerIcon from "../../navigation/drawer_icon";
import colors from "res/colors";
import strings from "res/strings";
import Spinner from "react-native-loading-spinner-overlay";
import SnackBar from "react-native-snackbar-component";
import Modal from "react-native-modal";
// import Slider from "@react-native-community/slider";
import Slider from "react-native-slider";
import { NavigationEvents } from "react-navigation";

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
      priceToDisplayTemp: "0",
      myTrainerProfilePrice: "0",
      myClientProfilePrice: "0",
      distanceToDisplay: null,
      distanceToDisplayTemp: "0",
      isLoading: false,
      isShowError: false,
      errorToShow: "",
      typedName: "",
      typedAboutMe: "",
      isNameEditMode: false,
      isAboutEditMode: false,
      isPriceEditMode: false,
      isDistanceEditMode: false,
      isLookingForTrainer: false,
      isGymAccess: false,
      avatarSource: null,
      userImageToDisplay: require("../../res/images/default_user.png"),
      snackColor: "green",
      uploading: false,
      progress: 0,
      isNameNull: false,
      isAboutMeNull: false,
      isProfilePicNull: false,
      priceDbVal: null,
      imageLoaded: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: strings.appStack.profile.navHeading,
      headerTitleStyle: {
        color: colors.header_text,
        fontFamily: "Helvetica Neue"
      },
      headerStyle: {
        backgroundColor: colors.header
      },
      headerLeft: <DrawerIcon />
    }
  };

  componentWillMount() {
    this.getMyProfileData();
  }

  getMyProfileData = () => {
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
          console.log("Data Fetched: ", snapshot.val());
          if (snapshot.val().isLookingForTrainer) {
            var aboutMe = snapshot.val().myClientProfile.about;
            var myPrice = snapshot.val().myClientProfile.price;
            this.setState({
              myClientProfilePrice: myPrice
            })

          } else {
            var aboutMe = snapshot.val().myTrainerProfile.about;
            var myPrice = snapshot.val().myTrainerProfile.price;
            this.setState({
              myTrainerProfilePrice: myPrice
            })
          }

          if (myPrice == "") {
            myPrice = "0";
            this.setState({ priceDbVal: null })
          } else {
            this.setState({ priceDbVal: myPrice })
          }



          console.log("My Price: ", myPrice)
          if (aboutMe == "") {
            this.setState({
              isAboutMeNull: true
            })
          }
          this.setState({
            user: snapshot.val(),
            displayName: snapshot.val().displayName,
            aboutMeText: aboutMe,
            priceToDisplay: myPrice,
            priceToDisplayTemp: myPrice,
            distanceToDisplay: snapshot.val().distance.toString(),
            distanceToDisplayTemp: snapshot.val().distance.toString(),
            isLookingForTrainer: snapshot.val().isLookingForTrainer,
            isGymAccess: snapshot.val().isGymAccess
          });
          if (user._user.photoURL != null) {
            this.setState({
              avatarSource: { uri: user._user.photoURL }
            });
          } else {
            console.warn("###########--------");
            this.setState({
              isProfilePicNull: true,
            })
          }
          if (snapshot.val().displayName == "Edit Your Name" || snapshot.val().displayName == "") {
            console.warn("#####");
            this.setState({
              isNameNull: true
            })
          }
          this.setState({
            isLoading: false
          });
        },
        error => {
          this.setState({ isLoading: false })
          console.log("Error: " + error);
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

  pickImage = async () => {
    const options = {
      title: "Select Image",
      storageOptions: {
        maxWidth: 100,
        maxHeight: 100,
        skipBackup: true,
        quality: 0.5,
        path: "images"
      }
    };
    try {
      if (Platform.OS === "ios") {
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
      } else {
        let granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message:
              '"TinFit needs access to your camera ' +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        console.log({ granted });
        if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message:
                '"TinFit needs access to your camera ' +
                "so you can take awesome pictures.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
        }
        console.log({ granted });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Open Android Image picker")
          ImagePicker.showImagePicker(options, response => {
            console.log("Response = ", response);

            if (response.didCancel) {
              console.log("User cancelled image picker");
            } else if (response.error) {
              console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
              console.log("User tapped custom button: ", response.customButton);
            } else {
              const source = { uri: response.uri, path: response.path };
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
        } else {
          console.log("Camera permission denied");
        }
      }
    } catch (err) {
      console.log(err);
    }
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
      .putFile(Platform.OS === "ios" ? this.state.avatarSource.uri : this.state.avatarSource.path)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          console.log({ snapshot });
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
              .then(function () {
                state = {
                  ...state,
                  uploading: false,
                  progress: 0
                };
                console.warn("Pic uptaed end");
              })
              .catch(function (error) {
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
              this.props.screenProps.userImageUrl = snapshot.downloadURL;
              this.setState({
                isProfilePicNull: false
              })
            })
            .catch(error => console.log({ error }));
        },
        error => {
          unsubscribe();
          this._showSnackBar(
            "Something went wrong, please try again",
            "red",
            100
          );
        },
        () => {
          this.setState({
            uploading: false,
            progress: 0
          });
          this._showSnackBar(
            "Profile picture updated successfully",
            "green",
            100
          );
        }
      );
  };

  editUserDisplayName = () => {
    this.setState({
      isNameEditMode: true,
      typedName: this.state.displayName
    });
  };
  updateUserDisplayName = () => {
    if (this.state.typedName != "" && this.state.typedName != "Edit Your Name") {
      user = firebase.auth().currentUser;
      firebase
        .database()
        .ref()
        .child("users/" + this.state.user.uid)
        .update({ displayName: this.state.typedName })
        .then(res => {
          this.setState({
            displayName: this.state.typedName,
            isNameEditMode: false,
            isNameNull: false
          });
          user.updateProfile({
            displayName: this.state.typedName
          });
          this._showSnackBar("Display name updated successfully", "green", 100);
          this.props.screenProps.userId = this.state.typedName;
        })
        .catch(error => {
          this._showSnackBar(
            "Something went wrong, please try again",
            "red",
            100
          );
        });
    } else {
      this._showSnackBar("Display name cannot be empty", "red", 100);
    }
  };

  editUserAboutMe = () => {
    this.setState({
      isAboutEditMode: true,
      typedAboutMe: this.state.aboutMeText
    });
  };
  updateUserAboutMe = () => {
    if (this.state.typedAboutMe != "") {
      if (this.state.isLookingForTrainer) {
        firebase
          .database()
          .ref()
          .child("users/" + this.state.user.uid + '/myClientProfile')
          .update({ about: this.state.typedAboutMe })
          .then(res => {
            this.setState({
              aboutMeText: this.state.typedAboutMe,
              isAboutEditMode: false,
              isAboutMeNull: false
            });
            this._showSnackBar("About me updated successfully", "green", 100);
          })
          .catch(error => {
            this._showSnackBar(
              "Something went wrong, please try again",
              "red",
              100
            );
          });
      } else {
        firebase
          .database()
          .ref()
          .child("users/" + this.state.user.uid + '/myTrainerProfile')
          .update({ about: this.state.typedAboutMe })
          .then(res => {
            this.setState({
              aboutMeText: this.state.typedAboutMe,
              isAboutEditMode: false,
              isAboutMeNull: false
            });
            this._showSnackBar("About me updated successfully", "green", 100);
          })
          .catch(error => {
            this._showSnackBar(
              "Something went wrong, please try again",
              "red",
              100
            );
          });
      }
    } else {
      this._showSnackBar("About me text cannot be empty", "red", 100);
    }

  };

  setLookingForValue = val => {
    if (val.key == 1) {
      var newValue = true;
      console.warn("PRICE: " + this.state.myClientProfilePrice)
      this._setLocalStorageValue(
        "userPrice",
        this.state.myClientProfilePrice
      );
    } else {
      var newValue = false;
      console.warn("PRICE: " + this.state.myTrainerProfilePrice)
      this._setLocalStorageValue(
        "userPrice",
        this.state.myTrainerProfilePrice
      );
    }
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .update({ isLookingForTrainer: newValue })
      .then(res => {
        this.getMyProfileData();
        this.setState({
          isLookingForTrainer: newValue
        });
        this._setLocalStorageValue(
          "isUserLookingPT",
          newValue ? "true" : "false"
        );
        // this._setLocalStorageValue(
        //   "userPrice",
        //   newValue ? this.state.myClientProfilePrice : this.state.myTrainerProfilePrice
        // );
        this._showSnackBar(
          "Looking for value changed successfully",
          "green",
          100
        );
      })
      .catch(error => {
        this._showSnackBar(
          "Something went wrong, please try again",
          "red",
          100
        );
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
        this._showSnackBar(
          "Gym access value changed successfully",
          "green",
          100
        );
      })
      .catch(error => {
        this._showSnackBar(
          "Something went wrong, please try again",
          "red",
          100
        );
      });
  };

  setNewPrice = () => {
    if (this.state.isLookingForTrainer) {
      firebase
        .database()
        .ref()
        .child("users/" + this.state.user.uid + '/myClientProfile')
        .update({ price: this.state.priceToDisplayTemp })
        .then(res => {
          this.setState(
            {
              priceToDisplay: this.state.priceToDisplayTemp
            },
            () => {
              this._setLocalStorageValue(
                "userPrice",
                this.state.priceToDisplayTemp
              );
              this._showSnackBar("Price changed successfully", "green", 100);
              this.props.screenProps.userPrice = this.state.priceToDisplayTemp;
              this.props.screenProps.userPriceToDisplay = this.state.priceToDisplayTemp;
            }
          );
        })
        .catch(error => {
          this._showSnackBar(
            "Something went wrong, please try again",
            "red",
            500
          );
        });
    } else {
      firebase
        .database()
        .ref()
        .child("users/" + this.state.user.uid + '/myTrainerProfile')
        .update({ price: this.state.priceToDisplayTemp })
        .then(res => {
          this.setState(
            {
              priceToDisplay: this.state.priceToDisplayTemp
            },
            () => {
              this._setLocalStorageValue(
                "userPrice",
                this.state.priceToDisplayTemp
              );
              this._showSnackBar("Price changed successfully", "green", 100);
              this.props.screenProps.userPrice = this.state.priceToDisplayTemp;
              this.props.screenProps.userPriceToDisplay = this.state.priceToDisplayTemp;
            }
          );
        })
        .catch(error => {
          this._showSnackBar(
            "Something went wrong, please try again",
            "red",
            500
          );
        });
    }

  };

  setNewDistance = () => {
    firebase
      .database()
      .ref()
      .child("users/" + this.state.user.uid)
      .update({ distance: this.state.distanceToDisplayTemp })
      .then(res => {
        this.setState(
          {
            distanceToDisplay: this.state.distanceToDisplayTemp
          },
          () => {
            this._setLocalStorageValue(
              "userLookingDistance",
              this.state.distanceToDisplayTemp
            );
            this._showSnackBar("Distance changed successfully", "green", 100);
          }
        );
      })
      .catch(error => {
        this._showSnackBar(
          "Something went wrong, please try again",
          "red",
          500
        );
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

  _showSnackBar = (message, color, time) => {
    this.setState({
      isShowError: false
    });
    setTimeout(() => {
      this.setState({
        isShowError: true,
        errorToShow: message,
        snackColor: color
      });
    }, time);
  };

  closeModal = () => {
    this.setState({
      isPriceEditMode: false,
      isDistanceEditMode: false
    });
  };

  updateNewPrice = val => {
    this.setState({
      priceToDisplayTemp: val.toString(),
      priceDbVal: val.toString
    });
  };

  updateNewDistance = val => {
    this.setState({
      distanceToDisplayTemp: val.toString()
    });
  };

  onTabFocusOut = () => {
    if (this.state.isAboutEditMode || this.state.isNameEditMode) {
      this._showSnackBar("There are unsaved data, please click save icon", "red", 100);
      this.props.navigation.navigate("Profile");
      return
    }
    if (this.state.isProfilePicNull) {
      this._showSnackBar("Please upload a picture of yourself", "red", 100);
      this.props.navigation.navigate("Profile");
      return
    }
    if (this.state.isNameNull) {
      this._showSnackBar("Please enter your name", "red", 100);
      this.props.navigation.navigate("Profile");
      return
    }
    // console.log("Price: ",this.state.priceToDisplay)
    // console.log("Price: ",this.state.priceToDisplayTemp)
    // console.log("Price: ",this.state.isPriceEditMode)
    // console.log("Price: ",this.state.price)
    console.log("is Looking for: ", this.state.isLookingForTrainer)
    console.log("priceDbVal: ", this.state.priceDbVal)

    if (this.state.isLookingForTrainer && this.state.priceDbVal == null) {
      this._showSnackBar("Please enter your price", "red", 100);
      this.props.navigation.navigate("Profile");
      return
    }



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
        <NavigationEvents onWillBlur={this.onTabFocusOut} />
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
              onLoad={() => this.setState({ imageLoaded: true })}
              imageStyle={{ borderRadius: 10 }}
              source={
                this.state.avatarSource == null
                  ? this.state.userImageToDisplay
                  : this.state.avatarSource
              }
            >
              {!this.state.uploading && this.state.imageLoaded && (
                <TouchableOpacity
                  onPress={this.pickImage}
                  style={styles.picEditTapArea}
                >
                  <Text style={{ color: "white" }}>Tap to edit</Text>
                </TouchableOpacity>
              )}

              {this.state.uploading && this.state.imageLoaded && (
                <View style={styles.imageUploadStatusArea}>
                  <Text style={styles.loadingProgressFont}>
                    {this.state.progress} %
                  </Text>
                </View>
              )}
              {!this.state.imageLoaded && (
                <View style={styles.profilePicLoader}>
                  <ActivityIndicator size="large" color="gray" />
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
                  style={[styles.emailInput, { padding: 0 }]}
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
          {/* <View style={styles.ratingRow}>
            {this.state.user != null ? this.createStars() : ""}
          </View> */}
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
                    onPress={() => {
                      if (!this.state.isAboutEditMode) {
                        this.lookingForSelector.open()
                      } else {
                        this._showSnackBar("There are unsaved data, please click save icon", "red", 100);
                      }
                    }}
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

          <View style={styles.settingItemRowLarge}>
            <View style={styles.settingItemRowLargeContent}>
              <Text style={styles.sectionTitleFont}>Price</Text>
              <View style={styles.settingItemTapArea}>
                <Text style={styles.settingValueFont}>
                  ${this.state.priceToDisplayTemp}
                </Text>
              </View>
            </View>
            <View style={styles.settingItemRowLargeContent}>
              <Slider
                style={styles.sliderBar}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={parseInt(this.state.priceToDisplayTemp)}
                minimumTrackTintColor="#FE007A"
                maximumTrackTintColor="#9D9D9D"
                onValueChange={val => this.updateNewPrice(val)}
                onSlidingComplete={() => this.setNewPrice()}
                thumbStyle={{ backgroundColor: "#FE007A" }}
              />
            </View>
          </View>

          <View style={styles.settingItemRowLarge}>
            <View style={styles.settingItemRowLargeContent}>
              <Text style={styles.sectionTitleFont}>Distance</Text>
              <View style={styles.settingItemTapArea}>
                <Text style={styles.settingValueFont}>
                  {this.state.distanceToDisplayTemp} miles
                </Text>
              </View>
            </View>
            <View style={styles.settingItemRowLargeContent}>
              <Slider
                style={styles.sliderBar}
                minimumValue={0}
                maximumValue={50}
                step={1}
                value={parseInt(this.state.distanceToDisplayTemp)}
                minimumTrackTintColor="#FE007A"
                maximumTrackTintColor="#9D9D9D"
                onValueChange={val => this.updateNewDistance(val)}
                onSlidingComplete={() => this.setNewDistance()}
                thumbStyle={{ backgroundColor: "#FE007A" }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
