import React from 'react';
import { SafeAreaView, Text, View} from "react-native"

const SignIn = () => {
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{ height: 100}}>
                <Text style={{color: "red", fontSize: 30,}}>
                    SignIn Sheet Here 
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default SignIn