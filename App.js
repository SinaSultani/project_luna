/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useContext } from 'react';
import { Node } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './screens/SignIn';
import TermsScreen from './screens/Terms';
import RegisterScreen from './screens/RegisterUser';
import ProfileScreen from './screens/Profile';
import UserProvider, { UserContext } from "./context/UserProvider";
import EditProfileScreen from './screens/EditProfile';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
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
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SignInStack = createStackNavigator();
const TermsStack = createStackNavigator();
const RegisterStack = createStackNavigator();
const BalanceStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const EditProfileStack = createStackNavigator();

//Screen names
const signInName = 'Sign In';
const registerName = 'Register';
const termsName = 'Terms';

const HomeTab = () => {
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
        "tabBarActiveTintColor": 'tomato',
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

function SignInStackScreen() {
  return (
    <SignInStack.Navigator>
      <SignInStack.Screen
        name="The Sign In"
        options={{ headerShown: false }}
        component={SignInScreen} />
      {/* <SignInStack.Screen
        name="The Profile"
        options={{ headerShown: false }}
        component={ProfileScreen} /> */}
    </SignInStack.Navigator>
  )
}
function ProfileStackScreen() {

  return (
    <ProfileStack.Navigator screenOptions={({ route }) => ({
      "tabBarStyle": [
        {
          "display": "none"
        }
      ]
    })}>
      <ProfileStack.Screen
        name="The Profile"
        options={{ headerShown: false, }}
        component={ProfileScreen} />
      {/* <ProfileStack.Screen
        name="The EditProfile"
        component={EditProfileScreen} /> */}
    </ProfileStack.Navigator>
  )
}

function EditProfileStackScreen() {

  return (
    <EditProfileStack.Navigator>
      <EditProfileStack.Screen
        name="The Edit Profile"
        options={{ headerShown: true }}
        component={EditProfileScreen} />
    </EditProfileStack.Navigator>
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

const Section = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const Navigator = ({ navigation }) => {
  const { user, logoutUser, loadingName } = useContext(UserContext);
  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeTab" component={HomeTab} />
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
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={ProfileStackScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfileStackScreen} />
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
    <NavigationContainer>
      <UserProvider>
        <Navigator />
        {/* <Stack.Navigator>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeTab" component={HomeTab} />
          </Stack.Group>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={ProfileStackScreen} />
            <Stack.Screen name="Edit Profile" component={EditProfileStackScreen} />
            <Stack.Screen name="Sign In" component={SignInScreen} />
            <Stack.Screen name="Register" component={RegisterStackScreen} />
            <Stack.Screen name='Terms' component={TermsStackScreen} />
          </Stack.Group>
        </Stack.Navigator> */}
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
