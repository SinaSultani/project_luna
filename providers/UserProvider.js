import React, { useContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

export const UserContext = React.createContext();

export const UserProvider = ({children}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [ loggedIn, setLoggedIn ] = useState(false)
    const [ initializing, setInitializing ] = useState(true)
    const [ user, setUser ] = useState({});
    const [ balance, setBalance ] = useState(0)
    const [ firestoreUID, setFirestoreUID ] = useState('')

    
const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
};

useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
}, [])
 

const createUser = async () => {
try {
    const { user } = await auth().createUserWithEmailAndPassword(email, password);
    onAuthStateChanged(user)
   
   if (user) {
    navigation.navigate('Profile')
    setLoggedIn(true)
    setFirestoreUID(user.uid)
    firestore().collection('users')
    .doc(user.uid)
    .set({
         email: email,
         name: "",
         balance: 0,
     })
    }

} catch (err) {
    console.log("NOPE, NOT CREATED")
}
}

const signIn = async () => {
    try {
        if (email === "" || password === "") {
           return Alert.alert("Email or password cannot be empty.")
        }
        const { user } = await auth().signInWithEmailAndPassword(email, password);
        
        onAuthStateChanged(user)
        
        if (user) {
            console.log("auth UID", user.uid)
        }
        setFirestoreUID(user.uid)
        // navigation.navigate('Profile');
        setLoggedIn(true)

    } catch (err) {
        console.log("Not signed in")
    }
  }

const signOut = async () => {
    // setPassword(""); 
    // setEmail("");
    await firebase.auth().signOut().then(() => {
        // setLoggedIn(false)
        navigation.navigate('Sign In');
        console.log("user is", users);
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
        onAuthStateChanged
    }


    // return (
    //     <UserContext.Provider value={{email, setEmail, password, setPassword}}>
    //         {children}
    //     </UserContext.Provider>
    // )
    return (
        <UserContext.Provider value={thisUser}>
            {children}
        </UserContext.Provider>
    )
};