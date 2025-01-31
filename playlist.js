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
          <View style={{ flex: 1, width: '100%' }}></View>
          <ScrollView key={songs.length} contentContainerStyle={styles.playlist}>
            {songs.length > 0 ? (
              songs.map((song, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.songItem}
                  onPress={() =>
                    navigation.navigate('Player', {
                      song,
                      memberImage: member.image,
                      songs,
                    })
                  }
                >
                  <Text style={styles.songTitle}>{song.title}</Text>
                </TouchableOpacity>
              ))
            ) : (
              !loading && <Text style={styles.noSongsText}>No songs available.</Text>
            )}

            {loading && <ActivityIndicator size="large" color="#fff" />}
          </ScrollView>
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
  playlistContainer: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  playlist: {
        flexGrow: 1,
        paddingBottom: 50,
        minHeight: 300, // Add a minimum height to ensure visibility
  },
  songItem: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 5,
    alignItems: 'center',
    width: '100%',
  },
  
  songTitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 5,
  },
  playlistIdText: {
    color: '#fff',
  }
  

});

export default Playlist;
