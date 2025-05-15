import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const verticalScale = height / 812;
const normalize = (size) => Math.round(scale * size);
const normalizeVertical = (size) => Math.round(verticalScale * size);


const CategoryMenu = ({ onCategorySelect, selectedCategory }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategory);
  const categories = [
    { id: '', name: 'Clear', icon: 'list', color: 'red' },
    { id: '1', name: 'Cars', icon: 'car', color: '#6495ED' },
    { id: '2', name: 'Properties', icon: 'home', color: '#4682B4' },
    { id: '7', name: 'Mobile', icon: 'phone-portrait', color: '#32CD32' },
    { id: '29', name: 'Electronics', icon: 'tv', color: '#FFD700' },
    { id: '24', name: 'Bikes', icon: 'bicycle', color: '#D2691E' },
    { id: '45', name: 'Furniture', icon: 'bed', color: '#8A2BE2' },
    { id: '51', name: 'Fashion', icon: 'shirt', color: '#FF69B4' },
    { id: '55', name: 'Books', icon: 'book', color: '#FF6347' },
  ];

  useEffect(() => {
    setSelectedCategoryId(selectedCategory); // Update when selectedCategory prop changes
  }, [selectedCategory]);

  const handleCategorySelect = (id) => {
    setSelectedCategoryId(id);
    onCategorySelect(id);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        item.id === selectedCategoryId ? styles.selectedCategory : null
      ]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <Icon name={item.icon} size={normalize(23)} color={item.color} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(8),
    paddingVertical: normalizeVertical(10),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryItem: {
    marginRight: normalize(14),
    alignItems: 'center',
  },
  categoryName: {
    marginTop: normalizeVertical(3),
    fontSize: normalize(10),
    color: '#000',
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
});

export default CategoryMenu;
