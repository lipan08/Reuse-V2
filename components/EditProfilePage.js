import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    businessType: '',
    businessAddress: '',
    profileImage: null,
    businessWebsite: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch profile data from the API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const apiUrl = `${process.env.BASE_URL}/get-my-profile`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
          const profile = responseData.data;

          // Split the name into first and last name
          const [firstName, lastName] = profile.name.split(', ');

          // Update the state with the fetched data
          setUserData({
            firstName: firstName || '',
            lastName: lastName || '',
            email: profile.email || '',
            phoneNumber: profile.phone_no || '',
            businessName: profile.company_detail?.name || '',
            businessType: profile.company_detail?.type || '',
            businessAddress: profile.company_detail?.address || '',
            businessWebsite: profile.company_detail?.website || '',
            profileImage: profile.images?.url || '',
            bio: profile.about_me || '',
          });
          console.log('Profile image URL:', profile.images.url);
        } else {
          console.error('Failed to fetch profile data:', responseData.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleChooseImage = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorMessage) {
      console.error('ImagePicker Error:', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setUserData({ ...userData, profileImage: selectedImage });
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId'); // Assuming user ID is stored in AsyncStorage
      const apiUrl = `${process.env.BASE_URL}/users/${userId}`;
      const formDataToSend = new FormData();

      // Append standard fields
      Object.keys(userData).forEach((key) => {
        if (key !== 'profileImage') {
          formDataToSend.append(key, userData[key]);
        }
      });

      // Append profile image if it exists
      if (userData.profileImage) {
        formDataToSend.append('profile_image', {
          uri: userData.profileImage,
          type: 'image/jpeg',
          name: `profile_${Date.now()}.jpg`,
        });
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Profile updated successfully!',
          button: 'close',
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Validation Error',
          textBody: responseData.message || 'Something went wrong!',
          button: 'close',
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Network Error',
        textBody: 'Failed to connect to the server',
        button: 'close',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.header}>Edit Your Profile</Text>

            <TouchableOpacity style={styles.imagePicker} onPress={handleChooseImage}>
              {userData.profileImage ? (
                <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
              ) : (
                <Ionicons name="camera" size={40} color="#ccc" />
              )}
            </TouchableOpacity>

            {/* Personal Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Personal Details</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={[styles.input, { marginRight: 10 }]}
                  placeholder="First Name"
                  value={userData.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={userData.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={userData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={userData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Business Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Business Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Business Name"
                value={userData.businessName}
                onChangeText={(text) => handleChange('businessName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Business Type"
                value={userData.businessType}
                onChangeText={(text) => handleChange('businessType', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Business Address"
                value={userData.businessAddress}
                onChangeText={(text) => handleChange('businessAddress', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Business Website"
                value={userData.businessWebsite}
                onChangeText={(text) => handleChange('businessWebsite', text)}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Bio Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>About You</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about yourself"
                value={userData.bio}
                onChangeText={(text) => handleChange('bio', text)}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007BFF',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default EditProfilePage;