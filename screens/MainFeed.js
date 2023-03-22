import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { firebase } from "../firebase";
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MainFeed = () => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const userRef = firebase.firestore().collection("users").doc(currentUserId);
        const fetchPosts = async () => {
            let postData = [];
            try {
                const userDoc = await firebase.firestore().collection('users').doc(currentUserId).get();
                const friendsRefs = userDoc.data().friends;
                // Get the document references of the current users friends
                const friends = await Promise.all(friendsRefs.map(async friendRef => {
                    try {
                        let friend = await friendRef.get();
                        console.log("friend: ", friend.ref)
                        return friend.ref;
                    } catch (error) {
                        console.log(error);
                        return null;
                    }
                }));
                // Query the posts collection for documents with a userId that matches the current user's reference or any of their friends' references
                const postsRef = firebase.firestore().collection('posts');
                let query = postsRef.where('userId', 'in', [userRef, ...friends]).orderBy('createdAt', 'desc');
                let querySnapshot = await query.get();
                // Sort the resulting documents in descending order by the "createdAt" field
                let sortedPosts = querySnapshot.docs.sort((a, b) => b.data().createdAt.seconds - a.data().createdAt.seconds);

                // Retrieve the displayName and profileImg for each post's user and each friend's profileImg
                postData = await Promise.all(sortedPosts.map(async post => {
                    let userRef = post.data().userId;
                    let user = await userRef.get();
                    let profileImg;
                    if (friendsRefs.includes(userRef) || userRef) {
                        // If the user is a friend, get their profileImg from Firebase Storage
                        const memberDoc = userRef;
                        const downloadUrl = await storage().ref(memberDoc.id).getDownloadURL();
                        profileImg = downloadUrl;
                    } else {
                        // Otherwise, use the user's profileImg from Firestore
                        profileImg = user.data().profileImg;
                    }
                    return {
                        ...post.data(),
                        id: post.id,
                        displayName: user.data().displayName,
                        profileImg: profileImg
                    };
                }));
            } catch (error) {
                console.log(error.message);
            }
            setPosts(postData);
        };

        fetchPosts();
    }, []);



    const handlePost = async () => {
        const userRef = firebase.firestore().collection("users").doc(currentUserId);
        if (image) {
            const imageFileName = image.split("/").pop();
            const ref = storage().ref().child(`posts/${currentUserId}/${imageFileName}`);
            await ref.putFile(image);
            const url = await storage().ref().child(`posts/${currentUserId}/${imageFileName}`).getDownloadURL();
            firebase
                .firestore()
                .collection('posts')
                .add({
                    text,
                    userId: userRef,
                    createdAt: new Date(),
                    media: url
                });
        }
        else {
            firebase
                .firestore()
                .collection('posts')
                .add({
                    text,
                    userId: userRef,
                    createdAt: new Date(),
                });
        }
        setText('');
        setImage(null);
    };
    const openCamera = () => {
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: true,
        };
        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                setImage(response.assets[0].uri)
            }
        });
    }
    const handleOpenAttachment = async () => {
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: true,
        };
        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                setImage(response.assets[0].uri);
            }
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.postContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Write your post"
                />
                <TouchableOpacity onPress={handleOpenAttachment}>
                    <MaterialIcons name="image" style={styles.attachmentIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={openCamera}>
                    <MaterialIcons name="camera" style={styles.attachmentIcon} />
                </TouchableOpacity>
                {image && (
                    <Image style={styles.previewImage} source={{ uri: image }} />
                )}
                <TouchableOpacity onPress={handlePost}>
                    <Text style={styles.postButton}>Post</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={posts}
                keyExtractor={(item) => `${item.id}-${item.createdAt.seconds}`}
                renderItem={({ item }) => (

                    <View ket={item.id}>
                        <Text style={styles.displayName}>{item.displayName}</Text>
                        <Image style={styles.profileImg} source={{ uri: item.profileImg }} />

                        <View style={styles.post}>
                            <Text>{item.text}</Text>
                            {item.media && (
                                <Image style={styles.postImage} source={{ uri: item.media }} />
                            )}
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20,
    },
    attachmentIcon: {
        fontSize: 24,
        color: '#398378',
        marginRight: 10,
    },
    postContainer: {
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        padding: 10,
    },
    previewImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    displayName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10,
    },
    profileImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    postButton: {
        padding: 10,
        backgroundColor: '#398378',
        color: '#fff',
        borderRadius: 15
    },
    post: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
    postImage: {
        width: '100%',
        height: 200,
        marginTop: 10,
    },
};

export default MainFeed;
