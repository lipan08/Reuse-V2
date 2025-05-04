import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import Header from './components/Header';

const HomeScreen = () => {
    return (
        <NavigationContainer>
            <Header />
            <AppNavigator />
        </NavigationContainer >
    );
};
export default HomeScreen;
