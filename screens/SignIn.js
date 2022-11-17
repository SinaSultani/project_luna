import React , {useEffect, useState} from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, Button, TextInput, Alert} from "react-native"
import auth from '@react-native-firebase/auth';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ logIn, setLogIn ] = useState(false)
    const [ initializing, setInitializing ] = useState(true)
    const [ user, setUser ] = useState({});

    console.log("user is", user)

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [])

    const signIn = async () => {
    try {
        if (email === "" || password === "") {
           return Alert.alert("Email or password cannot be empty.")
            
        }
        const { user } = await auth().signInWithEmailAndPassword(email, password);
        console.log("the signed in user: ", user)
        onAuthStateChanged(user)
        navigation.navigate('Profile');
        setLogIn(true)
        resetLogIn();
     
        // navigation.navigate('The Profile')
    } catch (err) {
        console.log("Not signed in")
    }
  }

    const resetLogIn = () => {
        if(logIn) {
            setTimeout(() => {
                setEmail("")
                setPassword("")
                }, 2000) 
        }
    }

    // if (!user) {
    //     return (
    //       <View>
    //          <Button
    //             title="Sign In"
    //             onPress={signIn}>
    //         </Button>
    //       </View>
    //     );
    // }



    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: "60%", alignContent: "center", alignSelf: "center"}}>
            <Image style={styles.image} source={require("../assets/bosi-logo.png")} />
                <Text style={{ color: "#099556", fontSize: 30, textAlign: "center", marginBottom: 30 }}>
                    Welcome!
                </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="email"
                    placeholderTextColor="#003f5c"
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                />
                <Button
                    title="Sign In"
                    onPress={signIn}>
                </Button>
                <Text
                    style={styles.signIn}
                    onPress={() => navigation.navigate('Register & Sign in')}
                > Register here </Text>
            </View>
        </SafeAreaView>
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
        marginBottom: 3,
        width: 200,
        height: 200, 
        alignSelf: "center"
    },
    signIn: {
        color: "blue",
        marginTop: 5
    },
    textInput: {
        marginTop: 3,
        marginBottom: 3,
        borderWidth: 1,
        borderRadius: 5
    },
})
export default SignIn