import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BottomNavBar from './BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  AppOpenAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const verticalScale = height / 812;
const normalize = (size) => Math.round(scale * size);
const normalizeVertical = (size) => Math.round(verticalScale * size);

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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats available yet.</Text>
          </View>
        }
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
    paddingHorizontal: normalize(8),
    paddingVertical: normalizeVertical(8),
    marginBottom: normalizeVertical(38),
  },
  chatItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: normalizeVertical(8),
  },
  userName: {
    fontWeight: 'bold',
    fontSize: normalize(12),
    marginBottom: normalizeVertical(3),
  },
  message: {
    fontSize: normalize(10),
    color: '#555555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ChatList;
