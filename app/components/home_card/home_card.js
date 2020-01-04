import React, { Component } from "react";
import { Button, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";

import styles from "./style";
import { Icon } from "native-base";


class HomeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false
    };
  }
  createStars = () => {
    let stars = [];
    let rating = this.props.rating;
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

  didTapPhoto = () => {
    this.props.onPressPhoto(this.props.id, this.props.userID);
  };

  didTapRequest = () => {
    this.props.onPressRequest(this.props.id);
  };

  didTapMessage = () => {
    this.props.onPressMessage(this.props.id);
  };
  crossUser = () => {

    this.props.onPressCrossUser(this.props.id, this.props.userID);
  }


  render() {
    console.warn("The type of list is clientListing? ", this.props.isClientListing)

    if (this.props.isClientListing) {
      return (
        <View style={{
          marginTop: 10, height: 280, width: Dimensions.get("window").width - 40,
          // backgroundColor: 'orange',
          justifyContent: 'center', alignItems: 'center'
        }}>

          <View style={{
            flexDirection: 'row',
            // backgroundColor:'red',
            width: Dimensions.get("window").width - 40
          }} >
            <View style={{ justifyContent: "flex-start", width: '80%' }}>
              <TouchableOpacity

                onPress={this.didTapPhoto}

                style={{
                  borderRadius: 10,
                  // backgroundColor: '#CFD7E1',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>





                <Image source={this.props.userImage} resizeMode="cover" style={{
                  // marginLeft:10,
                  width: '100%', height: 225,
                  borderRadius: 10,
                }} />
              </TouchableOpacity>
            </View>

            <View style={{ marginLeft: 10, justifyContent: 'flex-end', width: '20%' }}>


              <TouchableOpacity
                onPress={this.crossUser}

                style={{
                  marginBottom: 10, backgroundColor: '#e2e2e2', height: 50, width: 50, justifyContent: 'center', alignItems: 'center',

                  borderRadius: 10,

                }}>


                <Icon
                  name={"remove"}
                  type={"FontAwesome"}
                  style={{ fontSize: 30, color: 'grey' }}

                />

              </TouchableOpacity>


              <TouchableOpacity
                onPress={this.didTapMessage}

                style={{
                  marginBottom: 10, backgroundColor: '#e2e2e2', height: 50, width: 50, justifyContent: 'center', alignItems: 'center',

                  borderRadius: 10,

                }}>


                <Icon
                  name={"email"}
                  type={"Zocial"}
                  style={{ fontSize: 30, color: 'grey' }}

                />

              </TouchableOpacity>


              <TouchableOpacity
                style={
                  this.props.isGymEnable
                    ? styles.gymButtonEnable
                    : styles.gymButtonDisable
                }
              >
                <View>
                  <Image
                    source={
                      this.props.isGymEnable
                        ? require("../../res/images/gym_icon_enable.png")
                        : require("../../res/images/gym_icon_disable.png")
                    }
                    style={styles.gymButtonIcon}
                  />
                </View>
                <View>
                  <Text
                    style={
                      this.props.isGymEnable
                        ? styles.gymButtonEnableFont
                        : styles.gymButtonDisableFont
                    }
                  >
                    GYM
                  </Text>
                </View>
              </TouchableOpacity>




              <TouchableOpacity
                style={styles.requestButton}
                onPress={this.didTapRequest}

                style={{
                  marginTop: 10, backgroundColor: '#FE007A', height: 50, width: 50, justifyContent: 'center', alignItems: 'center',

                  borderRadius: 10,

                }}>


                <Icon
                  name={"check"}
                  type={"FontAwesome"}
                  style={{ fontSize: 30, color: 'white' }}

                />

              </TouchableOpacity>




            </View>
          </View>



          <View style={{ borderRadius: 10, backgroundColor: '#e2e2e2', marginTop: 10, height: 40, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ marginLeft: 10, justifyContent: "flex-start", alignItems: 'center' }}>
              <Text style={[styles.nameFont, { marginTop: 5, textAlign: 'center' }]}>{this.props.name}</Text>
            </View>

            <View style={{ marginRight: 10, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>


              {this.createStars(this.props.rating)}
              <Text>{this.props.ratingCount ? this.props.ratingCount : "0"}</Text>
            </View>
          </View>




        </View>


      );
    } else {
      console.log("Else is working")
      return (
        <View style={{
          marginTop: 10, height: 280, width: Dimensions.get("window").width - 40,
          // backgroundColor: 'orange',
          justifyContent: 'center', alignItems: 'center'
        }}>

          <View style={{
            flexDirection: 'row',
            // backgroundColor:'red',
            width: Dimensions.get("window").width - 40
          }} >
            <View style={{ justifyContent: "flex-start", width: '80%' }}>
              <TouchableOpacity

                onPress={this.didTapPhoto}

                style={{
                  borderRadius: 10,
                  // backgroundColor: '#CFD7E1',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>





                <Image
                  source={this.props.userImage}
                  onLoad={() => this.setState({ imageLoaded: true })}
                  resizeMode="cover" style={{
                    // marginLeft:10,
                    width: '100%', height: 225,
                    borderRadius: 10,
                  }} />
                {!this.state.imageLoaded && (
                  <View style={styles.profilePicLoader}>
                    <ActivityIndicator size="large" color="gray" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ marginLeft: 10, justifyContent: 'flex-end', width: '20%' }}>


              <TouchableOpacity
                onPress={this.crossUser}

                style={{

                  marginBottom: 10, backgroundColor: '#e2e2e2', height: 50, width: 50, justifyContent: 'center', alignItems: 'center',

                  borderRadius: 10,

                }}>


                <Icon
                  name={"remove"}
                  type={"FontAwesome"}
                  style={{ fontSize: 30, color: 'grey' }}

                />

              </TouchableOpacity>

              <View style={{ marginBottom: 10, backgroundColor: '#e2e2e2', width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, }}>
                <Text style={styles.priceFont}>{this.props.price === '$undefined' ? 0 : this.props.price}</Text>
              </View>





              <TouchableOpacity
                style={
                  this.props.isGymEnable
                    ? styles.gymButtonEnable
                    : styles.gymButtonDisable
                }
              >
                <View>
                  <Image
                    source={
                      this.props.isGymEnable
                        ? require("../../res/images/gym_icon_enable.png")
                        : require("../../res/images/gym_icon_disable.png")
                    }
                    style={styles.gymButtonIcon}
                  />
                </View>
                <View>
                  <Text
                    style={
                      this.props.isGymEnable
                        ? styles.gymButtonEnableFont
                        : styles.gymButtonDisableFont
                    }
                  >
                    GYM
                  </Text>
                </View>
              </TouchableOpacity>




              <TouchableOpacity
                style={styles.requestButton}
                onPress={this.didTapRequest}

                style={{
                  marginTop: 10, backgroundColor: '#FE007A', height: 50, width: 50, justifyContent: 'center', alignItems: 'center',

                  borderRadius: 10,

                }}>



                <Icon
                  name={"check"}
                  type={"FontAwesome"}
                  style={{ fontSize: 30, color: 'white' }}

                />

              </TouchableOpacity>




            </View>
          </View>



          <View style={{ borderRadius: 10, backgroundColor: '#e2e2e2', marginTop: 10, height: 40, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ marginLeft: 10, justifyContent: "flex-start", alignItems: 'center' }}>
              <Text style={[styles.nameFont, { marginTop: 5, textAlign: 'center' }]}>{this.props.name}</Text>
            </View>

            <View style={{ marginRight: 10, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>


              {this.createStars(this.props.rating)}
              <Text>{this.props.ratingCount ? this.props.ratingCount : "0"}</Text>

            </View>
          </View>




        </View>


      );

    }

    // <View style={styles.card}>
    //   <View style={styles.cardTopSection}>
    //     <TouchableOpacity
    //       style={styles.pictureCol}
    //       onPress={this.didTapPhoto}
    //     >
    //       <Image style={styles.picture} source={this.props.userImage} />
    //     </TouchableOpacity>
    //     <View style={styles.detailCol}>
    //       <View style={styles.nameRow}>
    //         <Text style={styles.nameFont}>{this.props.name}</Text>
    //       </View>
    //       <View style={styles.secondRow}>
    //         <View style={styles.ratingRow}>
    //           {this.createStars(this.props.rating)}
    //         </View>
    //         <View>
    //           {!this.props.isClientListing && (
    //             <View>
    //               <Text style={styles.priceFont}>{this.props.price}</Text>
    //             </View>
    //           )}
    //           {this.props.isClientListing && (
    //             <TouchableOpacity onPress={this.didTapMessage}>
    //               <Image
    //                 source={require("../../res/images/email_icon.png")}
    //                 style={styles.messageIcon}
    //               />
    //             </TouchableOpacity>
    //           )}
    //         </View>
    //       </View>

    //       <View style={styles.buttonRow}>
    //         <TouchableOpacity
    //           style={styles.requestButton}
    //           onPress={this.didTapRequest}
    //         >
    //           <Text style={styles.requestButtonFont}>REQUEST</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity
    //           style={
    //             this.props.isGymEnable
    //               ? styles.gymButtonEnable
    //               : styles.gymButtonDisable
    //           }
    //         >
    //           <View>
    //             <Image
    //               source={
    //                 this.props.isGymEnable
    //                   ? require("../../res/images/gym_icon_enable.png")
    //                   : require("../../res/images/gym_icon_disable.png")
    //               }
    //               style={styles.gymButtonIcon}
    //             />
    //           </View>
    //           <View>
    //             <Text
    //               style={
    //                 this.props.isGymEnable
    //                   ? styles.gymButtonEnableFont
    //                   : styles.gymButtonDisableFont
    //               }
    //             >
    //               GYM
    //             </Text>
    //           </View>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </View>
    //   {this.props.isShowMessage && (
    //     <View>
    //       <Text style={styles.messageFont}>{this.props.messageText}</Text>
    //     </View>
    //   )}
    // </View>

  }
}

export default HomeCard;

