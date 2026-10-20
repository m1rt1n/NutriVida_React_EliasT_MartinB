import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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
    expect(screen.getByText(/Aranceles|Catálogo de Planes/i)).toBeTruthy();
  });

  it('debe invocar la función de agregar al carrito al hacer clic en un servicio', () => {
    const mockAgregar = jasmine.createSpy('agregarAlCarrito'); // Cambia a jest.fn() si usas Jest en lugar de Jasmine
    
    render(
      <CarritoContext.Provider value={{ carrito: [], agregarAlCarrito: mockAgregar }}>
        <BrowserRouter>
          <Catalogo />
        </BrowserRouter>
      </CarritoContext.Provider>
    );

    // Busca el primer botón de agregar y simula un clic
    const botonesAgregar = screen.getAllByText(/Agregar|Reservar/i);
    if (botonesAgregar.length > 0) {
      fireEvent.click(botonesAgregar[0]);
      expect(mockAgregar).toHaveBeenCalled();
    }
  });
});