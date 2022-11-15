import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const TermsComplete = ( {navigation} ) => {

  const handleBack = () => {
    return navigation.goBack()
  }


  return (
    <SafeAreaView style={styles.wrapper}>
         <Text style={styles.text}>Here you can read about the terms for mobile app development</Text>
         <Text onPress={() => handleBack()} style={styles.exit}> X </Text>

    </SafeAreaView>   
  )
}

const styles = StyleSheet.create({
    wrapper: {
        display:"flex", 
        flexDirection: "row", 
        justifyContent:"space-between"
    },
    text: {
        flex:1, 
        marginTop: 50, 
        textAlign: "center"
    },
    exit: {
        textDecorationLine: 'underline', 
        color: "blue", 
        fontSize: 30
    }
})

export default TermsComplete