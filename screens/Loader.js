import { Flex } from "native-base";
import React from "react";

import { Text, SafeAreaView, View, StyleSheet, Image } from "react-native";
// import {  } from "react-native-safe-area-context";


const Loader = ({ navigation }) => {

    return (
        <SafeAreaView>
            <View style={{ flex: 0 }}>
                <Image style={styles.image} source={require("../assets/half-moon.png")} />
            </View>
                <Text style={{textAlign: "center", fontWeight: "400"}}> Loading the profile </Text>
        </SafeAreaView>
    )
    
}


const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100, 
        alignSelf: "center"
    },
})

export default Loader;