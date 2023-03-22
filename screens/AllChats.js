import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';
import { UserContext } from "../context/UserProvider";
import { firebase } from "../firebase";
import { auth } from "../firebase";
import { firestore } from "../firebase";
const AllChats = ({ navigation, route }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [chatRoomId, setChatRoomId] = useState('');
    const { user, loadingName, DownloadUserImage, logoutUser } = useContext(UserContext);

    const handleChange = (event) => {
        setFriends(event.target.value);
    };

    useEffect(() => {
        const unsubscribe = firebase
          .firestore()
          .collection("chatRooms")
          .where("members", "array-contains", firebase.firestore().doc(`users/${user.uid}`))
          .orderBy("createdAt", "desc")
          .onSnapshot((querySnapshot) => {
            const updatedChatRooms = [];
            if (querySnapshot) {
              console.log("querySnapshot!: ", querySnapshot)
              querySnapshot.forEach((doc) => {
                console.log("doc.id: ", doc.id)
                updatedChatRooms.push({
                  chatRoomId: doc.id,
                  name: doc.data().name,
                  createdAt: doc.data().createdAt,
                  members: doc.data().members,
                });
              });
              setChatRooms(updatedChatRooms);
            }
          });
        return () => unsubscribe();
      }, []);
      

    async function GetFriends() {
        if (user) {
            const userRef = firebase.firestore().collection("users").doc(user.uid);
            const userSnapshot = await userRef.get();
            const userData = userSnapshot.data();
            if (userData && userData.friends) {
                const friendIds = Object.keys(userData.friends).map(key => userData.friends[key].id);
                const friendRefs = friendIds.map(friendId => firebase.firestore().collection("users").doc(friendId));
                const friendPromises = friendRefs.map(ref => ref.get());
                const friendSnapshots = await Promise.all(friendPromises);
                const friendData = friendSnapshots.map((snapshot, index) => ({ ...snapshot.data(), id: friendIds[index] }));
                setFriends(friendData);
            }
        }
    }

    const renderChatRoom = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.chatRoomContainer}
                onPress={() => navigation.navigate("ChatRoom", { chatRoomId: item.chatRoomId })}
            >
                <Text style={styles.chatRoomName}>{item?.name}</Text>
                {/* Get the latest message for each chat room */}
                <Text style={styles.chatRoomMessage}>Latest Message</Text>
            </TouchableOpacity>
        );
    };

    const StartChatRoom = async (friends) => {
        // console.log("FRIENDS: ", JSON.stringify(friends))
        try {
            const chatRoomRef = firebase.firestore().collection("chatRooms").doc();
            setChatRoomId(chatRoomRef.id);
            const createdAt = firebase.firestore.Timestamp.now();
            await chatRoomRef.set({
                name: "My Chat Room",
                createdAt: createdAt,
                members: [user.uid, ...friends.map(friend => friend.id)]
            });
            firebase.firestore().collection("messages").doc(chatRoomRef.id)
                .set({});
            return navigation.navigate("ChatRoom", { chatRoomId: chatRoomRef.id })
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={chatRooms}
                renderItem={renderChatRoom}
                keyExtractor={(item) => item.chatRoomId}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>No chats yet</Text>
                    </View>
                }
            />
            <View style={styles.floatingButtonContainer}>
                <TouchableOpacity style={styles.addChatButton} onPress={GetFriends}>
                    <Text style={styles.addChatButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.friendSelectionContainer}>
                <ModalDropdown
                    options={Object.entries(friends).map(([key, value]) => value.displayName)}
                    onSelect={(index) => {
                        const selectedFriend = Object.entries(friends)[index][1];
                        setSelectedFriends([...selectedFriends, selectedFriend]);
                    }}
                    renderRow={(option) => <Text style={styles.friendSelectionOption}>{option}</Text>}
                    defaultValue={'Select friends'}
                    style={styles.friendSelectionDropdown}
                />
                {selectedFriends &&
                    <TouchableOpacity style={styles.selectedFriendContainer} onPress={() => StartChatRoom(selectedFriends)}>
                        <Text style={styles.selectedFriendText}>{selectedFriends.map(friend => friend.displayName).join(", ")}</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatRoomContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#fff",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        margin: 10,
        borderRadius: 10,
    },
    chatRoomName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#398378",
    },
    chatRoomMessage: {
        fontSize: 14,
        color: "#555",
        marginTop: 5,
    },
    emptyListText: {
        fontSize: 16,
        alignSelf: "center",
        marginTop: 20,
        color: "#555",
    },
    addChatButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#398378",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    addChatButtonText: {
        fontSize: 40,
        color: "#fff",
        fontWeight: "bold",
    },
    friendsContainer: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        margin: 10,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    friendsText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    friendsSelected: {
        fontWeight: "bold",
        color: "#398378",
    },
    friendSelectionContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: "#ccc",
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    friendSelectionDropdown: {
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        flex: 1,
        marginRight: 10,
        paddingHorizontal: 10,
    },
    friendSelectionOption: {
        fontSize: 14,
        paddingVertical: 10,
    },
    selectedFriendContainer: {
        backgroundColor: "#398378",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
    },
    selectedFriendText: {
        color: "#fff",
        fontSize: 14,
    },

});

export default AllChats;

