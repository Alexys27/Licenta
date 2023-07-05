/* eslint-disable react/no-unstable-nested-components */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
// import Login from './screens/Login';
import Home from './screens/Home';
// import PhoneSignIn from './screens/OTP';
import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {StyleSheet} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Budget from './screens/Budget';
import Login from './screens/Login';
import Payments from './screens/Payments';
import Reports from './screens/Reports';
import {Store} from '../redux/store';
import {Provider} from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAc-JBu8CLMeyFZuJaFzlgfk7_2wbUKuk4',
  authDomain: 'mobilebanking-bfee7.firebaseapp.com',
  projectId: 'mobilebanking-bfee7',
  storageBucket: 'mobilebanking-bfee7.appspot.com',
  messagingSenderId: '364758268502',
  appId: '1:364758268502:web:308da7c8469378fa1959f7',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const Tab = createMaterialBottomTabNavigator();

function AppTabs() {
  return (
    <Provider store={Store}>
      <Tab.Navigator
        activeColor="#f4845f"
        inactiveColor="#adb5bd"
        // eslint-disable-next-line react-native/no-inline-styles
        barStyle={{
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
        screenOptions={({route}) => ({
          tabBarLabel: '',
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'home') {
              iconName = 'home';
              size = focused ? 25 : 20;
            } else if (route.name === 'payments') {
              iconName = 'exchange-alt';
              size = focused ? 25 : 20;
            } else if (route.name === 'reports') {
              iconName = 'file-alt';
              size = focused ? 25 : 20;
            } else if (route.name === 'budget') {
              iconName = 'chart-pie';
              size = focused ? 25 : 20;
            }
            return (
              <FontAwesome5Icon name={iconName} color={color} size={size} />
            );
          },
        })}>
        <Tab.Screen name={'home'} component={Home} />
        <Tab.Screen name={'payments'} component={Payments} />
        <Tab.Screen name={'reports'} component={Reports} />
        <Tab.Screen name={'budget'} component={Budget} />
      </Tab.Navigator>
    </Provider>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
