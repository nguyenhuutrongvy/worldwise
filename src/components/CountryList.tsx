import CountryItem from './CountryItem';
import Message from './Message';
import Spinner from './Spinner';

import styles from './CountryList.module.css';
import { Country } from '../types/Country';
import { useCities } from '../contexts/CitiesContext';

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    );
  }

  const countries: Country[] = cities.reduce<Country[]>((acc, cur) => {
    if (!acc.some((item) => item.country === cur.country)) {
      acc.push({
        emoji: cur.emoji,
        country: cur.country,
      });
    }
    return acc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
