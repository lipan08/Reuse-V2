import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export const submitForm = async (formData, subcategory) => {
    console.log(subcategory);
    const token = await AsyncStorage.getItem('authToken');
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
        if (key === 'images') {
            formData.images.forEach((imageUri, index) => {
                formDataToSend.append('images[]', {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: `image_${index}.jpg`,
                });
            });
        } else {
            formDataToSend.append(key, formData[key]);
        }
    });

    formDataToSend.append('category_id', subcategory.id);
    formDataToSend.append('guard_name', subcategory.guard_name);
    formDataToSend.append('post_type', 'sell');
    formDataToSend.append('address', 'India');

    var apiUrl = `${process.env.BASE_URL}/posts`;
    if (formData.id) {
        apiUrl = `${process.env.BASE_URL}/posts/${formData.id}`;
    }
    console.log(apiUrl);
    console.log(formDataToSend);
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formDataToSend,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });

        const responseData = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response OK:', response.ok);
        console.log('Response Data:', responseData);
        if (response.ok) {
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Details submitted successfully!',
                button: 'close',
            });
        } else {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Validation Error',
                textBody: responseData.message,
                button: 'close',
            });
        }

        return responseData;
    } catch (error) {
        Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Error',
            textBody: 'There was an issue submitting the form.',
            button: 'close',
        });
        throw error;
    }
}