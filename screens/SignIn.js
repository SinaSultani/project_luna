import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import getAuth from '@react-native-firebase/auth';
import Profile from "./Profile";
// import { UserProvider } from "../context/UserProvider";
import { UserContext } from '../context/UserProvider';



const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // // Set an initializing state whilst Firebase connects
    // const [initializing, setInitializing] = useState(true);
    // const [user, setUser] = useState();

    const { signInUser } = useContext(UserContext);
    console.log("signInUser: ", signInUser)
    // const currentAuth = getAuth().currentUser;


    // Handle user state changes
    // function onAuthStateChanged(user) {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    // }

    // useEffect(async () => {
    //     const subscriber = await auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);

    // if (initializing) return <Text>NULL</Text>;

    // const signIn = async () => {
    //     try {
    //         const { user } = await auth().signInWithEmailAndPassword(email, password);
    //         navigation.navigate('The Profile')
    //     } catch (err) {
    //         console.log("Not signed in")
    //     }
    // }

    return (
        <>
            <View style={styles.container}>
                <Image style={styles.image} source={require("../assets/bosi-logo.png")} />
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Email."
                        placeholderTextColor="#003f5c"
                        onChangeText={(email) => setEmail(email)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password."
                        placeholderTextColor="#003f5c"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgot_button}>Forgot Password?</Text>
                </TouchableOpacity>

                <Button style={styles.loginBtn}
                    onPress={() => signInUser(email, password)}>
                    Login
                </Button>
            </View>
        </>
    )


    return (
        <Profile />
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
        marginBottom: 40,
        width: 200,
        height: 200
    },

    inputView: {
        backgroundColor: "#398378",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,

        alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },

    forgot_button: {
        height: 30,
        marginBottom: 30,
    },

    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#398378",
    },
});

export default SignIn;