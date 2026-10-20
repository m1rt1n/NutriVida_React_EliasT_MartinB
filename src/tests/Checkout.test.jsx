import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkout from '../views/Checkout';
import { AuthContext } from '../context/AuthContext';
import { CarritoContext } from '../context/CarritoContext';

describe('Pruebas del Componente Checkout', () => {
  const renderCheckout = (carritoMock = [], usuarioMock = null) => {
    return render(
      <AuthContext.Provider value={{ usuario: usuarioMock }}>
        <CarritoContext.Provider value={{ carrito: carritoMock, total: 25000, vaciarCarrito: () => {} }}>
          <BrowserRouter>
            <Checkout />
          </BrowserRouter>
        </CarritoContext.Provider>
      </AuthContext.Provider>
    );
  };

  it('debe mostrar mensaje restrictivo si el carrito está vacío', () => {
    renderCheckout([]);
    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
    expect(screen.getByText('Ir al Catálogo')).toBeTruthy();
  });

  it('debe renderizar el formulario si hay items en el carrito', () => {
    const carritoMock = [{ id: 1, nombre: 'Control Nutricional', precio: 25000 }];
    renderCheckout(carritoMock);
    expect(screen.getByText('Información del Paciente')).toBeTruthy();
    expect(screen.getByText('Resumen de la Orden')).toBeTruthy();
  });

  it('debe precargar los datos del usuario si hay sesión iniciada', () => {
    const carritoMock = [{ id: 1, nombre: 'Control Nutricional', precio: 25000 }];
    const usuarioMock = { nombre: 'Juan', apellidos: 'Pérez', correo: 'juan@gmail.com' };
    
    renderCheckout(carritoMock, usuarioMock);
    
    const inputNombre = screen.getByDisplayValue('Juan');
    const inputCorreo = screen.getByDisplayValue('juan@gmail.com');
    
    expect(inputNombre).toBeTruthy();
    expect(inputCorreo).toBeTruthy();
  });
});