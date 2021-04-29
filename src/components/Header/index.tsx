import format from 'date-fns/format';
import enUS from 'date-fns/locale/en-US';
import styles from './styles.module.scss';

export default function Header() {
  const currDate = format( new Date(), 'EEE, d MMMM', { locale: enUS } );

  return(
    <header className={ styles.headerContainer }>
      <img src="/logo.svg" alt="Podcastr" />
      <p>Always the best for you to listen</p>
      <span>{ currDate }</span>
    </header>
  );
}