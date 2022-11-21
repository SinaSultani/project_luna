import React, { useContext }  from 'react';
import { SafeAreaView, Text, View, StyleSheet, StatusBar, Button} from "react-native"
import  { UserContext } from '../providers/UserProvider'


const Balance = ( {navigation} ) => {

    const toTopUp = () => {
        return navigation.navigate('TopUp')
    }

    const { email, user, balance, loggedIn } = useContext(UserContext);
    console.log(user)
    
    return (
        
        <SafeAreaView style={{ flex: 1 }}>
            {!loggedIn  ?
                <View style={{ height: "100%" }}>
                    <Text style={{ fontSize: 20, }} onPress={() => navigation.navigate('Sign In')}>
                        Please Log In to see your balance
                    </Text>
                </View> 
                    :  
                <View>
                    <Text>
                        Hello {email}, your current balance is {balance} kr.
                        If you want to top up your account, please tap here.
                    </Text>
                    <Button
                        title='here'
                        onPress={() => toTopUp()}
                    />
                </View>
            }
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