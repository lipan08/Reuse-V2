import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddLandPlots = ({ route, navigation }) => {
  const { category, subcategory, product } = route.params;
  const [formData, setFormData] = useState({
    listedBy: 'Owner',
    plotArea: '',
    length: '',
    breadth: '',
    projectName: '',
    adTitle: '',
    description: '',
    amount: '',
    facing: 'East',
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
          console.log(productData);
          // Initialize form data with API response
          setFormData({
            id: productData.id,
            listedBy: productData.post_details?.listed_by || 'Owner',
            plotArea: productData.post_details?.carpet_area ? productData.post_details.carpet_area.toString() : '',
            length: productData.post_details?.length ? productData.post_details.length.toString() : '',
            breadth: productData.post_details?.breadth ? productData.post_details.breadth.toString() : '',
            projectName: productData.post_details?.project_name || '',
            facing: productData.post_details?.facing || 'East',
            adTitle: productData.title || '',
            description: productData.post_details?.description || '',
            amount: productData.post_details?.amount?.toString() || '',
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
        <Text style={styles.loaderText}>Loading product details...</Text>
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
          <Text style={styles.formHeader}>{product ? 'Edit' : 'Add'} Land/Plots</Text>

          {/* Listed By */}
          <Text style={styles.label}>Listed By *</Text>
          <View style={styles.optionContainer}>
            {['Dealer', 'Owner', 'Builder'].map((listedByOption) => (
              <TouchableOpacity
                key={listedByOption}
                style={[styles.optionButton, formData.listedBy === listedByOption && styles.selectedOption]}
                onPress={() => handleChange('listedBy', listedByOption)}
              >
                <Text style={formData.listedBy === listedByOption ? styles.selectedText : styles.optionText}>
                  {listedByOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Facing */}
          <Text style={styles.label}>Facing *</Text>
          <View style={styles.optionContainer}>
            {['East', 'North', 'South', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map((facingOption) => (
              <TouchableOpacity
                key={facingOption}
                style={[styles.optionButton, formData.facing === facingOption && styles.selectedOption]}
                onPress={() => handleChange('facing', facingOption)}
              >
                <Text style={formData.facing === facingOption ? styles.selectedText : styles.optionText}>
                  {facingOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Plot Area */}
          <Text style={styles.label}>Plot Area (ft²) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Plot Area"
            keyboardType="numeric"
            value={formData.plotArea}
            onChangeText={(value) => handleChange('plotArea', value)}
          />

          {/* Length */}
          <Text style={styles.label}>Length (ft)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Length"
            keyboardType="numeric"
            value={formData.length}
            onChangeText={(value) => handleChange('length', value)}
          />

          {/* Breadth */}
          <Text style={styles.label}>Breadth (ft)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Breadth"
            keyboardType="numeric"
            value={formData.breadth}
            onChangeText={(value) => handleChange('breadth', value)}
          />

          {/* Project Name */}
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Project Name"
            value={formData.projectName}
            onChangeText={(value) => handleChange('projectName', value)}
          />

          {/* Title */}
          <Text style={styles.label}>Ad Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Ad Title"
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

export default AddLandPlots;