import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { usePlayer } from './playerContext'; // Make sure path is correct
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const MiniPlayer = () => {
  const { setCurrentSong, song, currentSong, setIsPlaying, isPlaying, setCurrentIndex, setCurrentTime, currentIndex, songs } = usePlayer(); // Destructure from context
  const navigation = useNavigation();

  useEffect(() => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, [song, setCurrentSong, setIsPlaying]);

  if (!currentSong) return null; // Don't show MiniPlayer if no song is playing

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying); // Corrected to use setIsPlaying
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('PlayerScreen', { song: currentSong })} // Navigate to PlayerScreen
    >
      <Text style={styles.title}>{currentSong.title}</Text>
      
      {/* Previous Button */}
      <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
        <Icon name="backward" size={20} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={togglePlayPause}>
        <Icon name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
      </TouchableOpacity>
      
      {/* Next Button */}
      <TouchableOpacity onPress={playNext} style={styles.controlButton}>
        <Icon name="forward" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  controlButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 70,
  },
});

export default MiniPlayer;
