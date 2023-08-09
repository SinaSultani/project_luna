import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Stories = () => {
  // Mock data for logged in user and friends' stories
  const loggedInUserStory = {
    id: '1',
    username: 'loggedInUser',
    image: require('../assets/portraits/me.jpg'),
    hasStory: true, // Set this based on user's story status (true if uploaded, false if not)
  };

  const friendsStories = [
    { id: '2', username: 'friend1', image: require('../assets/portraits/user1.jpg'), hasStory: false },
    { id: '3', username: 'friend2', image: require('../assets/portraits/user2.jpg'), hasStory: false },
    { id: '4', username: 'friend3', image: require('../assets/portraits/user3.jpg'), hasStory: true },
    // Add more friend stories as needed
  ];

  return (
    <View style={styles.stories}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Logged in user's story */}
        <TouchableOpacity style={styles.storyContainer}>
          <View style={[styles.storyItem, styles.activeStory]}>
            <View style={styles.circle}>
              <View style={styles.innerCircle}>
                <Image source={loggedInUserStory.image} style={styles.storyImage} />
              </View>
            </View>
            <Text style={styles.storyUsername}>{loggedInUserStory.username}</Text>
          </View>
        </TouchableOpacity>

        {/* Friends' stories */}
        {friendsStories.map((story) => (
          <TouchableOpacity style={styles.storyContainer} key={story.id}>
            <View style={[styles.storyItem, styles.activeStory]}>
              {story.hasStory ? (
                <View style={styles.circle}>
                  <View style={styles.innerCircle}>
                    <Image source={story.image} style={styles.storyImage} />
                  </View>
                </View>
              ) : (
                <View style={[styles.circle, styles.inactiveCircle]}>
                  <View style={styles.innerCircle}>
                    <Image source={story.image} style={styles.storyImage} />
                  </View>
                </View>
              )}
              <Text style={styles.storyUsername}>{story.username}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  stories: {
    paddingHorizontal: 20,
  },
  storyContainer: {
    paddingHorizontal: 8,
  },
  storyItem: {
    alignItems: 'center',
  },
  activeStory: {
    opacity: 1,
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    borderColor: '#FF5722',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    borderColor: '#777777',
    borderWidth: 1,
  },

  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 28,
  },
  storyUsername: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Stories;

