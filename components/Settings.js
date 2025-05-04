import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsPage = ({ navigation }) => {
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const handlePasswordChange = () => {
        navigation.navigate('ChangePassword');
    };

    const handleDeleteAccount = () => {
        setIsDeleteModalVisible(true); // Show delete confirmation modal
    };

    const confirmDeletion = async () => {
        setIsDeleteModalVisible(false);
        try {
            const response = await fetch(`${process.env.BASE_URL}/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            } else {
                Alert.alert('Error', 'There was an issue deleting your account.');
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
            Alert.alert('Error', 'Failed to delete account. Please try again.');
        }
    };

    const handleLogoutAllDevices = () => {
        setIsLogoutModalVisible(true); // Show logout confirmation modal
    };

    const confirmLogout = async () => {
        setIsLogoutModalVisible(false);
        try {
            const response = await fetch(`${process.env.BASE_URL}/logout-all-devices`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                Alert.alert('Logged Out', 'You have been logged out from all devices.');
            } else {
                Alert.alert('Error', 'There was an issue logging out from all devices.');
            }
        } catch (error) {
            console.error("Failed to logout from all devices:", error);
            Alert.alert('Error', 'Failed to logout from all devices. Please try again.');
        }
    };

    const handleUse2FA = () => {
        // Logic for enabling or managing 2FA
    };

    return (
        <View style={styles.container}>
            {/* <TouchableOpacity style={styles.linkItem} onPress={handlePasswordChange}>
                <Icon name="key-variant" size={24} color="#D9534F" style={styles.icon} />
                <Text style={styles.linkText}>Change Password</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.linkItem} onPress={handleDeleteAccount}>
                <Icon name="delete-outline" size={24} color="#4B9CD3" style={styles.icon} />
                <Text style={styles.linkText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem} onPress={handleLogoutAllDevices}>
                <Icon name="logout-variant" size={24} color="#F0AD4E" style={styles.icon} />
                <Text style={styles.linkText}>Logout from All Devices</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem} onPress={handleUse2FA}>
                <Icon name="shield-lock" size={24} color="#5CB85C" style={styles.icon} />
                <Text style={styles.linkText}>Use 2FA Authorization</Text>
            </TouchableOpacity>

            {/* Delete Confirmation Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={isDeleteModalVisible}
                onRequestClose={() => setIsDeleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Deletion</Text>
                        <Text style={styles.modalText}>Are you sure you want to delete this account permanently?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsDeleteModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={confirmDeletion}>
                                <Text style={styles.confirmButtonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={isLogoutModalVisible}
                onRequestClose={() => setIsLogoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalText}>Are you sure you want to log out from all devices?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsLogoutModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={confirmLogout}>
                                <Text style={styles.confirmButtonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    linkText: {
        fontSize: 16,
        color: 'black',
        flexGrow: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#ccc',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: 'red',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SettingsPage;
