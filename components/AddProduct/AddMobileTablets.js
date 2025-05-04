import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddMobileTablets = ({ route }) => {
  const { category, subcategory, product } = route.params;
  const [formData, setFormData] = useState({
    brand: 'xiaomi',
    adTitle: '',
    description: '',
    amount: '',
    images: [],
  });

  useEffect(() => {
    if (product) {
      // Populate form fields with existing product data
      setFormData({
        id: product.id,
        brand: product.post_details.brand ?? '',
        adTitle: product.title ?? '',
        description: product.post_details.description ?? '',
        amount: product.post_details.amount ?? '',
        images: product.images || [], // Set existing images
      });
    }
  }, [product]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    submitForm(formData, subcategory) // Use the centralized function
      .then((response) => {
        console.log('Form submitted successfully', response);
      })
      .catch((error) => {
        console.error('Error submitting form', error);
      });
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.formHeader}>Add Mobile/Tablets</Text>

          {/* Brand Selection */}
          <Text style={styles.label}>Brand *</Text>
          <Picker
            selectedValue={formData.brand}
            onValueChange={(value) => handleChange('brand', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Brand" value="" />
            <Picker.Item label="iPhone" value="iphone" />
            <Picker.Item label="Samsung" value="samsung" />
            <Picker.Item label="Xiaomi" value="xiaomi" />
            <Picker.Item label="Vivo" value="vivo" />
            <Picker.Item label="Oppo" value="oppo" />
            <Picker.Item label="Realme" value="realme" />
            <Picker.Item label="Asus" value="asus" />
            <Picker.Item label="BlackBerry" value="blackberry" />
            <Picker.Item label="Gionee" value="gionee" />
            <Picker.Item label="Google Pixel" value="google-pixel" />
            <Picker.Item label="Honor" value="honor" />
            <Picker.Item label="HTC" value="htc" />
            <Picker.Item label="Huawei" value="huawei" />
            <Picker.Item label="Infinix" value="infinix" />
            <Picker.Item label="Intex" value="intex" />
            <Picker.Item label="Karbonn" value="karbonn" />
            <Picker.Item label="Lava" value="lava" />
            <Picker.Item label="Lenovo" value="lenovo" />
            <Picker.Item label="LG" value="lg" />
            <Picker.Item label="Micromax" value="micromax" />
            <Picker.Item label="Motorola" value="motorola" />
            <Picker.Item label="Nokia" value="nokia" />
            <Picker.Item label="One Plus" value="one-plus" />
            <Picker.Item label="Sony" value="sony" />
            <Picker.Item label="Techno" value="techno" />
            <Picker.Item label="Other Mobiles" value="other-mobiles" />
          </Picker>

          {/* Title Field */}
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            value={formData.adTitle}
            onChangeText={(value) => handleChange('adTitle', value)}
          />

          {/* Description Field */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Enter Description"
            value={formData.description}
            multiline
            onChangeText={(value) => handleChange('description', value)}
          />

          {/* Amount Field */}
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            keyboardType="numeric"
            value={formData.amount}
            onChangeText={(value) => handleChange('amount', value)}
          />

          {/* Image Picker */}
          <ImagePickerComponent
            formData={formData}
            setFormData={setFormData}
          />
          {/* Display Selected Images */}
        </ScrollView>

        {/* Fixed Submit Button */}
        <View style={styles.stickyButton}>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>{product ? "Update" : "Submit"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
};

export default AddMobileTablets;