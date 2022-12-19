/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserContext, UserProvider } from './providers/UserProvider';
import {
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Text } from 'react-native'
import SignIn from './screens/SignIn';
import RegisterUser from './screens/RegisterUser';
import Balance from './screens/Balance';
import Terms from './screens/Terms';
import TopUp from './screens/TopUp';
import CompleteTopUp from './screens/CompleteTopUp';
import TermsComplete from './screens/TermsComplete';
import Profile from './screens/Profile';
import Loader from './screens/Loader';
import Settings from './screens/Settings';
 
const Tab = createBottomTabNavigator(); // for bottom navigation

const Stack = createStackNavigator();
const RegisterStack = createStackNavigator();
const BalanceStack = createStackNavigator();
const TermsStack = createStackNavigator();


const HomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
       {/* <Tab.Screen
        name="Sign Up/In"
        component={RegisterStackScreen}
      /> */}
       <Tab.Screen
        name="Profile"
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
       {/* <RegisterStack.Screen 
        screenOptions={{ headerShown: false }}
        name="Profile"
        component={Profile}
      /> */}
    </RegisterStack.Navigator>
  );
};

function BalanceStackScreen() {
  return (
    <BalanceStack.Navigator
  
    > 
     <BalanceStack.Screen 
        screenOptions={{ headerShown: false }}
        name="Profilee"
        component={Profile} 
        options={{ title: 'My Profile',  }}
      />
     
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
      <BalanceStack.Screen 
        name="Settings"
        component={Settings}  
        options={{ title: "Profile Settings"}}
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

const MyNavigator = () => {
const { user } = useContext(UserContext)
// console.log("In app js", user)
  if(!user) { return ( 
    <Stack.Navigator>
  
    <Stack.Group screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={RegisterStackScreen} />
    </Stack.Group>

  </Stack.Navigator>
  ) }
  return (
    <Stack.Navigator>

    <Stack.Group screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTab" component={HomeTab} />
    </Stack.Group>

    <Stack.Group screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Balance" component={BalanceStackScreen} />
      <Stack.Screen name="Terms of use" component={TermsStackScreen} />
    </Stack.Group>

  </Stack.Navigator>
 ) 
}



const App = ( {navigation} ) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: "salmon",
    height: 20,
    
  };

  return (
    <NavigationContainer>
      <UserProvider>
        <MyNavigator />
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
