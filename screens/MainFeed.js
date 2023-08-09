import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { Platform, PermissionsAndroid } from 'react-native';
import { firebase } from "../firebase";
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import Stories from '../components/Stories';
import { ScrollView } from 'react-native';

const MainFeed = () => {
  const currentUserId = firebase.auth().currentUser.uid;
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  useEffect(() => {
    const userRef = firebase.firestore().collection("users").doc(currentUserId);
    
    const fetchPosts = async () => {
      let postData = [];
      try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUserId).get();
        const friendsRefs = userDoc.data().friends;
        
        // Get the document references of the current users friends
        const friends = await Promise.all(friendsRefs.map(async friendRef => {
          try {
            let friend = await friendRef.get();
            return friend.ref;
          } catch (error) {
            console.log(error);
            return null;
          }
        }));
       
        
        // Query the posts collection for documents with a userId that matches the current user's reference or any of their friends' references
        const postsRef = firebase.firestore().collection('posts');
        let query = postsRef.where('userId', 'in', [userRef, ...friends]).orderBy('createdAt', 'desc');
        let querySnapshot = await query.get();
        console.log("querySnapshot NU: ", querySnapshot)
        // Sort the resulting documents in descending order by the "createdAt" field
        let sortedPosts = querySnapshot.docs.sort((a, b) => b.data().createdAt.seconds - a.data().createdAt.seconds);
        // Retrieve the displayName and profileImg for each post's user and each friend's profileImg

        postData = await Promise.all(sortedPosts.map(async post => {
          let userRef = post.data().userId;
          let user = await userRef.get();
          let profileImg;
          if (friendsRefs.includes(userRef) || userRef) {
            // If the user is a friend, get their profileImg from Firebase Storage
            const memberDoc = userRef;
            const downloadUrl = await storage().ref(memberDoc.id).getDownloadURL();
            profileImg = downloadUrl;
          } else {
            // Otherwise, use the user's profileImg from Firestore
            profileImg = user.data().profileImg;
          }

          return {
            ...post.data(),
            id: post.id,
            displayName: user.data().displayName,
            profileImg: profileImg
          };
        }));
      } catch (error) {
        console.log(error.message);
      }
      setPosts(postData);
    };
    fetchPosts();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePost = async () => {
    const userRef = firebase.firestore().collection("users").doc(currentUserId);
    if (image) {
      const imageFileName = image.split("/").pop();
      const ref = storage().ref().child(`posts/${currentUserId}/${imageFileName}`);
      await ref.putFile(image);
      const url = await storage().ref().child(`posts/${currentUserId}/${imageFileName}`).getDownloadURL();
      firebase
        .firestore()
        .collection('posts')
        .add({
          text,
          userId: userRef,
          createdAt: new Date(),
          media: url
        });
    }
    else {
      firebase
        .firestore()
        .collection('posts')
        .add({
          text,
          userId: userRef,
          createdAt: new Date(),
        });
    }
    setText('');
    setImage(null);
  };
  const openCamera = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          launchCameraWithOptions();
        } else {
          console.log('Camera permission denied');
        }
      } else if (Platform.OS === 'ios') {
        launchCameraWithOptions();
        // const cameraPermissionStatus = await Permissions.check('camera');
        // if (cameraPermissionStatus !== 'authorized') {
        //   const { status } = await Permissions.request('camera');
        //   if (status === 'authorized') {
        //     console.log('Camera permission granted');
        //     launchCameraWithOptions();
        //   } else {
        //     console.log('Camera permission denied');
        //   }
        // } else {
        //   console.log('Camera permission already granted');
        //   launchCameraWithOptions();
        // }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const launchCameraWithOptions = () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };
    launchCamera(options, response => {
      console.log('ImagePicker response:', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button:', response.customButton);
      } else {
        console.log('response:', response);
        setImage(response.assets[0].uri);
      }
    });
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
    <SafeAreaProvider style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>LUNA</Text>
            <TouchableOpacity onPress={() => console.log("Notifications pressed")}>
              <MaterialIcons name="notifications" style={styles.notificationsIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.stories}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Stories />
          </ScrollView>
        </View>
        <View style={styles.feedContainer}>
          {posts.map((item) => (
            <View key={`${item.id}-${item.createdAt?.seconds}`} style={styles.cardContainer}>
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardContent}>
                    <Image style={styles.profileImg} source={{ uri: item.profileImg }} />
                    <Text style={styles.displayName}>{item.displayName}</Text>
                    <TouchableOpacity style={styles.dotsContainer} onPress={openModal}>
                      <Text style={styles.dots}>...</Text>
                    </TouchableOpacity>
                  </View>
                  {item.media && (
                    <Image style={styles.postImage} source={{ uri: item.media }} />
                  )}
                  <Text style={styles.textStyle}>{item.text}</Text>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity>
                      <MaterialIcons name="comment" style={styles.commentIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <MaterialIcons name="favorite-outline" style={styles.likeIcon} />
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal visible={showModal} animationType="slide" transparent>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Options</Text>
            </View>
            <View style={styles.modalContent}>
              {/* List of options */}
              <TouchableOpacity style={styles.option}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Text>Delete</Text>
              </TouchableOpacity>
              {/* Add more options as needed */}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  </SafeAreaProvider>
  );
};

const styles = {
  headerContainer: {
    flex: 1,
    backgroundColor: 'rgb(242, 242, 242)',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5722',
    textAlign: 'center',
  },
  notificationsIcon: {
    fontSize: 28,
    color: '#FF5722',
  },
  feedContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cardContainer: {
    marginBottom: 20,
  },
  stories: {
    marginTop: 10,
    marginBottom: 10
  },
  dotsContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  showTestModal: {
    width: 100,
    height: 100
  },
  dots: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  textStyle: {
    fontSize: 17,
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentIcon: {
    fontSize: 24,
    color: '#FF5722',
    marginTop: 20,
    marginRight: 10,
  },
  likeIcon: {
    fontSize: 24,
    color: '#FF5722',
    marginTop: 20,
  },
  displayName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    elevation: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    padding: 16,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F4F4F4',
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    paddingHorizontal: 16,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
};

export default MainFeed;