import React , {useCallback, useEffect, useState, useContext} from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, Button, TextInput, Alert} from "react-native"
import auth from '@react-native-firebase/auth';
import { UserContext } from '../providers/UserProvider';
import { FirestoreUsersContext } from '../providers/FirestoreUsersProvider';


import firestore from '@react-native-firebase/firestore';


export const SignIn = ({ navigation }) => {
    const [ logIn, setLogIn ] = useState(false)
    const [ initializing, setInitializing ] = useState(true)
    const { email, setEmail, password, setPassword, user, setUser, setLoggedIn } = useContext(UserContext)
    const { users } = useContext(FirestoreUsersContext)
    console.log("init", initializing)
    console.log(user)
    
    
    // const users = await firestore().collection('users').get();

    console.log(users)

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [])

    const signIn = async () => {
    try {
        if (email === "" || password === "") {
           return Alert.alert("Email or password cannot be empty.")
            
        }
        const { user } = await auth().signInWithEmailAndPassword(email, password);
        console.log("the signed in user: ", user)
        onAuthStateChanged(user)
        navigation.navigate('Profile');
        setLoggedIn(true)
   
     
        // navigation.navigate('The Profile')
    } catch (err) {
        console.log("Not signed in")
    }
  }

    return (
      
            <SafeAreaView style={styles.container}>
                <View style={{width: "60%", alignContent: "center", alignSelf: "center"}}>
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
                        style={styles.textInput}
                        placeholder="password"
                        placeholderTextColor="#003f5c"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(password) => setPassword(password)}
                    />
                    <Button
                        title="Sign In"
                        onPress={signIn}>
                    </Button>
                    <Text
                        style={styles.signIn}
                        onPress={() => { navigation.navigate('Register & Sign in')}}
                    > Register here </Text>
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
    image: {
        marginBottom: 3,
        width: 200,
        height: 200, 
        alignSelf: "center"
    },
    signIn: {
        color: "blue",
        marginTop: 5
    },
    textInput: {
        marginTop: 3,
        marginBottom: 3,
        borderWidth: 1,
        borderRadius: 5
    },
})
export default SignIn