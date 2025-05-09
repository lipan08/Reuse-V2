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
        } else if (result.assets?.length > 0) {
            const newImages = result.assets.map(asset => ({
                uri: asset.uri,
                isNew: true // Mark new images
            }));

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        }
    };

    const handleImageRemove = (image) => {
        if (image.isNew) {
            // Remove new images directly
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter(img => img.uri !== image.uri)
            }));
        } else {
            // Track deleted existing images
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter(img => img.uri !== image.uri),
                deletedImages: [...prev.deletedImages, image.uri]
            }));
        }
    };

    return (
        <>
            <Text style={styles.label}>Upload Images *</Text>
            <TouchableOpacity style={styles.uploadArea} onPress={handleImagePick}>
                <MaterialIcons name="cloud-upload" size={24} color="#007BFF" />
                <Text style={styles.uploadText}>Tap to upload</Text>
            </TouchableOpacity>

            <View style={styles.imagesContainer}>
                {formData.images.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: image.uri || image }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleImageRemove(image)}
                        >
                            <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                        {!image.isNew && (
                            <View style={styles.existingBadge}>
                                <Text style={styles.existingBadgeText}>Existing</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </>
    );
};

export default ImagePickerComponent;