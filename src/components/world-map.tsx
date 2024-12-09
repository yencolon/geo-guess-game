import Topology from '@/types/Topology';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

export default function WorldMap({ topologyMap }: { topologyMap: Topology }) {

  return (
    <div className="w-full h-full bg-slate-100">
      <ComposableMap projection="geoEqualEarth" className="w-full h-full">
        <Geographies geography={topologyMap} >
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                strokeWidth={0.5}
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