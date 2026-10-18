import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Carrito from "./components/Carrito";
import { ModalLogin, ModalRegistro } from "./views/LoginRegistro";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";

import Home from "./views/Home";
import Catalogo from "./views/Catalogo";
import Especialidad from "./views/Especialidad";
import Equipo from "./views/Equipo";
import Dudas from "./views/Dudas";
import Contacto from "./views/Contacto";
import Checkout from "./views/Checkout";
import CompraExitosa from "./views/CompraExitosa";
import PagoError from "./views/PagoError";
import AdminDashboard from "./views/AdminDashboard";

function App() {
  return (
    // Los Provider envuelven TODA la app: así cualquier componente, en
    // cualquier nivel, puede usar useCarrito() o useAuth() sin tener que
    // pasarse props manualmente de padre a hijo ("prop drilling").
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/especialidad" element={<Especialidad />} />
              <Route path="/equipo" element={<Equipo />} />
              <Route path="/dudas" element={<Dudas />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/compra-exitosa" element={<CompraExitosa />} />
              <Route path="/pago-error" element={<PagoError />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <Footer />

          {/* Carrito (offcanvas) y modales: viven fuera de <Routes> porque
              deben poder abrirse desde CUALQUIER página, no solo desde una ruta. */}
          <Carrito />
          <ModalLogin />
          <ModalRegistro />
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
