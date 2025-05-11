import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddJob = ({ route, navigation }) => {
  const { category, subcategory, product } = route.params;
  const [formData, setFormData] = useState({
    salaryPeriod: 'Monthly',
    positionType: 'Full-time',
    salaryFrom: '',
    salaryTo: '',
    adTitle: '',
    description: '',
    images: [],
    deletedImages: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!product); // Show loader only if editing

  // Fetch product details if editing
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product) return;

      setIsLoading(true); // Show loader immediately

      try {
        const token = await AsyncStorage.getItem('authToken');
        const apiURL = `${process.env.BASE_URL}/posts/${product.id}`;
        const response = await fetch(apiURL, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const productData = data.data;

          // Initialize form data with API response
          setFormData({
            id: productData.id,
            salaryPeriod: productData.post_details?.salary_period || 'Monthly',
            positionType: productData.post_details?.position_type || 'Full-time',
            salaryFrom: productData.post_details?.salary_from || '',
            salaryTo: productData.post_details?.salary_to || '',
            adTitle: productData.title || '',
            description: productData.post_details?.description || '',
            images: productData.images?.map((url, index) => ({
              id: index,
              uri: url,
              isNew: false,
            })) || [],
            deletedImages: [],
          });
        } else {
          console.error('Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [product]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelection = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await submitForm(formData, subcategory);

      if (response.success) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loaderText}>Loading job details...</Text>
      </View>
    );
  }

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.formHeader}>{product ? 'Edit' : 'Add'} Job</Text>

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
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.stickyButton}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              isSubmitting && styles.disabledButton,
            ]}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Processing...' : product ? 'Update' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
};

export default AddJob;