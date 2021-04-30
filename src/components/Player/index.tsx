import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss'
import { durationToString } from '../../utils/durationToString';


export default function Player() {

  const audioRef = useRef<HTMLAudioElement>( null )
  const [ progress, setProgress ] = useState( 0 )

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasNext,
    hasPrevious,
    setPlayingState,
    playNext,
    playPrevious,
    toggleLoop,
    toggleShuffle,
    clearPlayerState
  } = usePlayer()

  useEffect( () => {
    if( !audioRef.current ) return

    if( isPlaying ) audioRef.current.play()
    else audioRef.current.pause()
  }, [ isPlaying ] )

  function setupProgressListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener( 'timeupdate', () => {
      setProgress( Math.floor( audioRef.current.currentTime ) )
    } )
  }

  function handleSeek( amount: number ) {
    audioRef.current.currentTime = amount
    setProgress( amount )
  }

  function handleEpisodeEnded() {
    if( hasNext ) playNext()
    else clearPlayerState()
  }
  
  const episode = episodeList[ currentEpisodeIndex ]

  return(
    <div className={ styles.playerContainer }>
      
      <header>
        <img src="/playing.svg" alt="Playing Now"/>
        <strong>Playing Now</strong>
      </header>

      {
        episode ? (
          <div className={ styles.currentEpisode }>
            <Image
              width={ 592 }
              height={ 592 }
              src={ episode.thumbnail }
              objectFit="cover"
            />
            <strong>{ episode.title }</strong>
            <span>{ episode.members }</span>
          </div>
        ) : (
          <div className={ styles.emptyPlayer }>
            <strong>Select a podcast to play</strong>
          </div>
        )
      }

      <footer className={ !episode ? styles.empty : '' }>
        
        <div className={ styles.progress }>
          <span>{ durationToString( progress ) }</span>
          <div className={ styles.slider }>
            {
              episode ? (
                <Slider
                  max={ episode.duration }
                  value={ progress }
                  onChange={ handleSeek }
                  trackStyle={{ backgroundColor: '#04d361' }}
                  railStyle={{ backgroundColor: '#9f75ff' }}
                  handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                />
              ) : (
                <div className={ styles.emptySlider } />
              )
            }
          </div>
          <span>{ durationToString( episode?.duration ?? 0 ) }</span>
        </div>

        { episode && (     //&& and || are conditional structures. (param) && => if(param) and (param) || => if(!param)
          <audio
            src={ episode.url }
            ref={ audioRef }
            autoPlay
            loop={ isLooping }
            onPlay={ () => setPlayingState( true ) }
            onPause={ () => setPlayingState( false ) }
            onLoadedMetadata={ setupProgressListener }
            onEnded={ handleEpisodeEnded }
          />
        ) }

        <div className={ styles.buttons }>
          <button
            type="button"
            onClick={ toggleShuffle }
            className={ isShuffling ? styles.isActive : '' }
            disabled={ !episode || episodeList.length === 1 }
          >
            <img src="/shuffle.svg" alt="Shuffle"/>
          </button>

          <button
            type="button"
            onClick={ playPrevious }
            disabled={ !episode || !hasPrevious }
          >
            <img src="/play-previous.svg" alt="Play Previous"/>
          </button>
          
          <button
            type="button"
            className={ styles.playButton }
            disabled={ !episode }
            onClick={ () => setPlayingState( !isPlaying ) }
          >
            { isPlaying ? 
              <img src="/pause.svg" alt="Pause"/>
            :
              <img src="/play.svg" alt="Play"/>
            }
          </button>

          <button
            type="button"
            onClick={ playNext }
            disabled={ !episode || !hasNext }
          >
            <img src="/play-next.svg" alt="Play Next"/>
          </button>
          
          <button
            type="button"
            onClick={ toggleLoop }
            className={ isLooping ? styles.isActive : '' }
            disabled={ !episode }
          >
            <img src="/repeat.svg" alt="Repeat"/>
          </button>

        </div>
      
      </footer>
    </div>
  );
}