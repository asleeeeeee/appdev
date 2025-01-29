import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, setCurrentSong } from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { usePlayer } from './playerContext';

const PlayerScreen = ({ route}) => {
  const { song, memberImage, songs } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(songs.findIndex(s => s.videoId === song.videoId));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lastRotation, setLastRotation] = useState(0); 
  const playerRef = useRef(null);
  const { setCurrentSong, setIsPlaying: setPlayerIsPlaying } = usePlayer(); // Destructure from context

  const rotation = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (song) {
      setIsPlaying(true);  // Automatically start playing the song when this screen loads
    }
  }, [song, setIsPlaying]);
  
  useEffect(() => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, [song, setCurrentSong, setIsPlaying]);

  useEffect(() => {
    if (isPlaying) {
      // Start or resume the rotation animation when the song is playing
      Animated.loop(
        Animated.timing(rotation, {
          toValue: rotation._value + 1, // Keep adding 1 to the current value
          duration: 3000, // Faster rotation (e.g., 3000ms for 360 degree rotation)
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Ensure rotation continues without resetting when paused
      rotation.stopAnimation();
    }
  
    // Start the interval to update current time
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current) {
          playerRef.current.getCurrentTime().then(setCurrentTime);
        }
      }, 100); // Update every 100ms
    } else {
      clearInterval(intervalRef.current); // Clear the interval when not playing
    }
  
    // Cleanup on unmount
    return () => {
      clearInterval(intervalRef.current);
      rotation.stopAnimation();
    };
  }, [isPlaying]);
  
  // Interpolation for rotation
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Full rotation
  });
  

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setPlayerIsPlaying(!isPlaying); // Update playing state in context
  };

  const playNext = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const currentSong = songs[currentIndex];

  const handleSeek = (time) => {
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.vinylContainer}>
        <Animated.View style={[styles.vinyl, { transform: [{ rotate: rotateInterpolate }] }]}>
          <Image source={memberImage} style={styles.vinylImage} />
        </Animated.View>
        <View style={styles.vinylCenter}></View>
        <View style={styles.innerVinylCenter}></View>
      </View>

      <Text style={styles.songTitle}>{currentSong.title}</Text>

      <YouTubeIframe
        ref={playerRef}
        videoId={currentSong.videoId}
        height={200}
        play={isPlaying}
        onChangeState={(state) => {
          if (state === 'ended') playNext();
        }}
        onReady={() => {
          playerRef.current?.getDuration().then(setDuration);
        }}
      />

      {/* Seek Bar (Slider) */}
      <View style={styles.seekBarContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#fff"
          thumbTintColor="#fff"
          onSlidingComplete={handleSeek}
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

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
    position: 'absolute', // Use absolute positioning
    top: '50%', // Position it vertically in the center
    left: '33%', // Position it horizontally in the center
    marginTop: -25, // Offset by half of the height to truly center it
    marginLeft: -25, // Offset by half of the width to truly center it
    justifyContent: 'center', // Ensure the content is centered
    alignItems: 'center', // Align the content in the center
    borderWidth: 2, // Set the width of the border
    borderColor: '#000',
  },

  songTitle: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 20,
    padding: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    bottom: 80,
  
  },
  
  innerVinylCenter: {
    width: 20, // Smaller size for the inner center
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000', // Different color for the inner center
    position: 'absolute', // Use absolute positioning
    top: '55%', // Position it vertically in the center
    left: '37%', // Position it horizontally in the center
    marginTop: -23, // Offset by half of the height to truly center it
    marginLeft: -25, // Offset by half of the width to truly center it
    justifyContent: 'center', // Ensure the content is centered
    alignItems: 'center',
  },
  seekBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10, // Increase bottom margin to move upwards
    position: 'absolute',
    bottom: 200,
  },
  slider: {
    flex: 1,
    height: 40,
    
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 10,
  },
});

export default PlayerScreen;
