import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { CarritoContext } from '../context/CarritoContext';

describe('Pruebas del Componente Navbar', () => {
  const renderConContexto = (usuarioMock = null, carritoMock = []) => {
    return render(
      <AuthContext.Provider value={{ usuario: usuarioMock, cerrarSesion: () => {} }}>
        <CarritoContext.Provider value={{ carrito: carritoMock }}>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </CarritoContext.Provider>
      </AuthContext.Provider>
    );
  };

  it('debe renderizar el logotipo y nombre de la clínica', () => {
    renderConContexto();
    expect(screen.getByText('NutriVida')).toBeTruthy();
    expect(screen.getByText('CLÍNICA NUTRICIONAL')).toBeTruthy();
  });

  it('debe mostrar opciones de Ingresar y Crear Cuenta si no hay sesión', () => {
    renderConContexto(null);
    expect(screen.getByText('Ingresar')).toBeTruthy();
    expect(screen.getByText('Crear Cuenta')).toBeTruthy();
  });

  it('debe mostrar el botón de Panel Admin si el usuario tiene rol de administrador', () => {
    const adminMock = { nombre: 'Elías', rol: 'administrador' };
    renderConContexto(adminMock);
    expect(screen.getByText('Panel Admin')).toBeTruthy();
  });

  it('debe mostrar la cantidad correcta de items en el botón del carrito', () => {
    const carritoLleno = [{ id: 1, nombre: 'Consulta', precio: 25000 }];
    renderConContexto(null, carritoLleno);
    expect(screen.getByText('Reservas (1)')).toBeTruthy();
  });
});