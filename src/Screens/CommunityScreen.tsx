import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import strings from '../../localization';

interface CommunityPost {
  id: string;
  user: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
}

const CommunityScreen = () => {
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      user: 'Priya M.',
      avatar: '👩‍🦰',
      time: '2h ago',
      content: 'Just completed week 20 scan! Baby is doing great. Any tips for second trimester nutrition?',
      likes: 24,
      comments: 7,
    },
    {
      id: '2',
      user: 'Anjali S.',
      avatar: '🤰',
      time: '4h ago',
      content: 'Morning meditation routine is keeping me calm. Sharing my playlist for other moms-to-be!',
      likes: 38,
      comments: 12,
    },
    {
      id: '3',
      user: 'Meera R.',
      avatar: '👩',
      time: '5h ago',
      content: 'First time mom here. Looking for recommendations on gentle exercises during pregnancy.',
      likes: 15,
      comments: 18,
    },
  ];

  const renderPost = ({ item }: { item: CommunityPost }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.avatar}>{item.avatar}</Text>
        <View style={styles.postHeaderInfo}>
          <Text style={styles.postUser}>{item.user}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>❤️ {item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 {item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D6336C', '#F06292', '#F8B4C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{strings.communitySupport || 'Community Support'}</Text>
        <Text style={styles.headerSubtitle}>
          {strings.communitySubtitle || 'Connect with other mothers and experts'}
        </Text>
      </LinearGradient>

      <View style={styles.newPostContainer}>
<TextInput
           style={styles.newPostInput}
           placeholder={strings.communityPlaceholder || 'Share something with the community...'}
           placeholderTextColor="#999"
           multiline
         />
        <TouchableOpacity style={styles.postButton}>
          <LinearGradient
            colors={['#D6336C', '#F06292']}
            style={styles.postButtonGradient}
          >
            <Text style={styles.postButtonText}>{strings.postNow || 'Post'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        <FlatList
          data={communityPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF5F7',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  newPostContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  newPostInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    fontSize: 14,
    color: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  postButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    borderRadius: 20,
    overflow: 'hidden',
  },
  postButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  postButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  postUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    marginRight: 20,
  },
  actionText: {
    fontSize: 13,
    color: '#666',
  },
});

export default CommunityScreen;
