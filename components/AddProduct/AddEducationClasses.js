import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddEducationClasses = ({ route }) => {
  const { category, subcategory, product } = route.params;
  const [formData, setFormData] = useState({
    type: '',
    adTitle: '',
    description: '',
    images: [],
  });

  useEffect(() => {
    if (product) {
      // Populate form fields with existing product data
      setFormData({
        id: product.id,
        type: product.post_details.type ?? '',
        adTitle: product.title ?? '',
        description: product.post_details.description ?? '',
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

  const handleSelection = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    submitForm(formData, subcategory)  // Use the centralized function
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
          <Text style={styles.formHeader}>Add {subcategory.name}</Text>

          {/* Type Selection */}
          <Text style={styles.label}>Type *</Text>
          <View style={styles.optionContainer}>
            {['Tutions', 'Hobby Classes', 'Skill Development', 'Others'].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.optionButton, formData.type === val && styles.selectedOption]}
                onPress={() => handleSelection('type', val)}
              >
                <Text style={formData.type === val ? styles.selectedText : styles.optionText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

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

export default AddEducationClasses;