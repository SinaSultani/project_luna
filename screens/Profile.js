
import React, { useState, useContext, useRef} from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar, Text, Pressable, Image, Modal} from "react-native"
import { UserContext } from '../providers/UserProvider';
import Loader from './Loader';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { firebase } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
// import { Icon } from 'react-native-vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



const Profile = ({ navigation}) => {
  
  const { user, signOut, isLoading,  firestoreUID, profilePicture, dob } = useContext(UserContext)
  const drawerRef = useRef(null)
  const [ modal, setModal ] = useState(false)
  const [imageUri, setImageUri] = useState("");
  const [ imagePath, setImagePath] = useState()
  const [ imagePathSecond, setImagePathSecond ] = useState()
  const [ runGallery, setRunGallery ] = useState(false)
  const [ imagePreview, setImagePreview ] = useState(false)


  let currentUserData;
  firestore()
    .collection('users')
    .doc(firestoreUID)
    .get()
    .then( documentSnapshot => {
      currentUserData = documentSnapshot.data()
  });

  const toBalance = () => {
    navigation.navigate('TopUp', { screen: 'Your Balance'})
  }
  const toSettings = () => {
    navigation.navigate('Settings')
  }
const toggleModal = () => {
  setModal(true)
}
const onModalClose = () => {
  setModal(false)
}

const openGallery = () => {
  setRunGallery(true)
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
        const source = { uri: 'data:image/jpeg;base64,' + response.base64 };
        setImagePath(response.assets[0].uri);
        setImagePreview(true)
        if (imagePath) {
          setImagePathSecond(response.assets[0].uri)
        }
      }
  });
}


const openCamera = async () => {
 
  const options = {
      storageOptions: {
          path: 'images',
          mediaType: 'photo',
      },
      includeBase64: true,
  };
  launchCamera(options, response => {
      if (response.didCancel) {
          console.log('User cancelled image picker');
      } else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
      } else {
          
        setImagePreview(true)  
        setImagePath(response.assets[0].uri);
        // reference.putFile(pathToFile);
        // const source = { uri: 'data:image/jpeg;base64,' + response.base64 };
        // setImageUri(pathToFile);
        // setImagePath(response.assets[0].uri)
         
      }
  });

}

const handleImageCancle = () => {
  setImagePath(null)
  // if(imagePath) {
  //  setImagePath(imagePathSecond)
  // } else (
  //   setImagePath(null)
  //   )
}

// adds image to storage
const handleImageConfirm = () => {
  setImagePreview(false)
  setRunGallery(false)
  // imagePathSecond && setImagePath(imagePathSecond)

  // creates a folder with user name user.uid in fb storage and pushes pictures in the folder
  const storageRef = firebase.storage().ref(user.uid);
  const imageRef = storageRef.child(imagePath);
  imageRef.putFile(imagePath).then((snapshot) => {
    console.log("snapshot", snapshot)
  });

  // creates profile image path in firestore so we can access the specific image from users image folder
  firestore()
    .collection('users')
    .doc(user.uid) 
    .set({
      ...currentUserData,
      profileImagePath: imagePath,
  })
}
const name = "360"
if (!user && isLoading) return <Loader/>
    return (
      <SafeAreaView style={{ flex: 1}}>
          <View style={styles.item}>
            <Text style={styles.title}> Welcome mister  </Text>
            <View >
              <Text onLongPress={toggleModal}> IMAGE </Text>
              <MaterialIcons name={name} size={44} color="white" />
            { (modal && user) ? <Modal 
                visible={modal}
                transparent={true}
                onRequestClose={onModalClose}
              >
              <View style={styles.centeredView} onTouchEnd={onModalClose}>
                <View style={[styles.modalView, {width:250}]}  >
                  <Text style={{marginBottom: 20}}  onPress={openCamera}> Take a new photo. </Text>
                  <Text  onPress={openGallery}> Upload a photo.</Text>
                </View>
              </View>
              </Modal> : null }
             {imagePreview && 
             <View style={{width: 400, opacity: 1, backgroundColor: "fff", flexDirection: "row"}}>
              <Image style={{width: 100, height: 100}} source={{uri: imagePath }}/>
              <Text style={{color: "black"}}
                onPress={handleImageConfirm}
               >OK</Text>
               <Text onPress={() => {handleImageCancle(); setImagePreview(false)}}> Cancle</Text>
               { !runGallery && <Text onPress={openCamera}> Retake</Text> }
               { runGallery && <Text onPress={() => {setRunGallery(false); openGallery()}}> Re-Select</Text> }
             </View>
             }
            {(!imagePreview && user) ? <Image style={{width: 200, height: 200}} source={{uri: imagePath || profilePicture   }}/>: null}
          </View>
            <Text style={[styles.title, {fontSize: 25} ]}>{user?.email}</Text>
            <Text style={[styles.title, {fontSize: 25} ]}>{dob}</Text>
          </View>
        <Pressable
          style={styles.button}
          onPress={toBalance}
        >
          <Text style={{ color: "white", alignSelf: "center" }}>To balance</Text>
        </Pressable>

        <Pressable
          style={[{marginTop: 20, bottom: 10}, styles.button]}
          onPress={toSettings}
        >
          <Text style={{ color: "white", alignSelf: "center" }}>Settings</Text>
        </Pressable>

        <Pressable
          style={[{marginTop: "auto", bottom: 10}, styles.button]}
          onPress={() => signOut()}
        >
          <Text style={{ color: "white", alignSelf: "center" }}>Log Out</Text>
        </Pressable>
   
        </SafeAreaView>
      
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#7954d1',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    textAlign: "center"
  }, 
  button:{ 
    backgroundColor: "#a177fc", 
    width: 100, 
    height: 30, 
    alignSelf:"center", 
    alignItems: "center", 
    borderRadius: 10,
    paddingTop: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    backgroundColor: '#fff', 
    borderRadius: 10,
    paddingTop: 25,
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
})

export default Profile