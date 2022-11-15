import React from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet} from "react-native"

const SignIn = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.image} source={require("../assets/bosi-logo.png")} />
            <View style={{ height: 100}}>
                <Text style={{color: "red", fontSize: 30,}}>
                    SignIn Sheet Here 
                </Text>
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