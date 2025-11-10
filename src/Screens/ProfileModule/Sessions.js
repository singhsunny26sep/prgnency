import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import metrics from '../../Constants/Metrics';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Instance} from '../../API/Instance';
import { Fonts } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/Scalling';

export default function Sessions({navigation}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchVideos = async (pageToFetch = 1) => {
    try {
      if (pageToFetch === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await Instance.get(`/api/youtube/pagination?page=${pageToFetch}&limit=${limit}`);
      if (response.data && response.data.success) {
        if (pageToFetch === 1) {
          setVideos(response.data.data);
        } else {
          setVideos(prev => [...prev, ...response.data.data]);
        }
        setTotalPages(response.data.totalPages);
        setPage(pageToFetch);
      } else {
        setError('No videos found');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to fetch videos. Please check your internet connection.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchVideos(page + 1);
    }
  };

  const renderVideoItem = ({item}) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => navigation.navigate('SessionDetails', {
        video: item,
      })}>
      <Text style={styles.videoTitle}>{item.title}</Text>
      <View style={styles.arrow}>
        <MaterialIcons name="arrow-forward-ios" size={20} color={AllColors.black} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Container
        statusBarStyle={'dark-content'}
        statusBarBackgroundColor={AllColors.lightBlue}
        backgroundColor={AllColors.white}>
        <View style={styles.headerView}>
          <CustomHeader
            type="back"
            screenName={'Session Videos'}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AllColors.lightBlue} />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        statusBarStyle={'dark-content'}
        statusBarBackgroundColor={AllColors.lightBlue}
        backgroundColor={AllColors.white}>
        <View style={styles.headerView}>
          <CustomHeader
            type="back"
            screenName={'Session Videos'}
            onPressBack={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={AllColors.red} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchVideos(1)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.lightBlue}
      backgroundColor={AllColors.white}>
      <View style={styles.headerView}>
        <CustomHeader
          type="back"
          screenName={'Session Videos'}
          onPressBack={() => {
            navigation.goBack();
          }}
        />
      </View>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? (
          <ActivityIndicator size="small" color={AllColors.lightBlue} />
        ) : null}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: metrics.hp10,
    backgroundColor: AllColors.lightBlue,
    paddingTop: metrics.hp2,
    borderBottomEndRadius: metrics.hp20,
    borderRadius: 10,
    elevation: 22,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listContainer: {
    padding: 16,
  },
  videoItem: {
    backgroundColor: AllColors.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  videoTitle: {
    fontSize:moderateScale(20),
    fontFamily:Fonts.AfacadMedium,
    color: AllColors.black,
    flex: 1,
  },
  arrow: {
    marginLeft: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.black,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: AllColors.lightBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: moderateScale(16),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
    textAlign: 'center',
  },
});
