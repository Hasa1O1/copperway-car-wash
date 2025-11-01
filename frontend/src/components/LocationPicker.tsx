import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface LocationPickerProps {
  onLocationSelect: (address: string, lat: number, lng: number, isPickup: boolean) => void;
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [pickupMap, setPickupMap] = useState<google.maps.Map | null>(null);
  const [dropoffMap, setDropoffMap] = useState<google.maps.Map | null>(null);
  const pickupMapRef = useRef<HTMLDivElement>(null);
  const dropoffMapRef = useRef<HTMLDivElement>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const dropoffMarkerRef = useRef<google.maps.Marker | null>(null);
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('Google Maps API key not found. Location picker will not work.');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      // Initialize pickup map
      if (pickupMapRef.current && !pickupMap) {
        const map = new google.maps.Map(pickupMapRef.current, {
          center: { lat: -12.8153, lng: 28.2139 }, // Kitwe, Zambia
          zoom: 13,
        });

        const marker = new google.maps.Marker({
          map,
          draggable: true,
        });

        const autocomplete = new google.maps.places.Autocomplete(
          document.getElementById('pickup-address') as HTMLInputElement,
          { fields: ['formatted_address', 'geometry'] }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            map.setCenter(location);
            marker.setPosition(location);
            setPickupAddress(place.formatted_address || '');
            onLocationSelect(
              place.formatted_address || '',
              location.lat(),
              location.lng(),
              true
            );
          }
        });

        google.maps.event.addListener(marker, 'dragend', (e: any) => {
          const location = e.latLng;
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setPickupAddress(results[0].formatted_address);
              onLocationSelect(
                results[0].formatted_address,
                location.lat(),
                location.lng(),
                true
              );
            }
          });
        });

        setPickupMap(map);
        pickupMarkerRef.current = marker;
        pickupAutocompleteRef.current = autocomplete;
      }

      // Initialize dropoff map
      if (dropoffMapRef.current && !dropoffMap) {
        const map = new google.maps.Map(dropoffMapRef.current, {
          center: { lat: -12.8153, lng: 28.2139 },
          zoom: 13,
        });

        const marker = new google.maps.Marker({
          map,
          draggable: true,
        });

        const autocomplete = new google.maps.places.Autocomplete(
          document.getElementById('dropoff-address') as HTMLInputElement,
          { fields: ['formatted_address', 'geometry'] }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            map.setCenter(location);
            marker.setPosition(location);
            setDropoffAddress(place.formatted_address || '');
            onLocationSelect(
              place.formatted_address || '',
              location.lat(),
              location.lng(),
              false
            );
          }
        });

        google.maps.event.addListener(marker, 'dragend', (e: any) => {
          const location = e.latLng;
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setDropoffAddress(results[0].formatted_address);
              onLocationSelect(
                results[0].formatted_address,
                location.lat(),
                location.lng(),
                false
              );
            }
          });
        });

        setDropoffMap(map);
        dropoffMarkerRef.current = marker;
        dropoffAutocompleteRef.current = autocomplete;
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
        <input
          id="pickup-address"
          type="text"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
          placeholder="Enter or select pickup address"
        />
        <div ref={pickupMapRef} className="w-full h-48 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Address (Optional)</label>
        <input
          id="dropoff-address"
          type="text"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
          placeholder="Enter or select drop-off address"
        />
        <div ref={dropoffMapRef} className="w-full h-48 rounded-lg" />
      </div>
    </div>
  );
}

