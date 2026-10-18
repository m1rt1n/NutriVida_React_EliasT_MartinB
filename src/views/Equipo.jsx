import { nutricionistas } from "../data/db";

function Equipo() {
  return (
    <div className="container my-5">
      <figure className="mb-4">
        <img
          src="/Nutricionistas.jpg"
          alt="Equipo de especialistas de NutriVida"
          className="img-fluid rounded-3 shadow-sm banner-equipo w-100"
        />
      </figure>

      <header className="border-bottom pb-2 mb-4">
        <h3 className="fw-bold text-success m-0">Sobre NutriVida</h3>
        <p className="text-muted m-0">
          Fundada en 2016 en Temuco, Región de La Araucanía. Atención personalizada y preventiva.
        </p>
      </header>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {nutricionistas.map((n) => (
          <div className="col" key={n.codigo}>
            <div className="p-3 border rounded-2 h-100 bg-light card-servicio">
              <h5 className="fw-bold text-success m-0">{n.nombre}</h5>
              <span className="badge bg-secondary my-2">Código: {n.codigo}</span>
              <p className="mb-1"><strong>Especialidad:</strong> {n.especialidad}.</p>
              <p className="small text-muted mb-0"><strong>Atención:</strong> {n.dias} ({n.horario}).</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Equipo;
