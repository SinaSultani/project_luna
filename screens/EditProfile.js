import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from '../context/UserProvider';
import { occupation } from '../utilities/occupations';
import {
    StyleSheet,
    SafeAreaView,
    Text,
    Alert,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Modal,
    ScrollView,
    Pressable
} from 'react-native';
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { auth } from '../firebase';
import { firestore } from '../firebase';
// import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import { SelectList } from 'react-native-dropdown-select-list';
//import * as ImagePicker from "react-native-image-picker";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import Camera from '../components/Camera';
import moment from 'moment';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import Loader from "./Loader";

const EditProfile = ({ route, navigation }) => {

    const { user, loadingName, forgotPassword, createUserInFirestore, editProfile, DownloadUserImage, UploadImage } = useContext(UserContext);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [birthday, setBirthday] = useState(new Date());
    const [biografi, setBiografi] = useState("");
    const [job, setJob] = useState("");
    const [imagePath, setImagePath] = useState(null);
    const [imageUri, setImageUri] = useState('');
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [open, setOpen] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [visible, setVisible] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const [url, setUrl] = useState('');
    console.log("user in editprofile::: ", user)

    useEffect(async () => {
        if (user) {
            setUrl(user.photoURL)
        }
    }, [url, updated])

    const uploadProfileToDb = async () => {
        try {
            await firestore().collection('users').doc(user.uid).set({
                displayName: newName,
                email: newEmail,
                biography: biografi,
                birthday: birthday,
                occupation: job,
                profileImg: imagePath
            })
            await UploadImage(user, imagePath)
                .then(() => setUpdated(true))
                .catch(() => console.log("error: ", err.message));
        } catch (err) {
            console.log("error: ", err.message);
        }
    }

    const uploadFileToStorage = async () => {

    }

    const openCamera = () => {
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: true,
        };
        launchCamera(options, response => {
            //console.log("Response URI = ", response.assets[0].uri);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                //You can also display the image using data:
                const source = { uri: 'data:image/jpeg;base64,' + response.base64 };
                setImageUri(source);
                setImagePath(response.assets[0].uri)
            }
        });
    }


    const openGallery = () => {
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: true,
        };
        launchImageLibrary(options, response => {
            // console.log("Response = ", response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                //You can also display the image using data:
                const source = { uri: 'data:image/jpeg;base64,' + response.base64 };
                setImageUri(source);
            }
        });
    }
    if (!url) { return <Loader /> }
    return (
        <ScrollView>
            <SafeAreaView style={styles.droidSafeArea}>
                <View style={styles.container}>
                    <View style={styles.header}></View>
                    <Image style={styles.avatar} source={{ uri: url }} />
                    <View style={styles.body}>
                        <View>
                            <Text style={styles.name}>{user?.email}</Text>
                            <Text style={styles.name}>{user?.displayName || loadingName}</Text>
                            <TextInput
                                placeholder="Edit Display name"
                                value={newName}
                                onChangeText={(newName) => setNewName(newName)} />
                            <TextInput
                                placeholder="Edit email"
                                value={newEmail}
                                onChangeText={(newEmail) => setNewEmail(newEmail)} />
                            <TextInput
                                placeholder="Tell people about yourself!"
                                value={biografi}
                                onChangeText={(biografi) => setBiografi(biografi)} />
                            <View>
                                <SelectList
                                    data={occupation}
                                    setSelected={(val) => setJob(val)}
                                    save="value" />
                            </View>
                            <Button onPress={() => setOpen(true)}>Set your birthday</Button>
                            <DatePicker
                                modal
                                open={open}
                                mode="date"
                                date={birthday}
                                onConfirm={(birthday) => {
                                    setOpen(false)
                                    setBirthday(birthday)
                                }}
                                onCancel={() => {
                                    setOpen(false)
                                }} />

                            {/* <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
                                <Text style={styles.buttonText}>Pick an image</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity style={styles.uploadButton}
                                onPress={() => setVisible(true)}>
                                <Text style={styles.buttonText}>Change your profile picture</Text></TouchableOpacity>
                            <Modal
                                visible={visible}
                                style={styles.modal}
                                transparent={true}
                                onRequestClose={() => {
                                    Alert.alert("Modal has been closed.");
                                    setVisible(!visible);
                                }}
                            >

                                <View style={styles.modalContent}>
                                    <TouchableOpacity style={styles.uploadButton}
                                        // onPress={() => { navigation.navigate('Camera', { from: "Edit Profile" }); setVisible(false) }}>
                                        onPress={openCamera}>
                                        <Text style={styles.buttonText}>Open Camera</Text></TouchableOpacity>
                                    {/* <TouchableOpacity style={styles.uploadButton}
                                        onPress={() => navigation.navigate("HomeTabAuthed", {
                                            screen: "Profile",
                                            params: { prase: "HELLO" }
                                        })}>
                                        <Text style={styles.buttonText}>Upload Image</Text></TouchableOpacity> */}
                                    <TouchableOpacity style={styles.uploadButton}
                                        onPress={openGallery}>
                                        <Text style={styles.buttonText}>Open Gallery</Text></TouchableOpacity>
                                    <Button style={{ marginTop: '10%' }} onPress={() => setVisible(false)}>Close</Button>
                                </View>
                            </Modal>
                            <View>



                                {/* {image !== null ? (
                                    <Image source={{ uri: image.uri }} style={styles.imageBox} />
                                ) : null}
                                {uploading ? (
                                    <View style={styles.progressBarContainer}>
                                        <Progress.Bar progress={transferred} width={300} />
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                                        <Text style={styles.buttonText}>Upload image</Text>
                                    </TouchableOpacity>
                                )} */}


                                <Button
                                    onPress={() =>
                                        uploadProfileToDb(newName, biografi, job, birthday)
                                    }>
                                    Save changes
                                </Button>
                                <Button
                                    onPress={() =>
                                        DownloadUserImage(user)
                                    }>
                                    Get URL
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#bbded6'
    },
    selectButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: '#8ac6d1',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        padding: 10,
        color: 'black',
    },
    uploadButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: '#ffb6b9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    modalContent: {
        width: 350,
        height: 250,
        marginTop: '50%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: 'white',
        elevation: 20,
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    closingTag: {

    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center'
    },
    progressBarContainer: {
        marginTop: 20
    },
    imageBox: {
        width: 300,
        height: 300
    },
    imageStyle: {
        width: 200,
        height: 200,
        margin: 5,
    },
    header: {
        backgroundColor: "#00BFFF",
        height: 200,
    },
    droidSafeArea: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? 0 : 0
    },
    inputView: {
        backgroundColor: "#398378",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
        marginBottom: 40,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 130
    },
    name: {
        fontSize: 22,
        color: "#00BFFF",
        fontWeight: '600',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
        justifyContent: 'center'
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10,
        textAlign: 'center'
    },
    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
});
export default EditProfile;