import { Country } from '../types/Country';
import styles from './CountryItem.module.css';
import './emoji.css';

function CountryItem({ country }: { country: Country }) {
  return (
    <li className={styles.countryItem}>
      {/* <span>{country.emoji}</span> */}
      <i
        className={`em em-flag-${country.emoji.toLowerCase()} ${styles.emoji}`}
      ></i>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
