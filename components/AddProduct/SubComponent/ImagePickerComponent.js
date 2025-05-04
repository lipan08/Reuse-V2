import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../../assets/css/AddProductForm.styles.js';

const ImagePickerComponent = ({ formData, setFormData }) => {
    const handleImagePick = async () => {
        const options = {
            mediaType: 'photo',
            selectionLimit: 0,
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
                images: [...formData.images, ...result.assets.map((asset) => asset.uri)],
            });
        }
    };

    const handleImageRemove = (uriToRemove) => {
        setFormData({
            ...formData,
            images: formData.images.filter(uri => uri !== uriToRemove),
        });
    };

    return (
        <>
            <Text style={styles.label}>Upload Images *</Text>
            <TouchableOpacity style={styles.uploadArea} onPress={handleImagePick}>
                <MaterialIcons name="cloud-upload" size={24} color="#007BFF" />
                <Text style={styles.uploadText}>Tap to upload</Text>
            </TouchableOpacity>

            <View style={styles.imagesContainer}>
                {formData.images.map((imageUri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleImageRemove(imageUri)}
                        >
                            {/* Fixed: Properly wrapped in Text component */}
                            <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </>
    );
};

export default ImagePickerComponent;