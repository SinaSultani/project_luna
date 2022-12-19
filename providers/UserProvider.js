import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database'
import { Database } from 'firebase/database';
import { Dimensions } from 'react-native';

export const UserContext = React.createContext();

export const UserProvider = ({children}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [ loggedIn, setLoggedIn ] = useState(false)
    const [ initializing, setInitializing ] = useState(true)
    const [ user, setUser ] = useState({});
    const [ firestoreUID, setFirestoreUID ] = useState('')
    const [userEmail, setUserEmail]  = useState("")
    const [dbBalance, setDbBalance] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [dob, setDob] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profilePicture, setProfilePicture] = useState("logo");


useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
}, [])

// let profilePicturePath;
// is this a "bad practice" to have so much data loading on the start?
useEffect(() => {
    if (user) {
        
    setFirestoreUID(user.uid)
    setIsLoading(true)
    const currentUser = firestore().collection('users').doc(user.uid)

    currentUser.onSnapshot(documentSnapshot => {
    let databaseuserEmail =   documentSnapshot.get('email')
    let balance = documentSnapshot.get('balance')
    let name = documentSnapshot.get('name');
    let lastName = documentSnapshot.get('lastName');
    let dob = documentSnapshot.get('dob');
    let title = documentSnapshot.get('title');
    let profilePicture = documentSnapshot.get('profileImagePath');

    setDbBalance(balance)
    setLoggedIn(true)
    setUserEmail(databaseuserEmail)    
    setIsLoading(false)
    setTitle(title)
    setDob(dob)
    setName(name)
    setLastName(lastName)
    setProfilePicture(profilePicture)
    console.log("new firebase call in useEffect")
    });
}
   }, [userEmail, profilePicture])
// ovo user email nije dobar parametar jer ako se izlogujemo pa opet ulogujemo ostaju stari podatci valjda
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


// We do not have to call for this function, it listens to changes all the time
const onAuthStateChanged = async (user) => {
   await setUser(user);
    if (initializing) setInitializing(false);
};


 

const createUser = async () => {
try {
    const { user } = await auth().createUserWithEmailAndPassword(email, password);
    onAuthStateChanged(user)
   
   if (user) {
    setLoggedIn(true)
    setFirestoreUID(user.uid)
    firestore().collection('users')
    .doc(user.uid)
    .set({
         name: name,
         lastName: lastName,
         dob: dob,
         title: title,
         email: email,
         balance: 0,
     })
    }

} catch (err) {
    console.log("NOPE, NOT CREATED")
}
}
// userEmail =  firestore().collection('users').doc(user.uid)
// If we put theese functions into UserProvider and make them global
// than we can not use navigation.navigate() from here but in App.js in return  
// we check if there is a user if(!user) <Sign/> else <Profile/> type of logic
const signIn = async () => {
    try {
        if (email === "" || password === "") {
           return Alert.alert("Email or password cannot be empty.")
        }
        const { user } = await auth().signInWithEmailAndPassword(email, password);
        
        if (user) {
            setLoggedIn(true)
            setFirestoreUID(user.uid)

            const userRef = firestore().collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            const userProfilePicture = userDoc.get('profileImagePath');

            // const userProfilePicture = await firestore().collection('users').doc(user.uid).documentSnapshot.get('profileImagePath')
            console.log("user PP ", userProfilePicture)
            setProfilePicture(userProfilePicture)
        }
    } catch (err) {
        console.log("Not signed in")
    }
  }

const signOut = async () => {
    setPassword(""); 
    setEmail("");
    setProfilePicture("logo");
    setUser(undefined)
    await firebase.auth().signOut().then(() => {
        setLoggedIn(false)
        setUserEmail("");
      }).catch((error) => {
        console.log(error)
    });
  }


    const thisUser = {
        email, 
        setEmail,
        password,
        setPassword,   
        user, 
        setUser,
        loggedIn,
        setLoggedIn, 
        firestoreUID, 
        setFirestoreUID,
        createUser,
        signOut, 
        signIn,
        onAuthStateChanged,
        userEmail,
        setUserEmail, 
        dbBalance,
        initializing,
        isLoading,
        windowHeight,
        windowWidth, 
        title, 
        setTitle, 
        name,
        setName,
        dob, 
        setDob,
        lastName, 
        setLastName, 
        profilePicture,
    
    }
console.log(profilePicture)
    return (
        <UserContext.Provider value={thisUser}>
            {children}
        </UserContext.Provider>
    )
};


// Zapazanja: 
// 1. Komplikovano je sve sto se tice cuvanja e-maila cini mi se.