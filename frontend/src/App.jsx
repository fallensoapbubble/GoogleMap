import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddProperty from './pages/AddProperty';
import Insights from './pages/Insights';
import About from './pages/About';
import Google from './pages/Google';
import EnhancedRealEstate from './pages/EnhancedRealEstate';
import Errorz from './pages/Errorz';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/about" element={<About />} />
            <Route path="/google" element={<Google/>} />
            <Route path="/enhanced" element={<EnhancedRealEstate/>} />
            <Route path="/*" element={<Errorz/>} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;