import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import getAuth from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
// import SignIn from "./SignIn";
import { UserContext } from "../context/UserProvider";
import { firestore } from "../firebase";
import { useNavigation } from '@react-navigation/native';
import { DownloadUserImage } from '../context/UserProvider';
import Loader from "./Loader";

const Profile = ({ navigation, route }) => {
    const [newUrl, setNewUrl] = useState("");
    const [url, setUrl] = useState('');
    const { user, loadingName, DownloadUserImage, logoutUser } = useContext(UserContext);
    console.log("user in profile: ", user)
    useEffect(async () => {
        if (user) {
            setUrl(user.photoURL)
        }
    }, [url])

    useEffect(async () => {
        const dbUser = await firestore().collection("users").doc(user.uid).get();
        // console.log("dbUser in profile: ", dbUser)
    }, [])

    const ToEdit = () => {
        try {
            return navigation.navigate("Edit Profile");
        }
        catch (err) {
            alert(err.message)
        }
    }
    // if (!url) { return <Loader /> }
    return (
        <>
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.header}></View>
                    <Image style={styles.avatar} source={{ uri: url }} />

                    <View style={styles.body}>
                        <View>
                            <Text style={styles.name}>{user?.email}</Text>
                            <Text style={styles.name}>{user?.displayName || loadingName}</Text>
                            <Text style={styles.info}>UX Designer / Mobile developer</Text>
                            <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
                            <Button style={styles.buttonContainer}
                                onPress={() => ToEdit()}>
                                Edit Profile
                            </Button>
                        </View>
                        <Button
                            onPress={() => logoutUser()
                            }>
                            Sign Out
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </>
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
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
        justifyContent: 'center'
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10,
        textAlign: 'center'
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
});

export default Profile;