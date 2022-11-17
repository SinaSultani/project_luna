import React, { useState} from 'react';
import { SafeAreaView, View, Button, StyleSheet, TextInput, StatusBar} from "react-native"
import firebase from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';


const Profile = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // const auth = getAuth().currentUser;
  
  const createUser = async () => {
    try {
        console.log("email and password: ", email, password)
        const { user } = await auth().createUserWithEmailAndPassword(email, password);
        console.log("THE CREATED USER: ", user)
        // await sendEmailVerification();
        // console.log("THE CREATED USER: ", user);
    } catch (err) {
        console.log("NOPE, NOT CREATED")
    }

  }

  


    return (
        <SafeAreaView style={{ flex: 1}}>
            <View style={styles.inputView}> 
            <TextInput
                style={styles.TextInput}
                placeholder="Email."
                placeholderTextColor="#003f5c"
                value={email}
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput
                placeholder="Password."
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                value={password}
                onChangeText={(password) => setPassword(password)}
            />
            <Button 
              title="Register"
              onPress={createUser}>
            </Button>
          
            </View>
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
    },
  });
  
export default Profile