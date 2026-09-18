import { Search, TextInput } from 'hds-react';
import { type ChangeEvent, type ComponentProps, useCallback, useEffect, useRef, useState } from 'react';
import { defaultSearchInputTheme } from '@/react/common/constants/searchInputStyle';
import type { ServiceMapAddress, ServiceMapLocationResult, ServiceMapResponse } from '@/types/ServiceMap';
import ServiceMap from './enum/ServiceMap';
import {
  type AddressSearchErrorType,
  getAddressSearchInlineText,
  resolveAddressSearchError,
} from './helpers/addressSearchError';
import getNameTranslation, { fetchServiceMap, firstRejectionReason, sanitizeAddress } from './helpers/ServiceMap';

export type AddressWithCoordinates = { label: string; value: [number, number, string] };

const USE_LOCATION_VALUE = Drupal.t('Use current Location', {}, { context: 'Location autocomplete' });

const useLocationOption = {
  label: USE_LOCATION_VALUE,
  value: USE_LOCATION_VALUE,
};

type BaseAddressSearchProps = {
  className?: string;
  error?: boolean | AddressSearchErrorType;
  hideSearchButton?: boolean;
  onChange?: (value: string) => void;
  searchInputClassname?: string;
  useLocation?: boolean;
  value?: string;
  visibleSuggestions?: number;
} & Omit<
  ComponentProps<typeof Search>,
  'onSubmit' | 'onSearch' | 'onSend' | 'onChange' | 'value' | 'hideSubmitButton' | 'visibleOptions'
>;

type AddressSearchProps =
  | (BaseAddressSearchProps & { includeCoordinates: true; onSubmit: (address: AddressWithCoordinates) => void })
  | (BaseAddressSearchProps & { includeCoordinates?: false; onSubmit: (address: string) => void });

export const AddressSearch = ({
  className,
  error,
  hideSearchButton,
  includeCoordinates = false,
  onChange,
  onSubmit,
  searchInputClassname,
  useLocation = false,
  value,
  visibleSuggestions,
  ...rest
}: AddressSearchProps) => {
  const addressMap = useRef(new Map<string, [number, number]>());
  const [geoLocationError, setGeoLocationError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [suggestionsUnavailable, setSuggestionsUnavailable] = useState(false);

  const [props] = useState({
    ...rest,
    className: searchInputClassname || 'hdbt-search__input hdbt-search__search-input',
    hideSubmitButton: hideSearchButton ?? true,
    theme: defaultSearchInputTheme,
  });

  const textsObject = props.texts && typeof props.texts === 'object' ? props.texts : undefined;
  const loadingPlaceholderProps = {
    label: textsObject?.label,
    helperText: textsObject?.assistive,
    placeholder: textsObject?.searchPlaceholder,
  };

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  // HDS Search clears its initial value on mount by firing onChange(""), so we
  // push the incoming value back out to keep the parent's state intact. The
  // ref tracks what we last emitted so we don't bounce our own typing back at
  // the parent.
  const lastSyncedValue = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (value && value !== lastSyncedValue.current) {
      lastSyncedValue.current = value;
      onChangeRef.current?.(value);
    }
  }, [value]);

  const submitAddress = useCallback(
    (resolvedName: string, coords?: [number, number]) => {
      if (includeCoordinates) {
        if (!coords) {
          return;
        }
        (onSubmitRef.current as (a: AddressWithCoordinates) => void)({
          label: resolvedName,
          value: [coords[0], coords[1], resolvedName],
        });
      } else {
        (onSubmitRef.current as (a: string) => void)(resolvedName);
      }
    },
    [includeCoordinates],
  );

  const handleLocationError = useCallback((message?: string) => {
    setGeoLocationError(
      message ??
        Drupal.t(
          "We couldn't retrieve your current location. Try entering an address.",
          {},
          { context: 'Location autocomplete' },
        ),
    );
  }, []);

  const handleLocationRequest = useCallback(() => {
    setGeoLocationError(null);
    setGeoLoading(true);

    if (!navigator.geolocation) {
      handleLocationError(
        Drupal.t('Geolocation is not supported by this browser.', {}, { context: 'Location autocomplete' }),
      );
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const url = new URL(ServiceMap.ADDRESS_URL);
        url.search = new URLSearchParams({
          lat: latitude.toString(),
          lon: longitude.toString(),
        }).toString();

        try {
          const data = await fetchServiceMap<ServiceMapResponse<ServiceMapLocationResult>>(url.toString());
          if (data.results.length > 0) {
            const addressResult = data.results[0];
            const resolvedName = getNameTranslation(addressResult.full_name, 'fi') || '';
            submitAddress(resolvedName, [latitude, longitude]);
          } else {
            handleLocationError();
          }
        } catch (_e) {
          handleLocationError();
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        handleLocationError();
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      },
    );
  }, [handleLocationError, submitAddress]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: searchValue } = e.target;

      if (useLocation && searchValue === USE_LOCATION_VALUE) {
        handleLocationRequest();
        return;
      }

      lastSyncedValue.current = searchValue;
      onChangeRef.current?.(searchValue);
    },
    [useLocation, handleLocationRequest],
  );

  const getSuggestions = useCallback(
    async (searchTerm?: string) => {
      const sanitized = searchTerm ? sanitizeAddress(searchTerm) : '';

      if (!sanitized) {
        return [];
      }

      const fetchSuggestions = async (param: URLSearchParams) => {
        const url = new URL(ServiceMap.EVENTS_URL);
        url.search = param.toString();
        return fetchServiceMap<ServiceMapResponse<ServiceMapAddress>>(url.toString());
      };

      const [fiParams, svParams] = ['fi', 'sv'].map(
        (lang) =>
          new URLSearchParams({
            format: 'json',
            language: lang,
            municipality: 'helsinki',
            q: sanitized,
            type: 'address',
          }),
      );

      const parseResults = (result: ServiceMapResponse<ServiceMapAddress>, langKey: string) =>
        result.results.map((addressResult) => {
          const resolvedName = getNameTranslation(addressResult.name, langKey) || '';
          if (includeCoordinates && addressResult.location?.coordinates) {
            addressMap.current.set(resolvedName, addressResult.location.coordinates);
          }
          return { label: resolvedName, value: resolvedName };
        });

      const settled = await Promise.allSettled([fetchSuggestions(fiParams), fetchSuggestions(svParams)]);

      if (settled.every((result) => result.status === 'rejected')) {
        console.error('Failed to load address suggestions from the service map.', firstRejectionReason(settled));
        setSuggestionsUnavailable(true);
        return [];
      }

      setSuggestionsUnavailable(false);

      const emptyResponse: ServiceMapResponse<ServiceMapAddress> = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
      const [fiResults, svResults] = settled.map((result) =>
        result.status === 'fulfilled' ? result.value : emptyResponse,
      );

      return [...parseResults(fiResults, 'fi'), ...parseResults(svResults, 'sv')].slice(0, 10);
    },
    [includeCoordinates],
  );

  const handleSend = useCallback(
    (address: string) => {
      submitAddress(address, addressMap.current.get(address));
    },
    [submitAddress],
  );

  const handleSearch = useCallback(
    (searchValue: string) =>
      getSuggestions(searchValue).then((options) => ({
        options: useLocation ? [useLocationOption, ...options] : options,
      })),
    [getSuggestions, useLocation],
  );

  const geoInProgress = useLocation && geoLoading;
  const addressError = resolveAddressSearchError(error) ?? (suggestionsUnavailable ? 'unavailable' : null);

  const searchComponent = (
    <Search
      {...props}
      onChange={handleChange}
      onSearch={handleSearch}
      onSend={handleSend}
      value={value}
      visibleOptions={visibleSuggestions}
    />
  );

  const wrapperClassName = [className || 'hdbt-search__filter', useLocation && 'hdbt-search__filter--with-location']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName} aria-busy={useLocation ? geoInProgress || undefined : undefined}>
      {useLocation ? (
        <>
          <output aria-live='polite' className='visually-hidden'>
            {geoInProgress ? Drupal.t('Retrieving current location...', {}, { context: 'Location autocomplete' }) : ''}
          </output>
          <div style={!geoInProgress ? { display: 'none' } : undefined}>
            <TextInput
              {...loadingPlaceholderProps}
              className={searchInputClassname || 'hdbt-search__input hdbt-search__search-input'}
              disabled
              id='address-search-loading'
              value={value}
            />
          </div>
          <div style={geoInProgress ? { display: 'none' } : undefined}>{searchComponent}</div>
          {geoLocationError && <div className='hds-text-input hds-text-input__error-text'>{geoLocationError}</div>}
        </>
      ) : (
        searchComponent
      )}
      {addressError && (
        <div className='hds-text-input hds-text-input__error-text'>{getAddressSearchInlineText(addressError)}</div>
      )}
    </div>
  );
};
