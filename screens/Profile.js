import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from "../context/UserProvider";
import { firestore } from "../firebase";
import Loader from "./Loader";

const Profile = ({ navigation, route }) => {
    const [url, setUrl] = useState('');
    const [dbUser, setDbUser] = useState('');
    const { user, loadingName, logoutUser } = useContext(UserContext);
    useEffect(async () => {
        if (user) {
            setUrl(user.photoURL)
        }
    }, [url])

    useEffect(async () => {
        if (user) {
            setDbUser(await firestore().collection("users").doc(user.uid).get());
        }
    }, [dbUser])

    const ToEdit = () => {
        try {
            return navigation.navigate("Edit Profile");
        }
        catch (err) {
            alert(err.message)
        }
    }
    if (!url) { return <Loader /> }
    if (!dbUser) { return <Loader /> }
    return (
        <>
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.header}></View>
                    <Image style={styles.avatar} source={{ uri: user?.photoURL }} />
                    <View style={styles.body}>
                        <View style={styles.bodyContent}>
                            <Text style={styles.name}>{user?.email}</Text>
                            <Text style={styles.name}>{user?.displayName || loadingName}</Text>
                            <Text style={styles.info}>{dbUser._data.occupation}</Text>
                            <Text style={styles.description}>{dbUser._data.biography}</Text>
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
        backgroundColor: "#398378",
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    bodyContent: {
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
        color: "#398378",
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
        color: "white",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: "#398378",
    },
});

export default Profile;