import React from 'react';
import { View, Image, Text, StyleSheet, Button } from 'react-native';

const Settings = ({ navigation, children }) => {
    const Leaving = () => {
        navigation.navigate("Search", {
            screen: "Another Search",
            params: { testString: "VADSÄGSSÅ" }
        })
    }
    return (
        <View>
            <Button onPress={() => Leaving()} title="Yepp">Yepp</Button>
            <Text> The Settings </Text>
        </View>
    )
}

const styles = StyleSheet.create({});

export default Settings;