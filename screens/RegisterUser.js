import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    Image,
    Modal,
    Alert,
    TouchableOpacity,
} from "react-native";
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { UserContext } from '../context/UserProvider';
import { emailIsValid, passwordIsValid, confirmPasswordIsValid, nameIsValid } from '../utilities/validation';

const Register = ({ navigation, route }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogText, setDialogText] = useState();
    const [visible, setVisible] = useState(false);
    const { registerUser, user } = useContext(UserContext);


    // useEffect(() => {
    //     if (route.params) {
    //         setProfileImg(route?.params?.thePath);
    //     }
    // }, [route?.params?.thePath])

    const ToProfile = () => {
        return navigation.navigate('Profile', {
            screen: 'Another Profile'
        });
    }

    const showDialog = (text) => {
        setDialogText(text);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const checkRegistrationValidation = (email, name, password, confirmPassword) => {
        console.log("the passwords: ", password, confirmPassword)
        if (!nameIsValid(name)) {
            showDialog("Please enter a valid name.");
        }
        else if (!emailIsValid(email)) {
            showDialog("Invalid Email. Please retry using a correct email address.")
        }
        else if (!passwordIsValid(password)) {
            showDialog("Your password needs at least 6 characters.")
        }
        else if (!confirmPasswordIsValid(password, confirmPassword)) {
            showDialog("Your passwords do not match.")
        }
        else {
            registerUser(email, name, password);
        }
    }
    return (
        <>
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
                    onPress={() => checkRegistrationValidation(email, firstName + " " + lastName, password, confirmPassword)}>
                    Register
                </Button>
            </View>
            <SafeAreaView>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                        <Dialog.Content>
                            <Paragraph>{dialogText}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
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
    modalContent: {
        width: 350,
        height: 250,
        marginTop: '50%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: 'white',
        elevation: 20,
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    uploadButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: '#ffb6b9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
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