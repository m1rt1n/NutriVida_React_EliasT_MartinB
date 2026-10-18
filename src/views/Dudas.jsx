const PREGUNTAS = [
  { q: "¿Necesito una orden médica para agendar mi primera consulta?", a: "No es obligatorio, pero si tienes exámenes de laboratorio recientes, puedes traerlos para que el nutricionista los revise en la primera sesión." },
  { q: "¿Las teleconsultas tienen el mismo valor que las presenciales?", a: "No, la teleconsulta de seguimiento tiene un valor preferencial, pero requiere haber tenido al menos una consulta presencial previa." },
  { q: "¿Puedo cambiar o cancelar una hora agendada?", a: "Sí, puedes hacerlo contactándonos con al menos 24 horas de anticipación a través del formulario de contacto." },
  { q: "¿Atienden a niños y adolescentes?", a: "Sí, contamos con un plan de alimentación infantil (2 a 12 años) a cargo de nuestro especialista en nutrición pediátrica." },
];

function Dudas() {
  return (
    <div className="container my-5" style={{ maxWidth: 800 }}>
      <header className="border-bottom pb-2 mb-4">
        <h3 className="fw-bold text-success m-0">Preguntas Frecuentes</h3>
      </header>

      <div className="accordion" id="acordeonDudas">
        {PREGUNTAS.map((item, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#pregunta${index}`}
              >
                {item.q}
              </button>
            </h2>
            <div id={`pregunta${index}`} className="accordion-collapse collapse" data-bs-parent="#acordeonDudas">
              <div className="accordion-body text-muted">{item.a}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dudas;
