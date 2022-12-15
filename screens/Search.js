import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const Search = ({ navigation, route, children }) => {
    useEffect(() => {
        console.log("route in search: ", route)
    }, [route])
    return (
        <View>
            <Text> The Search Page </Text>
        </View>

    )
}

const styles = StyleSheet.create({});

export default Search;