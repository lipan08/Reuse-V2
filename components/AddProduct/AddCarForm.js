import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';


const AddCarForm = ({ route }) => {
  const { category, subcategory, product } = route.params;
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    brand: '',
    year: currentYear, // Default to the current year
    fuelType: 'Petrol',
    transmission: 'Automatic',
    kmDriven: '',
    owners: '1st',
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
        kmDriven: product.post_details.km_driven.toString() ?? '',
        brand: product.post_details.brand ?? '',
        year: product.post_details.year ?? currentYear,
        transmission: product.post_details.transmission ?? '',
        owners: product.post_details.no_of_owner ?? '',
        fuelType: product.post_details.fuel ?? '',
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
          <Text style={styles.formHeader}>
            Add Product - {category.name ?? subcategory.name}
          </Text>

          {/* Brand Field */}
          <Text style={styles.label}>Brand:</Text>
          <Picker
            selectedValue={formData.brand}
            onValueChange={(value) => handleChange('brand', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Brand" value="" />
            <Picker.Item label="Maruti Suzuki" value="Maruti Suzuki" />
            <Picker.Item label="Hyundai" value="Hyundai" />
            <Picker.Item label="Tata" value="Tata" />
            <Picker.Item label="Mahindra" value="Mahindra" />
            <Picker.Item label="Toyota" value="Toyota" />
            <Picker.Item label="Honda" value="Honda" />
            <Picker.Item label="BYD" value="BYD" />
            <Picker.Item label="Audi" value="Audi" />
            <Picker.Item label="Ambassador" value="Ambassador" />
            <Picker.Item label="Ashok" value="Ashok" />
            <Picker.Item label="Ashok Leyland" value="Ashok Leyland" />
            <Picker.Item label="Aston" value="Aston" />
            <Picker.Item label="Aston Martin" value="Aston Martin" />
            <Picker.Item label="Bajaj" value="Bajaj" />
            <Picker.Item label="Bentley" value="Bentley" />
            <Picker.Item label="Citroen" value="Citroen" />
            <Picker.Item label="McLaren" value="McLaren" />
            <Picker.Item label="Fisker" value="Fisker" />
            <Picker.Item label="BMW" value="BMW" />
            <Picker.Item label="Bugatti" value="Bugatti" />
            <Picker.Item label="Cadillac" value="Cadillac" />
            <Picker.Item label="Caterham" value="Caterham" />
            <Picker.Item label="Chevrolet" value="Chevrolet" />
            <Picker.Item label="Chrysler" value="Chrysler" />
            <Picker.Item label="Conquest" value="Conquest" />
            <Picker.Item label="Daewoo" value="Daewoo" />
            <Picker.Item label="Datsun" value="Datsun" />
            <Picker.Item label="Dc" value="Dc" />
            <Picker.Item label="Dodge" value="Dodge" />
            <Picker.Item label="Eicher Polaris" value="Eicher Polaris" />
            <Picker.Item label="Ferrari" value="Ferrari" />
            <Picker.Item label="Fiat" value="Fiat" />
            <Picker.Item label="Force Motors" value="Force Motors" />
            <Picker.Item label="Ford" value="Ford" />
            <Picker.Item label="Hummer" value="Hummer" />
            <Picker.Item label="ICML" value="ICML" />
            <Picker.Item label="Infiniti" value="Infiniti" />
            <Picker.Item label="Isuzu" value="Isuzu" />
            <Picker.Item label="Jaguar" value="Jaguar" />
            <Picker.Item label="Jeep" value="Jeep" />
            <Picker.Item label="Kia" value="Kia" />
            <Picker.Item label="Lamborghini" value="Lamborghini" />
            <Picker.Item label="Land Rover" value="Land Rover" />
            <Picker.Item label="Lexus" value="Lexus" />
            <Picker.Item label="Mahindra Renault" value="Mahindra Renault" />
            <Picker.Item label="Maserati" value="Maserati" />
            <Picker.Item label="Maybach" value="Maybach" />
            <Picker.Item label="Mazda" value="Mazda" />
            <Picker.Item label="Mercedes-Benz" value="Mercedes-Benz" />
            <Picker.Item label="MG" value="MG" />
            <Picker.Item label="Mini" value="Mini" />
            <Picker.Item label="Mitsubishi" value="Mitsubishi" />
            <Picker.Item label="Nissan" value="Nissan" />
            <Picker.Item label="Opel" value="Opel" />
            <Picker.Item label="Peugeot" value="Peugeot" />
            <Picker.Item label="Porsche" value="Porsche" />
            <Picker.Item label="Premier" value="Premier" />
            <Picker.Item label="Renault" value="Renault" />
            <Picker.Item label="Rolls-Royce" value="Rolls-Royce" />
            <Picker.Item label="San" value="San" />
            <Picker.Item label="Sipani" value="Sipani" />
            <Picker.Item label="Skoda" value="Skoda" />
            <Picker.Item label="Smart" value="Smart" />
            <Picker.Item label="Ssangyong" value="Ssangyong" />
            <Picker.Item label="Subaru" value="Subaru" />
            <Picker.Item label="Volkswagen" value="Volkswagen" />
            <Picker.Item label="Volvo" value="Volvo" />
            <Picker.Item label="Other Brands" value="Other Brands" />
          </Picker>

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
            {['CNG & Hybrids', 'Diesel', 'Electric', 'LPG', 'Petrol'].map((fuel) => (
              <TouchableOpacity
                key={fuel}
                style={[styles.optionButton, formData.fuelType === fuel && styles.selectedOption]}
                onPress={() => handleChange('fuelType', fuel)}
              >
                <Text style={formData.fuelType === fuel ? styles.selectedText : styles.optionText}>{fuel}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Transmission Selection */}
          <Text style={styles.label}>Transmission *</Text>
          <View style={styles.optionContainer}>
            {['Automatic', 'Manual'].map((trans) => (
              <TouchableOpacity
                key={trans}
                style={[styles.optionButton, formData.transmission === trans && styles.selectedOption]}
                onPress={() => handleChange('transmission', trans)}
              >
                <Text style={formData.transmission === trans ? styles.selectedText : styles.optionText}>{trans}</Text>
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
                onPress={() => handleChange('owners', owner)}
              >
                <Text style={formData.owners === owner ? styles.selectedText : styles.optionText}>{owner}</Text>
              </TouchableOpacity>
            ))}
          </View>

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

export default AddCarForm;