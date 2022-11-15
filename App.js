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
import Profile from './screens/Profile';
import Balance from './screens/Balance';
import Terms from './screens/Terms';
import TopUp from './screens/TopUp';
import CompleteTopUp from './screens/CompleteTopUp';
 
const Tab = createBottomTabNavigator(); // for bottom navigation

const Stack = createStackNavigator();
const SignInStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const BalanceStack = createStackNavigator();
const TermsStack = createStackNavigator();


const HomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
       <Tab.Screen
        name="SignIn"
        component={SignInStackScreen}
      />
       <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
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

function SignInStackScreen() {
  return (
    <SignInStack.Navigator>
      <SignInStack.Screen 
        name="Sign In"
        component={SignIn}
      />
    </SignInStack.Navigator>
  );
};

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Your Profile"
        component={Profile}
      />
    </ProfileStack.Navigator>
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
    <TermsStack.Navigator>
      <TermsStack.Screen 
        name="The Terms!"
        component={Terms}
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

    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeTab" component={HomeTab} />
        </Stack.Group>

        <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Your Balance" component={BalanceStackScreen} />
            <Stack.Screen name="Main" component={SignInStackScreen} />
            <Stack.Screen name="Your Profile" component={ProfileStackScreen} />
            <Stack.Screen  name="Terms of use" component={TermsStackScreen} />
            <Stack.Screen name="Top Up" component={BalanceStackScreen}/>
          </Stack.Group>

      </Stack.Navigator>
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
