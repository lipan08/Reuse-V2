import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { submitForm } from '../../service/apiService';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ImagePickerComponent from './SubComponent/ImagePickerComponent';
import styles from '../../assets/css/AddProductForm.styles.js';

const AddShopOffices = ({ route }) => {
    const { category, subcategory, product } = route.params;
    const [formData, setFormData] = useState({
        furnishing: 'Unfurnished',
        constructionStatus: 'Ready to Move',
        listedBy: 'Owner',
        carParking: '1',
        superBuiltUpArea: '',
        carpetArea: '',
        maintenance: '',
        washroom: '',
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
                furnishing: product.post_details.furnishing ?? '',
                constructionStatus: product.post_details.construction_status ?? '',
                listedBy: product.post_details.listed_by ?? '',
                carParking: product.post_details.car_parking ?? '',
                superBuiltUpArea: product.post_details.super_builtup_area ?? '',
                carpetArea: product.post_details.carpet_area ?? '',
                maintenance: product.post_details.maintenance ?? '',
                washroom: product.post_details.washroom ?? '',
                projectName: product.post_details.project_name ?? '',
                adTitle: product.title ?? '',
                description: product.post_details.description ?? '',
                amount: product.post_details.amount ?? '',
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
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.formHeader}>Add Properties</Text>
                    {/* Furnishing */}
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

                    {/* Construction Status */}
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

                    {/* Listed By */}
                    <Text style={styles.label}>Listed By *</Text>
                    <View style={styles.optionContainer}>
                        {['Builder', 'Dealer', 'Owner'].map((option) => (
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

                    {/* Car Parking */}
                    <Text style={styles.label}>Car Parking *</Text>
                    <View style={styles.optionContainer}>
                        {['0', '1', '2', '3', '3+'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.optionButton, formData.carParking === option && styles.selectedOption]}
                                onPress={() => handleOptionSelection('carParking', option)}
                            >
                                <Text style={formData.carParking === option ? styles.selectedText : styles.optionText}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Super Built-up Area */}
                    <Text style={styles.label}>Super Built-up Area (ft²) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Super Built-up Area"
                        keyboardType="numeric"
                        value={formData.superBuiltUpArea}
                        onChangeText={(value) => handleChange('superBuiltUpArea', value)}
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

                    {/* Maintenance */}
                    <Text style={styles.label}>Maintenance (Monthly)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Maintenance"
                        keyboardType="numeric"
                        value={formData.maintenance}
                        onChangeText={(value) => handleChange('maintenance', value)}
                    />

                    {/* Washrooms */}
                    <Text style={styles.label}>Washrooms</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Number of Washrooms"
                        keyboardType="numeric"
                        value={formData.washroom}
                        onChangeText={(value) => handleChange('washroom', value)}
                    />

                    {/* Project Name */}
                    <Text style={styles.label}>Project Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Project Name"
                        value={formData.projectName}
                        onChangeText={(value) => handleChange('projectName', value)}
                    />

                    {/* Ad Title */}
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

                {/* Sticky Submit Button */}
                <View style={styles.stickyButton}>
                    <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>{product ? "Update" : "Submit"}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </AlertNotificationRoot>
    );
};

export default AddShopOffices;