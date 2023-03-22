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
        //console.log("Messages: ", messages)
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
          console.log("members: ", members)
          Promise.all(
            members.map(async (memberRef) => {
              console.log("memberRef: ", memberRef)
              const memberDoc = await memberRef.get();
              const downloadUrl = await storage().ref(memberDoc.id).getDownloadURL();
              return { memberId: memberDoc.id, downloadUrl: downloadUrl, displayName: memberDoc.data().displayName };
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
          const senderName = senderInfo?.displayName || '';
          console.log("profileInfo: ", profileInfo)

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

                <View style={styles.contentContainer}>
                  <Text style={styles.senderName}>{senderName}</Text>
                  {item.media ? (
                    <View>
                      <Image style={styles.image} source={{ uri: item.media }} />
                      <Text>{item.text}</Text>
                    </View>
                  ) : (
                    <Text>{item.text}</Text>
                  )}
                  <Text style={styles.time}>{formattedTime}</Text>
                </View>
                <Image style={styles.profileImage} source={{ uri: senderImage }} />
              </View>

            );
          } else {
            return (
              <View style={styles.leftMessageContainer}>
                <Image style={styles.profileImage} source={{ uri: senderImage }} />
                <View style={styles.contentContainer}>
                  <Text style={styles.senderName}>{senderName}</Text>
                  {item.media ?
                    <View>
                      <Image style={styles.image} source={{ uri: item.media }} />
                      <Text>{item.text}</Text>
                    </View> :
                    <Text>{item.text}</Text>
                  }
                  <Text style={styles.time}>{formattedTime}</Text>
                </View>
              </View>
            );
          }
        }}
        keyExtractor={(item) => item.createdAt.toString()}
      />
      {image && (
        <View style={styles.inputContainer}>
          <Image style={styles.imageInInput} source={{ uri: image }} />
        </View>
      )}
      <View style={styles.inputContainer}>
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
  rightMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C5',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
    flexDirection: 'row',
  },
  leftMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 50,
    marginLeft: 10,
  },
  contentContainer: {
    maxWidth: '70%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  senderName: {
    fontSize: 12,
    color: '#888',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  time: {
    fontSize: 10,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    padding: 5,
    margin: 5,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  imageInInput: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  attachmentIcon: {
    fontSize: 20,
    color: '#888',
    marginHorizontal: 5,
  },
  send: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
  },
});

export default ChatRoom;