import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, Image, Spinner, ScrollView } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { UserContext } from "../context/UserProvider";
import { Divider } from 'react-native-paper';
import { services } from '../services';
import moment from 'moment';

const Feed = ({ navigation, children }) => {
    const { user, logoutUser, loadingName } = useContext(UserContext);
    const [newsData, setNewsData] = useState([])
    useEffect(() => {
        services('general')
            .then(data => {
                setNewsData(data)
            })
            .catch(error => {
                alert(error)
            })
    }, [])


    return (
        <>
            {newsData.length > 1 ? (
                <FlatList
                    data={newsData}
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }}
                    renderItem={({ item }) => (
                        <View>
                            <View style={styles.newsContainer}>
                                <Image
                                    style={{ width: 370, height: 250, justifyContent: 'center', alignContent: 'center' }}
                                    source={{
                                        uri: item.urlToImage,
                                    }}
                                    alt="Alternate Text"
                                />
                                <Text style={styles.title}>
                                    {item.title}
                                </Text>
                                <Text style={styles.date}>
                                    {moment(item.publishedAt).format('LLL')}
                                </Text>
                                <Text style={styles.newsDescription}>
                                    {item.description}
                                </Text>
                            </View>
                            <Divider style={{ padding: 3 }} />
                        </View>
                    )}
                />
            ) : (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" />
                    <Text>Loading...</Text>
                </View>
            )
            }
        </>
    )
}

const styles = StyleSheet.create({
    newsContainer: {
        padding: 10
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'flex-end',
        position: 'absolute',
        marginTop: 30
    },
    title: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: "600"
    },
    newsDescription: {
        fontSize: 16,
        marginTop: 10
    },
    date: {
        fontSize: 14
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 400
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: "center"
    },
});

export default Feed;