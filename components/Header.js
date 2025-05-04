import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   Image,
   Platform,
   StatusBar,
   TouchableOpacity,
   Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
   const navigation = useNavigation();
   const [address, setAddress] = useState("Set Location");
   const statusBarHeight = StatusBar.currentHeight || (Platform.OS === 'ios' ? 20 : 24);

   const handleNavigation = async () => {
      try {
         await AsyncStorage.removeItem('authToken');
         navigation.navigate('Login');
         console.log('Logged out successfully');
      } catch (error) {
         console.error('Error logging out:', error);
      }
   };

   useEffect(() => {
      const fetchAddress = async () => {
         const savedAddress = await AsyncStorage.getItem('defaultAddress');
         if (savedAddress) {
            setAddress(JSON.parse(savedAddress).addressText || "Set Location");
         }
      };
      fetchAddress();
   }, []);

   return (
      <>
         <StatusBar
            backgroundColor="#007BFF"
            barStyle="light-content"
            translucent={true}
         />
         <View style={[styles.headerContainer, { paddingTop: statusBarHeight }]}>
            <View style={styles.contentContainer}>
               <View style={styles.logoContainer}>
                  <Image
                     source={{ uri: 'https://i.pinimg.com/originals/92/4c/af/924cafad941065f4d5c03ca5423bfcd3.gif' }}
                     style={styles.logo}
                  />
                  <View style={styles.titleContainer}>
                     <Text style={styles.appName}>Reuse</Text>
                     <Text style={styles.appSubName}>Bharat</Text>
                  </View>
               </View>
               <View style={styles.rightIcons}>
                  <TouchableOpacity
                     style={styles.locationContainer}
                     onPress={() => navigation.navigate('LocationPicker')}
                  >
                     <Text
                        style={styles.addressText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                     >
                        {address}
                     </Text>
                     <Ionicons
                        name="location-outline"
                        size={20}
                        color="#fff"
                        style={styles.locationIcon}
                     />
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </>
   );
};

const styles = StyleSheet.create({
   headerContainer: {
      backgroundColor: '#007BFF',
      height: Platform.select({
         ios: 90,
         android: 100,
         default: 70
      }),
      paddingHorizontal: 16,
   },
   contentContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Platform.select({
         ios: 4,
         android: 8,
         default: 8
      }),
   },
   logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
   },
   logo: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
      marginRight: 10,
   },
   titleContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
   },
   appName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      includeFontPadding: false,
   },
   appSubName: {
      fontSize: 12,
      color: '#FFFFFF',
      includeFontPadding: false,
      marginTop: -2,
   },
   rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
      maxWidth: Dimensions.get('window').width * 0.6,
   },
   locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
   },
   addressText: {
      color: '#FFFFFF',
      fontSize: 14,
      maxWidth: Dimensions.get('window').width * 0.5,
      includeFontPadding: false,
   },
   locationIcon: {
      marginLeft: 6,
      marginTop: 2,
   },
});

export default Header;