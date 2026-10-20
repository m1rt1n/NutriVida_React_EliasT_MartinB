// ==========================================================================
// AuthContext.jsx
// ==========================================================================
import { createContext, useContext, useState } from "react";

const CLAVE_USUARIOS = "nutrivida_usuarios";
const CLAVE_SESION = "nutrivida_sesion";
const AuthContext = createContext(null);

const adminElias = {
  rut: "20333444-5", nombre: "Elías", apellidos: "Terán", correo: "eliasteran.bustos@gmail.com", 
  rol: "administrador", clave: "Admin123" 
};

const pacientesIniciales = [
  {
    rut: "19011022-K", nombre: "Juan", apellidos: "Pérez González", correo: "juan.perez@gmail.com", 
    rol: "cliente", clave: "Cliente123", region: "valparaiso", comuna: "vina", direccion: "Álvarez 123",
    telefono: "+56912345678", planActual: "Plan Nutrición Deportiva", fechaCita: "2026-10-25", horaCita: "10:30"
  },
  {
    rut: "18555444-3", nombre: "María", apellidos: "López Silva", correo: "maria.lopez@hotmail.com", 
    rol: "cliente", clave: "Cliente123", region: "metropolitana", comuna: "providencia", direccion: "Av. Providencia 456",
    telefono: "+56987654321", planActual: "Asesoría Control de Peso", fechaCita: "2026-10-26", horaCita: "16:00"
  },
  {
    rut: "11111111-1", nombre: "Admin", apellidos: "Principal", correo: "admin@nutrivida.cl", 
    rol: "administrador", clave: "Admin123"
  },
  {
    rut: "22222222-2", nombre: "Administrador", apellidos: "Secundario", correo: "admin@gmail.com", 
    rol: "administrador", clave: "Admin123" // <-- Se agregó la cuenta que solicitaste
  },
  adminElias
];

function leerUsuarios() {
  try {
    let guardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
    
    if (!guardados || guardados.length === 0) {
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(pacientesIniciales));
      return pacientesIniciales;
    }

    const indexElias = guardados.findIndex(u => u.correo.toLowerCase() === adminElias.correo.toLowerCase());
    if (indexElias === -1) {
      guardados.push(adminElias);
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(guardados));
    } else if (guardados[indexElias].clave !== adminElias.clave) {
      guardados[indexElias].clave = adminElias.clave;
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(guardados));
    }

    // Asegurar que admin@gmail.com también persista si limpian caché a medias
    const indexAdminGmail = guardados.findIndex(u => u.correo.toLowerCase() === "admin@gmail.com");
    if (indexAdminGmail === -1) {
      guardados.push(pacientesIniciales[3]);
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(guardados));
    }

    return guardados;
  } catch {
    return pacientesIniciales;
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

  function actualizarPaciente(rutPaciente, nuevosDatos) {
    let usuarios = leerUsuarios();
    usuarios = usuarios.map((u) => (u.rut === rutPaciente ? { ...u, ...nuevosDatos } : u));
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  }

  function iniciarSesion(correo, clave, rolSolicitado) {
    const usuarios = leerUsuarios();
    const encontrado = usuarios.find((u) => u.correo.toLowerCase() === correo.toLowerCase());

    if (!encontrado) {
      return { exito: false, mensaje: "El correo ingresado no está registrado en el sistema." };
    }
    
    if (encontrado.clave !== clave) {
      return { exito: false, mensaje: "La contraseña es incorrecta." };
    }

    if (rolSolicitado !== "cliente" && encontrado.rol !== rolSolicitado) {
      return { exito: false, mensaje: `No tienes permisos de ${rolSolicitado}.` };
    }

    setUsuario(encontrado);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(encontrado));
    // IMPORTANTE: Ahora retorna el rol para que LoginRegistro sepa dónde redirigir
    return { exito: true, rol: encontrado.rol };
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem(CLAVE_SESION);
  }

  const valor = { 
    usuario, 
    registrar, 
    iniciarSesion, 
    cerrarSesion, 
    listaUsuarios: leerUsuarios,
    actualizarPaciente 
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return contexto;
}