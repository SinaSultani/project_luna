import React, { useEffect, useState } from 'react';
import { Searchbar, useTheme } from 'react-native-paper';
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { firebase } from "../firebase";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const Search = ({ navigation, route, children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loggedInUserFriends, setLoggedInUserFriends] = useState([]);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [isPendingRequest, setIsPendingRequest] = useState(false);
    const theme = useTheme();
    const currentUserId = firebase.auth().currentUser.uid;
    useEffect(() => {
        const getUsersFriends= async () => {
        // Get logged in user friends
        try {

            const userDoc = await firebase.firestore().collection('users').doc(currentUserId).get();
            const friendsRefs = userDoc.data().friends;
            // Get the IDs of the current users friends
            await Promise.all(friendsRefs.map(async friendRef => {
                let friend = await friendRef.get();
                setLoggedInUserFriends(friend.id);
            }));
        } catch (err) {
            console.log(err.message)
        }
        }
        getUsersFriends();
    }, []);
    //setLoggedInUserFriends(snapshot.data().friends || []);
    const onChangeSearch = query => {
        setSearchQuery(query);
    };
    const searchUser = (query) => {
        // // Get search results from firestore
        firebase.firestore()
            .collection('users')
            .where('displayName', '==', query)
            .get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    firebase.firestore().collection('friendRequests')
                        .where('requester', '==', currentUserId)
                        .where('requested', '==', doc.id)
                        .get()
                        .then(snapshotRequester => {
                            firebase.firestore().collection('friendRequests')
                                .where('requester', '==', doc.id)
                                .where('requested', '==', currentUserId)
                                .get()
                                .then(snapshotRequested => {
                                    if (!snapshotRequester.empty) {
                                        setIsRequestSent(true);
                                    } else if (!snapshotRequested.empty) {
                                        setIsPendingRequest(true);
                                    } else {
                                        setIsRequestSent(false);
                                        setIsPendingRequest(false);
                                    }
                                })
                            // console.log("NW SnaP: ", snapshot);
                            // console.log("snapshot.empty: ", snapshot.empty)
                            // if (!snapshot.empty) {
                            //     setIsRequestSent(true);
                            // } else {
                            //     setIsRequestSent(false);
                            // }
                        });
                });

                setSearchResults(snapshot.docs.map(doc => ({
                    profileImg: doc.data().profileImg,
                    displayName: doc.data().displayName,
                    occupation: doc.data().occupation,
                    id: doc.id
                })));
            });
    }

    const sendFriendRequest = async (userId) => {
        await firebase.firestore()
            .collection('friendRequests')
            .add({
                requester: currentUserId,
                requested: userId,
                status: 'pending'
            })
    }

    const openFriendRequest = async (userId) => {

    }


    const acceptRequest = (userId) => {
        //Approach 1
        // Get the other user's friends
        firebase.firestore()
            .collection('users')
            .doc(userId)
            .get()
            .then(snapshot => {
                const otherUsersFriends = snapshot.data().friends || [];
                // Create a reference to the current user's document
                const currentUserRef = firebase.firestore().collection('users').doc(currentUserId);
                // Add the friend reference to the logged in user's friends array in firestore
                firebase.firestore()
                    .collection('users')
                    .doc(currentUserId)
                    .update({
                        friends: [...loggedInUserFriends, currentUserRef],
                    });
                // Update the other user's friends array
                firebase.firestore()
                    .collection('users')
                    .doc(userId)
                    .update({
                        friends: [...otherUsersFriends, currentUserRef],
                    });
            });

        //Approach 2
        // firebase.firestore().batch().update(
        //     firebase.firestore().collection('users').doc(currentUserId),
        //     { friends: [...loggedInUserFriends, userId] }
        //   ).update(
        //     firebase.firestore().collection('users').doc(userId),
        //     { friends: [...otherUserFriends, currentUserId] }
        //   ).commit()
        //     .then(() => {
        //       console.log('Friends added successfully!');
        //     })
        //     .catch(error => {
        //       console.error('Error adding friends: ', error);
        //     });
    };

    const declineRequest = async (userId) => {
        firebase.firestore().collection('friendRequests')
            .where('requester', '==', userId)
            .where('requested', '==', currentUserId)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    firebase.firestore().collection('friendRequests').doc(doc.id).update({
                        status: "declined",
                        ...doc.data()
                    });
                });
            });
    }

    return (
        <>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                onIconPress={() => searchUser(searchQuery)}
            />
            {searchResults.length > 0 ? (
                searchResults.map(user => (

                    <User
                        key={user.id}
                        user={user}
                        isFriend={loggedInUserFriends.includes(user.id)}
                        sendFriendRequest={() => sendFriendRequest(user.id)}
                        isRequestSent={isRequestSent}
                        isPendingRequest={isPendingRequest}
                    />
                ))
            ) : (
                <Text style={{ textAlign: 'center' }}>Not found</Text>
            )}
        </>
    );
};

const User = ({ user, isFriend, sendFriendRequest, isRequestSent, isPendingRequest }) => {
    console.log("ISFRIEND: ", isFriend)
    const [requestSent, setRequestSent] = useState(false);
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
            <Image source={{ uri: user.profileImg }} style={{ width: 50, height: 50, borderRadius: 20 }} />
            <View style={{ marginLeft: 10 }}>
                <Text>{user.displayName}</Text>
                <Text>{user.occupation}</Text>
            </View>
            {isFriend ? (
                <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
                    <MaterialIcons name="check" size={24} color="#000" style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Friend</Text>
                </View>
            ) : isRequestSent ? (
                <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
                    <MaterialIcons name="check" size={24} color="#000" style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Request Sent</Text>
                </View>
            ) : isPendingRequest ? (
                <TouchableOpacity onPress={() => openFriendRequest(user.id)} style={{ marginLeft: 'auto', flexDirection: 'row' }}>
                    <MaterialIcons name="hourglass-empty" size={21} color="#000" style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Pending Request</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={() => {
                        sendFriendRequest(user.id);
                    }}
                    style={{ marginLeft: 'auto', flexDirection: 'row' }}
                >
                    <MaterialIcons name="add" size={24} color="#000" style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Add Friend</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Search;