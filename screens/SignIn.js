import React, { useState, useEffect, useContext, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import Profile from "./Profile";
import { UserContext } from '../context/UserProvider';
import { useNavigation } from '@react-navigation/native';
import Loader from "./Loader";



function SignIn({ navigation }) {
    const inputRef = useRef();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState('');

    const { signInUser, user, initializing, forgotPassword } = useContext(UserContext);

    // useEffect(() => {
    //     // console.log("changes in initializing in SignIn; ", initializing)
    // }, [initializing])

    const ToProfile = () => {
        try {
            return navigation.navigate('Profile');
        } catch (err) {
            console.log("error navigating from SignIn to Profile: ", err.message)
        }
    }

    if (initializing) return <Loader />

    return (
        <>

            <View style={styles.container}>
                <Image style={styles.image} source={require("../assets/bosi-logo.png")} />
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        ref={inputRef}
                        value={email}
                        placeholder="Email."
                        placeholderTextColor="#003f5c"
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
                <TouchableOpacity>
                    <Button style={styles.forgot_button}
                        onPress={() => forgotPassword(email)}>Forgot Password?</Button>
                </TouchableOpacity>
                <Button style={styles.loginBtn}
                    onPress={() => signInUser(email, password)
                    }>
                    Login
                </Button>
            </View>
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
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#398378",
    },
});

export default SignIn;