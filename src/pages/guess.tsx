import { useState, useCallback } from 'react';
import { Button } from "@/components/uix/button";
import { Input } from "@/components/uix/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/uix/card";
import WorldMap from '@/components/world-map';
import geoUrl from '@/assets/map.json';
import Topology from '@/types/Topology';
import Coordinate from '@/types/Coordinates';
import { calculateGeometryCentroid } from '@/lib/geo-utils';

export default function Guess() {
  const [userGuess, setUserGuess] = useState<string>('VENEZUELA');
  const [guessedCountries, setGuessedCountries] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [topologyMap, setTopologyMap] = useState<Topology>(geoUrl as Topology);
  const [rotation, setRotation] = useState<Coordinate>({ latitude: 0, longitude: 0 });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const guessedCountry = userGuess.trim().toLowerCase();
      if (!guessedCountry) return;

      setTopologyMap(prevMap => {
        const updatedGeometries = prevMap.objects["world"].geometries.map(g => {
          const correctGuess = guessedCountry === g.properties.name.toLowerCase() && !g.properties.selected;

          if (correctGuess) {
            const centroid = calculateGeometryCentroid(g.arcs, g.type, prevMap.arcs);
            setRotation(centroid);
            setGuessedCountries(prevCountries => [...prevCountries, g.properties.name]);
            setScore(prevScore => prevScore + 1);
            setUserGuess('');
          }

          return {
            ...g,
            properties: {
              ...g.properties,
              selected: correctGuess || g.properties.selected,
            },
          };
        });

        return {
          ...prevMap,
          objects: {
            ...prevMap.objects,
            "world": {
              ...prevMap.objects["world"],
              geometries: updatedGeometries,
            },
          },
        };
      });
    },
    [userGuess]
  );



  return (
    <div className='h-screen w-full flex flex-col lg:flex-row items-center justify-around bg-slate-100 '> 
      <div className="w-full lg:w-1/6 h-1/3 lg:h-full bg-slate-200">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Name all the countries</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Enter country name"
                className="w-full"
              />
              <Button type="submit" className="w-full">Submit</Button>
            </form>
            <p className="mt-4 text-center">Score: {score} / {topologyMap.objects["world"].geometries.length}</p>
          </CardContent>
        </Card>
        <div className='p-3 hidden md:block'>
          <h2 className='text-center text-xl'>Guessed Countries</h2>
          <div className="flex flex-wrap gap-1">
            {guessedCountries.map((country) => {
              return (
                <span key={country} className="bg-green-100 text-black-500 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-500 dark:text-black-300">
                  {country}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className='w-full h-full lg:w-5/6 flex items-center justify-center '>
        <WorldMap topologyMap={topologyMap} coordinates={rotation} />
      </div>
    </div>
  );
}