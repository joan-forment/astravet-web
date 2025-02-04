/**
 * Marca Astra: la estrella polar fusionada con la cruz veterinaria.
 * "Conocimiento que sana".
 *
 * ⚠️ POR DEBAJO DE ~36 px HAY QUE PASAR withCross={false}.
 *    La cruz mide 1,1 u de grosor sobre un lienzo de 24: pintada a 12 o 14 px
 *    se come los brazos de la estrella y el dibujo deja de leerse como una
 *    estrella para leerse como un signo "+", que además es justo el icono de
 *    "añadir". A esos tamaños (ojos de sección, viñetas de lista) se usa la
 *    silueta limpia; la cruz se reserva para los usos grandes, donde sí se
 *    distingue y aporta el significado veterinario.
 */
export default function StarIcon({ className = "", withCross = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 1L14.4 9.6L23 12L14.4 14.4L12 23L9.6 14.4L1 12L9.6 9.6L12 1Z"
        fill="currentColor"
      />
      {withCross && (
        <g stroke="var(--color-navy, #0D1B3D)" strokeWidth="1.1">
          <line x1="12" y1="8.2" x2="12" y2="15.8" />
          <line x1="8.2" y1="12" x2="15.8" y2="12" />
        </g>
      )}
    </svg>
  );
}
