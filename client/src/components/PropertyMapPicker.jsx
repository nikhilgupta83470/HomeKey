import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";

const defaultIcon = L.divIcon({
  className: "custom-map-marker",
  html: '<div style="width:24px;height:24px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px #555"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function LocationMarker({ position, onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return position ? (
    <Marker
      position={[position.latitude, position.longitude]}
      icon={defaultIcon}
      draggable
      eventHandlers={{
        dragend(event) {
          const point = event.target.getLatLng();

          onSelect({
            latitude: point.lat,
            longitude: point.lng,
          });
        },
      }}
    />
  ) : null;
}

export default function PropertyMapPicker({
  latitude,
  longitude,
  onLocationSelect,
}) {
  const [position, setPosition] = useState(
    latitude != null && longitude != null
      ? { latitude: Number(latitude), longitude: Number(longitude) }
      : null,
  );

  const initialCenter = position
    ? [position.latitude, position.longitude]
    : [26.8467, 80.9462];

  function selectLocation(point) {
    setPosition(point);

    onLocationSelect({
      ...point,
      mapUrl: `https://www.openstreetmap.org/?mlat=${point.latitude}&mlon=${point.longitude}#map=16/${point.latitude}/${point.longitude}`,
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Map par click karo ya pin drag karke property ki exact location select
        karo.
      </p>

      <div
        className="overflow-hidden rounded-xl border border-gray-300"
        style={{ height: "440px", width: "100%", position: "relative" }}
      >
        {" "}
        <MapContainer
          center={initialCenter}
          zoom={position ? 15 : 11}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{
              tileload(event) {
                console.log("Tile loaded:", event.tile.src);
              },
              tileerror(event) {
                console.error("Tile error:", event);
              },
            }}
          />
          <LocationMarker position={position} onSelect={selectLocation} />
        </MapContainer>
      </div>

      {position ? (
        <div className="text-sm text-gray-700">
          <p>Latitude: {position.latitude.toFixed(6)}</p>
          <p>Longitude: {position.longitude.toFixed(6)}</p>
          <button
            type="button"
            onClick={() => selectLocation(position)}
            className="mt-2 text-blue-600 underline"
          >
            Confirm location
          </button>
        </div>
      ) : (
        <p className="text-sm text-amber-700">
          Abhi location select nahi hui hai.
        </p>
      )}
    </div>
  );
}
