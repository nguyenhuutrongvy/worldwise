import { Link } from 'react-router-dom';

import { formatDate } from '../utils';
import styles from './CityItem.module.css';
import './emoji.css';
import { City } from '../types/City';
import { useCities } from '../contexts/CitiesContext';
import { MouseEvent } from 'react';

function CityItem({ city }: { city: City }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;

  const currentCityId = currentCity?.id ?? -1;

  function handleDeleteCity(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    deleteCity(id!);
  }

  return (
    <li>
      {/* <span className={styles.emoji}>{emoji}</span> */}
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${city.id === currentCityId ? styles['cityItem--active'] : ''}`}
      >
        <i className={`em em-flag-${emoji.toLowerCase()} ${styles.emoji}`}></i>
        <h1 className={styles.name}>{cityName}</h1>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
