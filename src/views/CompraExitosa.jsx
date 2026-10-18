import { useLocation, Link } from "react-router-dom";
import { formatoCLP } from "../utils/validaciones";

function CompraExitosa() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="container my-5 text-center">
        <p className="text-muted">No hay información de una compra reciente.</p>
        <Link to="/" className="btn btn-success">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: 700 }}>
      <div className="alert alert-success d-flex align-items-center gap-2">
        <i className="bi bi-check-circle-fill fs-4"></i>
        <div>
          <strong>Se ha realizado la reserva. Código: {state.codigoOrden}</strong>
        </div>
      </div>

      <p className="mb-1"><strong>{state.nombre} {state.apellidos}</strong> — {state.correo}</p>
      <p className="text-muted">Dirección: {state.direccion}, {state.comuna}</p>

      <table className="table table-sm my-4">
        <tbody>
          {state.items.map((item, i) => (
            <tr key={i}><td>{item.nombre}</td><td>{formatoCLP(item.precio)}</td></tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="fw-bold"><td>Total pagado</td><td>{formatoCLP(state.total)}</td></tr>
        </tfoot>
      </table>

      <Link to="/" className="btn btn-success">Volver al inicio</Link>
    </div>
  );
}

export default CompraExitosa;
