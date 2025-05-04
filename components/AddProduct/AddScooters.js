import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { submitForm } from '../../service/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddScooters = ({ route }) => {
  const { category, subcategory, product } = route.params;
  const [brands, setBrands] = useState([]);
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    brand: '',
    adTitle: '',
    year: currentYear,
    km_driven: '',
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
        year: product.post_details.year ?? '',
        km_driven: product.post_details.km_driven ?? '',
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

  const generateYears = () => {
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year.toString());
    }
    return years;
  };

  useEffect(() => {
    const getScooterBrand = async () => {
      const token = await AsyncStorage.getItem('authToken');
      try {
        const response = await fetch(`${process.env.BASE_URL}/scooter/brand`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const responseData = await response.json();
        if (response.ok) {
          setBrands(responseData);
        } else {
          console.log('Scooter/Brand: ', responseData);
        }
      } catch (error) {
        console.log('Something went wrong!', error);
      }
    };
    getScooterBrand();
  }, []);

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
          <Text style={styles.formHeader}>Add Scooters</Text>

          {/* Brand Selection */}
          <Text style={styles.label}>Brand *</Text>
          <Picker
            selectedValue={formData.brand}
            onValueChange={(value) => handleChange('brand', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a brand" value="" />
            {brands.map((brand) => (
              <Picker.Item key={brand} label={brand} value={brand} />
            ))}
          </Picker>

          {/* Year Dropdown */}
          <Text style={styles.label}>Year *</Text>
          <Picker
            selectedValue={formData.year} // Tracks the selected value
            onValueChange={(value) => handleChange('year', value)} // Updates the selected value
            style={styles.picker}
          >
            {generateYears().map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>

          {/* KM Driven Field */}
          <Text style={styles.label}>KM Driven *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter KM driven"
            value={formData.km_driven}
            onChangeText={(value) => handleChange('km_driven', value)}
          />

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

export default AddScooters;