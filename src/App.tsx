import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Guess from './pages/guess';
import Home from './pages/home';
import RandomGuess from './pages/guess-random';

function App() {
  return (
    <Router>
      <main >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/name-all-countries" element={<Guess />} />
          <Route path="/random-guess" element={<RandomGuess />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
