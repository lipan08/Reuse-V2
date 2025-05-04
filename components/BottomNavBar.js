import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomNavBar = () => {
  const navigation = useNavigation();

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const navItems = [
    { key: 'Home', route: 'Home', icon: 'home-outline', color: '#4CAF50' }, // Green for Home
    { key: 'Chat', route: 'ChatList', icon: 'chatbubble-ellipses-outline', color: '#2196F3' }, // Blue for Chat
    { key: 'Add Product', route: 'ProductAddPage', icon: 'add-circle', color: '#E91E63', size: 50, bump: true, showText: false }, // Pink, larger size, bump effect
    { key: 'My Ads', route: 'MyAdsPage', icon: 'briefcase-outline', color: '#FF9800' }, // Orange for My Ads
    { key: 'Account', route: 'AccountPage', icon: 'person-outline', color: '#9C27B0' } // Purple for Account
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map(({ key, route, icon, color, size, bump, showText }) => (
        <TouchableOpacity
          key={key}
          onPress={() => handleNavigation(route)}
          style={[
            styles.navItem,
            bump && styles.bump // Apply bump style for Add Product
          ]}
        >
          <Icon name={icon} size={size || 30} color={color} />
          {showText && <Text style={styles.navText}>{key}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 10
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  navText: {
    fontSize: 12,
    color: '#555'
  },
  bump: {
    marginTop: -15, // Reduced bump effect for balanced look
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default BottomNavBar;
