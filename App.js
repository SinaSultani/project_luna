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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
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
import EditProfileScreen from './screens/EditProfile';

//Components
import Camera from './components/Camera';

//Providers
import UserProvider, { UserContext } from "./context/UserProvider";

import { useNavigation } from '@react-navigation/native';
import { DownloadUserImage } from './context/UserProvider';

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

const HomeTabNotAuthed = () => {
  const { user, logoutUser, loadingName } = useContext(UserContext);

  return (
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
          return <MaterialIcons name={iconName} size={20} color={color} />;
        },
        "tabBarActiveTintColor": '#398378',
        "tabBarInactiveTintColor": 'grey',
        "tabBarLabelStyle": { "paddingBottom": 10, "fontSize": 10 },
        "tabBarStyle": { "padding": 10, "height": 70 }
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
  // console.log("url in app: ", url)
  return (
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
          }
          else if (rn === feedName) {
            iconName = 'article';
          }
          else if (rn === searchName) {
            iconName = 'search';
          }
          else if (rn === settingsName) {
            iconName = 'settings';
          }
          else if (rn === profileName) {
            if (url) {
              return <Image style={{ height: 30, width: 30, borderRadius: 63 }} source={{ uri: url }} />
            }
            else {
              return <Image style={{ height: 30, width: 30, borderRadius: 63 }} source={{ uri: "https://gravatar.com/avatar/9cbca7bb32eb6d774eb67a0911b9c7cf?s=600&d=robohash&r=x" }} />
            }
          }
          return <MaterialIcons name={iconName} size={20} color={color} />
        },
        "tabBarActiveTintColor": '#398378',
        "tabBarInactiveTintColor": 'grey',
        "tabBarLabelStyle": { "paddingBottom": 10, "fontSize": 10 },
        "tabBarStyle": { "padding": 10, "height": 55 }
      })}
    >
      <Tab.Screen
        name={feedName}
        options={{ headerShown: false }}
        component={FeedStackScreen} />
      <Tab.Screen
        name={friendsName}
        options={{ headerShown: false }}
        component={FriendRequestsStackScreen} />
      <Tab.Screen
        name={chatName}
        options={{ headerShown: false }}
        component={ChatStackScreen} />
      <Tab.Screen
        name={searchName}
        options={{ headerShown: false }}
        component={SearchStackScreen} />
      <Tab.Screen
        name={settingsName}
        options={{ headerShown: false }}
        component={SettingsStackScreen} />
      <Tab.Screen
        name={profileName}
        options={{ headerShown: false }}
        component={ProfileStackScreen} />
    </Tab.Navigator >
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
        options={{ headerShown: false, }}
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
        options={{ headerShown: false, }}
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

// const Section = ({ children, title }) => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

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
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer theme={NavigationTheme}>
      <UserProvider>
        <Navigator />
      </UserProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
