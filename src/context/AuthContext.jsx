// ==========================================================================
// AuthContext.jsx
// --------------------------------------------------------------------------
// Simula sesión de usuario + un "registro de usuarios" guardado en
// localStorage (hace las veces de la tabla de usuarios que en un proyecto
// real estaría en el backend). Guarda quién inició sesión para que el
// Navbar pueda mostrar "Admin" / "Salir" en vez de "Ingresar", y para que
// el Checkout pueda autocompletar los datos del cliente.
// ==========================================================================

import { createContext, useContext, useState } from "react";

const CLAVE_USUARIOS = "nutrivida_usuarios";
const CLAVE_SESION = "nutrivida_sesion";
const AuthContext = createContext(null);

function leerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_SESION));
    } catch {
      return null;
    }
  });

  function registrar(datosUsuario) {
    const usuarios = leerUsuarios();
    usuarios.push(datosUsuario);
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  }

  // Login "simulado": solo exige que el correo tenga dominio válido y la
  // clave entre 4 y 10 caracteres (misma regla que en app.js). Si el correo
  // coincide con un usuario registrado, se usa su rol real; si no, entra
  // como "cliente" invitado.
  function iniciarSesion(correo) {
    const usuarios = leerUsuarios();
    const encontrado = usuarios.find((u) => u.correo.toLowerCase() === correo.toLowerCase());
    const sesion = encontrado || { correo, nombre: correo.split("@")[0], rol: "cliente" };
    setUsuario(sesion);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return sesion;
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem(CLAVE_SESION);
  }

  const valor = { usuario, registrar, iniciarSesion, cerrarSesion, listaUsuarios: leerUsuarios };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return contexto;
}
