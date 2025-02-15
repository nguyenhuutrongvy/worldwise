import { useState } from 'react';
import { Position } from '../types/Position';

export function useGeolocation(defaultPosition: Position = { lat: 0, lng: 0 }) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState('');

  function getPosition() {
    if (!navigator.geolocation) {
      return setError('Your browser does not support geolocation');
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
