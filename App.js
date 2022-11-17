/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Node } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './screens/SignIn';
import TermsScreen from './screens/Terms';
import RegisterScreen from './screens/RegisterUser';
import ProfileScreen from './screens/Profile';
import UserProvider from './context/UserProvider';
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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SignInStack = createStackNavigator();
const TermsStack = createStackNavigator();
const RegisterStack = createStackNavigator();
const BalanceStack = createStackNavigator();
const ProfileStack = createStackNavigator();


function HomeTab({ navi }) {
  return (
    <Tab.Navigator
    >
      <Tab.Screen
        name="Sign In"
        options={{ headerShown: false }}
        component={SignInStackScreen} />
      <Tab.Screen
        name="Register"
        options={{ headerShown: false }}
        component={RegisterStackScreen} />
      <Tab.Screen
        name="Terms"
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
      <SignInStack.Screen
        name="The Profile"
        options={{ headerShown: false }}
        component={ProfileScreen} />
    </SignInStack.Navigator>

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


const App = ({ navigation }) => {


  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeTab" component={HomeTab} />
          </Stack.Group>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Sign In" component={SignInStackScreen} />
            <Stack.Screen name="Terms" component={TermsStackScreen} />
            <Stack.Screen name="Register" component={RegisterStackScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
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
