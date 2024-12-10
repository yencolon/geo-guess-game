import { useEffect, useState, useCallback } from 'react';
import WorldMap from '@/components/world-map';
import geoUrl from '@/assets/map.json';
import Topology from '@/types/Topology';
import Coordinate from '@/types/Coordinates';
import { Button } from '@/components/uix/button';
import { calculateGeometryCentroid } from '@/lib/geo-utils';

const MAX_OPTIONS = 4; // Maximum number of options to display

export default function RandomGuess() {
    const [topologyMap, setTopologyMap] = useState<Topology>(geoUrl as Topology);
    const [rotation, setRotation] = useState<Coordinate>({ latitude: 0, longitude: 0 });
    const [options, setOptions] = useState<string[]>([]);
    const [correctOption, setCorrectOption] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [guessCount, setGuessCount] = useState<number>(0);

    const selectRandomCountries = useCallback(() => {
        const geometries = topologyMap.objects['world'].geometries;

        // Filter and shuffle geometries
        const availableGeometries = geometries.filter(geometry => !geometry.properties.selected);
        const shuffledGeometries = [...availableGeometries].sort(() => Math.random() - 0.5);

        // Select a random index and ensure it is valid
        const randomIndex = Math.floor(Math.random() * Math.min(MAX_OPTIONS, shuffledGeometries.length));

        if (randomIndex < 0 || randomIndex >= shuffledGeometries.length) return [];

        // Mark the selected country
        const selectedCountry = {
            ...shuffledGeometries[randomIndex],
            properties: {
                ...shuffledGeometries[randomIndex].properties,
                selected: true,
            },
        };

        // Update geometries with the selected country
        const updatedGeometries = geometries.map(geometry =>
            geometry.properties.name === selectedCountry.properties.name ? selectedCountry : geometry
        );

        // Update topology map state
        setTopologyMap(prevMap => ({
            ...prevMap,
            objects: {
                ...prevMap.objects,
                world: {
                    ...prevMap.objects.world,
                    geometries: updatedGeometries,
                },
            },
        }));

        // Set the correct option name and calculate centroid
        setCorrectOption(selectedCountry.properties.name);
        const centroid = calculateGeometryCentroid(selectedCountry.arcs, selectedCountry.type, topologyMap.arcs);
        setRotation(centroid);

        return shuffledGeometries.slice(0, MAX_OPTIONS).map(geometry => geometry.properties.name);
    }, [topologyMap]);

    useEffect(() => {
        const randomCountries = selectRandomCountries();
        setOptions(randomCountries);
    }, [guessCount]);

    const handleAnswer = (option: string) => {
        if (option.toUpperCase() === correctOption.toUpperCase()) {
            setResult('Correct!');
            setGuessCount(prevCount => prevCount + 1);
        } else {
            setResult('Try Again!'); // Optional feedback for incorrect answers
        }
    };

    return (
        <div className='h-screen w-full flex flex-col items-center justify-around bg-slate-100'>
            <div className='w-full md:w-4/6 h-4/6 flex items-center justify-center'>
                <WorldMap topologyMap={topologyMap} coordinates={rotation} currentCountry={correctOption} />
            </div>
            <div className='mt-4 p-4 w-full md:w-1/3'>
                <h2 className='text-xl text-center font-bold mb-2'>Which country is highlighted?</h2>
                <div className='grid grid-cols-2 gap-4'>
                    {options.map((option, index) => (
                        <Button key={index} onClick={() => handleAnswer(option)} variant='outline'>
                            {option}
                        </Button>
                    ))}
                </div>
                <p className='text-center mt-4'>{result}</p>
                <p className='text-center mt-4'>Guess Count: {guessCount}</p>
            </div>
        </div>
    );
}