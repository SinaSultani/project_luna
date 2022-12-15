import React, { useEffect, useContext } from 'react';
import { View, Button } from 'react-native';
import { auth } from '../firebase';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

const UploadImage = async (user, filePath) => {
    try {
        const reference = storage().ref(user.uid);
        await reference.putFile(filePath);
        const url = await storage().ref(user.uid).getDownloadURL();
        console.log("url in uploadImage: ", url)
        await auth().currentUser.updateProfile({
            photoURL: url,
        });
        return url;
    } catch (err) {
        console.log("Error: ", err.message);
    }
}



export { UploadImage }