import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, StatusBar, Button} from "react-native"



const Balance = ( {navigation} ) => {

    const toTopUp = () => {
        return navigation.navigate('TopUp')

    }
    
    return (
        
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ height: "100%" }}>
                <Text style={{ color: "red", fontSize: 30, }}>
                    Your Balance is 1kr.
                </Text>
                <Text style={{fontSize: 20}}>
                    You can top up your balance
                    <Button
                        title='here'
                        onPress={() => toTopUp()}
                    >

                    </Button>
                </Text>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });
  

export default Balance