import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import BottomNavBar from './BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  AppOpenAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.G_BANNER_AD_UNIT_ID;

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    getAllChat();
  }, []);

  const getAllChat = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`${process.env.BASE_URL}/chats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // c // Log to verify data structure
      setChats(data.chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const renderChatItem = ({ item: chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        // If chatId exists, navigate using chatId, otherwise pass seller_id, buyer_id, and post_id
        navigation.navigate('ChatBox', {
          chatId: chat.id,
          sellerId: chat.seller_id,
          buyerId: chat.buyer_id,
          postId: chat.post_id,
        });
      }}
    >
      <Text style={styles.userName}>{chat.post.title}</Text>
      <Text>{chat.buyer.name}</Text>
      {/* <Text>{chat.seller_id}</Text> */}
      <Text>{chat.post.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} /> */}

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(chat) => chat.id}
        contentContainerStyle={styles.chatList}
      />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 50,
  },
  chatItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 12,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#555555',
  },
});

export default ChatList;
