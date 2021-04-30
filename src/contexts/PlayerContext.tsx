import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: ( episode: Episode ) => void;
  playList: ( list: Array<Episode>, index: number ) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: ( state: boolean ) => void;
  clearPlayerState: () => void;
}

export const PlayerContext = createContext( {} as PlayerContextData )

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider( props: PlayerContextProviderProps ) {
  const [ episodeList, setEpisodeList ] = useState( [] )
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState( 0 )
  const [ isPlaying, setIsPlaying ] = useState( false )
  const [ isLooping, setIsLooping ] = useState( false )
  const [ isShuffling, setIsShuffling ] = useState( false )

  function play( episode: Episode ) {
    setEpisodeList([ episode ])
    setCurrentEpisodeIndex( 0 )
    setIsPlaying( true )
  }

  function playList( list: Array<Episode>, index: number ) {
    setEpisodeList( list )
    setCurrentEpisodeIndex( index )
    setIsPlaying( true )
  }

  function toggleLoop() {
    setIsLooping( !isLooping )
  }

  function toggleShuffle() {
    setIsShuffling( !isShuffling )
  }

  function setPlayingState( state: boolean ) {
    setIsPlaying( state )
  }

  function clearPlayerState() {
    setEpisodeList( [] )
    setCurrentEpisodeIndex( 0 )
  }

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length
  const hasPrevious = currentEpisodeIndex > 0

  function playNext() {
    if( isShuffling ) {
      const nextRandomEpisodeIndex = Math.floor( Math.random() * episodeList.length )
      setCurrentEpisodeIndex( nextRandomEpisodeIndex )

    } else if( hasNext ) setCurrentEpisodeIndex( currentEpisodeIndex + 1 )
  }

  function playPrevious () {
    if( hasPrevious ) setCurrentEpisodeIndex( currentEpisodeIndex - 1 )
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        play,
        playList,
        playNext,
        playPrevious,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        clearPlayerState
      }}
    >
      { props.children }
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext( PlayerContext )
}