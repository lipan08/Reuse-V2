import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ParentCategoryPanel from './ParentCategoryPanel';
import SubCategoryPanel from './SubCategoryPanel';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from './BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductAddPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [popupText, setPopupText] = useState('Click here or choose any category'); // Popup text state
  const navigation = useNavigation();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const apiUrl = `${process.env.BASE_URL}/category`;
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();
        console.log(data);
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle parent category selection
  const handleCategorySelect = (category) => {
    console.log(category.guard_name);
    setSelectedCategory(category);
    setSelectedSubCategory(null); // Reset selected subcategory when a new parent category is selected
    if (category.children.length > 0) {
      setSubcategories(category.children);
      setPopupText('Choose a subcategory'); // Update popup text for subcategories
    } else {
      setPopupText(''); // Hide popup text if no subcategories
      // Navigate based on the guard_name of the category
      switch (category?.guard_name) {
        case 'cars':
          navigation.navigate('AddCarForm', { category, subcategory: category });
          break;
        case 'mobiles':
          navigation.navigate('AddMobileTablets', { category, subcategory: category });
          break;
        default:
          console.log('No valid guard_name found for the selected category');
          break;
      }
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory) => {
    console.log(subcategory);
    setSelectedSubCategory(subcategory); // Update selectedSubCategory state
    setPopupText(''); // Hide popup text when a subcategory is selected
    switch (subcategory?.guard_name) {
      case 'houses_apartments':
        navigation.navigate('AddHousesApartments', { category: selectedCategory, subcategory });
        break;
      case 'land_plots':
        navigation.navigate('AddLandPlots', { category: selectedCategory, subcategory });
        break;
      case 'pg_guest_houses':
        navigation.navigate('AddPgGuestHouse', { category: selectedCategory, subcategory });
        break;
      case 'shop_offices':
        navigation.navigate('AddShopOffices', { category: selectedCategory, subcategory });
        break;
      // Job :: Start
      case 'data_entry_back_office':
      case 'sales_marketing':
      case 'bpo_telecaller':
      case 'driver':
      case 'office_assistant':
      case 'delivery_collection':
      case 'teacher':
      case 'cook':
      case 'receptionist_front_office':
      case 'operator_technician':
      case 'engineer_developer':
      case 'hotel_travel_executive':
      case 'accountant':
      case 'designer':
      case 'other_jobs':
        navigation.navigate('AddJob', { category: selectedCategory, subcategory });
        break;
      // Job:: End
      case 'motorcycles':
        navigation.navigate('AddMotorcycles', { category: selectedCategory, subcategory });
        break;
      case 'scooters':
        navigation.navigate('AddScooters', { category: selectedCategory, subcategory });
        break;
      case 'bycycles':
        navigation.navigate('AddBycycles', { category: selectedCategory, subcategory });
        break;
      case 'accessories':
      case 'computers_laptops':
      case 'tvs_video_audio':
      case 'acs':
      case 'fridges':
      case 'washing_machines':
      case 'cameras_lenses':
      case 'harddisks_printers_monitors':
      case 'kitchen_other_appliances':
      case 'sofa_dining':
      case 'beds_wardrobes':
      case 'home_decor_garden':
      case 'kids_furniture':
      case 'other_household_items':
      case 'mens_fashion':
      case 'womens_fashion':
      case 'kids_fashion':
      case 'books':
      case 'gym_fitness':
      case 'musical_instruments':
      case 'sports_instrument':
      case 'other_hobbies':
      case 'dogs':
      case 'fish_aquarium':
      case 'pets_food_accessories':
      case 'other_pets':
      case 'other_services':
      case 'packers_movers':
      case 'machinery_spare_parts':
        navigation.navigate('AddOthers', { category: selectedCategory, subcategory });
        break;
      case 'education_classes':
        navigation.navigate('AddEducationClasses', { category: selectedCategory, subcategory });
        break;
      case 'tours_travels':
        navigation.navigate('AddToursTravels', { category: selectedCategory, subcategory });
        break;
      case 'electronics_repair_services':
        navigation.navigate('AddElectronicsRepairServices', { category: selectedCategory, subcategory });
        break;
      case 'health_beauty':
        navigation.navigate('AddHealthBeauty', { category: selectedCategory, subcategory });
        break;
      case 'home_renovation_repair':
        navigation.navigate('AddHomeRenovationRepair', { category: selectedCategory, subcategory });
        break;
      case 'cleaning_pest_control':
        navigation.navigate('AddCleaningPestControl', { category: selectedCategory, subcategory });
        break;
      case 'legal_documentation_sevices':
        navigation.navigate('AddLegalDocumentationServices', { category: selectedCategory, subcategory });
        break;
      case 'commercial_heavy_vehicles':
        navigation.navigate('AddCommercialHeavyVehicle', { category: selectedCategory, subcategory });
        break;
      case 'vehicle_spare_parts':
        navigation.navigate('AddVehicleSpareParts', { category: selectedCategory, subcategory });
        break;
      case 'commercial_heavy_machinery':
        navigation.navigate('AddCommercialHeavyMachinery', { category: selectedCategory, subcategory });
        break;
      default:
        console.log('No valid guard_name found for the selected subcategory');
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Category Panels */}
      <View style={styles.categoryContainer}>
        {/* Parent Category Panel */}
        <ParentCategoryPanel
          categories={categories}
          onSelectCategory={handleCategorySelect}
          selectedCategory={selectedCategory} // Pass selected category
        />

        {selectedCategory && selectedCategory.children.length > 0 && (
          <SubCategoryPanel
            subcategories={subcategories}
            onSelectSubcategory={handleSubcategorySelect}
            selectedSubcategory={selectedSubCategory} // Pass selected subcategory
          />
        )}
      </View>

      {/* BottomNavBar remains fixed at the bottom */}
      <BottomNavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Stack the category container and BottomNavBar vertically
  },
  categoryContainer: {
    flex: 1, // Take up all available space above the BottomNavBar
    flexDirection: 'row', // Parent and subcategories are displayed side by side
  },
});

export default ProductAddPage;