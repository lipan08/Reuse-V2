import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddCarForm = ({ route, navigation }) => {
  const { category, subcategory, product } = route.params;
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    brand: '',
    year: currentYear.toString(),
    fuelType: 'Petrol',
    transmission: 'Automatic',
    kmDriven: '',
    owners: '1st',
    adTitle: '',
    description: '',
    amount: '',
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
            brand: productData.post_details?.brand || '',
            year: productData.post_details?.year?.toString() || currentYear.toString(),
            fuelType: productData.post_details?.fuel || 'Petrol',
            transmission: productData.post_details?.transmission || 'Automatic',
            kmDriven: productData.post_details?.km_driven?.toString() || '',
            owners: productData.post_details?.no_of_owner || '1st',
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

  const generateYears = () => {
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year.toString());
    }
    return years;
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
          <Text style={styles.formHeader}>
            {product ? 'Edit' : 'Add'} {category.name ?? subcategory.name}
          </Text>

          {/* Brand Field */}
          <Text style={styles.label}>Brand *</Text>
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
            selectedValue={formData.year}
            onValueChange={(value) => handleChange('year', value)}
            style={styles.picker}
          >
            {generateYears().map((year) => (
              <Picker.Item key={year} label={year} value={year} />
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

export default AddCarForm;