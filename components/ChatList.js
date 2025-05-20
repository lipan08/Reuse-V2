import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNavBar from './BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const verticalScale = height / 812;
const normalize = (size) => Math.round(scale * size);
const normalizeVertical = (size) => Math.round(verticalScale * size);

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getAllChat();
  }, []);

  const getAllChat = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${process.env.BASE_URL}/chats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setChats(data.chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <ActivityIndicator
        size="large"
        color="#007BFF"
        style={styles.loadingIndicator}
      />
    );
  };


  const renderChatItem = ({ item: chat }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => navigation.navigate('ChatBox', {
        chatId: chat.id,
        sellerId: chat.seller_id,
        buyerId: chat.buyer_id,
        postId: chat.post_id,
      })}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: chat.buyer.profile_image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle} numberOfLines={1}>{chat.post.title}</Text>
          <Text style={styles.chatTime}>2h ago</Text>
        </View>

        <View style={styles.chatDetails}>
          <MaterialIcons name="person" size={normalize(14)} color="#666" />
          <Text style={styles.chatUser} numberOfLines={1}>{chat.buyer.name}</Text>
        </View>

        <View style={styles.chatDetails}>
          <MaterialIcons name="location-on" size={normalize(14)} color="#666" />
          <Text style={styles.chatLocation} numberOfLines={1}>{chat.post.address}</Text>
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={normalize(20)} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(chat) => chat.id.toString()} // Added toString() for safety
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyState}>
              <MaterialIcons name="forum" size={normalize(60)} color="#007BFF" />
              <Text style={styles.emptyTitle}>
                {isError ? 'Connection Error' : 'No Chats Yet'}
              </Text>
              <Text style={styles.emptyText}>
                {isError ?
                  'Failed to load conversations. Please check your connection.' :
                  'Start a conversation by contacting sellers about their items!'
                }
              </Text>
              {isError && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={getAllChat}
                  activeOpacity={0.7}
                >
                  <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
      />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalizeVertical(16),
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalizeVertical(12),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: normalize(12),
  },
  avatar: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
  },
  chatContent: {
    flex: 1,
    marginRight: normalize(12),
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalizeVertical(4),
  },
  chatTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#2D3436',
    maxWidth: '70%',
  },
  chatTime: {
    fontSize: normalize(12),
    color: '#999999',
  },
  chatDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeVertical(4),
  },
  chatUser: {
    fontSize: normalize(14),
    color: '#666666',
    marginLeft: normalize(6),
    maxWidth: '80%',
  },
  chatLocation: {
    fontSize: normalize(12),
    color: '#999999',
    marginLeft: normalize(6),
    maxWidth: '80%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(24),
    marginTop: normalizeVertical(100),
  },
  emptyTitle: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: '#2D3436',
    marginVertical: normalizeVertical(12),
  },
  emptyText: {
    fontSize: normalize(14),
    color: '#666666',
    textAlign: 'center',
    lineHeight: normalizeVertical(20),
  },
  retryButton: {
    marginTop: normalizeVertical(20),
    backgroundColor: '#007BFF',
    paddingHorizontal: normalize(24),
    paddingVertical: normalizeVertical(12),
    borderRadius: normalize(8),
  },
  retryText: {
    color: 'white',
    fontWeight: '500',
    fontSize: normalize(14),
  },
  loadingIndicator: {
    marginVertical: normalizeVertical(20),
  },
});

export default ChatList;