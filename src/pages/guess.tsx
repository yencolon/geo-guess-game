import { useState, useCallback } from 'react';
import { Button } from "@/components/uix/button";
import { Input } from "@/components/uix/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/uix/card";
import WorldMap from '@/components/world-map';
import geoUrl from '@/assets/map.json';
import Topology from '@/types/Topology';

export default function Guess() {
  const [userGuess, setUserGuess] = useState<string>('');
  const [guessedCountries, setGuessedCountries] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [topologyMap, setTopologyMap] = useState<Topology>(geoUrl as Topology);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const guessedCountry = userGuess.trim().toLowerCase();
      if (!guessedCountry) return;

      setTopologyMap(prevMap => {
        const updatedGeometries = prevMap.objects["world"].geometries.map(g => {
          const correctGuess = guessedCountry === g.properties.name.toLowerCase() && !g.properties.selected;
          if (correctGuess) {
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
    <div className='h-screen w-full flex items-center justify-around'>
      <div className="w-1/6 h-full">
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
        <div className='p-3'>
          <h2 className='text-center text-xl'>Guessed Countries</h2>
          {guessedCountries.map((country, index) => (
            <p key={index} className="text-center">{country}</p>
          ))}
        </div>
      </div>
      <div className='w-5/6 h-full flex items-center justify-center bg-orange-700'>
        <WorldMap topologyMap={topologyMap} />
      </div>
    </div>
  );
}