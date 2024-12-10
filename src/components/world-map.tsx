import { useEffect, useState } from 'react';
import Topology from '@/types/Topology';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import Coordinate from '@/types/Coordinates';


export default function WorldMap({ topologyMap, coordinates }: { topologyMap: Topology, coordinates: Coordinate }) {

  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinate>(coordinates);

  useEffect(() => {
    const step = 5; // Adjust this step size to control the speed of transition
    const intervalTime = 50; // Interval time in milliseconds

    const timer = setInterval(() => {
      setCurrentCoordinates(current => {
        const latitudeDiff = coordinates.latitude - current.latitude;
        const longitudeDiff = coordinates.longitude - current.longitude;

        if (Math.abs(latitudeDiff) < step && Math.abs(longitudeDiff) < step) {
          clearInterval(timer);
          return coordinates;
        }

        return {
          latitude: current.latitude + Math.sign(latitudeDiff) * Math.min(step, Math.abs(latitudeDiff)),
          longitude: current.longitude + Math.sign(longitudeDiff) * Math.min(step, Math.abs(longitudeDiff))
        };
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [coordinates]);

  return (
    <div className='w-3/4 max-h-screens'>
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={
          {
            rotate: [-1 * currentCoordinates.longitude, -1 * currentCoordinates.latitude, 0],
          }
        }
      >
        <Geographies geography={topologyMap} >
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                strokeWidth={1}
                style={{
                  default: {
                    fill: geo.properties.selected ? "#06b6d4" : "#EAEAEC",
                    outline: "none",
                  },
                  hover: {
                    fill: "#F53",
                    outline: "none"
                  },
                  pressed: {
                    fill: "#E42",
                    outline: "none"
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
