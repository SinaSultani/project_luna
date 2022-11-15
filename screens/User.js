import React from 'react';
import { Text, View, SafeAreaView, ScrollView,  } from 'react-native'


const User = () => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ marginHorizontal: 15, marginBottom: 30 }}>
                    <Text style={{ fontSize: 30, color: "green" }}>
                        This is users profile
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

export default User