import React from 'react';
import { View, Text, SafeAreaView} from "react-native"

const Terms = () => {
    return (
       
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ height: 100 }}>
                <Text style={{ color: "red", fontSize: 30, }}>
                    Terms of Use Here
                </Text>
            </View>
        </SafeAreaView>
    
    )
}

export default Terms