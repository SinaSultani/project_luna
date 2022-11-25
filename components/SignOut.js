import React from 'react';
import auth from '@react-native-firebase/auth';
import SignIn from '../screens/SignIn';

const SignOut = ({ navigation }) => {

    const signOut = async () => {
        await auth()
            .signOut()
            .then(() => console.log('User signed out!'));

    }

}

export default SignOut