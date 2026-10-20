import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../views/AdminDashboard';
import { AuthContext } from '../context/AuthContext';

describe('Pruebas del Componente AdminDashboard', () => {
  const renderAdmin = (usuarioMock) => {
    return render(
      <AuthContext.Provider value={{ usuario: usuarioMock, listaUsuarios: () => [] }}>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('debe denegar el acceso si el usuario no es administrador', () => {
    const clienteMock = { nombre: 'Juan', rol: 'cliente' };
    renderAdmin(clienteMock);
    // Asume que tu dashboard muestra un mensaje de acceso denegado si no es admin
    expect(screen.getByText(/Acceso Restringido/i)).toBeTruthy();
  });

  it('debe renderizar el panel de control si el usuario es administrador', () => {
    const adminMock = { nombre: 'Elías', rol: 'administrador' };
    renderAdmin(adminMock);
    // Verifica elementos clave del dashboard de administrador
    expect(screen.getByText(/Resumen de las actividades de la clínica/i)).toBeTruthy();
  });
});