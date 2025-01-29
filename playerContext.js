import React, { createContext, useState, useContext, useEffect } from 'react';

// The playlistIds object as provided
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

// Create a context for the player state
const PlayerContext = createContext();

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to initialize the player with a playlist based on the selected member
  const initializePlayer = (memberName) => {
    const playlistId = playlistIds[memberName.toLowerCase()];
    if (playlistId) {
      fetchPlaylistFromYouTube(playlistId);
    }
  };

  // Function to fetch the playlist (simulate fetching here)
  const fetchPlaylistFromYouTube = (playlistId) => {
    // Simulate fetching playlist data (In real-world, you'd use YouTube API or another service)
    const fetchedSongs = fetchSongsForPlaylist(playlistId);
    setSongs(fetchedSongs);
    setCurrentSong(fetchedSongs[0]);
    setCurrentIndex(0);
    setIsPlaying(true); // Start playing the first song by default
  };

  // Simulate fetching songs for a given playlist
  const fetchSongsForPlaylist = (playlistId) => {
    // Replace with actual YouTube API fetching logic
    // For now, we return mock data for the example.
    return [
      { title: 'Song 1', videoId: 'abc123', playlistId: playlistId },
      { title: 'Song 2', videoId: 'def456', playlistId: playlistId },
      { title: 'Song 3', videoId: 'ghi789', playlistId: playlistId },
    ];
  };

  // Handle toggling the play/pause state
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle playing the next song
  const playNext = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  // Handle playing the previous song
  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  // Set the current song (called when a song is selected from the playlist)
  const selectSong = (song) => {
    setCurrentSong(song);
    setCurrentIndex(songs.indexOf(song));
  };

  // Set the song's playing state (for example, when user navigates away)
  const setPlayerIsPlaying = (state) => {
    setIsPlaying(state);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong, 
        setIsPlaying,
        songs,
        isPlaying,
        currentIndex,
        initializePlayer,
        togglePlayback,
        playNext,
        playPrevious,
        selectSong,
        setPlayerIsPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
