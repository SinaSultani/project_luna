import React, { useContext, useEffect, useState, useRef } from 'react'
import { Text, View, SafeAreaView, ScrollView, Button, TextInput, Alert } from 'react-native'
import { UserContext } from '../providers/UserProvider'
import firestore from '@react-native-firebase/firestore'
import { PreventRemoveContext } from '@react-navigation/native'
import { get } from 'react-native/Libraries/Utilities/PixelRatio'


const TopUp = ({ navigation }) => {

    const { firestoreUID, getData, dbBalance } = useContext(UserContext)
    const inputRef = useRef();
    const [ amount, setAmount ] = useState("")
    const [ currentBalanceAmount, setCurrentBalanceAmount ] = useState()
    const currentUser = firestore().collection('users').doc(firestoreUID)
    const renderAmount = useRef(1)
   
    
    // useEffect(() => {
    //      getData()
    // }, [])


//        const currentBalance =  currentUser.onSnapshot(documentSnapshot => {
//        let fromDatabase = documentSnapshot.get('balance')
//        console.log("in useEffect", dbBalance)
//        setCurrentBalanceAmount(fromDatabase)
//        });
//         // setAmount(0)
// currentBalance()
    
    function amountIsValid(amount) {
        return /^[0-9\b]+$/.test(amount);
    }
        
    const topUpAccount = async () => {
        let balance = parseInt(dbBalance) + parseInt(amount);

        if (amount <= 0 || !amountIsValid(amount)) {
            return Alert.alert("Amount can not be 0 or text.")
        };

        await currentUser.update({
            balance: balance,
        })
            .then(() => {
                console.log('data type', amount);
                amount > 0 ? setAmount(0) : amount
            })
            .catch((error) => console.log("error in TopUp.js", error.message))
            .finally(() => navigation.navigate('CompleteTopUp'));
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ marginHorizontal: 15, marginBottom: 30 }}>
                    <Text style={{ fontSize: 30, color: "green" }}>
                        This is a place to top up your balance.
                        Follow the steps below please.
                    </Text>
                    <Text>Your current balance is {dbBalance} </Text>
                    <TextInput 
                        // ref={useRef(0)}
                        selectTextOnFocus={true}
                        placeholder="Amount to top up account with.."
                        placeholderTextColor="#003f5c"
                        keyboardType='number-pad'
                        value={amount.toString()}
                        onChangeText={(number) => setAmount(number)}
                    />
                    <Button
                        title="Complete  Transfer  Here"
                        onPress={() => topUpAccount()}
                    >
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
  
}

export default TopUp