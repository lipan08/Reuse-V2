import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { AlertNotificationRoot, Toast, ALERT_TYPE } from 'react-native-alert-notification';

const LocationPicker = ({ navigation }) => {
    const [location, setLocation] = useState({
        latitude: 28.6139,
        longitude: 77.209,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const skipNextApiCallRef = useRef(false); // Add this ref

    const API_KEY = process.env.GOOGLE_MAP_API_KEY;
    const DEBOUNCE_TIME = 300;

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
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${API_KEY}&components=country:in`;
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
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
            const response = await fetch(detailsUrl);
            const json = await response.json();

            if (json.result?.geometry?.location) {
                const { lat, lng } = json.result.geometry.location;
                skipNextApiCallRef.current = true; // Set flag before updating query
                setSearchQuery(json.result.formatted_address);
                setLocation({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                setPredictions([]);
            }
        } catch (error) {
            console.error('Details error:', error);
        }
    };

    const handleConfirmLocation = async () => {
        try {
            await AsyncStorage.setItem('defaultAddress', JSON.stringify(location));
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Location Saved',
                textBody: 'This address has been set as your default.',
            });
            setTimeout(() => navigation.navigate('Home'), 2000);
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    return (
        <AlertNotificationRoot>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <MapView
                    key={`${location.latitude}_${location.longitude}`}
                    style={styles.map}
                    region={location}
                >
                    <Marker
                        coordinate={location}
                        draggable
                        onDragEnd={(e) => setLocation({
                            ...location,
                            latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude
                        })}
                    />
                </MapView>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search location"
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (predictions.length > 0) setPredictions([]);
                        }}
                        placeholderTextColor="#666"
                    />

                    {isLoading && <ActivityIndicator style={styles.loader} />}

                    {predictions.length > 0 && (
                        <FlatList
                            style={styles.predictionsList}
                            data={predictions}
                            keyExtractor={(item) => item.place_id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.predictionItem}
                                    onPress={() => handlePlaceSelect(item.place_id)}
                                >
                                    <Text style={styles.predictionText}>{item.description}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.cancelButton]}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirmLocation} style={[styles.button, styles.confirmButton]}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </AlertNotificationRoot>
    );
};

// Keep the same styles as previous version
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: Platform.select({ ios: 50, android: 20 }),
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    searchInput: {
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    predictionsList: {
        maxHeight: 200,
        borderTopWidth: 1,
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
    loader: {
        position: 'absolute',
        right: 15,
        top: 18,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 0,
        borderRadius: 0,
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 52, 52, 0.8)',
    },
    confirmButton: {
        backgroundColor: 'rgba(0, 128, 0, 0.8)',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default LocationPicker;