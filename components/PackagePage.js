import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const PackagePage = () => {
  const packageData = [
    { id: '1', title: 'General', price: '$9.99', icon: 'https://cdn.icon-icons.com/icons2/3233/PNG/512/empty_box_package_icon_197143.png' },
    { id: '2', title: 'Standard', price: '$19.99', icon: 'https://cdn.icon-icons.com/icons2/3233/PNG/512/empty_box_package_icon_197143.png' },
    { id: '3', title: 'Premium', price: '$29.99', icon: 'https://cdn.icon-icons.com/icons2/3233/PNG/512/empty_box_package_icon_197143.png' },
    { id: '4', title: 'Super Premium', price: '$49.99', icon: 'https://cdn.icon-icons.com/icons2/3233/PNG/512/empty_box_package_icon_197143.png' },
    // Add more package items as needed
  ];

  const renderPackageItem = ({ item }) => (
    <TouchableOpacity style={styles.packageItem}>
      <Image source={{ uri: item.icon }} style={styles.packageIcon} />
      <Text style={styles.packageTitle}>{item.title}</Text>
      <Text style={styles.packagePrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={packageData}
        renderItem={renderPackageItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.packageList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  packageList: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  packageItem: {
    width: '45%',
    aspectRatio: 1, // Maintain aspect ratio for each item
    margin: '2.5%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  packageIcon: {
    width: '60%',
    height: '40%', // Adjust icon height
    resizeMode: 'contain',
    marginBottom: 12,
  },
  packageTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 6,
  },
  packagePrice: {
    color: '#007bff',
    textAlign: 'center',
  },
});

export default PackagePage;
