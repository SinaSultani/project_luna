import React, { useContext, useState } from 'react'
import firestore from '@react-native-firebase/firestore';


export const FirestoreUsersContext = React.createContext();

export const FirestoreUsersProvider = ({children}) => {
    

    const users = firestore().collection('users');

    // const getUsers = () => {
    //     for( let i=0; i < users)
    // }

    const data = {
        users
    }


    // return (
    //     <UserContext.Provider value={{email, setEmail, password, setPassword}}>
    //         {children}
    //     </UserContext.Provider>
    // )
    return (
        <FirestoreUsersContext.Provider value={data}>
            {children}
        </FirestoreUsersContext.Provider>
    )
};