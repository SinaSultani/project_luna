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
import MessageView from './screens/MessageView'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Icon } from 'react-native-vector-icons'
import Messages from './screens/Messages';

const Tab = createBottomTabNavigator(); // for bottom navigation

const Stack = createStackNavigator();
const RegisterStack = createStackNavigator();
const BalanceStack = createStackNavigator();
const TermsStack = createStackNavigator();
const MessageStack = createStackNavigator();





const HomeTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size },) => {
          let iconName;
          let rn = route.name;
          switch (rn) {
            case "Profile":
              iconName = 'person';
              break;
            case "Terms":
              iconName = 'notes';
              break;
            case "Messages":
              iconName = 'message';
              break;
            default:
              iconName = '';
          }
          return <MaterialIcons name={iconName} size={20} color={color} />
        },
        "tabBarActiveTintColor": 'tomato',
        "tabBarInactiveTintColor": 'grey',
        "tabBarLabelStyle": { "paddingBottom": 10, "fontSize": 10 },
        "tabBarStyle": { "padding": 10, "height": 55 }
      })
      }
    >
      <Tab.Screen
        name="Profile"
        component={BalanceStackScreen}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStackScreen}
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

function MessagesStackScreen() {
  return (
    <MessageStack.Navigator
      screenOptions={{headerShown: false}}
    >
      <MessageStack.Screen
        name="MessageView"
        component={MessageView}
      />
      <MessageStack.Screen
      
        name="Message"
        component={Messages}
      />
    </MessageStack.Navigator>
  )
}

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
