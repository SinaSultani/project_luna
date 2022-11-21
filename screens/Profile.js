import React, { useState, useContext} from 'react';
import { SafeAreaView, View, Button, StyleSheet, TextInput, StatusBar, Text, Pressable} from "react-native"
import firebase from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { UserContext } from '../providers/UserProvider';


const Profile = ({ navigation}) => {
  
  // const authh = getAuth().currentUser;
  // console.log("This is Auth", authh)
  const { email, setEmail, setPassword, setLoggedIn } = useContext(UserContext)


  const signOut = async () => {
    setPassword(""); 
    setEmail("");
    await firebase.auth().signOut().then(() => {
        setLoggedIn(false)
        console.log("Sign-out successful")
        navigation.navigate('Sign In')
      }).catch((error) => {
        console.log(error)
    });

  }

  const toBalance = () => {
    navigation.navigate('Your Balance')
  }

    return (
        <SafeAreaView style={{ flex: 1}}>
          <View style={styles.item}>
            <Text style={styles.title}> Welcome mister  </Text>
            <Text style={[styles.title, {fontSize: 25} ]}>{email}</Text>
          </View>
          <Pressable
              style={styles.button}
            
              onPress={signOut}
            >
              <Text style={{color:"white", alignSelf:"center"}}>Log Out</Text>
            </Pressable>
          <Pressable
              style={styles.button}
            
              onPress={toBalance}
            >
              <Text style={{color:"white", alignSelf:"center"}}>To balance</Text>
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
    backgroundColor: '#3199de',
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
    backgroundColor: "#3199de", 
    width: 100, 
    height: 30, 
    alignSelf:"center", 
    alignItems: "center", 
    borderRadius: 10,
    paddingTop: 5
  }
})

export default Profile