import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddPgGuestHouse = ({ route }) => {
  const { category, subcategory, product } = route.params;
  const [formData, setFormData] = useState({
    pgType: 'PG',
    furnishing: 'Unfurnished',
    listedBy: 'Owner',
    carParking: '1',
    isMealIncluded: 'No',
    adTitle: '',
    carpetArea: '',
    description: '',
    amount: '',
    images: [], // Changed to handle multiple images
  });

  useEffect(() => {
    if (product) {
      // Populate form fields with existing product data
      setFormData({
        id: product.id,
        pgType: product.post_details.pg_type ?? '',
        furnishing: product.post_details.furnishing ?? '',
        listedBy: product.post_details.listed_by ?? '',
        carParking: product.post_details.car_parking ?? '',
        isMealIncluded: product.post_details.is_meal_included ?? '',
        carpetArea: product.post_details.carpet_area ?? '',
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

  const handleOptionSelection = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0, // Allow multiple image selection
      quality: 1,
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorMessage) {
      console.error('ImagePicker Error:', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      setFormData({
        ...formData,
        images: [...formData.images, ...result.assets.map((asset) => asset.uri)], // Add selected images to the array
      });
    }
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.formHeader}>Add Properties</Text>
          {/* Subtype */}
          <Text style={styles.label}>Type *</Text>
          <View style={styles.optionContainer}>
            {['Guest House', 'PG', 'Roommate'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, formData.pgType === option && styles.selectedOption]}
                onPress={() => handleOptionSelection('pgType', option)}
              >
                <Text style={formData.pgType === option ? styles.selectedText : styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Furnishing */}
          <Text style={styles.label}>Furnishing *</Text>
          <View style={styles.optionContainer}>
            {['Furnished', 'Semi-Furnished', 'Unfurnished'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, formData.furnishing === option && styles.selectedOption]}
                onPress={() => handleOptionSelection('furnishing', option)}
              >
                <Text style={formData.furnishing === option ? styles.selectedText : styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Listed By */}
          <Text style={styles.label}>Listed By *</Text>
          <View style={styles.optionContainer}>
            {['Builder', 'Owner', 'Dealer'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, formData.listedBy === option && styles.selectedOption]}
                onPress={() => handleOptionSelection('listedBy', option)}
              >
                <Text style={formData.listedBy === option ? styles.selectedText : styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Carpet Area */}
          <Text style={styles.label}>Carpet Area (ft²) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Carpet Area"
            keyboardType="numeric"
            value={formData.carpetArea}
            onChangeText={(value) => handleChange('carpetArea', value)}
          />

          {/* Car Parking */}
          <Text style={styles.label}>Car Parking *</Text>
          <View style={styles.optionContainer}>
            {['0', '1', '2', '3', '4', '5', '5+'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, formData.carParking === option && styles.selectedOption]}
                onPress={() => handleOptionSelection('carParking', option)}
              >
                <Text style={formData.carParking === option ? styles.selectedText : styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Meals Included */}
          <Text style={styles.label}>Meals Included *</Text>
          <View style={styles.optionContainer}>
            {['Yes', 'No'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, formData.isMealIncluded === option && styles.selectedOption]}
                onPress={() => handleOptionSelection('isMealIncluded', option)}
              >
                <Text style={formData.isMealIncluded === option ? styles.selectedText : styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Title */}
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            value={formData.adTitle}
            onChangeText={(value) => handleChange('adTitle', value)}
          />

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Enter Description"
            value={formData.description}
            multiline
            onChangeText={(value) => handleChange('description', value)}
          />

          {/* Amount */}
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

        {/* Sticky Submit Button */}
        <View style={styles.stickyButton}>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>{product ? "Update" : "Submit"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
};

export default AddPgGuestHouse;