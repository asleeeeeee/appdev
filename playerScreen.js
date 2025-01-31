import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlayerScreen = ({ route }) => {
  const { song, memberImage, songs } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(songs.findIndex(s => s.videoId === song.videoId));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);
  
  const rotation = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (song) {
      setIsPlaying(true);  
    }
  }, [song]);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: rotation._value + 1, 
          duration: 3000, 
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotation.stopAnimation();
    }

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current) {
          playerRef.current.getCurrentTime().then((currentTimeVal) => {
            setCurrentTime(currentTimeVal);
          });
        }
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      rotation.stopAnimation();
    };
  }, [isPlaying]);


  
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], 
  });

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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

  const onPlayerReady = async () => {
    if (playerRef.current) {
      const videoDuration = await playerRef.current.getDuration();  // Get the actual video duration
      setDuration(videoDuration);  // Set the accurate duration
      setIsLoading(false);  // Once we have the duration, set loading to false
    }
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

      <Text style={styles.songTitle}>{currentSong?.title}</Text>
      <Text style={styles.artistText}>{currentSong.artist}</Text>




      <YouTubeIframe
        ref={playerRef}
        videoId={currentSong.videoId}
        height={200}
        play={isPlaying}
        onChangeState={(state) => {
          if (state === 'ended') playNext();
        }}
        onReady={onPlayerReady}  // Call onPlayerReady when the video is ready
      />

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
        <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
          <Icon name="backward" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#fff" />
        </TouchableOpacity>
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
    marginBottom: 3,
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
    width: '90%',
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
  artistText: {
    fontSize: 16,
    color: '#aaa',
   marginBottom: 5,
  },
  
});

export default PlayerScreen;