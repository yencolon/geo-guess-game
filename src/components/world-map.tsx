import { useEffect, useState, useRef, useCallback } from 'react';
import Topology from '@/types/Topology';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import Coordinate from '@/types/Coordinates';
import ControlButton from './control-buttons';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

interface WorldMapProps {
  topologyMap: Topology;
  coordinates: Coordinate;
  currentCountry?: string;
}

const STEP_SIZE = 4;
const INTERVAL_TIME = 10;

export default function WorldMap({ topologyMap, coordinates, currentCountry = '' }: WorldMapProps) {
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinate>(coordinates);
  const [zoom, setZoom] = useState(0.85);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = useCallback((callback: () => void) => {
    callback();
    intervalRef.current = setInterval(callback, 100);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCoordinates(current => {
        const latitudeDiff = coordinates.latitude - current.latitude;
        const longitudeDiff = coordinates.longitude - current.longitude;

        if (Math.abs(latitudeDiff) < STEP_SIZE && Math.abs(longitudeDiff) < STEP_SIZE) {
          clearInterval(timer);
          return coordinates;
        }

        return {
          latitude: current.latitude + Math.sign(latitudeDiff) * Math.min(STEP_SIZE, Math.abs(latitudeDiff)),
          longitude: current.longitude + Math.sign(longitudeDiff) * Math.min(STEP_SIZE, Math.abs(longitudeDiff)),
        };
      });
    }, INTERVAL_TIME);

    return () => clearInterval(timer);
  }, [coordinates]);

  const createControlButton = (icon: JSX.Element, updateFn: (current: Coordinate) => Coordinate) => (
    <ControlButton
      onMouseDown={() => handleMouseDown(() => setCurrentCoordinates(updateFn))}
      onMouseUp={handleMouseUp}
    >
      {icon}
    </ControlButton>
  );

  const validateCoordinates = (latitude: number, longitude: number) => {
    const clampedLatitude = Math.max(-90, Math.min(90, latitude)); // Clamp latitude
    const clampedLongitude = ((longitude + 180) % 360 + 360) % 360 - 180; // Wrap longitude
    return { latitude: clampedLatitude, longitude: clampedLongitude };
  };

  return (
    <div className='w-full h-full flex-1 overflow-hidden relative'>
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{
          rotate: [-currentCoordinates.longitude, -currentCoordinates.latitude, 0],
        }}
        className='w-full h-full'
      >
        <g
          transform={`translate(${400}, ${300}) scale(${zoom}) translate(${-400}, ${-300})`}
        >
          <circle cx={400} cy={300} r={250} fill="#0ea5e9" stroke="#9ca3af" />
          <Graticule />
          <Geographies geography={topologyMap}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                  strokeWidth={0.1}
                  style={{
                    default: {
                      fill: currentCountry === geo.properties.name ? "#fbbf24" : geo.properties.selected ? "#34d399" : "#EAEAEC",
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </g>
      </ComposableMap>
      <div className='absolute bottom-0 left-0 right-0 md:bottom-auto md:top-0 flex items-center justify-center space-x-2 p-2 bg-white rounded shadow'>
        <ControlButton onMouseDown={() => handleMouseDown(() => setZoom(prevZoom => prevZoom > 1.5 ? prevZoom : prevZoom + 0.1))} onMouseUp={handleMouseUp}>
          <ZoomIn />
        </ControlButton>
        <ControlButton onMouseDown={() => handleMouseDown(() => setZoom(prevZoom => prevZoom < 0.5 ? prevZoom : prevZoom - 0.1))} onMouseUp={handleMouseUp}>
          <ZoomOut />
        </ControlButton>
        {createControlButton(<RotateCcw />, current =>
          validateCoordinates(current.latitude, current.longitude + 10)
        )}
        {createControlButton(<RotateCw />, current =>
          validateCoordinates(current.latitude, current.longitude - 10)
        )}
        {createControlButton(<ArrowUp />, current =>
          validateCoordinates(current.latitude + 10, current.longitude)
        )}
        {createControlButton(<ArrowDown />, current =>
          validateCoordinates(current.latitude - 10, current.longitude)
        )}
      </div>
    </div>
  );
}