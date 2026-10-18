import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import Catalogo from './views/Catalogo';


function App() {
  return (
    <BrowserRouter>
      {/* El Navbar siempre visible arriba */}
      <Navbar />
      
      {/* Contenido dinámico según la página */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          {/* Rutas futuras de Elías: */}
          {/* <Route path="/login" element={<LoginRegistro />} /> */}
        </Routes>
      </main>

      {/* El Footer siempre visible abajo */}
      <Footer />
    </BrowserRouter>
  )
}

export default App;