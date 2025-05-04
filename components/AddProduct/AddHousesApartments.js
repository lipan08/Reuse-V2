import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddHousesApartments = ({ route }) => {
  const { category, subcategory, product } = route.params;
  const [formData, setFormData] = useState({
    propertyType: 'Apartments',
    bedroom: '2',
    bathroom: '1',
    furnishing: 'Unfurnished',
    constructionStatus: 'Ready to Move',
    listedBy: 'Owner',
    carParking: '1',
    facing: 'East',
    superBuiltupArea: '',
    carpetArea: '',
    maintenance: '',
    totalFloors: '',
    floorNo: '',
    projectName: '',
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
        adTitle: product.title ?? '',
        description: product.post_details.description ?? '',
        amount: product.post_details.amount ?? '',
        propertyType: product.post_details.property_type ?? '',
        bedroom: product.post_details.bedrooms.toString() ?? '',
        bathroom: product.post_details.bathrooms ?? '',
        furnishing: product.post_details.furnishing ?? '',
        constructionStatus: product.post_details.construction_status ?? '',
        listedBy: product.post_details.listed_by ?? '',
        carParking: product.post_details.car_parking.toString() ?? '',
        facing: product.post_details.facing ?? '',
        superBuiltupArea: product.post_details.super_builtup_area.toString() ?? '',
        carpetArea: product.post_details.carpet_area.toString() ?? '',
        maintenance: product.post_details.maintenance ?? '',
        totalFloors: product.post_details.total_floors ?? '',
        floorNo: product.post_details.floor_no ?? '',
        projectName: product.post_details.project_name ?? '',
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
          {/* Type Selection */}
          <Text style={styles.label}>Type *</Text>
          <View style={styles.optionContainer}>
            {['Apartments', 'Builder Floors', 'Farm Houses', 'Houses & Villas'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, formData.propertyType === option && styles.selectedOption]}
                onPress={() => handleOptionSelection('propertyType', option)}
              >
                <Text style={formData.propertyType === option ? styles.selectedText : styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bedroom Selection */}
          <Text style={styles.label}>Bedroom *</Text>
          <View style={styles.optionContainer}>
            {['1', '2', '3', '4', '4+'].map((bedroom) => (
              <TouchableOpacity
                key={bedroom}
                style={[styles.optionButton, formData.bedroom === bedroom && styles.selectedOption]}
                onPress={() => handleOptionSelection('bedroom', bedroom)}
              >
                <Text style={formData.bedroom === bedroom ? styles.selectedText : styles.optionText}>{bedroom}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bathroom Selection */}
          <Text style={styles.label}>Bathroom *</Text>
          <View style={styles.optionContainer}>
            {['1', '2', '3', '4', '4+'].map((bathroom) => (
              <TouchableOpacity
                key={bathroom}
                style={[styles.optionButton, formData.bathroom === bathroom && styles.selectedOption]}
                onPress={() => handleOptionSelection('bathroom', bathroom)}
              >
                <Text style={formData.bathroom === bathroom ? styles.selectedText : styles.optionText}>{bathroom}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Facing */}
          <View style={styles.container}>
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
          </View>

          {/* Furnishing Selection */}
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

          {/* Construction Status Selection */}
          <Text style={styles.label}>Construction Status *</Text>
          <View style={styles.optionContainer}>
            {['New Launch', 'Under Construction', 'Ready to Move'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, formData.constructionStatus === option && styles.selectedOption]}
                onPress={() => handleOptionSelection('constructionStatus', option)}
              >
                <Text style={formData.constructionStatus === option ? styles.selectedText : styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Listed By Selection */}
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

          {/* Car Parking Selection */}
          <Text style={styles.label}>Car Parking *</Text>
          <View style={styles.optionContainer}>
            {['0', '1', '2', '3', '3+'].map((parking) => (
              <TouchableOpacity
                key={parking}
                style={[styles.optionButton, formData.carParking === parking && styles.selectedOption]}
                onPress={() => handleOptionSelection('carParking', parking)}
              >
                <Text style={formData.carParking === parking ? styles.selectedText : styles.optionText}>{parking}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Super Builtup Area */}
          <Text style={styles.label}>Super Builtup Area (ft²)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Super Builtup Area"
            keyboardType="numeric"
            value={formData.superBuiltupArea}
            onChangeText={(value) => handleChange('superBuiltupArea', value)}
          />

          {/* Carpet Area */}
          <Text style={styles.label}>Carpet Area (ft²) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Carpet Area"
            keyboardType="numeric"
            value={formData.carpetArea}
            onChangeText={(value) => handleChange('carpetArea', value)}
          />


          {/* Ad Title Field */}
          <Text style={styles.label}>Ad Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Ad Title"
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

export default AddHousesApartments;