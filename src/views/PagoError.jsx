import { useLocation, useNavigate, Link } from "react-router-dom";

function PagoError() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="container my-5 text-center">
        <p className="text-muted">No hay información de un intento de pago reciente.</p>
        <Link to="/" className="btn btn-success">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="container my-5 text-center" style={{ maxWidth: 600 }}>
      <div className="alert alert-danger d-flex flex-column align-items-center gap-2">
        <i className="bi bi-x-circle-fill fs-1"></i>
        <strong>No se pudo realizar el pago. Código: {state.codigoOrden}</strong>
      </div>
      <p className="text-muted">
        Esto fue una simulación: en un proyecto real, acá se reintentaría contra la pasarela de pago.
      </p>
      <button className="btn btn-success" onClick={() => navigate("/checkout")}>
        Volver a intentar el pago
      </button>
    </div>
  );
}

export default PagoError;
