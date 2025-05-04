import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Corrected import
import { launchImageLibrary } from 'react-native-image-picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddCommercialHeavyVehicle = ({ route }) => {
  const { category, subcategory, product } = route.params;
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    brand: '',
    year: currentYear.toString(), // Changed to string
    fuelType: 'Diesel',
    condition: 'Fair',
    owners: '1st',
    listedBy: 'Owner',
    adTitle: '',
    description: '',
    contact_name: '',
    contact_phone: '',
    amount: '',
    kmDriven: '', // Added missing field
    images: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        brand: product.post_details.brand ?? '',
        year: product.post_details.year?.toString() ?? currentYear.toString(),
        fuelType: product.post_details.fuel_type ?? 'Diesel',
        condition: product.post_details.condition ?? 'Fair',
        owners: product.post_details.owner ?? '1st',
        listedBy: product.post_details.listed_by ?? 'Owner',
        adTitle: product.title ?? '',
        description: product.post_details.description ?? '',
        amount: product.post_details.amount ?? '',
        kmDriven: product.post_details.km_driven ?? '', // Populate kmDriven
        images: product.images || [],
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

  const handleFuelSelection = (type) => {
    setFormData({ ...formData, fuelType: type });
  };

  const handleConditionSelection = (type) => {
    setFormData({ ...formData, condition: type });
  };

  const handleTransmissionSelection = (type) => {
    setFormData({ ...formData, transmission: type });
  };

  const handleOwnersSelection = (type) => {
    setFormData({ ...formData, owners: type });
  };

  const vehicleBrands = [
    'Tata Motors Limited',
    'Mahindra & Mahindra Limited',
    'Eicher Motors Limited',
    'Ashok Leyland Limited',
    'Force Motors Limited',
    'SML ISUZU Limited',
    'Hindustan Motors',
    "Daimler India Commercial Vehicles' BharatBenz",
    'Volvo Trucks',
    'Asia Motorworks',
    'Scania Commercial Vehicles India Pvt. Ltd.',
    'MAN Trucks India Pvt. Ltd.',
    'Iveco',
    'Bharat Earth Movers Limited (BEML)',
    'JCB India Limited',
    'Komatsu India Private Limited',
    'Caterpillar India',
    'John Deere India Private Limited',
    'Case New Holland Construction Equipment India Private Limited',
    'L&T Construction Equipment Limited',
    'Others',
  ];

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
          <Text style={styles.formHeader}>Add: {subcategory.name}</Text>

          {/* Brand Selection */}
          <Text style={styles.label}>Type *</Text>
          <Picker
            selectedValue={formData.brand}
            onValueChange={(value) => handleChange('brand', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Brand" value="" />
            {vehicleBrands.map((brand, index) => (
              <Picker.Item key={index} label={brand} value={brand} />
            ))}
          </Picker>


          {/* Condition Selection */}
          <Text style={styles.label}>Condition *</Text>
          <View style={styles.optionContainer}>
            {['New', 'Like new', 'Fair', 'Needs repair'].map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[styles.optionButton, formData.condition === condition && styles.selectedOption]}
                onPress={() => handleConditionSelection(condition)}
              >
                <Text style={formData.condition === condition ? styles.selectedText : styles.optionText}>{condition}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Year Dropdown */}
          <Text style={styles.label}>Year *</Text>
          <Picker
            selectedValue={formData.year} // Tracks the selected value
            onValueChange={(value) => handleChange('year', value)} // Updates the selected value
            style={styles.picker}
          >
            {generateYears().map((year) => (
              <Picker.Item
                key={year}
                label={year}
                value={year}
              />
            ))}
          </Picker>

          {/* Fuel Type Selection */}
          <Text style={styles.label}>Fuel Type *</Text>
          <View style={styles.optionContainer}>
            {['Diesel', 'Electric', 'Others'].map((fuel) => (
              <TouchableOpacity
                key={fuel}
                style={[styles.optionButton, formData.fuelType === fuel && styles.selectedOption]}
                onPress={() => handleFuelSelection(fuel)}
              >
                <Text style={formData.fuelType === fuel ? styles.selectedText : styles.optionText}>{fuel}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* KM Driven Field */}
          <Text style={styles.label}>KM Driven *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter KM Driven"
            keyboardType="numeric"
            value={formData.kmDriven}
            onChangeText={(value) => handleChange('kmDriven', value)}
          />

          {/* Number of Owners Selection */}
          <Text style={styles.label}>Number of Owners *</Text>
          <View style={styles.optionContainer}>
            {['1st', '2nd', '3rd', '4th', '5th', '6th'].map((owner) => (
              <TouchableOpacity
                key={owner}
                style={[styles.optionButton, formData.owners === owner && styles.selectedOption]}
                onPress={() => handleOwnersSelection(owner)}
              >
                <Text style={formData.owners === owner ? styles.selectedText : styles.optionText}>{owner}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Listed By *</Text>
          <View style={styles.optionContainer}>
            {['Dealer', 'Owner'].map((listedByOption) => (
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

          {/* Contact Name */}
          <Text style={styles.label}>Contact Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Contact Name"
            value={formData.contact_name}
            onChangeText={(value) => handleChange('contact_name', value)}
          />

          {/* Contact Phone */}
          <Text style={styles.label}>Contact Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Contact Phone"
            keyboardType="phone-pad"
            value={formData.contact_phone}
            onChangeText={(value) => handleChange('contact_phone', value)}
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

export default AddCommercialHeavyVehicle;
