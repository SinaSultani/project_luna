import React, { useEffect, useRef, useState } from 'react';
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
    const searchQueryRef = useRef('');

    const currentUserId = firebase.auth().currentUser.uid;


    useEffect(() => {
        const getUsersFriends= async () => {
        // Get logged in user friends
        try {
                const userDoc = await firebase.firestore().collection('users').doc(currentUserId).get();
                const friendsRefs = userDoc.data().friends;
                // Get the IDs of the current users friends
                const friends = await Promise.all(friendsRefs.map(async friendRef => {
                    const friendDoc = await friendRef.get();
                    return friendDoc.id;
                }));
                setLoggedInUserFriends(friends);
        } catch (err) {
            console.log(err.message)
        }
        }
        getUsersFriends();
    }, []);
    //setLoggedInUserFriends(snapshot.data().friends || []);
    const onChangeSearch = query => {
        searchQueryRef.current = query;
        setSearchQuery(query);
    };
    const searchUser = () => {
        // // Get search results from firestore
        setSearchResults([]);
        const query = searchQueryRef.current;
        if (query.trim() === '') {
          return;
        }
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
                            snapshotRequester.docs.forEach(request => {
                                const status = request.data().status;
                                console.log("Request 1: ", request.data())
                                if(status === "pending") {
                                    setIsRequestSent(true);
                                }
                            })
                            firebase.firestore().collection('friendRequests')
                                .where('requester', '==', doc.id)
                                .where('requested', '==', currentUserId)
                                .get()
                                .then(snapshotRequested => {
                                snapshotRequested.docs.forEach(request => {
                                    const status = request.data().status;
                                    console.log("Request 2: ", request.data())
                                    if(status === "pending") {
                                        setIsPendingRequest(true);
                                    }
                                })
                                })
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
    console.log("user: ", user)
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