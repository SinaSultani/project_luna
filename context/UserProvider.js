import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from '@react-native-firebase/app';
import getAuth from '@react-native-firebase/auth';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { auth } from '../firebase';

export const UserContext = createContext();

// export const useUserContext = () => useContext(UserContext);

function UserProvider({ navigation, children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState();
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true)
        const unsubscribe = auth().onAuthStateChanged((res) => {
            res ? setUser(res) : setUser(null)
            setError("");
            setLoading(false);
        });
        return unsubscribe;
    }, [])

    const registerUser = (email, name, password) => {
        setLoading(true);
        auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                updateProfile(auth, {
                    displayName: name,
                });
            }).then(res => navigation.navigate('The Profile'))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }

    const signInUser = (email, password) => {
        setLoading(true);
        auth().signInWithEmailAndPassword(email, password)
            .then(res => navigation.navigate('The Profile'))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }

    const logoutUser = () => {
        signOut(auth);
    }

    const forgotPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    const contextValue = {
        user,
        loading,
        error,
        registerUser,
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
