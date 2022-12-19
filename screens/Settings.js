import React, { useState, useContext } from 'react'
import { SafeAreaView, Text, View, Image, StyleSheet, Switch, TextInput} from 'react-native'
import { UserContext } from '../providers/UserProvider'
import firestore from '@react-native-firebase/firestore'

const Settings = () => {

const {  windowHeight, windowWidth, userEmail, setUserEmail, title, setTitle, name, setName, lastName, 
    setLastName, dob, setDob, firestoreUID  } = useContext(UserContext)
const [ edit, setEdit ] = useState(false)
const [ isEnabled, setIsEnabled ] = useState(false)

const currentUserId = firestore().collection('users').doc(firestoreUID)
console.log("dob", dob)
// making a query to get user details from firestore
let currentUserData;
firestore()
  .collection('users')
  .doc(firestoreUID)
  .get()
  .then( documentSnapshot => {
    currentUserData = documentSnapshot.data()
});


const onToggleSwitch = () => {
    setIsEnabled(prevState => !prevState)
}

const handleEditField = () => {
    setEdit( true )
} 

// updating database with personal details, 
const handleSaveChanges = async () => {
    setEdit(false)

    // adding new fields to database
    if (typeof currentUserData.lastName === "undefined" 
        &&  typeof currentUserData.dob === "undefined" 
        && typeof currentUserData.title === "undefined") {
       
    await currentUserId.set({
        ...currentUserData,
        lastName: lastName,
        dob: dob,
        title: title,
        works: "works"
    })
    } else {
        console.log("not the match")
    }

    await currentUserId.update({
        name: name,
        lastName: lastName,
        dob: dob,
        title: title,
    })
        .catch((error) => console.log("ERROR in settings.js", error.message) )

}

return (
    <SafeAreaView>
        <View style={{ padding: 10, height: windowHeight, alignSelf: "center", fontSize: 20 }}>

            <View style={[styles.field, { width: 255 }]}>
                <Text style={{ fontSize: 18 }}>Dark Mode </Text>
                <Switch
                    style={{ marginLeft: 15 }}
                    trackColor={{ false: "#767577", true: "#a177fc" }}
                    thumbColor={isEnabled ? "#7954d1" : "#f4f3f4"}
                    onValueChange={onToggleSwitch}
                    value={isEnabled}
                />
            </View>


            <View style={[styles.field, { marginTop: 30 }]} >

                {!edit
                    ? <Text style={{ fontSize: 18 }}>Name: {name}</Text>
                    :
                    <View style={styles.editView}>
                        <Text style={{ fontSize: 18 }}>Name: </Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder='name'
                            value={name}
                            onChangeText={(name) => setName(name)}
                        />
                    </View>
                }
            </View>

            <View style={styles.field} >
                {!edit
                    ? <Text style={{ fontSize: 18 }}>Surname: {lastName} </Text>
                    :
                    <View style={styles.editView}>
                        <Text style={{ fontSize: 18 }}>Surname: </Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder='surname'
                            value={lastName}
                            onChangeText={(lastName) => setLastName(lastName)}
                        />
                    </View>
                }
            </View>
            <View style={styles.field} >

                {!edit
                    ? <Text style={{ fontSize: 18 }} >Year of Birth: {dob}</Text>
                    :
                    <View style={styles.editView}>
                        <Text style={{ fontSize: 18 }}>Year of Birth: </Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder='year of birth'
                            value={dob}
                            onChangeText={(dob) => setDob(dob)}
                        />
                    </View>
                }
            </View>
            <View style={styles.field} >
                {!edit
                    ? <Text style={{ fontSize: 18 }}>Title: {title}</Text>
                    :
                    <View style={styles.editView}>
                        <Text style={{ fontSize: 18 }}>Title: </Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder='Title'
                            value={title}
                            onChangeText={(title) => setTitle(title)}
                        />
                    </View>
                }

            </View>

            <View style={styles.field} >
                <Text style={{ fontSize: 18 }}>Email: {userEmail} </Text>
            </View>

            <View style={styles.field}>

                {!edit
                    ? <View style={[styles.field, { marginTop: 25}]} onTouchEnd={handleEditField}>
                        <Text style={{ fontSize: 18 }}>Edit personal details </Text>
                        <Image style={styles.editButton} source={require("../assets/edit.png")} />
                    </View>
                    : <View onTouchEnd={handleSaveChanges}>
                        <Image style={styles.confirmChanges} source={require("../assets/ok.png")} />
                    </View>
                }
            </View>

        </View>

    </SafeAreaView>
)
}

const styles = StyleSheet.create({
    editButton: {
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
    field: {
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-between", 
        width:250, 
        marginTop: 10,
        
    },
    editView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    }, 
    inputField: {
        fontSize: 16,
    },
    confirmChanges: {
        alignSelf: "center",
        alignContent: "center",
        marginLeft: "50%",
        marginTop: 40,
        width: 40,
        height: 40,
    }
})


export default Settings

