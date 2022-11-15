import React from 'react'
import { Text, View, SafeAreaView, ScrollView, Button } from 'react-native'

const TopUp = ({ navigation }) => {

    const toCompleteTopUp = () => {
      navigation.navigate('CompleteTopUp')
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ marginHorizontal: 15, marginBottom: 30 }}>
                    <Text style={{ fontSize: 30, color: "green" }}>
                        This is a place to top up your balance.
                        Follow the steps below please.
                    </Text>
                    <Button
                        title="Complete  Transfer  Here"
                        onPress={() => toCompleteTopUp()}
                    >
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
  
}

export default TopUp