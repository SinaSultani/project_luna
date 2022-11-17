import React , {useState} from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, Button, TextInput} from "react-native"
import auth from '@react-native-firebase/auth';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const signIn = async () => {
    try {
        const { user } = await auth().signInWithEmailAndPassword(email, password);
        console.log("the signed in user: ", user)
        // navigation.navigate('The Profile')
    } catch (err) {
        console.log("Not signed in")
    }
  }
    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.image} source={require("../assets/bosi-logo.png")} />
            <View style={{ height: 100}}>
                <Text style={{color: "red", fontSize: 30,}}>
                    SignIn Sheet Here 
                </Text>
                <TextInput
                style={styles.TextInput}
                placeholder="Email."
                placeholderTextColor="#003f5c"
                value={email}
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput
                placeholder="Password."
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                value={password}
                onChangeText={(password) => setPassword(password)}
            />

                <Button
                    title="Sign In"
                    onPress={signIn}>
                </Button>
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
        marginBottom: 40,
        width: 200,
        height: 200
    }
})
export default SignIn