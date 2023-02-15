import React, { useEffect, useState, useContext } from 'react';
import { Searchbar, useTheme } from 'react-native-paper';
import { Text, View, Image, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native'
import { firebase } from "../firebase";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from "../context/UserProvider";
const FriendRequest = ({ navigation, children }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFriendRequest, setSelectedFriendRequest] = useState({});
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            const friendRequestSnapshot = await firebase.firestore().collection('friendRequests')
                .where('requested', '==', user.uid)
                .get();
            const friendRequests = await Promise.all(
                friendRequestSnapshot.docs.map(async friendRequest => {
                    const requesterId = friendRequest.data().requester;
                    const userSnapshot = await firebase.firestore().collection('users').doc(requesterId).get();
                    return userSnapshot.data();
                })
            );
            console.log("friendRequests: ", friendRequests)
            setFriendRequests(friendRequests);
        };

        fetchFriendRequests();
    }, [user]);
    //setFriendRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    const acceptFriendRequest = async () => {
        const requesterId = selectedFriendRequest.requester;
        const currentUserId = firebase.auth().currentUser.uid;
        await firebase.firestore().collection('friendRequests')
            .doc(selectedFriendRequest.id)
            .update({ status: 'accepted' });
        await firebase.firestore().collection('friends')
            .doc(`${requesterId}-${currentUserId}`)
            .set({ userIds: [requesterId, currentUserId] });
        setModalVisible(false);
    };

    const declineFriendRequest = async () => {
        await firebase.firestore().collection('friendRequests')
            .doc(selectedFriendRequest.id)
            .update({ status: 'declined' });
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
                            <Image source={{ uri: item.profileImg }} style={styles.friendRequestAvatar} />
                            <View>
                                <Text style={styles.friendRequestName}>{item.displayName}</Text>
                                <Text style={styles.friendRequestStatus}>Pending request</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={item => item.email}
            />
            <Modal visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <Image source={{ uri: selectedFriendRequest.profileImg }} style={styles.modalAvatar} />
                    <Text style={styles.modalName}>{selectedFriendRequest.displayName}</Text>
                    <View style={styles.modalActionContainer}>
                        <TouchableOpacity onPress={acceptFriendRequest} style={styles.modalActionButton}>
                            <Text style={styles.modalActionButtonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={declineFriendRequest} style={styles.modalActionButton}>
                            <Text style={styles.modalActionButtonText}>Decline</Text>
                        </TouchableOpacity>
                    </View>
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