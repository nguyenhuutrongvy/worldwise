import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { City } from '../types/City';

const BASE_URL = 'http://localhost:8000';

interface State {
  readonly cities: City[];
  readonly isLoading: boolean;
  readonly currentCity: City | null;
  readonly error: string;
}

const initialState: State = {
  cities: [],
  isLoading: false,
  currentCity: null,
  error: '',
};

const loadingAction = () =>
  ({
    type: 'loading',
  }) as const;

const gotCitiesAction = (cities: City[]) =>
  ({
    type: 'cities/loaded',
    payload: cities,
  }) as const;

const gotCityAction = (city: City) =>
  ({
    type: 'city/loaded',
    payload: city,
  }) as const;

const createdCityAction = (city: City) =>
  ({
    type: 'city/created',
    payload: city,
  }) as const;

const deletedCityAction = (id: number) =>
  ({
    type: 'city/deleted',
    payload: id,
  }) as const;

const rejectedAction = (error: string) =>
  ({
    type: 'rejected',
    payload: error,
  }) as const;

type Actions =
  | ReturnType<typeof loadingAction>
  | ReturnType<typeof gotCitiesAction>
  | ReturnType<typeof gotCityAction>
  | ReturnType<typeof createdCityAction>
  | ReturnType<typeof deletedCityAction>
  | ReturnType<typeof rejectedAction>;

// The reducer must be pure function
// Therefore, cannot fetch data from API in the reducer
function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: null,
      };
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error('Unknown action type');
  }
}

type CitiesContextType = {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
  error: string;
  getCity: (id: number) => void;
  createCity: (newCity: City) => void;
  deleteCity: (id: number) => void;
};

const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  isLoading: false,
  currentCity: null,
  error: '',
  getCity: () => {},
  createCity: () => {},
  deleteCity: () => {},
});

function CitiesProvider({ children }: { children: ReactNode }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch(loadingAction());

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch(gotCitiesAction(data));
      } catch {
        dispatch(rejectedAction('There was an error while loading cities...'));
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id: number) {
      if (id === currentCity?.id) {
        return;
      }

      dispatch(loadingAction());

      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();

        dispatch(gotCityAction(data));
      } catch {
        dispatch(rejectedAction('There was an error while loading city...'));
      }
    },
    [currentCity?.id]
  );

  async function createCity(newCity: City) {
    dispatch(loadingAction());

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();

      if (data.id) {
        dispatch(createdCityAction(data));
      }
    } catch {
      dispatch(rejectedAction('There was an error while creating the city...'));
    }
  }

  async function deleteCity(id: number) {
    dispatch(loadingAction());

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch(deletedCityAction(id));
    } catch {
      dispatch(rejectedAction('There was an error while deleting the city...'));
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) {
    throw new Error('CitiesContext was used outside of the CitiesProvider');
  }

  return context;
}

export { CitiesProvider, useCities };
