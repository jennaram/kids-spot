// utils/android-map-config// utils/android-map-config.ts
import { Platform } from 'react-native';
import MapView, { MapViewProps } from 'react-native-maps';
import React from 'react';

type EnhancedMapViewProps = MapViewProps & {
  children?: React.ReactNode;
};

export const applyAndroidMapFix = (
  MapComponent: React.ComponentType<EnhancedMapViewProps>
): React.ComponentType<EnhancedMapViewProps> => {
  if (Platform.OS === 'android') {
    return (props: EnhancedMapViewProps) => (
      <MapComponent
        {...props}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
      />
    );
  } else {
    return MapComponent;
  }

  return MapComponent; // Default return to ensure all code paths return a value
};