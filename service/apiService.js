import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export const submitForm = async (formData, subcategory) => {
    const token = await AsyncStorage.getItem('authToken');
    const formDataToSend = new FormData();

    // Append standard fields
    Object.keys(formData).forEach((key) => {
        if (!['images', 'deletedImages'].includes(key)) {
            formDataToSend.append(key, formData[key]);
        }
    });

    // Handle images
    if (formData.images) {
        // Append new images
        formData.images
            .filter(image => image.isNew)
            .forEach((image, index) => {
                formDataToSend.append('new_images[]', {
                    uri: image.uri,
                    type: 'image/jpeg',
                    name: `image_${Date.now()}_${index}.jpg`
                });
            });

        // Append existing image IDs
        formData.images
            .filter(image => !image.isNew)
            .map(image => image.uri)
            .forEach(uri => formDataToSend.append('existing_images[]', uri));
    }

    // Append deleted image IDs
    if (formData.deletedImages) {
        formData.deletedImages.forEach(id =>
            formDataToSend.append('deleted_images[]', id)
        );
    }

    // Common fields
    formDataToSend.append('category_id', subcategory.id);
    formDataToSend.append('guard_name', subcategory.guard_name);
    formDataToSend.append('post_type', 'sell');
    formDataToSend.append('address', 'India');

    // Determine API endpoint and method
    const isUpdate = !!formData.id;
    const apiUrl = isUpdate
        ? `${process.env.BASE_URL}/posts/${formData.id}`
        : `${process.env.BASE_URL}/posts`;
    console.log(apiUrl);
    console.log('Form Data:', formDataToSend);
    try {
        const response = await fetch(apiUrl, {
            method: isUpdate ? 'POST' : 'POST',
            body: formDataToSend,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });

        const responseData = await response.json();

        console.log('API Response:', {
            status: response.status,
            ok: response.ok,
            data: responseData
        });

        if (response.ok) {
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: isUpdate
                    ? 'Post updated successfully!'
                    : 'Post created successfully!',
                button: 'close',
            });
            return { success: true, data: responseData };
        } else {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Validation Error',
                textBody: responseData.message || 'Something went wrong!',
                button: 'close',
            });
            return { success: false, errors: responseData.errors };
        }
    } catch (error) {
        console.error('API Error:', error);
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Network Error',
            textBody: 'Failed to connect to the server',
            button: 'close',
        });
        return { success: false, error: error.message };
    }
};