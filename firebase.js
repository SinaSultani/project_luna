import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



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

export { firebase, auth, firestore }