import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddJob = ({ route }) => {
  const { category, subcategory, product } = route.params;
  const [formData, setFormData] = useState({
    salaryPeriod: 'Monthly',
    positionType: 'Full-time',
    salaryFrom: '',
    salaryTo: '',
    adTitle: '',
    description: '',
    images: [],
  });

  useEffect(() => {
    if (product) {
      // Populate form fields with existing product data
      setFormData({
        id: product.id,
        salaryPeriod: product.post_details.salary_period ?? '',
        positionType: product.post_details.position_type ?? '',
        salaryFrom: product.post_details.salary_from ?? '',
        salaryTo: product.post_details.salary_to ?? '',
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
          <Text style={styles.formHeader}>Add Job</Text>

          {/* Salary Period Selection */}
          <Text style={styles.label}>Salary Period *</Text>
          <View style={styles.optionContainer}>
            {['Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[styles.optionButton, formData.salaryPeriod === period && styles.selectedOption]}
                onPress={() => handleSelection('salaryPeriod', period)}
              >
                <Text style={formData.salaryPeriod === period ? styles.selectedText : styles.optionText}>{period}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Position Type Selection */}
          <Text style={styles.label}>Position Type *</Text>
          <View style={styles.optionContainer}>
            {['Contract', 'Full-time', 'Part-time', 'Temporary'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.optionButton, formData.positionType === type && styles.selectedOption]}
                onPress={() => handleSelection('positionType', type)}
              >
                <Text style={formData.positionType === type ? styles.selectedText : styles.optionText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Salary From Field */}
          <Text style={styles.label}>Salary From *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Salary From"
            keyboardType="numeric"
            value={formData.salaryFrom}
            onChangeText={(value) => handleChange('salaryFrom', value)}
          />

          {/* Salary To Field */}
          <Text style={styles.label}>Salary To *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Salary To"
            keyboardType="numeric"
            value={formData.salaryTo}
            onChangeText={(value) => handleChange('salaryTo', value)}
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

export default AddJob;