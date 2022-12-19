import React, { useContext, useEffect, useState} from 'react'
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableHighlight} from 'react-native'
import { UserContext, UserProvider } from '../providers/UserProvider';
import { firebase } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { FirebaseFirestore } from '@react-native-firebase/firestore';

const MessageView = ({ navigation}) => {
    
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const [ users, setUsers ] = useState([])
    
    useEffect(() => {

        // creating list user name because if we would just serUsers directly 
        // to our result from db, the data would not load because component is already mounted.
        let listUserName = [];

        const usersRef = firestore().collection('users').where("name", ">", "");
        usersRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                listUserName.push(doc.data());
            });
            setUsers(listUserName)
            setLoading(false)
        });
    }, [])
    
    const toMessage = () => {
        navigation.navigate("Message")
    }

if(loading) return <Text>Loading...</Text> 
    return (
        <SafeAreaView>
            <View>
                <Text>MessageView</Text>
                <View style={{ height: 600, width: "100%"}}>
                    { users.map((user) => {
                        return (
                            <TouchableHighlight
                                key={user.email}
                                activeOpacity={0.6}
                                underlayColor="#DDDDDD"
                                onPress={toMessage}>
                                <View key={user.email} style={styles.fieldView}>
                                    <Text style={styles.messageView} >{user.name}</Text>
                                </View>
                            </TouchableHighlight>
                        )})}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fieldView: {
        height: 80, 
        width: "100%"
    }, 
   messageView: {
    fontSize: 18,
    color: "black", 
   }, 
   shadow: {
    backgroundColor: "gray",
   }
})

 export default MessageView;