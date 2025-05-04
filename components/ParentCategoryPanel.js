import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const iconMapping = {
  electronics: { type: 'MaterialCommunity', name: 'television' },
  fashion: { type: 'MaterialCommunity', name: 'tshirt-crew' },
  furniture: { type: 'MaterialCommunity', name: 'sofa' },
  cars: { type: 'FontAwesome', name: 'car' },
  bikes: { type: 'FontAwesome', name: 'motorcycle' },
  mobiles: { type: 'FontAwesome', name: 'mobile' },
  properties: { type: 'MaterialCommunity', name: 'home' },
  commercial_vehicle_spare_part: { type: 'MaterialCommunity', name: 'truck' },
  commercial_mechinery_spare_parts: { type: 'MaterialCommunity', name: 'tow-truck' },
  boks_sports_hobbies: { type: 'MaterialCommunity', name: 'book-open-page-variant-outline' },
  pets: { type: 'FontAwesomeIcon6', name: 'cat' },
  services: { type: 'MaterialIcons', name: 'home-repair-service' },
  electronics_appliances: { type: 'MaterialIcons', name: 'electrical-services' },
  job: { type: 'MaterialCommunity', name: 'human-dolly' },
};

const ParentCategoryPanel = ({ categories, onSelectCategory, selectedCategory }) => {
  const renderIcon = (iconConfig) => {
    if (iconConfig.type === 'MaterialCommunity') {
      return <MaterialCommunityIcon name={iconConfig.name} size={20} color="#4CAF50" style={styles.icon} />;
    } else if (iconConfig.type === 'FontAwesome') {
      return <FontAwesomeIcon name={iconConfig.name} size={20} color="#4CAF50" style={styles.icon} />;
    } else if (iconConfig.type === 'FontAwesomeIcon6') {
      return <FontAwesomeIcon6 name={iconConfig.name} size={20} color="#4CAF50" style={styles.icon} />;
    } else if (iconConfig.type === 'MaterialIcons') {
      return <MaterialIcons name={iconConfig.name} size={20} color="#4CAF50" style={styles.icon} />;
    }
    return null; // Default case if no icon type matches
  };

  return (
    <ScrollView style={styles.panelContainer}>
      {categories.map((category) => {
        const iconConfig = iconMapping[category.guard_name] || { type: 'FontAwesome', name: 'tag' }; // Default fallback icon
        const isSelected = selectedCategory?.id === category.id; // Check if the category is selected
        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.panelItem, isSelected && styles.selectedItem]} // Apply selected style
            onPress={() => onSelectCategory(category)}
          >
            {renderIcon(iconConfig)}
            <Text style={[styles.text, isSelected && styles.selectedText]}>{category.name}</Text>
            <MaterialCommunityIcon name="chevron-right" size={20} color="#888" style={styles.arrowIcon} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f1f1f1',
  },
  panelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 5,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: '#2196F3', // Change to blue
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  selectedText: {
    color: '#fff', // Change text color for selected item
  },
  arrowIcon: {
    marginLeft: 'auto', // Push the arrow to the right
  },
});

export default ParentCategoryPanel;