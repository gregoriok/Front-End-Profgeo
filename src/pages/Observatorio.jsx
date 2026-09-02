import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, WMSTileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GEOSERVER_URL = import.meta.env.VITE_GEOSERVER_URL || 'http://localhost:8080/geoserver';
const WMS_LAYER = 'profgeo:escola_com_turma';

function WMSFeatureInfo() {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const size = map.getSize();
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const params = new URLSearchParams({
        SERVICE: 'WMS',
        VERSION: '1.1.1',
        REQUEST: 'GetFeatureInfo',
        FORMAT: 'image/png',
        TRANSPARENT: 'true',
        QUERY_LAYERS: WMS_LAYER,
        LAYERS: WMS_LAYER,
        INFO_FORMAT: 'application/json',
        FEATURE_COUNT: '1',
        X: Math.round(map.latLngToContainerPoint(e.latlng).x),
        Y: Math.round(map.latLngToContainerPoint(e.latlng).y),
        SRS: 'EPSG:4326',
        WIDTH: size.x,
        HEIGHT: size.y,
        BBOX: `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`,
      });

      fetch(`${GEOSERVER_URL}/wms?${params}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            const nome = props.nome_escola || props.nome || 'Escola';
            const turmas = props.total_turmas ? `<br/><b>Turmas:</b> ${props.total_turmas}` : '';
            L.popup()
              .setLatLng([lat, lng])
              .setContent(`<b>${nome}</b>${turmas}`)
              .openOn(map);
          }
        })
        .catch(() => {});
    },
  });

  return null;
}

export function Observatorio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-profgeo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-profgeo-100">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-profgeo-900">
              Observatorio ProfGeo
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Mapa interativo das escolas com turmas cadastradas no programa.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-profgeo-600 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Pagina Inicial
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-white bg-profgeo-600 hover:bg-profgeo-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Acessar o Sistema
            </button>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: '70vh' }}>
        <MapContainer
          center={[-15.78, -47.93]}
          zoom={5}
          className="w-full h-full absolute inset-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <WMSTileLayer
            url={`${GEOSERVER_URL}/wms`}
            layers={WMS_LAYER}
            format="image/png"
            transparent={true}
            version="1.1.1"
          />
          <WMSFeatureInfo />
        </MapContainer>
      </div>
    </div>
  );
}
