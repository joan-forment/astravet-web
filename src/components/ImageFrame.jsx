import StarIcon from "./StarIcon.jsx";

/**
 * Placeholder visual limpio para las fotografías oficiales de la marca
 * (estilo "slice of life": clínicas luminosas, vínculo humano-animal).
 * Acepta `src` para sustituir el placeholder por la foto real sin tocar layout.
 */
export default function ImageFrame({
  label = "Fotografía oficial",
  caption,
  src,
  alt = "",
  ratio = "aspect-[4/5]",
  className = "",
  tone = "turquoise",
  ...rest
}) {
  const toneBg = {
    turquoise: "from-turquoise/25 via-navy-soft/60 to-navy-deep",
    amber: "from-amber/20 via-navy-soft/60 to-navy-deep",
    coral: "from-coral/20 via-navy-soft/60 to-navy-deep",
  }[tone];

  return (
    <figure
      data-cursor-label="Ver foto"
      className={`theme-static group relative overflow-hidden rounded-card border border-white/10 ${ratio} ${className}`}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${toneBg}`} />
          <div className="absolute inset-0 text-white/[0.06] bg-diagonal-grid" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <StarIcon
              withCross={false}
              className="h-8 w-8 text-white/30 transition-transform duration-700 ease-out group-hover:rotate-45 group-hover:scale-110"
            />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">
              {label}
            </p>
          </div>
        </>
      )}
      {caption && (
        <figcaption className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-navy/70 px-4 py-2 backdrop-blur-md">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-turquoise" />
          <span className="truncate text-[11px] font-medium tracking-wide text-white/80">
            {caption}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
