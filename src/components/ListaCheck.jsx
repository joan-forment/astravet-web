import Icon from "./icons.jsx";

/*
 * Lista de puntos confirmados (el check dentro de un círculo turquesa).
 *
 * Estaba escrita a mano, idéntica, en "Por qué AstraVet" y en "Reserva una
 * reunión", con el riesgo de que una de las dos se quedara atrás al retocar
 * la otra. Ahora las dos pintan este componente.
 *
 * El check va a grosor 2.2 y no a 1.5: se pinta a 10 px y con el trazo del
 * sistema se quedaría en medio píxel.
 */
export default function ListaCheck({ items, className = "" }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-3 text-sm font-medium text-white/75"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-turquoise/40 bg-turquoise/10 text-turquoise">
            <Icon name="check" className="h-2.5 w-2.5" weight={2.2} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
