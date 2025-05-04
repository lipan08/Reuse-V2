import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CategoryMenu = ({ onCategorySelect, selectedCategory }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategory);
  const categories = [
    { id: '', name: 'All', icon: 'list', color: '#8A2BE2' },
    { id: '1', name: 'Cars', icon: 'car', color: '#FF6347' },
    { id: '2', name: 'Properties', icon: 'home', color: '#4682B4' },
    { id: '7', name: 'Mobile', icon: 'phone-portrait', color: '#32CD32' },
    { id: '29', name: 'Electronics', icon: 'tv', color: '#FFD700' },
    { id: '24', name: 'Bikes', icon: 'bicycle', color: '#D2691E' },
    { id: '45', name: 'Furniture', icon: 'bed', color: '#8A2BE2' },
    { id: '51', name: 'Fashion', icon: 'shirt', color: '#FF69B4' },
    { id: '55', name: 'Books', icon: 'book', color: '#6495ED' },
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
      <Icon name={item.icon} size={24} color={item.color} />
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
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  categoryName: {
    marginTop: 5,
    fontSize: 12,
    color: '#000', // Default text color
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff', // Blue color for the selected category
  },
});

export default CategoryMenu;
