import { Link } from '@react-navigation/native';
import React from 'react';
import { View, Text, SafeAreaView, Button, StyleSheet} from "react-native"

const Terms = ({navigation}) => {

    const toTermsComplete = () => {
      return navigation.navigate('TermsComplete')
    }
    const handleBack = () => {
        return navigation.goBack()
      }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.wrapper}>
                <Text style={{ color: "red", fontSize: 30, }}>
                    Terms of Use Here
                </Text>
                <Text onPress={() => handleBack()} style={styles.exit}> X </Text>
            </View> 
                <Button title="Here" style={{width: "40px"}} onPress={() => toTermsComplete()}>
                    To Open tap here!
                </Button>
           
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


export default Terms

// skapa component TermsComplete och kasta den i stack