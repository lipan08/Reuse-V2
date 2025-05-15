import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
const scale = width / 375;
const verticalScale = height / 812;
const normalize = (size) => Math.round(scale * size);
const normalizeVertical = (size) => Math.round(verticalScale * size);

const CustomPicker = ({ label, value, options, onSelect }) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <TouchableOpacity style={styles.pickerContainer} onPress={() => setVisible(true)}>
                <Text style={[styles.pickerText, !value && { color: '#aaa' }]}>
                    {value ? options.find(opt => opt.value === value)?.label : label}
                </Text>
            </TouchableOpacity>
            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(item.value);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc', // Match other input border color
        borderRadius: normalize(8),
        paddingVertical: normalizeVertical(10),
        paddingHorizontal: normalize(10),
        backgroundColor: '#fff',
        marginBottom: normalizeVertical(14),
        minHeight: normalizeVertical(44),
        justifyContent: 'center',
    },
    pickerText: {
        fontSize: normalize(13),
        color: '#222',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        padding: normalize(24),
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: normalize(10),
        maxHeight: normalizeVertical(520), // Responsive modal height
        overflow: 'hidden',
    },
    option: {
        paddingVertical: normalizeVertical(14),
        paddingHorizontal: normalize(18),
    },
    optionText: {
        fontSize: normalize(15),
        color: '#222',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginHorizontal: normalize(10),
    },
});

export default CustomPicker;