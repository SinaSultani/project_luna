import React, { createContext, useContext, useEffect, useRef, useState, useReducer, useCallback } from "react";
import firebase from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export const UserContext = createContext({});

function UserProvider({ children }) {
    const navigation = useNavigation();
    //const [user, dispatch] = useReducer(userReducer, []);
    const [user, setUser] = useState(null);
    const [loadingName, setLoadingName] = useState('');
    const [loading, setLoading] = useState();
    const [error, setError] = useState("");
    const [initializing, setInitializing] = useState(true);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const mountedRef = useRef(false);

    useEffect(async () => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, [])

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    }, [])

    function onAuthStateChanged(user) {
        // console.log("user inside onAuthStateChanged: ", user)
        setUser(user);
        if (initializing) setInitializing(false);
    }

    const createUserInFirestoreAfterSignUp = async (email, name) => {
        const authId = auth().currentUser.uid;
        await firestore().collection('users').doc(authId)
            .set({
                email: email,
                displayName: name
            })
            .then(() => console.log("created user: ", email, name))
            .catch(err => console.log("error creating user in firestore: ", err.message))
    };

    const registerUser = async (email, name, password) => {
        try {
            console.log(email, name, password)
            setLoadingName(name);
            setLoading(true);
            await auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    auth().currentUser.updateProfile({
                        displayName: name,
                    });
                })
                .catch(err => console.log("NOPE IN REGISTER: ", err.message))
                .finally(() => createUserInFirestoreAfterSignUp(email, name))
        } catch (err) {
            console.log("ERROR IN REGISTER USER!")
        }
    }

    const signInUser = async (email, password) => {
        try {
            console.log("email and password in signInUser: ", email, password)
            setLoading(true);
            setIsSigningIn(true);
            await auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    if (mountedRef.current) {
                        setIsSigningIn(false);
                    }
                })
        } catch (err) {
            if (mountedRef.current) {
                setIsSigningIn(false);
            }
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

    const editProfile = async () => {
        console.log("inside update profile");
        await auth().currentUser
    }

    const contextValue = {
        user,
        setUser,
        loading,
        error,
        initializing,
        loadingName,
        editProfile,
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
