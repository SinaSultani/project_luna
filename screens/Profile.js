import React from 'react';
import { ListViewBase, ListViewComponent, SafeAreaView, Text, View, FlatList, StyleSheet, StatusBar} from "react-native"





const data = [{ key: 1, title:"Boris"}, {key:2, title:"Sina"}, {key:3, title:"Pontus"}]

const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

const Profile = () => {

    const renderItem = ({ item }) => (
        <Item title={item.title} />
    );

    return (
        <SafeAreaView style={{ flex: 1}}>
            <View style={{ height: 350 }}>
                <Text style={{ color: "red", fontSize: 30, }}>
                   Users:
                </Text>
                <FlatList 
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });
  
export default Profile