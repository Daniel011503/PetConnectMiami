import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  description: string;
  photo: string | null;
  owner: User;
}

interface Comment {
  id: number;
  user: User;
  text: string;
  created_at: string;
}

interface Post {
  id: number;
  author: User;
  pet: Pet | null;
  caption: string;
  image: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  recent_comments: Comment[];
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchPosts();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await fetch('http://192.168.1.225:8000/api/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      }
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  };

  // Refresh posts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  const fetchPosts = async (): Promise<void> => {
    try {
      console.log('Fetching posts from API...');
      const response = await fetch('http://192.168.1.225:8000/api/social/posts/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: Post[] = await response.json();
        console.log('Posts fetched:', data.length);
        setPosts(data);
      } else {
        console.error('API Error:', response.status);
        setPosts([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      setLoading(false);
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://192.168.1.225:8000/api/social/posts/${postId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update the posts state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, is_liked: data.liked, likes_count: data.likes_count }
              : post
          )
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const addComment = async (postId: number) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://192.168.1.225:8000/api/social/posts/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (response.ok) {
        setNewComment(prev => ({ ...prev, [postId]: '' }));
        fetchPosts(); // Refresh to get updated comments
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#74B9FF']}
            tintColor={'#74B9FF'}
          />
        }
      >
        <Text style={styles.title}>Pet Connect Feed</Text>
        {posts.length === 0 ? (
          <View style={styles.noPostsContainer}>
            <Text style={styles.noPostsText}>No posts yet. Be the first to share!</Text>
          </View>
        ) : (
          posts.map((post: Post) => (
            <View key={post.id} style={styles.postCard}>
              {/* Header */}
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.username}>@{post.author.username}</Text>
                  <Text style={styles.timestamp}>{formatDate(post.created_at)}</Text>
                </View>
                {post.pet && (
                  <Text style={styles.petTag}>📷 {post.pet.name}</Text>
                )}
              </View>

              {/* Image */}
              {post.image && (
                <Image source={{ uri: post.image }} style={styles.postImage} />
              )}

              {/* Caption */}
              <Text style={styles.caption}>{post.caption}</Text>

              {/* Actions */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => toggleLike(post.id)}
                >
                  <Text style={styles.actionText}>
                    {post.is_liked ? '❤️' : '🤍'} {post.likes_count}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>💬 {post.comments_count}</Text>
                </TouchableOpacity>
              </View>

              {/* Recent Comments */}
              {post.recent_comments.length > 0 && (
                <View style={styles.commentsContainer}>
                  {post.recent_comments.map((comment) => (
                    <Text key={comment.id} style={styles.comment}>
                      <Text style={styles.commentUser}>@{comment.user.username}</Text>
                      {' '}{comment.text}
                    </Text>
                  ))}
                </View>
              )}

              {/* Add Comment */}
              <View style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment[post.id] || ''}
                  onChangeText={(text) => setNewComment(prev => ({ ...prev, [post.id]: text }))}
                  multiline
                />
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={() => addComment(post.id)}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      
      {/* Floating Action Button for new post */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/create-post')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 15,
    paddingTop: 50,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#74B9FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#74B9FF',
    marginTop: 100,
  },
  noPostsContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  noPostsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6C757D',
    fontStyle: 'italic',
  },
  postCard: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  timestamp: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  petTag: {
    fontSize: 12,
    color: '#74B9FF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  caption: {
    fontSize: 14,
    color: '#2D3436',
    padding: 15,
    paddingTop: 10,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  actionButton: {
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  commentsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  comment: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 5,
    lineHeight: 18,
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#74B9FF',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 10,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#74B9FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#74B9FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});