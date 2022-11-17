import React, { useState} from 'react';
import { SafeAreaView, View, Button, StyleSheet, TextInput, StatusBar, Text} from "react-native"
import firebase from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';


const Profile = ({navigation}) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const authh = getAuth().currentUser;
  console.log("This is Auth", authh)
  const createUser = async () => {
    try {
        console.log("email and password: ", email, password)
        const { user } = await auth().createUserWithEmailAndPassword(email, password);
        console.log("THE CREATED USER: ", user)
    } catch (err) {
        console.log("NOPE, NOT CREATED")
    }

  }
  const signOut = async () => {
    await firebase.auth().signOut().then(() => {
        setEmail("");
        setPassword("");
        console.log("Sign-out successful")
        navigation.navigate('Sign In')
      }).catch((error) => {
        console.log(error)
    });

  }

    return (
        <SafeAreaView style={{ flex: 1}}>
            <Text> user profile </Text>
            <Button
            title="Log Out"
            onPress={signOut}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  }
})

export default Profile