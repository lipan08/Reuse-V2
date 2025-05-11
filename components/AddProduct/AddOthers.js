import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/css/AddProductForm.styles.js';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAP_API_KEY; // Replace with your API key
const DEBOUNCE_TIME = 300;

const AddOthers = ({ route, navigation }) => {
  const { subcategory, product } = route.params;
  const [formData, setFormData] = useState({
    adTitle: '',
    description: '',
    amount: '',
    address: '',
    latitude: null,
    longitude: null,
    images: [],
    deletedImages: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const skipNextApiCallRef = useRef(false);
  const [inputLayout, setInputLayout] = useState(null); // Track input field position

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
            adTitle: productData.title || '',
            description: productData.post_details?.description || '',
            amount: productData.post_details?.amount?.toString() || '',
            address: productData.post_details?.address || '',
            latitude: productData.post_details?.latitude || null,
            longitude: productData.post_details?.longitude || null,
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (skipNextApiCallRef.current) {
        skipNextApiCallRef.current = false;
        return;
      }

      if (searchQuery.length >= 3) {
        fetchPredictions(searchQuery);
      } else {
        setPredictions([]);
      }
    }, DEBOUNCE_TIME);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchPredictions = async (text) => {
    setIsLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_PLACES_API_KEY}&components=country:in`;
      const response = await fetch(url);
      const json = await response.json();
      setPredictions(json.predictions || []);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = async (placeId) => {
    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(detailsUrl);
      const json = await response.json();

      if (json.result?.geometry?.location) {
        const { lat, lng } = json.result.geometry.location;
        skipNextApiCallRef.current = true; // Set flag before updating query
        setSearchQuery(json.result.formatted_address);
        setFormData((prev) => ({
          ...prev,
          address: json.result.formatted_address,
          latitude: lat,
          longitude: lng,
        }));
        setPredictions([]); // Hide predictions after selection
      }
    } catch (error) {
      console.error('Details error:', error);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      const response = await submitForm(formData, subcategory);

      if (response.success) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Autocomplete Predictions */}
        {predictions.length > 0 && inputLayout && (
          <FlatList
            style={[
              localStyles.predictionsList,
              { top: inputLayout.y + inputLayout.height }, // Position below the input
            ]}
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={localStyles.predictionItem}
                onPress={() => handlePlaceSelect(item.place_id)}
              >
                <Text style={localStyles.predictionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.formHeader}>
            {product ? 'Edit' : 'Create'} {subcategory.name}
          </Text>

          {/* Title Field */}
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            value={formData.adTitle}
            onChangeText={(v) => setFormData({ ...formData, adTitle: v })}
          />

          {/* Description Field */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Enter Description"
            value={formData.description}
            multiline
            onChangeText={v => handleChange('description', v)}
          />

          {/* Amount Field */}
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            keyboardType="numeric"
            value={formData.amount}
            onChangeText={v => handleChange('amount', v)}
          />

          {/* Address Field */}
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Search Address"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (predictions.length > 0) setPredictions([]);
            }}
            onLayout={(event) => setInputLayout(event.nativeEvent.layout)} // Capture input position
          />

          {/* Image Picker */}
          <ImagePickerComponent formData={formData} setFormData={setFormData} />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.stickyButton}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Processing...' : product ? 'Update' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
};

const localStyles = StyleSheet.create({
  predictionsList: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    maxHeight: 200,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  predictionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default AddOthers;