import React, { createContext, useSetState, useContext, useEffect, useRef, useState, useReducer, useCallback } from "react";
import firebase from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const UserContext = createContext({});

function UserProvider({ children }) {
    const navigation = useNavigation();
    //const [user, dispatch] = useReducer(userReducer, []);
    const [user, setUser] = useState(null);
    const [loadingName, setLoadingName] = useState('');
    const [loading, setLoading] = useState();
    const [profileImg, setProfileImg] = useState("");
    const [error, setError] = useState("");
    const [initializing, setInitializing] = useState(true);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [updated, setUpdated] = useState(false);
    const mountedRef = useRef(false);
    const [url, setUrl] = useState("");
    let storagePath = "";
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, [])
    const onAuthStateChanged = async (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    }
    useEffect(() => {
        if (user) {
            setUrl(user.photoURL)
        }
    }, [url, updated])

    const UploadImage = async (user, filePath) => {
        try {
            const reference = storage().ref(user.uid);
            await reference.putFile(filePath);
            //setUrl(await storage().ref(user.uid).getDownloadURL());
            storagePath = await storage().ref(user.uid).getDownloadURL();
            setUrl(storagePath);
            console.log("url in uploadImage: ", url)
            await auth().currentUser.updateProfile({
                photoURL: storagePath
            })
            console.log("user before in uploadImage: ", user)
            setUpdated(true);
        } catch (err) {
            console.log("Error: ", err.message);
        }
    }

    const DownloadUserImage = async (user) => {
        try {
            return await storage().ref(user.uid).getDownloadURL();
        } catch {
            return null
        }
    }

    const registerUser = async (email, name, password) => {
        console.log(email, name, password)
        setLoadingName(name);
        setLoading(true);
        await auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                auth().currentUser.updateProfile({
                    displayName: name,
                    photoURL: "https://gravatar.com/avatar/9cbca7bb32eb6d774eb67a0911b9c7cf?s=600&d=robohash&r=x"
                });
            })
            .catch(err => console.log("NOPE IN REGISTER: ", err.message))
            .finally(() => createUserInFirestoreAfterSignUp(email, name))
    }

    const createUserInFirestoreAfterSignUp = async (email, name) => {
        const authId = auth().currentUser.uid;
        console.log("authId: ", authId)
        console.log("currentUser: ", auth().currentUser)
        await firestore().collection('users').doc(authId)
            .set({
                email: email,
                displayName: name
            })
            .then(() => console.log("created user: ", email, name))
            .catch(err => console.log("error creating user in firestore: ", err.message))
            .finally(() => setUrl("https://gravatar.com/avatar/9cbca7bb32eb6d774eb67a0911b9c7cf?s=600&d=robohash&r=x"))
    };

    const signInUser = async (email, password) => {
        try {
            console.log("email and password in signInUser: ", email, password)
            await auth().signInWithEmailAndPassword(email, password)
                .then(() => setUrl(auth().currentUser.photoURL))
                .finally(() => console.log("signed in user: ", auth().currentUser))
        } catch (err) {
            console.log("error signing in in catch: ", err.message)
        }
    }

    const logoutUser = async () => {
        try {
            await auth().signOut()
        } catch (err) {
            console.log("Error in logout catch", err.message)
        }
    }

    const forgotPassword = (email) => {
        auth().sendPasswordResetEmail(email);
    }

    const contextValue = {
        user,
        setUser,
        loading,
        error,
        url,
        initializing,
        loadingName,
        UploadImage,
        DownloadUserImage,
        registerUser,
        createUserInFirestoreAfterSignUp,
        signInUser,
        logoutUser,
        forgotPassword,
    };
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider;
