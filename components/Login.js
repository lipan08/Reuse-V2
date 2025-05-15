import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';

const countryCodes = [
   { code: '+1', name: 'United States' },
   { code: '+91', name: 'India' },
   { code: '+44', name: 'United Kingdom' },
   { code: '+61', name: 'Australia' },
   { code: '+81', name: 'Japan' },
   { code: '+86', name: 'China' },
   { code: '+49', name: 'Germany' },
   { code: '+33', name: 'France' },
   { code: '+39', name: 'Italy' },
   { code: '+7', name: 'Russia' },
   { code: '+55', name: 'Brazil' },
   { code: '+27', name: 'South Africa' },
   { code: '+34', name: 'Spain' },
   { code: '+62', name: 'Indonesia' },
   { code: '+63', name: 'Philippines' },
   { code: '+64', name: 'New Zealand' },
   { code: '+82', name: 'South Korea' },
   { code: '+65', name: 'Singapore' },
   { code: '+66', name: 'Thailand' },
   { code: '+60', name: 'Malaysia' },
   { code: '+971', name: 'United Arab Emirates' },
   { code: '+92', name: 'Pakistan' },
   { code: '+20', name: 'Egypt' },
   { code: '+98', name: 'Iran' },
   { code: '+90', name: 'Turkey' },
   { code: '+31', name: 'Netherlands' },
   { code: '+32', name: 'Belgium' },
   { code: '+46', name: 'Sweden' },
   { code: '+47', name: 'Norway' },
   { code: '+48', name: 'Poland' },
   { code: '+351', name: 'Portugal' },
   { code: '+30', name: 'Greece' },
   { code: '+52', name: 'Mexico' },
   { code: '+54', name: 'Argentina' },
   { code: '+56', name: 'Chile' },
   { code: '+57', name: 'Colombia' },
   { code: '+58', name: 'Venezuela' },
   { code: '+94', name: 'Sri Lanka' },
   { code: '+880', name: 'Bangladesh' },
   { code: '+93', name: 'Afghanistan' },
   { code: '+964', name: 'Iraq' },
   { code: '+972', name: 'Israel' },
   { code: '+212', name: 'Morocco' },
   { code: '+213', name: 'Algeria' },
   { code: '+216', name: 'Tunisia' },
   { code: '+254', name: 'Kenya' },
   { code: '+255', name: 'Tanzania' },
   { code: '+256', name: 'Uganda' },
   { code: '+234', name: 'Nigeria' },
   { code: '+233', name: 'Ghana' },
   { code: '+263', name: 'Zimbabwe' },
   { code: '+260', name: 'Zambia' },
   { code: '+977', name: 'Nepal' },
   { code: '+975', name: 'Bhutan' },
   { code: '+960', name: 'Maldives' },
   { code: '+673', name: 'Brunei' },
   { code: '+84', name: 'Vietnam' },
   { code: '+856', name: 'Laos' },
   { code: '+855', name: 'Cambodia' },
   { code: '+679', name: 'Fiji' },
   { code: '+678', name: 'Vanuatu' },
   { code: '+682', name: 'Cook Islands' },
   { code: '+685', name: 'Samoa' },
   { code: '+686', name: 'Kiribati' },
   { code: '+687', name: 'New Caledonia' },
   { code: '+689', name: 'French Polynesia' },
   { code: '+672', name: 'Antarctica' },
   { code: '+501', name: 'Belize' },
   { code: '+502', name: 'Guatemala' },
   { code: '+503', name: 'El Salvador' },
   { code: '+504', name: 'Honduras' },
   { code: '+505', name: 'Nicaragua' },
   { code: '+506', name: 'Costa Rica' },
   { code: '+507', name: 'Panama' },
   { code: '+509', name: 'Haiti' },
   { code: '+592', name: 'Guyana' },
   { code: '+593', name: 'Ecuador' },
   { code: '+595', name: 'Paraguay' },
   { code: '+598', name: 'Uruguay' },
   { code: '+599', name: 'Netherlands Antilles' },
];

const Login = () => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [countryCode, setCountryCode] = useState('+91'); // Default country code
   const [phoneNumber, setPhoneNumber] = useState('');
   const [otp, setOtp] = useState('');
   const [showOtpField, setShowOtpField] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false); // For dropdown modal
   const [searchQuery, setSearchQuery] = useState(''); // For filtering countries
   const navigation = useNavigation();

   useEffect(() => {
      const checkLoginStatus = async () => {
         const token = await AsyncStorage.getItem('authToken');
         if (token) {
            setIsLoggedIn(true);
            navigation.navigate('Home');
         } else {
            setShowOtpField(false);
            setCountryCode('+91');
            setPhoneNumber('');
            setOtp('');
         }
      };
      checkLoginStatus();
   }, []);

   const handlePhoneNumberSubmit = async () => {
      if (!phoneNumber || phoneNumber.length < 10) {
         Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Invalid Phone',
            textBody: 'Please enter a valid phone number.',
            button: 'OK',
         });
         return;
      }

      // Send OTP here
      setShowOtpField(true);
   };

   const handleOtpSubmit = async () => {
      try {
         const response = await fetch(`${process.env.BASE_URL}/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            //${countryCode}
            body: JSON.stringify({
               phoneNumber: `${phoneNumber}`,
               otp,
            }),
         });

         const data = await response.json();

         if (response.ok) {
            await AsyncStorage.setItem('authToken', data.token);
            await AsyncStorage.setItem('userId', data.user.id.toString());
            await AsyncStorage.setItem('name', data.user.name);
            await AsyncStorage.setItem('phoneNo', data.user.phone_no);

            await AsyncStorage.setItem('userName', data.user.name || '');
            await AsyncStorage.setItem('userImage', data.user.images?.url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
            setIsLoggedIn(true);
            navigation.navigate('Home');
         } else {
            Dialog.show({
               type: ALERT_TYPE.WARNING,
               title: 'Login Failed',
               textBody: 'The provided credentials are incorrect.',
               button: 'Close',
            });
         }
      } catch (error) {
         console.log(error);
         Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Error',
            textBody: 'Something went wrong. Please try again later.',
            button: 'Close',
         });
      }
   };

   const handleLogout = async () => {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
      setShowOtpField(false);
      setCountryCode('+91');
      setPhoneNumber('');
      setOtp('');
      navigation.navigate('Login');
   };

   const filteredCountries = countryCodes.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
   );

   const renderCountryCodeItem = ({ item }) => (
      <TouchableOpacity
         style={styles.countryCodeItem}
         onPress={() => {
            setCountryCode(item.code);
            setIsModalVisible(false);
         }}
      >
         <Text style={styles.countryCodeText}>{item.name} ({item.code})</Text>
      </TouchableOpacity>
   );

   return (
      <AlertNotificationRoot>
         <View style={styles.container}>
            <Text style={styles.loginTitle}>Welcome to Reuse!</Text>
            <Text style={styles.loginSubtitle}>Login to your account</Text>

            <View style={styles.phoneInputContainer}>
               <TouchableOpacity
                  style={styles.countryCodeInput}
                  onPress={() => setIsModalVisible(true)}
               >
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
               </TouchableOpacity>
               <TextInput
                  style={styles.phoneNumberInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="Phone Number"
               />
            </View>

            {showOtpField && (
               <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
               />
            )}

            <TouchableOpacity
               style={styles.loginButton}
               onPress={showOtpField ? handleOtpSubmit : handlePhoneNumberSubmit}
            >
               <Text style={styles.buttonText}>{showOtpField ? 'Submit OTP' : 'Send OTP'}</Text>
            </TouchableOpacity>

            {isLoggedIn && (
               <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Logout</Text>
               </TouchableOpacity>
            )}

            {/* Modal for Country Code Selection */}
            <Modal
               visible={isModalVisible}
               transparent
               animationType="slide"
            >
               <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
                  <View style={styles.modalOverlay} />
               </TouchableWithoutFeedback>
               <View style={styles.modalContainer}>
                  <TextInput
                     style={styles.searchInput}
                     placeholder="Search country or code"
                     value={searchQuery}
                     onChangeText={setSearchQuery}
                  />
                  <FlatList
                     data={filteredCountries}
                     keyExtractor={(item) => item.code}
                     renderItem={renderCountryCodeItem}
                  />
               </View>
            </Modal>
         </View>
      </AlertNotificationRoot>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f4f8',
      justifyContent: 'center',
   },
   loginTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 5,
      textAlign: 'center',
   },
   loginSubtitle: {
      fontSize: 16,
      color: '#7f8c8d',
      marginBottom: 20,
      textAlign: 'center',
   },
   phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
   },
   countryCodeInput: {
      height: 45,
      borderColor: '#dcdcdc',
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 12,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
   },
   countryCodeText: {
      fontSize: 14,
      color: '#34495e',
   },
   phoneNumberInput: {
      height: 45,
      borderColor: '#dcdcdc',
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 12,
      backgroundColor: '#ffffff',
      flex: 1,
      fontSize: 14,
      color: '#34495e',
   },
   input: {
      height: 45,
      borderColor: '#dcdcdc',
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 12,
      backgroundColor: '#ffffff',
      marginBottom: 15,
      width: '100%',
      fontSize: 14,
      color: '#34495e',
   },
   loginButton: {
      backgroundColor: '#3498db',
      paddingVertical: 12,
      borderRadius: 6,
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
   },
   buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
   },
   logoutButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 12,
      borderRadius: 6,
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
   },
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContainer: {
      backgroundColor: '#ffffff',
      padding: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      maxHeight: '50%',
   },
   searchInput: {
      height: 45,
      borderColor: '#dcdcdc',
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 12,
      backgroundColor: '#ffffff',
      marginBottom: 10,
      fontSize: 14,
      color: '#34495e',
   },
   countryCodeItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#dcdcdc',
   },
   countryCodeText: {
      fontSize: 14,
      color: '#34495e',
   },
});

export default Login;