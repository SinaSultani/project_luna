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
    Platform
} from 'react-native';
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
// import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from "react-native-image-picker"
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

const EditProfile = ({ navigation }) => {

    const [newName, setNewName] = useState("");
    const [birthday, setBirthday] = useState(new Date());
    const [biografi, setBiografi] = useState("");
    const [selected, setSelected] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [open, setOpen] = useState(false)

    const { signInUser, user, loadingName, forgotPassword, createUserInFirestore, editProfile } = useContext(UserContext);

    useEffect(() => {

    }, [])

    const selectImage = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                console.log(source);
                setImage(source);
            }
        });
    };

    const uploadImage = async () => {
        const { uri } = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);
        setTransferred(0);
        const task = storage()
            .ref(filename)
            .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
            setTransferred(
                Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
            );
        });
        try {
            await task;
        } catch (e) {
            console.error(e);
        }
        setUploading(false);
        Alert.alert(
            'Photo uploaded!',
            'Your photo has been uploaded to Firebase Cloud Storage!'
        );
        setImage(null);
    };


    return (
        <SafeAreaView style={styles.droidSafeArea}>
            <View style={styles.container}>
                <View style={styles.header}></View>
                <Image style={styles.avatar} source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }} />
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
                            value={newName}
                            onChangeText={(newName) => setNewName(newName)} />
                        <TextInput
                            placeholder="Tell people about yourself!"
                            value={biografi}
                            onChangeText={(biografi) => setBiografi(biografi)} />
                        <View>
                            <SelectList
                                data={occupation}
                                setSelected={(val) => setSelected(val)}
                                onSelect={() => alert(selected)}
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
                    </View>

                    <SafeAreaView style={styles.container}>
                        <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
                            <Text style={styles.buttonText}>Pick an image</Text>
                        </TouchableOpacity>
                        <View style={styles.imageContainer}>
                            {image !== null ? (
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
                            )}
                        </View>
                    </SafeAreaView>

                    <View >
                        <Button
                            onPress={() =>
                                editProfile(newName, biografi, selected, birthday)
                            }>
                            Save changes
                        </Button>
                    </View>
                </View>
            </View>
        </SafeAreaView>
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
    uploadButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: '#ffb6b9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
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