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

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const verticalScale = height / 812;
const normalize = (size) => Math.round(scale * size);
const normalizeVertical = (size) => Math.round(verticalScale * size);



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
         ios: normalizeVertical(90),
         android: normalizeVertical(90),
         default: normalizeVertical(70)
      }),
      paddingHorizontal: normalize(12),
   },
   contentContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Platform.select({
         ios: normalizeVertical(4),
         android: normalizeVertical(8),
         default: normalizeVertical(8)
      }),
   },
   logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
   },
   logo: {
      width: normalize(32),
      height: normalize(32),
      resizeMode: 'contain',
      marginRight: normalize(8),
   },
   titleContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
   },
   appName: {
      fontSize: normalize(16),
      fontWeight: 'bold',
      color: '#FFFFFF',
      includeFontPadding: false,
   },
   appSubName: {
      fontSize: normalize(12),
      color: '#FFFFFF',
      includeFontPadding: false,
      marginTop: -normalizeVertical(2),
   },
   rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
      maxWidth: width * 0.6,
   },
   locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: normalize(8),
   },
   addressText: {
      color: '#FFFFFF',
      fontSize: normalize(12),
      maxWidth: width * 0.5,
      includeFontPadding: false,
   },
   locationIcon: {
      marginLeft: normalize(4),
      marginTop: normalizeVertical(1),
      fontSize: normalize(19), // Ionicons will use this if size prop is not set
   },
});

export default Header;