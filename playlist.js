import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  View,
  ActivityIndicator,
  Animated,
  Image,
  FlatList,
} from 'react-native';

const Playlist = ({ route, navigation }) => {
  const { member } = route.params || {}; // Get the selected member from route params
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (member && member.name) {
      fetchSongs(member.name.toLowerCase());
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [member]);

  const fetchSongs = (memberName) => {
    if (loading || !memberName) return;

    setLoading(true);

    const apiKey = 'AIzaSyC_HdI3_gQ8WjcORix4NCM4CZiuzMvoIR0';
    const playlistIds = {
      'choi hyunsuk': 'PLo9asGQPwSYSjf3uHpD3oSe0TbhAwLiih',
      'park jihoon': 'PLo9asGQPwSYSNugB7CFVOErkp_Ldnna1q',
      'kim junkyu': 'PLo9asGQPwSYTrw4UauSPduwicibIzqR8e',
      'yoshinori': 'PLo9asGQPwSYSlBke4GmZMqR6mSJbv9BkN',
      'asahi': 'PLo9asGQPwSYQYqg0C1xy-p8rV9VAAnZ0W',
      'yoon jaehyuk': 'PLo9asGQPwSYStpVEqbS5TVyLmd9cUeoQt',
      'park jeongwoo': 'PLo9asGQPwSYRk1ms3hLOKR_ElVspIHRhv',
      'haruto': 'PLo9asGQPwSYRhWCrI1ap3VNjAAHJpDQp9',
      'kim doyoung': 'PLo9asGQPwSYQAUacIz_0gHe1k0ecKUl0A',
      'so junghwan': 'PLo9asGQPwSYRwEbibmf9DJvC41BVhK4jj',
    };

    const playlistId = playlistIds[member.name.toLowerCase()];

    if (!playlistId) {
      console.error('Invalid member name:', memberName);
      setLoading(false);
      return;
    }

    const baseUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}`;
    const url = nextPageToken ? `${baseUrl}&pageToken=${nextPageToken}&maxResults=10` : `${baseUrl}&maxResults=10`;

    console.log('Fetching from URL:', url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          const newSongs = data.items.map((item) => ({
            title: item.snippet.title,
            videoId: item.snippet.resourceId.videoId,
            artist: item.snippet.videoOwnerChannelTitle || 'Unknown Artist',
            duration: null,
          }));

          setSongs((prev) => {
            // Remove duplicates before updating state
            const uniqueSongs = [...prev, ...newSongs].filter(
              (song, index, self) =>
                index === self.findIndex((s) => s.videoId === song.videoId) // Check if videoId is already present
            );
            return uniqueSongs;
          });

          setNextPageToken(data.nextPageToken || null);
        } else {
          console.log('No songs found for this member.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching songs:', error);
        setLoading(false);
      });
  }

  const loadMoreSongs = () => {
    if (!loading && nextPageToken) {
      fetchSongs(member.name.toLowerCase());
    }
  };

  return (
    <ImageBackground
    source={require('./assets/background.jpg')}
    style={styles.backgroundImage}
    blurRadius={5}
  >
    <Animated.View style={{ flex: 1 }}>
      <View style={styles.playlistContainer}>
        <Text style={styles.playlistIdText}>
          Playlist by: {member.name || 'Unknown'}
        </Text>
        <FlatList
          data={songs}
          keyExtractor={(item) => item.videoId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.songItem}
              onPress={() =>
                navigation.navigate('Player', {
                  song: item,
                  memberImage: member.image,
                  songs,
                })
              }
            >
              <Image source={require('./assets/background.jpg')} style={styles.songIcon} />
              <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.songArtist}>{item.artist}</Text>
              </View>
             
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 50 }} 
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="#fff" /> : null}
          ListFooterComponentStyle={{ marginBottom: 50 }} 
          onEndReached={loadMoreSongs}
          onEndReachedThreshold={0.2} 
        />
      </View>
    </Animated.View>
  </ImageBackground>
);
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#511A1A',
    alignItems: 'center',
  },
  songList: {
    paddingTop: 20,
    width: '100%',

  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  songIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#bbb',
    fontSize: 12,
  },
  songDuration: {
    color: '#ddd',
    fontSize: 14,
  },
  noSongsText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  playlistIdText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    fontSize: 15,
    marginBottom: 10,
  }

});

export default Playlist;
