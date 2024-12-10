import { Button } from '@radix-ui/themes';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
       <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Geo Guess Game</h1>
          <p className="text-lg text-gray-700 mt-4">
            Welcome to the Geo Guess Game, where you guess countries based on their geographical location.
          </p>
        </header>
        <nav className="flex space-x-4 mb-12">
          <Link to="/name-all-countries">
            <Button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Name all the countries
            </Button>
          </Link>
          <Link to="/random-guess">
            <Button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Random Guess
            </Button>
          </Link>
        </nav>
    </div>
  );
}