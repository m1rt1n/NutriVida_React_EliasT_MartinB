import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Catalogo from '../views/Catalogo';
import { CarritoContext } from '../context/CarritoContext';

describe('Pruebas del Componente Catalogo', () => {
  it('debe renderizar la lista de aranceles y servicios', () => {
    render(
      <CarritoContext.Provider value={{ carrito: [], agregarAlCarrito: () => {} }}>
        <BrowserRouter>
          <Catalogo />
        </BrowserRouter>
      </CarritoContext.Provider>
    );
    // Verifica que el título principal de la vista exista
    expect(screen.getByText(/Nuestros Servicios y Planes/i)).toBeTruthy();
  });

  it('debe invocar la función de agregar al carrito al hacer clic en un servicio', () => {
    // Cambio clave: Usamos vi.fn() de Vitest en lugar del antiguo jasmine.createSpy
    const mockAgregar = vi.fn(); 
    
    render(
      <CarritoContext.Provider value={{ carrito: [], agregarAlCarrito: mockAgregar }}>
        <BrowserRouter>
          <Catalogo />
        </BrowserRouter>
      </CarritoContext.Provider>
    );

    // Busca el primer botón de agregar y simula un clic
    const botonesAgregar = screen.getAllByText(/CONTRATA/i);
    if (botonesAgregar.length > 0) {
      fireEvent.click(botonesAgregar[0]);
      expect(mockAgregar).toHaveBeenCalled();
    }
  });
});