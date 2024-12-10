import { useEffect, useState } from 'react';
import Topology from '@/types/Topology';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import Coordinate from '@/types/Coordinates';

interface WorldMapProps {
  topologyMap: Topology;
  coordinates: Coordinate;
  currentCountry?: string;
}

const STEP_SIZE = 4; // Adjust this step size to control the speed of transition
const INTERVAL_TIME = 10; // Interval time in milliseconds

export default function WorldMap({ topologyMap, coordinates, currentCountry = '' }: WorldMapProps) {
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinate>(coordinates);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCoordinates(current => {
        const latitudeDiff = coordinates.latitude - current.latitude;
        const longitudeDiff = coordinates.longitude - current.longitude;

        if (Math.abs(latitudeDiff) < STEP_SIZE && Math.abs(longitudeDiff) < STEP_SIZE) {
          clearInterval(timer);
          return coordinates; // Return final coordinates when close enough
        }

        return {
          latitude: current.latitude + Math.sign(latitudeDiff) * Math.min(STEP_SIZE, Math.abs(latitudeDiff)),
          longitude: current.longitude + Math.sign(longitudeDiff) * Math.min(STEP_SIZE, Math.abs(longitudeDiff)),
        };
      });
    }, INTERVAL_TIME);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [coordinates]);

  return (
    <div className='w-full lg:w-4/5 max-h-screen'>
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{
          rotate: [-currentCoordinates.longitude, -currentCoordinates.latitude, 0],
          center: [0, 0],
        }}
        className=''
      >
        <circle cx={400} cy={300} r={250} fill="#0ea5e9" stroke="#9ca3af" />
        
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
      </ComposableMap>
    </div>
  );
}