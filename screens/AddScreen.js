import React, { useContext } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { UserContext } from "../context/UserProvider";

const AddSCreen = ({ navigation, children }) => {
    const { user, logoutUser, loadingName } = useContext(UserContext);
    return (
        <View>
            <Text> Add Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({});

export default AddSCreen;