import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAs6C5VQ4XQqkB-avBvr0OoTMz-ltCYLyU',
    projectId: 'bosi-e158f',
    storageBucket: 'bosi-e158f.appspot.com',
    appId: '1:462327531953:ios:3a75e817573c9830439590'
}



const sendEmailVerification = async () => {

    if (auth().currentUser) {
        try {
            await auth().currentUser.sendEmailVerification({
                handleCodeInApp: false,
                url: "https://bosi-e158f.web.app",
                android: {
                    installApp: true,
                    packageName: "com.project_luna",
                },
                dynamicLinkDomain: "bosie158ff.page.link",
            });
            // console.log('Verification email sent!');
            return Promise.resolve(true);
        } catch (error) {
            // console.error('Could not send verification email. ', error);
            return Promise.resolve(false);
        }

    }
};

export { firebase, auth, firestore, firebaseConfig }