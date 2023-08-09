import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { UserContext } from "../context/UserProvider";
import { services } from '../services';
import moment from 'moment';

const Feed = ({ navigation, children }) => {
  const { user, logoutUser, loadingName } = useContext(UserContext);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    services('general')
      .then(data => {
        setNewsData(data);
      })
      .catch(error => {
        alert(error);
      });
  }, []);

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
              <Card style={styles.card}>
                <View style={styles.userInfo}>
                  <Image style={styles.avatar} source={{ uri: user.image }} />
                  <Text style={styles.userName}>{user.name}</Text>
                </View>
                <Card.Cover source={{ uri: item.urlToImage }} />
                <Card.Title title={item.title} subtitle={moment(item.publishedAt).format('LLL')} />
                <Card.Content>
                  <Text style={styles.newsDescription}>
                    {item.description}
                  </Text>
                </Card.Content>
              </Card>
              <Divider style={{ marginVertical: 10 }} />
            </View>
          )}
        />
      ) : (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'blue',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  newsDescription: {
    fontSize: 16,
    marginTop: 10,
    color: 'white',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Feed;
