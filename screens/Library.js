import React, { useContext } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { UserContext } from "../context/UserProvider";

const Library = ({ navigation, children }) => {
    const { user, logoutUser, loadingName } = useContext(UserContext);
    return (
        <View>
            <Text> The Library </Text>
        </View>
    )
}

const styles = StyleSheet.create({});

export default Library;