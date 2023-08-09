/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useContext, useEffect, useState } from 'react';
import { Node } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
//Screens
import FriendRequestsScreen from './screens/FriendRequests';
import SignInScreen from './screens/SignIn';
import LibraryScreen from './screens/Library';
import SettingsScreen from './screens/Settings';
import SearchScreen from './screens/Search';
import TermsScreen from './screens/Terms';
import RegisterScreen from './screens/RegisterUser';
import FeedScreen from './screens/Feed';
import MainFeedScreen from './screens/MainFeed';
import ProfileScreen from './screens/Profile';
import AllChatScreen from './screens/AllChats';
import ChatRoom from './screens/ChatRoom';
import ChangeProfilePictureScreen from './screens/ChangeProfilePicture';
import AddScreen from './screens/AddScreen';
import EditProfileScreen from './screens/EditProfile';
import firebase from '@react-native-firebase/app';
import { firebaseConfig } from './firebase';

//Components
import Camera from './components/Camera';

//Providers
import UserProvider, { UserContext } from "./context/UserProvider";

import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const FriendRequestsStack = createStackNavigator();
const SignInStack = createStackNavigator();
const TermsStack = createStackNavigator();
const RegisterStack = createStackNavigator();
const BalanceStack = createStackNavigator();
const FeedStack = createStackNavigator();
const ChangeProfilePictureStack = createStackNavigator();
const SearchStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const LibraryStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ChatStack = createStackNavigator();
const EditProfileStack = createStackNavigator();

//Screen names for HomeTab not authed
const signInName = 'Sign In';
const registerName = 'Register';
const termsName = 'Terms';

//Screen namesfor HomeTab authed
const friendsName = 'FriendRequests';
const settingsName = 'Settings';
const searchName = 'Search';
const libraryName = 'Library';
const feedName = 'Feed';
const mainFeedName = 'MainFeed';
const profileName = 'Profile';
const chatName = 'Chat';


const tabBarHeight = Platform.OS === 'android' ? 45 : 60;
const paddingTopScaled = Platform.OS === 'ios' ? 40 : 20;


const HomeTabNotAuthed = () => {
  const { user, logoutUser, loadingName } = useContext(UserContext);
  return (
    <SafeAreaProvider style={{flex: 1}}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          
          if (rn === signInName) {
            iconName = 'home';
          }
          else if (rn === registerName) {
            iconName = 'favorite';
          }
          else if (rn === termsName) {
            iconName = 'book';
          }
          return <MaterialIcons name={iconName} size={24} color={color} style={{ paddingBottom: paddingTopScaled }} />;
        },
        tabBarActiveTintColor: '#398378',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { fontSize: 12, paddingBottom: 5 },
        tabBarStyle: { height: tabBarHeight, paddingTop: 15},
      })}
    >
      <Tab.Screen
        name={signInName}
        options={{ headerShown: false }}
        component={SignInStackScreen} />
      <Tab.Screen
        name={registerName}
        options={{ headerShown: false }}
        component={RegisterStackScreen} />
      <Tab.Screen
        name={termsName}
        options={{ headerShown: false }}
        component={TermsStackScreen} />
    </Tab.Navigator>
    </SafeAreaProvider>
  )
}

const HomeTabAuthed = () => {

  const { user, logoutUser, loadingName } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const [userURL, setUserURL] = useState('https://gravatar.com/avatar/9cbca7bb32eb6d774eb67a0911b9c7cf?s=600&d=robohash&r=x');
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (user) {
      setUrl(user.photoURL)
    }
  }, [url])
  return (
    <SafeAreaProvider style={{flex: 1}}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn === friendsName) {
            iconName = 'group';
          }
          else if (rn === chatName) {
            iconName = 'chat';
            return <MaterialIcons name={iconName} size={26} color={color} style={{ marginLeft: 40 }} />
          }
          else if (rn === feedName) {
            iconName = 'home';
          }
          else if (rn === searchName) {
            iconName = 'search';
            return <MaterialIcons name={iconName} size={26} color={color} style={{ marginRight: 40 }} />
          }
          else if (rn === settingsName) {
            iconName = 'settings';
          }
          else if (rn === profileName) {
            iconName = 'person'
          }
          return <MaterialIcons name={iconName} size={26} color={color}  />;
        },

        tabBarActiveTintColor: '#FF5722',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: { height: tabBarHeight, paddingBottom: 0, backgroundColor: 'white', elevation: 2},
        tabBarLabel: '',
      })
    }
    >
      <Tab.Screen
        name={feedName}
        options={{ headerShown: false }}
        component={FeedStackScreen} />
              <Tab.Screen
        name={searchName}
        options={{ headerShown: false }}
        component={SearchStackScreen} />
      <Tab.Screen
        name={chatName}
        options={{ headerShown: false}}
        component={ChatStackScreen} />
      <Tab.Screen
        name={profileName}
        options={{ headerShown: false}}
        component={ProfileStackScreen} />
        <Tab.Screen
          name="Add"
          component={AddScreen}
          options={{
            tabBarButton: ({ onPress, accessibilityLabel }) => (
              <TouchableOpacity style={styles.addButton}>
              <MaterialIcons name="add" size={24} color="#fff"/>
            </TouchableOpacity>
            ),
          }}
        />
    </Tab.Navigator >
    </SafeAreaProvider>
  )
}

function FriendRequestsStackScreen() {
  return (
    <FriendRequestsStack.Navigator>
      <FriendRequestsStack.Screen
        name="The FriendRequest"
        options={{ headerShown: false }}
        component={FriendRequestsScreen}
      />
    </FriendRequestsStack.Navigator>
  )
}

function SignInStackScreen() {
  return (
    <SignInStack.Navigator>
      <SignInStack.Screen
        name="The Sign In"
        options={{ headerShown: false }}
        component={SignInScreen} />
    </SignInStack.Navigator>
  )
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="Another Search"
        options={{ headerShown: false }}
        component={SearchScreen}
      />
    </SearchStack.Navigator>
  )
}

function FeedStackScreen() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="The Main Feed"
        options={{ headerShown: false }}
        component={MainFeedScreen} />
      <FeedStack.Screen
        name="Another Feed"
        options={{ headerShown: false }}
        component={FeedScreen} />
    </FeedStack.Navigator>
  )
}

function LibraryStackScreen() {
  return (
    <LibraryStack.Navigator>
      <LibraryStack.Screen
        name="Another Library"
        options={{ headerShown: false }}
        component={LibraryScreen} />
    </LibraryStack.Navigator>
  )
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Another Settings"
        options={{ headerShown: false }}
        component={SettingsScreen}
      />
    </SettingsStack.Navigator>
  )
}

function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="All Chats"
        options={{ headerShown: false }}
        component={AllChatScreen}
      />
      <ChatStack.Screen
        name="Chat room"
        component={ChatRoom}
      />
    </ChatStack.Navigator>
  )
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="The Profile"
        options={{ headerShown: false }}
        component={ProfileScreen} />
    </ProfileStack.Navigator>
  )
}

function EditProfileStackScreen() {
  return (
    <EditProfileStack.Navigator>
      <EditProfileStack.Screen
        name="Another Edit Profile"
        options={{ headerShown: true }}
        component={EditProfileScreen} />
    </EditProfileStack.Navigator>
  )
}

function ChangeProfilePictureStackScreen() {
  return (
    <ChangeProfilePictureStack.Navigator>
      <ChangeProfilePictureStack.Screen
        name="Change Profile"
        options={{ headerShown: false }}
        component={ChangeProfilePictureScreen} />
    </ChangeProfilePictureStack.Navigator>
  )
}

function TermsStackScreen() {
  return (
    <TermsStack.Navigator>
      <TermsStack.Screen
        name="The Terms"
        options={{ headerShown: false }}
        component={TermsScreen} />
    </TermsStack.Navigator>
  )
}

function RegisterStackScreen() {
  return (
    <RegisterStack.Navigator>
      <RegisterStack.Screen
        name="Another Register"
        options={{ headerShown: false }}
        component={RegisterScreen} />
    </RegisterStack.Navigator>
  )
}

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'green',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const Navigator = ({ navigation }) => {
  const { user, logoutUser, loadingName } = useContext(UserContext);
  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeTabNotAuthed" component={HomeTabNotAuthed} />
        </Stack.Group>
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Sign In' component={SignInStackScreen} />
          <Stack.Screen name="Register" component={RegisterStackScreen} />
          <Stack.Screen name='Terms' component={TermsStackScreen} />
        </Stack.Group>
      </Stack.Navigator>
    )
  }
  return (
    <Stack.Navigator >
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabAuthed" component={HomeTabAuthed} />
      </Stack.Group>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Feed" component={FeedStackScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfileStackScreen} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name='AllChats' component={AllChatScreen} />
        <Stack.Screen name='ChatRoom' component={ChatRoom} />
        <Stack.Screen name="ChangeProfilePic" component={ChangeProfilePictureStackScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}


const App = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  const backgroundStyle = {
    backgroundColor: 'red', // Change this to the desired background color
  };

  return (
    <NavigationContainer theme={NavigationTheme}>
      <UserProvider>
        <View style={[styles.droidSafeArea, backgroundStyle]}>
        <Navigator />
        </View>
      </UserProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "blue",
  },
  addButton: {
    position: 'absolute',
    marginTop: -8,
    left: '50%',
    marginLeft: -25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#FF5722',
    opacity: 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default App;
