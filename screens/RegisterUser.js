import React, { useState, useContext, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Button, StyleSheet, TextInput, StatusBar, Text, Image} from "react-native"
import firebase from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { UserContext } from '../providers/UserProvider';
import { doc, setDoc } from '@react-native-firebase/firestore'
import { FirestoreUsersContext } from '../providers/FirestoreUsersProvider';
import firestore from '@react-native-firebase/firestore'


const RegisterUser = ( { navigation} ) => {

const [ registered, setRegistered ] = useState(false)

const { email, setEmail, password, setPassword } = useContext(UserContext)

// useCallback(() => {
//     updateFirestore()
//     console.log("updated firestore")
// }, [registered])

const updateFirestore = useCallback(() => {
    firestore().collection('users')
    .add({
         email: email
     })
     .then((email) => console.log(email))
 }, [registered])
 

const createUser = async () => {
try {
    console.log("email and password: ", email, password)
    const { user } = await auth().createUserWithEmailAndPassword(email, password);
    setRegistered(true);
    console.log("THE CREATED USER: ", user)
   
    navigation.navigate('Profile');

} catch (err) {
    console.log("NOPE, NOT CREATED")
}
}



return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputView}>
            <Image style={styles.image} source={require("../assets/bosi-logo.png")} />
            <Text style={{ color: "#099556", fontSize: 30, textAlign: "center", marginBottom: 30 }}>
                    Welcome!
            </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="email"
                    placeholderTextColor="#003f5c"
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    style={[styles.textInput, {marginBottom: 10}]}
                    placeholder="password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                />
                <Button
                    title="Register"
                    onPress={() => {createUser(); updateFirestore() }}>
                </Button>
            </View>
            <View style={{marginTop: 20, alignSelf: "center", alignItems: "center"}}>
                <Text>
                    Already a user?  
                </Text>
                <Text 
                    style={styles.signIn}
                    onPress={() => navigation.navigate('Sign In')}    
                >
                    Sign In Here
                </Text>
            </View>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    inputView: {
        marginTop: 30,
        width: "60%",
        alignSelf: "center",
    },
    textInput: {
        marginTop: 3,
        marginBottom: 3,
        borderWidth: 1,
        borderRadius: 5
    },
    image: {
        marginBottom: 3,
        width: 200,
        height: 200, 
        alignSelf: "center"
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
    signIn: {
        color: "blue",
        marginTop: 5
    }
  });
  
export default RegisterUser