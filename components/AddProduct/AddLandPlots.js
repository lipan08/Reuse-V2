import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddLandPlots = ({ route }) => {
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
  });

  useEffect(() => {
    if (product) {
      // Populate form fields with existing product data
      setFormData({
        id: product.id,
        listedBy: product.post_details.listed_by ?? '',
        plotArea: product.post_details.carpet_area ?? '',
        length: product.post_details.length ?? '',
        breadth: product.post_details.breadth ?? '',
        projectName: product.post_details.project_name ?? '',
        facing: product.post_details.facing ?? '',
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.formHeader}>Add Properties</Text>
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

export default AddLandPlots;