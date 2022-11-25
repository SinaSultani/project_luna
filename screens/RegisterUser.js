import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import firebase from '@react-native-firebase/app';
import getAuth from '@react-native-firebase/auth';
import { UserContext } from '../context/UserProvider';
import Profile from './Profile';

const Register = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { registerUser, user } = useContext(UserContext);
    const ToProfile = () => {
        return navigation.navigate('Profile', {
            screen: 'Another Profile'
        });
    }

    return (
        <>
            {!user ? (
                <View style={styles.container}>
                    <Image style={styles.image} source={require("../assets/bosi-logo.png")} />
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="First name."
                            placeholderTextColor="#003f5c"
                            value={firstName}
                            onChangeText={(firstName) => setFirstName(firstName)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Last name."
                            placeholderTextColor="#003f5c"
                            value={lastName}
                            onChangeText={(lastName) => setLastName(lastName)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Email."
                            placeholderTextColor="#003f5c"
                            value={email}
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>

                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Password."
                            placeholderTextColor="#003f5c"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Confirm Password."
                            placeholderTextColor="#003f5c"
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                        />
                    </View>

                    <Button style={styles.loginBtn}
                        onPress={() => registerUser(email, firstName + " " + lastName, password)}>
                        Register
                    </Button>
                </View>
            ) : (
                <Profile navigation={navigation} />
            )}
        </>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        marginBottom: 40,
        width: 200,
        height: 200
    },

    inputView: {
        backgroundColor: "#398378",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,

        alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },

    forgot_button: {
        height: 30,
        marginBottom: 30,
    },

    loginBtn: {
        width: "50%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#398378",
    },
});

export default Register;