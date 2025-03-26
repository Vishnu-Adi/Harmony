import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'songs';
  content: string | Song[];
}

interface Song {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

export default function MoodChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! Tell me your mood and preferred language (e.g., "happy english" or "sad spanish"), and I\'ll find some music for you! 🎵'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const [mood, language] = input.trim().toLowerCase().split(' ');

    try {
      const token = await AsyncStorage.getItem('spotify_token');
      if (!token) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Please connect your Spotify account first!'
        }]);
        return;
      }

      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: `${mood} ${language} music`,
          type: 'track',
          limit: 5,
          market: 'US'
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: `Here are some ${mood} songs in ${language}:`
      }, {
        id: (Date.now() + 1).toString(),
        type: 'songs',
        content: response.data.tracks.items
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Sorry, I couldn\'t find any songs right now. Try again?'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    switch (item.type) {
      case 'user':
        return (
          <View style={styles.userMessage}>
            <Text style={styles.userText}>{item.content}</Text>
          </View>
        );
      case 'bot':
        return (
          <View style={styles.botMessage}>
            <Text style={styles.botText}>{item.content}</Text>
          </View>
        );
      case 'songs':
        return (
          <View style={styles.songsContainer}>
            {(item.content as Song[]).map((song: Song) => (
              <View key={song.id} style={styles.songCard}>
                <Image
                  source={{ uri: song.album.images[0]?.url }}
                  style={styles.songImage}
                />
                <View style={styles.songInfo}>
                  <Text style={styles.songName} numberOfLines={1}>
                    {song.name}
                  </Text>
                  <Text style={styles.artistName} numberOfLines={1}>
                    {song.artists.map(artist => artist.name).join(', ')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd();
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Assistant</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
        />

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type mood and language..."
            placeholderTextColor="#666"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              { backgroundColor: input.trim() ? '#EAC85E' : '#2A2A2A' }
            ]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={input.trim() ? '#000' : '#666'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#EAC85E',
    padding: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
    marginVertical: 4,
  },
  userText: {
    color: '#000',
    fontSize: 16,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
    marginVertical: 4,
  },
  botText: {
    color: '#FFF',
    fontSize: 16,
  },
  songsContainer: {
    marginVertical: 8,
  },
  songCard: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  songInfo: {
    marginLeft: 12,
    flex: 1,
  },
  songName: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8, // Reduced padding
    color: '#FFF',
    fontSize: 16,
    marginRight: 8,
    minHeight: 40, // Fixed height
  },
  sendButton: {
    width: 40, // Slightly smaller
    height: 40, // Slightly smaller
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoid: {
    flex: 1,
  },
});
