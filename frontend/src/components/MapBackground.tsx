import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngTuple } from 'leaflet';

// Ahmedabad approximate center coordinates
const AHMEDABAD_CENTER: LatLngTuple = [23.0225, 72.5714];
const ZOOM_LEVEL = 12;

interface MapBackgroundProps {
  children?: React.ReactNode;
}

export const MapBackground: React.FC<MapBackgroundProps> = ({ children }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
      <MapContainer
        center={AHMEDABAD_CENTER}
        zoom={ZOOM_LEVEL}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
        zoomControl={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
};