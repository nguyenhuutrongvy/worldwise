import { useParams } from 'react-router-dom';

import './emoji.css';
import styles from './City.module.css';

import { formatDate } from '../utils';
import { useEffect } from 'react';
import { useCities } from '../contexts/CitiesContext';
import Spinner from './Spinner';
import BackButton from './BackButton';

function City() {
  const { id } = useParams();

  const { getCity, currentCity, isLoading } = useCities();

  useEffect(() => {
    getCity(Number(id));
  }, [id]);

  if (!currentCity) {
    return;
  }

  const { cityName, emoji, date, notes } = currentCity;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          {/* <span>{emoji}</span> */}
          <i
            className={`em em-flag-${emoji?.toLowerCase()} ${styles.emoji}`}
          ></i>
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{date ? formatDate(date) : ''}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target='_blank'
          rel='noreferrer'
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
