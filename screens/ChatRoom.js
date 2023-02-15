import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firebase } from "../firebase";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatRoom = ({ navigation, route }) => {
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [index, setSelectedIndex] = useState('');
  const chatRoomId = route.params.chatRoomId;
  const currentUser = firebase.auth().currentUser.email;
  const currentUserId = firebase.auth().currentUser.uid;
  const [profileInfo, setProfileInfo] = useState([])

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('messages')
      .doc(chatRoomId)
      .collection('messageDetails')
      .orderBy('createdAt', 'asc')
      .onSnapshot((snapshot) => {
        let messages = snapshot.docs.map((doc) => doc.data());
        console.log("Messages: ", messages)
        setMessages(messages.sort((m1, m2) => m1.createdAt.seconds - m2.createdAt.seconds));
      });
    return () => unsubscribe();
  }, [chatRoomId]);

  useEffect(() => {
    try {
      firebase
        .firestore()
        .collection('chatRooms')
        .doc(chatRoomId)
        .onSnapshot((snapshot) => {
          const chatRoomData = snapshot.data();
          const members = chatRoomData.members;

          Promise.all(
            members.map(async (memberId) => {
              const downloadUrl = await storage().ref(memberId).getDownloadURL();
              return { memberId, downloadUrl };
            })
          )
            .then(profileInfo => {
              setProfileInfo(profileInfo);
            });
        });
    } catch (err) {
      console.log(err.message)
    }
  }, [])

  const handleSend = async () => {
    if (image) {
      const imageFileName = image.split("/").pop();
      const ref = storage().ref().child(`chatrooms/${chatRoomId}/${currentUserId}/${imageFileName}`);
      await ref.putFile(image);
      const url = await storage().ref().child(`chatrooms/${chatRoomId}/${currentUserId}/${imageFileName}`).getDownloadURL();
      firebase
        .firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messageDetails')
        .add({
          text,
          sender: currentUser,
          id: currentUserId,
          createdAt: new Date(),
          media: url
        });
    }
    else {
      firebase
        .firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messageDetails')
        .add({
          text,
          sender: currentUser,
          id: currentUserId,
          createdAt: new Date()
        });
    }
    setText('');
    setImage(null)
  };

  const handleOpenAttachment = async () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        scrollToIndex={({ index }) => setSelectedIndex(index)}
        renderItem={({ item }) => {
          const date = new Date(item.createdAt.seconds * 1000);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

          const senderInfo = profileInfo.find(info => info.memberId === item.id)
          const senderImage = senderInfo?.downloadUrl || '';

          if (!senderImage) {
            return (
              <View style={styles.container}>
                <ActivityIndicator size="large" />
              </View>
            );
          }

          if (item.sender === currentUser) {
            return (
              <View style={styles.rightMessageContainer}>
                <View style={styles.textContainer}>
                  {item.media ?
                    <View>
                      <Image style={styles.image} source={{ uri: item.media }} />
                      <Text>{item.text}</Text>
                    </View> :
                    <Text>{item.text}</Text>
                  }
                  <Text style={styles.time}>{formattedTime}</Text>
                </View>
                <Image style={styles.profileImage} source={{ uri: senderImage }} />
              </View>
            );
          } else {
            return (
              <View style={styles.leftMessageContainer}>
                <View style={styles.textContainer}>
                  {item.media ?
                    <View>
                      <Image style={styles.image} source={{ uri: item.media }} />
                      <Text>{item.text}</Text>
                    </View> :
                    <Text>{item.text}</Text>
                  }
                  <Text style={styles.time}>{formattedTime}</Text>
                </View>
                <Image style={styles.profileImage} source={{ uri: senderImage }} />
              </View>
            );
          }
        }}
        keyExtractor={(item) => item.createdAt.toString()}
      />
      <View style={styles.inputContainer}>
        {image && (

          <Image style={styles.imageInInput} source={{ uri: image }} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
        />

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity onPress={handleOpenAttachment}>
          <MaterialIcons name="image" style={styles.attachmentIcon} />
        </TouchableOpacity>
        <Text style={styles.send} onPress={handleSend}>
          Send
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  time: {
    fontSize: 10,
    color: "#999999",
    alignSelf: "flex-start",
    marginBottom: 3,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginLeft: 10,
    marginBottom: 10
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  imageInInput: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
  leftMessageContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  rightMessageContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: '#ADD8E6',
    borderRadius: 5,
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  send: {
    padding: 10,
    backgroundColor: 'blue',
    color: '#fff',
    borderRadius: 5,
  },
  attachmentIcon: {
    fontSize: 24,
    color: 'blue',
    marginRight: 10,
  },
});

export default ChatRoom;
