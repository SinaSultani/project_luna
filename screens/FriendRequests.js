import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserContext } from "../context/UserProvider";
import { firebase } from "../firebase";
const FriendRequest = ({ navigation, children }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [loggedInUserFriends, setLoggedInUserFriends] = useState([]);
    const [isRequestAnswered, setIsRequestAnswered] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFriendRequest, setSelectedFriendRequest] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            const fetchFriendRequests = async () => {
                const friendRequestSnapshot = await firebase.firestore().collection('friendRequests')
                    .where('requested', '==', user.uid)
                    .where('status', '==', 'pending')
                    .get();
                const friendRequests = await Promise.all(
                    friendRequestSnapshot.docs.map(async friendRequest => {
                        const requesterId = friendRequest.data().requester;
                        const userSnapshot = await firebase.firestore().collection('users').doc(requesterId).get();
                        return { requesterId, userData: userSnapshot.data(), requestId: friendRequest.id };
                    })
                );
                setFriendRequests(friendRequests);
            };
            fetchFriendRequests();
        }
    }, [user]);

    useEffect(() => {
        const getUsersFriends = async () => {
            // Get logged in user friends
            try {
                if (user) {
                    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                    const friendsRefs = userDoc.data().friends;
                    // Get the IDs of the current users friends
                    const friends = await Promise.all(friendsRefs.map(async friendRef => {
                        const friendDoc = await friendRef.get();
                        return friendDoc.ref;
                    }));
                    setLoggedInUserFriends(friends);
                }
            } catch (err) {
                console.log(err.message)
            }
        }
        getUsersFriends();
    }, []);
    

    const acceptFriendRequest = async (userId) => {
        if (user) {
            await firebase.firestore().collection('friendRequests')
                .doc(selectedFriendRequest.requestId)
                .update({ status: 'accepted' });
            const otherUserDoc = await firebase.firestore()
                .collection('users')
                .doc(userId)
                .get();
            const otherUsersFriends = otherUserDoc.data().friends || [];
            // Create a reference to the current user's document
            const currentUserRef = firebase.firestore().collection('users').doc(user.uid);
            const friendsRef = firebase.firestore().collection('users').doc(userId)
            console.log("loggedInUserFriends.length: ", loggedInUserFriends.length)
            console.log("otherUsersFriends.length: ", otherUsersFriends.length)
            const updatedFriendsCurrentUser = loggedInUserFriends.length > 0 ? [...loggedInUserFriends, friendsRef] : [friendsRef];
            const updatedFriendsOtherUser = otherUsersFriends.length > 0 ? [...otherUsersFriends, currentUserRef] : [currentUserRef];
            
            // Add the friend reference to the logged in user's friends array in firestore
            firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    friends: updatedFriendsCurrentUser,
                });
            //   Update the other user's friends array
            firebase.firestore()
                .collection('users')
                .doc(userId)
                .update({
                    friends: updatedFriendsOtherUser,
                });
            setFriendRequests(friendRequests.filter(request => request.requesterId !== selectedFriendRequest.requesterId));
            setIsRequestAnswered(true);
            setModalVisible(false);    
        }
    };

    const declineFriendRequest = async () => {
        await firebase.firestore().collection('friendRequests')
            .doc(selectedFriendRequest.requestId)
            .update({ status: 'declined' });
        setIsRequestAnswered(true);
        setModalVisible(false);
    };

    return (
        <View style={styles.friendRequestContainer}>
            <FlatList
                data={friendRequests}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => {
                            setSelectedFriendRequest(item);
                            setModalVisible(true);
                        }} style={styles.friendRequestContainer}>
                            <Image source={{ uri: item.userData.profileImg }} style={styles.friendRequestAvatar} />
                            <View>
                                <Text style={styles.friendRequestName}>{item.userData.displayName}</Text>
                                <Text style={styles.friendRequestStatus}>Pending request</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={item => item.requesterId}
            />
            <Modal visible={modalVisible}>
                <View style={styles.modalContainer}>
                    {selectedFriendRequest && (
                        <>
                            <Image source={{ uri: selectedFriendRequest.userData.profileImg }} style={styles.modalAvatar} />
                            <Text style={styles.modalName}>{selectedFriendRequest.userData.displayName}</Text>

                            <View style={styles.modalActionContainer}>
                                <TouchableOpacity onPress={() => acceptFriendRequest(selectedFriendRequest.requesterId)} style={styles.modalActionButton}>
                                    <Text style={styles.modalActionButtonText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => declineFriendRequest(selectedFriendRequest.requesterId)} style={styles.modalActionButton}>
                                    <Text style={styles.modalActionButtonText}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    friendRequestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    friendRequestAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    friendRequestName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    friendRequestStatus: {
        fontSize: 16,
        color: 'gray',
        marginTop: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        padding: 16,
    },
    modalAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    modalName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalActionContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    modalActionButton: {
        padding: 12,
        backgroundColor: '#007aff',
        borderRadius: 4,
        marginHorizontal: 8,
    },
    modalActionButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default FriendRequest;