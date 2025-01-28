// PlayerScreen.js (new file)
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlayerScreen = ({ route, navigation }) => {
  const { song, memberImage } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const rotation = new Animated.Value(0);

  useEffect(() => {
    // Start rotation animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000, // 5 seconds for a full rotation
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

   // Play the next song
   const playNext = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  // Play the previous song
  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.vinylContainer}>
        <Animated.View
          style={[
            styles.vinyl,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          <Image source={memberImage} style={styles.vinylImage} />
        </Animated.View>
        <View style={styles.vinylCenter} />
        <View style={styles.innerVinylCenter}/>
      </View>
      <Text style={styles.songTitle}>{song.title}</Text>
      <YouTubeIframe
        videoId={song.videoId}
        height={200}
        play={isPlaying}
        onChangeState={(state) => {
          if (state === 'ended') {
            setIsPlaying(false);
          }
        }}
      />
      <View style={styles.controls}>
         {/* Previous Button */}
         <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
                <Icon name="backward" size={30} color="#fff" />
              </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#fff" />
        </TouchableOpacity>
         {/* Next Button */}
         <TouchableOpacity onPress={playNext} style={styles.controlButton}>
                <Icon name="forward" size={30} color="#fff" />
              </TouchableOpacity>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  vinyl: {
    width: 250,
    height: 250,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  vinylImage: {
    width: 220,
    height: 220,
    borderRadius: 150,
  },
  vinylCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    position: 'absolute',  // Use absolute positioning
    top: '50%',  // Position it vertically in the center
    left: '33%',  // Position it horizontally in the center
    marginTop: -25,  // Offset by half of the height to truly center it
    marginLeft: -25,  // Offset by half of the width to truly center it
    justifyContent: 'center',  // Ensure the content is centered
    alignItems: 'center',  // Align the content in the center
    borderWidth: 2, // Set the width of the border
    borderColor: '#000', 
  },
  
  songTitle: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',

  },
  innerVinylCenter: {
    width: 20, // Smaller size for the inner center
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000', // Different color for the inner center
    position: 'absolute',  // Use absolute positioning
    top: '55%',  // Position it vertically in the center
    left: '37%',  // Position it horizontally in the center
    marginTop: -23,  // Offset by half of the height to truly center it
    marginLeft: -25,  // Offset by half of the width to truly center it
    justifyContent: 'center',  // Ensure the content is centered
    alignItems: 'center', 
  }
});

export default PlayerScreen;
