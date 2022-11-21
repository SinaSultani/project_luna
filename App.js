/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './providers/UserProvider';
import { FirestoreUsersProvider } from './providers/FirestoreUsersProvider';


import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import SignIn from './screens/SignIn';
import RegisterUser from './screens/RegisterUser';
import Balance from './screens/Balance';
import Terms from './screens/Terms';
import TopUp from './screens/TopUp';
import CompleteTopUp from './screens/CompleteTopUp';
import TermsComplete from './screens/TermsComplete';
import Profile from './screens/Profile';
 
const Tab = createBottomTabNavigator(); // for bottom navigation

const Stack = createStackNavigator();
const RegisterStack = createStackNavigator();
const BalanceStack = createStackNavigator();
const TermsStack = createStackNavigator();


const HomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
       <Tab.Screen
        name="Sign Up/In"
        component={RegisterStackScreen}
      />
       <Tab.Screen
        name="Balance"
        component={BalanceStackScreen}
      />
     <Tab.Screen
        name="Terms"
        component={TermsStackScreen}
      />
    </Tab.Navigator>
  )
}


function RegisterStackScreen() {
  return (
    <RegisterStack.Navigator
    screenOptions={{ headerShown: false }}
    >
      <RegisterStack.Screen
        screenOptions={{ headerShown: false }}
        name="Register & Sign in"
        component={RegisterUser}
      />
       <RegisterStack.Screen 
        screenOptions={{ headerShown: false }}
        name="Sign In"
        component={SignIn}
      />
       <RegisterStack.Screen 
        screenOptions={{ headerShown: false }}
        name="Profile"
        component={Profile}
      />
    </RegisterStack.Navigator>
  );
};

function BalanceStackScreen() {
  return (
    <BalanceStack.Navigator>
      <BalanceStack.Screen 
        name="Your Balance"
        component={Balance}
      />
      <BalanceStack.Screen
        name= "TopUp"
        component={TopUp}
      />
      <BalanceStack.Screen
        name= "CompleteTopUp"
        component={CompleteTopUp}
      />
    </BalanceStack.Navigator>
  );
};

function TermsStackScreen() {
  return (
    <TermsStack.Navigator
    screenOptions={{ headerShown: false }}>
      <TermsStack.Screen 
        name="The Terms"
        component={Terms}
      />
      <TermsStack.Screen 
        name="TermsComplete"
        component={TermsComplete}
      />
    </TermsStack.Navigator>
  );
};




const App = ( {navigation} ) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: "salmon",
    height: 20,
    
  };

  return (
    <UserProvider>
      <FirestoreUsersProvider>
        <NavigationContainer>
          <Stack.Navigator>
            
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="HomeTab" component={HomeTab} />
            </Stack.Group>

            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Your Balance" component={BalanceStackScreen} />
                <Stack.Screen name="Main" component={RegisterStackScreen} />
                {/* <Stack.Screen name="Your Profile" component={ProfileStackScreen} /> */}
                <Stack.Screen  name="Terms of use" component={TermsStackScreen} />
                <Stack.Screen  name="Top Up" component={BalanceStackScreen}/>
            </Stack.Group>

          </Stack.Navigator>
        </NavigationContainer>
      </FirestoreUsersProvider>
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
