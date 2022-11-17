import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import getAuth from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import SignIn from "./SignIn";
// import SignOut from "../components/SignOut";
// import signOut from "../components/SignOut";
//import SignIn from "./SignIn";

const Profile = ({ navigation, user }) => {

    const signOut = async () => {

        try {
            await auth()
                .signOut()
                .then(() => console.log("COMPLETE!"));

        } catch (err) {
            console.log("DID NOT SIGN OUT")
        }
    }
    const currentAuth = auth().onAuthStateChanged;
    // const currentAuth = getAuth().currentUser;
    // console.log("currentAuth: ", currentAuth)
    //USER ÄR TOM HÄR OM INTE SIGN IN SKICKAT IN DATA. VI MÅSTE KOLLA PÅ onAuthStateChanged om användaren är inloggad eller inte, om den inte är det, navigera till Sign In
    if (!currentAuth) {
        return (
            navigation.navigate('Sign In')
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <Image style={styles.avatar} source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }} />
            <View style={styles.body}>
                <View>
                    <Text style={styles.name}>{user.email}</Text>
                    <Text style={styles.info}>UX Designer / Mobile developer</Text>
                    <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Opcion 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Opcion 2</Text>
                    </TouchableOpacity>
                </View>
                <Button
                    onPress={signOut}>
                    Sign Out
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#00BFFF",
        height: 200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 130
    },
    name: {
        fontSize: 22,
        color: "#00BFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10
    },
    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
});

export default Profile;