import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity 
} from "react-native";
import BackIcon from "../../navigation/back_icon";
import colors from "res/colors";
import strings from "res/strings";
// import Slider from "@react-native-community/slider";
import Slider from "react-native-slider";
import { GiftedChat } from "react-native-gifted-chat";
import firebase from "react-native-firebase";
import styles from "./style";
import Dialog from "react-native-dialog";

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      user: {},
      messages: [],
      isShowDeleteAlert: false,
    };
  }

  static navigationOptions = ({navigation})=>{
    return{
      title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'Chat': navigation.state.params.title,
      headerTitleStyle: {
        color: colors.header_text,
        fontFamily: "Helvetica Neue"
      },
      headerStyle: {
        backgroundColor: colors.header
      },
      headerLeft: <BackIcon />,
      headerRight: <TouchableOpacity style={styles.deleteIconArea} onPress={() => navigation.getParam("deleteConversation")()}><Image style={styles.deleteIcon} source={require('../../res/images/delete_icon.png')} /></TouchableOpacity> 
    }
  };

  askeToDelete = () => {
    this.setState({
      isShowDeleteAlert: true
    });
  }
  deleteConversation = () =>{
    console.warn("DELETE ", this.state.chatUserId, this.state.loggedUserId);
    firebase
      .database()
      .ref("relationships/" + this.state.loggedUserId + "/requested")
      .child(this.state.chatUserId)
      .update({
        deleted:true
      })
      .then(() => {
        console.warn("USER DELETED");
      })
      .catch(function(error) {
        console.error(error);
      });

    firebase
      .database()
      .ref("relationships/" + this.state.loggedUserId + "/requestedBack")
      .child(this.state.chatUserId)
      .update({
        deleted:true
      })
      .catch(function(error) {
        console.error(error);
      });

      this.setState({
        isShowDeleteAlert: false
      }, () => {
        this.props.navigation.goBack();
      });
  };

  componentWillMount() {
    // const { navigation } = this.props;
    var userId = this.props.navigation.getParam("userId");
    var loggedUserId = this.props.navigation.getParam("loggedUserId");
    var userName = this.props.navigation.getParam("userName");
    var userAvatar = this.props.navigation.getParam("userAvatar");
    this.props.navigation.setParams({ title: userName, deleteConversation: this.askeToDelete});
    console.warn("PHOTO #####", userAvatar);
    this.setState({
      isLoading: true,
      loggedUserId: loggedUserId,
      chatUserId: userId,
      userAvatar:userAvatar,
      userName:userName

    });
    user = firebase.auth().currentUser;
    console.log(user);
    firebase
      .database()
      .ref()
      .child(
        "/relationships/" + loggedUserId + "/requestedBack/" + userId + "/chats"
      )
      .limitToLast(20)
      .on(
        "value",
        snapshot => {
          this.setState({
            messages:[]
          })
          snapshot.forEach(childSnapshot => {
            //console.log(childSnapshot.val());
            var message = this.parse(childSnapshot);
            console.log(message);
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, message)
            }));
            
          });
          console.log("####################",this.state.messages);
        },
        error => {
          console.log("Error: " + error.code);
        }
      );

    // this.setState({
    //   messages: [
    //     {
    //       _id: loggedUserId,
    //       text: "Hello developer",
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: "React Native",
    //         avatar: "https://placeimg.com/140/140/any"
    //       }
    //     }
    //   ]
    // });
  }

  parse = snapshot => {
    console.log(snapshot.val());
    // const { timestamp: numberStamp, text, user } = snapshot.val();
    // const { key: id } = snapshot.val().id.toString();
    const _id = snapshot.key;
    const numberStamp = snapshot.val().createdAt;
    const text = snapshot.val().text;
    const user = snapshot.val().user;
    user.name = this.state.userName;
    user.avatar = this.state.userAvatar != undefined ? this.state.userAvatar: require("../../res/images/default_user.png") 
    const createdAt = new Date(numberStamp);
    console.log("CreatedAT####", createdAt);
    const message = { _id, createdAt, text, user };
    return message;
  };

  timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  componentWillUnmount() {
    firebase
      .database()
      .ref()
      .off();
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      firebase
        .database()
        .ref()
        .child(
          "/relationships/" +
            this.state.loggedUserId +
            "/requestedBack/" +
            this.state.chatUserId +
            "/chats"
        )
        .push(message);

        firebase
        .database()
        .ref()
        .child(
          "/relationships/" +
          this.state.chatUserId +
            "/requestedBack/" +
            this.state.loggedUserId +
            "/chats"
        )
        .push(message);
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.send(messages)}
          user={{
            _id: this.props.navigation.getParam("loggedUserId")
          }}
        />
        <Dialog.Container visible={this.state.isShowDeleteAlert}>
          <Dialog.Title>Remove user from matching</Dialog.Title>
          <Dialog.Description>
            Are you sure to remove this from matching list?
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => this.setState({ isShowDeleteAlert: false })}
          />
          <Dialog.Button label="Yes" onPress={this.deleteConversation} />
        </Dialog.Container>
      </SafeAreaView>
    );
  }
}
