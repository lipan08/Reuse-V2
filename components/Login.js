import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, TouchableWithoutFeedback, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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

const AlertModal = ({ visible, type, title, message, onClose }) => {
   const getIconConfig = () => {
      switch (type) {
         case 'success': return { name: 'check-circle', color: '#4CAF50', bg: '#E8F5E9' };
         case 'error': return { name: 'error-outline', color: '#f44336', bg: '#FFEBEE' };
         case 'warning': return { name: 'warning', color: '#FF9800', bg: '#FFF8E1' };
         default: return { name: 'info', color: '#2196F3', bg: '#E3F2FD' };
      }
   };

   const { name, color, bg } = getIconConfig();

   return (
      <Modal visible={visible} transparent animationType="fade">
         <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.alertModalOverlay}>
               <TouchableWithoutFeedback>
                  <View style={styles.modernAlertContainer}>
                     <View style={[styles.iconCircle, { backgroundColor: bg }]}>
                        <MaterialIcons name={name} size={44} color={color} />
                     </View>
                     <Text style={styles.modernAlertTitle}>{title}</Text>
                     <Text style={styles.modernAlertMessage}>{message}</Text>
                     <TouchableOpacity
                        style={[styles.modernAlertButton, { backgroundColor: color }]}
                        onPress={onClose}
                        activeOpacity={0.85}
                     >
                        <Text style={styles.modernAlertButtonText}>OK</Text>
                     </TouchableOpacity>
                  </View>
               </TouchableWithoutFeedback>
            </View>
         </TouchableWithoutFeedback>
      </Modal>
   );
};

const Login = () => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [countryCode, setCountryCode] = useState('+91');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [otp, setOtp] = useState('');
   const [showOtpField, setShowOtpField] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [showAlert, setShowAlert] = useState(false);
   const [alertType, setAlertType] = useState('info');
   const [alertTitle, setAlertTitle] = useState('');
   const [alertMessage, setAlertMessage] = useState('');
   const navigation = useNavigation();
   const otpInputRef = useRef(null);

   useEffect(() => {
      const checkLoginStatus = async () => {
         const token = await AsyncStorage.getItem('authToken');
         if (token) {
            setIsLoggedIn(true);
            navigation.navigate('Home');
         }
      };
      checkLoginStatus();
   }, []);

   const handlePhoneNumberSubmit = async () => {
      if (!phoneNumber || phoneNumber.length < 10) {
         setAlertType('error');
         setAlertTitle('Invalid Phone');
         setAlertMessage('Please enter a valid 10-digit phone number');
         setShowAlert(true);
         return;
      }
      setShowOtpField(true);
      setTimeout(() => {
         otpInputRef.current?.focus();
      }, 100);
   };

   const handleOtpSubmit = async () => {
      try {
         console.log(`${process.env.BASE_URL}/login`);
         const response = await fetch(`${process.env.BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: `${phoneNumber}`, otp }),
         });
         const data = await response.json();
         console.log(data);

         if (response.ok) {
            await AsyncStorage.multiSet([
               ['authToken', data.token],
               ['userId', data.user.id.toString()],
               ['name', data.user.name],
               ['phoneNo', data.user.phone_no],
               ['userName', data.user.name || ''],
               ['userImage', data.user.images?.url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png']
            ]);
            setIsLoggedIn(true);
            navigation.navigate('Home');
         } else {
            setAlertType('error');
            setAlertTitle('Login Failed');
            setAlertMessage(data.message || 'Invalid credentials');
            setShowAlert(true);
         }
      } catch (error) {
         setAlertType('error');
         setAlertTitle('Connection Error');
         setAlertMessage('Please check your internet connection');
         setShowAlert(true);
      }
   };

   const handleLogout = async () => {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
      setShowOtpField(false);
      setCountryCode('+91');
      setPhoneNumber('');
      setOtp('');
   };

   const filteredCountries = countryCodes.filter(country =>
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
      <>
         <StatusBar backgroundColor="#f0f4f8" barStyle="dark-content" />
         <View style={styles.container}>
            <AlertModal
               visible={showAlert}
               type={alertType}
               title={alertTitle}
               message={alertMessage}
               onClose={() => setShowAlert(false)}
            />


            <Text style={styles.loginTitle}>Welcome to Reuse!</Text>
            <Text style={styles.loginSubtitle}>Login to your account</Text>

            <View style={styles.phoneInputContainer}>
               <TouchableOpacity
                  style={styles.countryCodeInput}
                  onPress={() => setIsModalVisible(true)}
                  activeOpacity={0.8}
               >
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
               </TouchableOpacity>

               <TextInput
                  style={styles.phoneNumberInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
               />
            </View>

            {showOtpField && (
               <TextInput
                  ref={otpInputRef}
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#999"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  autoFocus={true}
               />
            )}

            <TouchableOpacity
               style={styles.loginButton}
               onPress={showOtpField ? handleOtpSubmit : handlePhoneNumberSubmit}
               activeOpacity={0.8}
            >
               <Text style={styles.buttonText}>
                  {showOtpField ? 'Verify OTP' : 'Send OTP'}
               </Text>
            </TouchableOpacity>

            {isLoggedIn && (
               <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Logout</Text>
               </TouchableOpacity>
            )}

            {/* Country Code Selection Modal */}
            <Modal visible={isModalVisible} transparent animationType="slide">
               <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
                  <View style={styles.modalOverlay}>
                     <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                           <View style={styles.modalHeader}>
                              <Text style={styles.modalTitle}>Select Country</Text>
                              <TouchableOpacity
                                 onPress={() => setIsModalVisible(false)}
                                 style={styles.closeButton}
                              >
                                 <MaterialIcons name="close" size={24} color="#666" />
                              </TouchableOpacity>
                           </View>

                           <View style={styles.searchContainer}>
                              <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
                              <TextInput
                                 style={styles.searchInput}
                                 placeholder="Search country or code"
                                 placeholderTextColor="#999"
                                 value={searchQuery}
                                 onChangeText={setSearchQuery}
                              />
                           </View>

                           <FlatList
                              data={filteredCountries}
                              keyExtractor={(item) => item.code}
                              renderItem={renderCountryCodeItem}
                              keyboardDismissMode="on-drag"
                              contentContainerStyle={styles.countryList}
                           />
                        </View>
                     </TouchableWithoutFeedback>
                  </View>
               </TouchableWithoutFeedback>
            </Modal>
         </View>
      </>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 32,
      backgroundColor: '#f8f9fa',
      justifyContent: 'center',
   },
   loginTitle: {
      fontSize: 32,
      fontWeight: '800',
      color: '#2d3436',
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: -0.5,
   },
   loginSubtitle: {
      fontSize: 16,
      color: '#7f8c8d',
      marginBottom: 40,
      textAlign: 'center',
      fontWeight: '500',
   },
   phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      backgroundColor: '#fff',
      borderRadius: 16,
      paddingHorizontal: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
   },
   countryCodeInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
   },
   countryCodeText: {
      fontSize: 16,
      color: '#2d3436',
      fontWeight: '600',
      marginRight: 8,
   },
   phoneNumberInput: {
      flex: 1,
      height: 56,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#2d3436',
      fontWeight: '500',
   },
   input: {
      height: 56,
      borderWidth: 0,
      borderRadius: 16,
      paddingHorizontal: 20,
      backgroundColor: '#fff',
      marginBottom: 20,
      fontSize: 16,
      color: '#2d3436',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
   },
   loginButton: {
      backgroundColor: '#0984e3',
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      elevation: 4,
      shadowColor: '#0984e3',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
   },
   // Modern Alert Modal Styles
   alertModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
   },
   modernAlertContainer: {
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 32,
      width: '100%',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
   },
   iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
   },
   modernAlertTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: '#2d3436',
      marginBottom: 12,
      textAlign: 'center',
   },
   modernAlertMessage: {
      fontSize: 16,
      color: '#636e72',
      marginBottom: 28,
      textAlign: 'center',
      lineHeight: 24,
      fontWeight: '400',
   },
   modernAlertButton: {
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 44,
      overflow: 'hidden',
      alignSelf: 'stretch',
      alignItems: 'center',
   },
   modernAlertButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
   },
   // Country Code Modal
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
   },
   modalContainer: {
      backgroundColor: '#fff',
      height: '60%',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingTop: 16,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f2f6',
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#2d3436',
   },
   searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 12,
      backgroundColor: '#f1f2f6',
      borderRadius: 14,
   },
   searchIcon: {
      marginLeft: 12,
      marginRight: 8,
   },
   searchInput: {
      flex: 1,
      height: 52,
      backgroundColor: 'transparent',
      borderRadius: 14,
      fontSize: 16,
      color: '#2d3436',
      fontWeight: '500',
      paddingLeft: 0, // Remove extra padding
   },

   countryCodeItem: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f2f6',
   },
});

export default Login;