import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { api } from '../../services/api';
import { durationToString } from '../../utils/durationToString';
import Image from 'next/image';
import Link from 'next/link';

import styles from './episode.module.scss'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  url: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode( { episode }: EpisodeProps ) {
  return(
    <div className={ styles.episode }>
      <div className={ styles.thumbnailContainer }>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Back"/>
          </button>
        </Link>
        <Image
          width={ 700 }
          height={ 160 }
          src={ episode.thumbnail }
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Play Episode"/>
        </button>
      </div>

      <header>
        <h1>{ episode.title }</h1>
        <span>{ episode.members }</span>
        <span>{ episode.publishedAt }</span>
        <span>{ episode.durationAsString }</span>
      </header>

      <div
        className={ styles.description }
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get( 'episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  } )

  const paths = data.map( episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  } )

  return {
    paths,                    //fallback: true or 'blocking' are called Incremental Static Regeneration. It can preload
    fallback: 'blocking'      //some desired paths at the NextJS server using SSG and load new ones as required during navigation
  }         //if use fallback: true, it's necessary to import the useRouter function from Next to detect when some other page is loading
}

export const getStaticProps: GetStaticProps = async ( context ) => {
  const { slug } = context.params                         //get the query parameters from the context
  const { data } = await api.get( `/episodes/${ slug }` )

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    description: data.description,
    url: data.file.url,
    publishedAt: format( parseISO( data.published_at ), 'd MMM yy', { locale: enUS } ),
    duration: Number( data.file.duration ),
    durationAsString: durationToString( Number( data.file.duration ) )
  }
  
  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24
  }
}