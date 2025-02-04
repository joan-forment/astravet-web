import { useState } from "react";

import Icon from "./icons.jsx";

/*
 * Mock-up de calendario interactivo para agendar "Tutorías personalizadas".
 * No es funcional: ilustra el flujo (elegir día → elegir hora → agendar).
 * Algunos días tienen disponibilidad (punto turquesa); el resto, atenuados.
 */

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

// Septiembre 2026 empieza en martes → un hueco inicial
const LEADING_BLANKS = 1;
const DAYS_IN_MONTH = 30;
const AVAILABLE_DAYS = new Set([3, 4, 9, 11, 16, 18, 23, 25, 30]);

const SLOTS = ["10:00", "12:30", "16:00", "17:30", "19:00"];

export default function TutoringCalendar() {
  const [day, setDay] = useState(11);
  const [slot, setSlot] = useState("17:30");
  const [booked, setBooked] = useState(false);

  return (
    <div className="theme-static relative overflow-hidden rounded-panel border border-white/10 bg-gradient-to-br from-navy-soft/80 to-navy-deep/90 p-6 backdrop-blur-sm sm:p-7">
      <div className="glow-turquoise pointer-events-none absolute -right-[25%] -top-[20%] h-[30vmax] w-[30vmax]" />

      {/* Cabecera del mes */}
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-turquoise">
            Agenda tu tutoría
          </p>
          <p className="mt-1 text-lg font-black tracking-tight text-white">
            Septiembre 2026
          </p>
        </div>
        <div className="flex gap-2" aria-hidden="true">
          {["M-1", "M+1"].map((k, i) => (
            <span
              key={k}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/50"
            >
              <Icon
                name={i === 0 ? "chevron-izquierda" : "chevron-derecha"}
                className="h-3.5 w-3.5"
                weight={1.9}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Rejilla de días */}
      <div className="relative mt-6 grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((w) => (
          <span
            key={w}
            className="pb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/35"
          >
            {w}
          </span>
        ))}

        {Array.from({ length: LEADING_BLANKS }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((d) => {
          const available = AVAILABLE_DAYS.has(d);
          const selected = d === day;
          return (
            <button
              key={d}
              type="button"
              disabled={!available}
              onClick={() => {
                setDay(d);
                setBooked(false);
              }}
              data-cursor-label={available ? "Elegir día" : undefined}
              className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                selected
                  ? "bg-turquoise text-navy"
                  : available
                    ? "bg-white/[0.04] text-white/85 hover:bg-white/10"
                    : "text-white/20"
              }`}
            >
              {d}
              {available && !selected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-turquoise" />
              )}
            </button>
          );
        })}
      </div>

      {/* Franjas horarias */}
      <div className="relative mt-6">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
          Horas disponibles · {day} sep
        </p>
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((s) => {
            const active = s === slot;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSlot(s);
                  setBooked(false);
                }}
                data-cursor-label="Elegir hora"
                className={`rounded-full border px-4 py-2 text-xs font-bold tracking-wide transition-colors ${
                  active
                    ? "border-turquoise bg-turquoise/15 text-white"
                    : "border-white/12 bg-white/[0.03] text-white/65 hover:border-white/30"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Acción */}
      <button
        type="button"
        onClick={() => setBooked(true)}
        data-cursor-label="Agendar"
        className="relative mt-6 w-full rounded-full bg-turquoise px-6 py-3.5 text-sm font-bold tracking-wide text-navy transition-colors hover:bg-turquoise-bright"
      >
        {booked ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Icon name="check" className="h-3.5 w-3.5" weight={2.2} />
            Tutoría agendada
          </span>
        ) : (
          `Agendar tutoría · ${day} sep, ${slot}`
        )}
      </button>

      <p
        aria-live="polite"
        className={`relative mt-3 text-center text-xs font-medium transition-opacity ${
          booked ? "text-turquoise opacity-100" : "text-white/40 opacity-100"
        }`}
      >
        {booked
          ? "Te confirmaremos por email. Esto es un ejemplo del flujo real."
          : "Reserva en segundos con tu tutor asignado."}
      </p>
    </div>
  );
}
