/*
 * ══════════════════════════════════════════════════════════════════════════
 *  SEO · AstraVet
 * ══════════════════════════════════════════════════════════════════════════
 *  Textos que leen Google y los asistentes de IA (ChatGPT, Gemini, Perplexity…):
 *  el título y la descripción de cada página, las preguntas frecuentes y las
 *  guías. Con ellos, scripts/seo.mjs genera al publicar (npm run build):
 *
 *    · las páginas /temario-auxiliar-tecnico-veterinario/, /preguntas-frecuentes/,
 *      /que-es-un-auxiliar-tecnico-veterinario/ y /campus-virtual/
 *    · el contenido en HTML de la portada (para buscadores sin JavaScript)
 *    · sitemap.xml y llms.txt
 *
 *  Reglas para editar:
 *    · Solo datos ciertos. Nada de cifras, precios o títulos que no podamos
 *      demostrar: Google y las IA penalizan las contradicciones.
 *    · El temario (módulos, horas, temas) NO se escribe aquí: sale de
 *      temario.js. El contacto sale de site.js.
 *    · Tras cualquier cambio: npm run publicar.
 * ══════════════════════════════════════════════════════════════════════════
 */

export const SITE_URL = "https://www.astravet.es";
export const CAMPUS_DEMO_URL = "https://www.astravet.es/demo/";

/* Datos de la academia (los usan los datos estructurados de Google). */
export const ACADEMIA = {
  nombre: "AstraVet",
  nombreLegal: "Astra Vet",
  lema: "Formación para tu vocación.",
  ciudad: "Barcelona",
  codigoPostal: "08017",
  region: "Cataluña",
  pais: "ES",
  descripcion:
    "Academia de formación veterinaria online creada por veterinarios. Imparte el curso de Auxiliar Técnico Veterinario (ATV) para alumnos de toda España, con campus virtual, seminarios en directo, tutorías individuales, talleres presenciales opcionales y prácticas en centros clínicos.",
};

/* ───────────────────────────── PORTADA ───────────────────────────── */
export const PORTADA = {
  titulo: "Curso de Auxiliar Técnico Veterinario Online (ATV) | AstraVet",
  descripcion:
    "Curso de Auxiliar Técnico Veterinario (ATV) online en España, creado por veterinarios. Campus virtual, tutorías y prácticas en clínica. Pide información.",
};

/* ──────────────────────── PREGUNTAS FRECUENTES ──────────────────────
 * Cada respuesta es texto plano (se muestra tal cual y va a los datos
 * estructurados). Responde en la primera frase: así es como las citan
 * Google y las IA.
 */
export const FAQ = [
  {
    p: "¿Qué es el curso de Auxiliar Técnico Veterinario de AstraVet?",
    r: "Es un curso online para trabajar como Auxiliar Técnico Veterinario (ATV) en clínicas y hospitales veterinarios. Lo han creado veterinarios con experiencia clínica y combina un campus virtual, seminarios en directo, tutorías individuales, talleres presenciales opcionales y prácticas en un centro clínico.",
  },
  {
    p: "¿Cuánto dura el curso de Auxiliar Técnico Veterinario?",
    r: "El curso dura aproximadamente 12 meses. Recomendamos dedicar entre 8 y 10 horas a la semana al estudio para seguir el ritmo y aprovechar todos los recursos.",
  },
  {
    p: "¿El curso de ATV es 100% online?",
    r: "La parte teórica es 100% online: el temario, las clases grabadas, los seminarios en directo y las tutorías se hacen a través del campus virtual. Los talleres prácticos son presenciales y opcionales, y las prácticas se realizan en un centro veterinario.",
  },
  {
    p: "¿Puedo hacer el curso desde cualquier parte de España?",
    r: "Sí. Toda la formación teórica es online, así que puedes estudiar desde cualquier lugar de España y a tu ritmo. Consúltanos las opciones de talleres y prácticas disponibles en tu zona.",
  },
  {
    p: "¿Qué temario tiene el curso de Auxiliar Técnico Veterinario?",
    r: "El temario tiene 660 horas, incluida la parte práctica, organizadas en 6 módulos y 33 temas: atención al cliente y gestión en centros veterinarios; análisis de muestras biológicas animales; fundamentos clínicos y cuidados auxiliares; asistencia quirúrgica, anestésica y de urgencias; atención en la hospitalización de animales; y asistencia en los procedimientos de imagen para el diagnóstico. Está adaptado al Real Decreto 705/2017 y al Real Decreto 489/2026.",
  },
  {
    p: "¿Cómo se estudia el temario?",
    r: "Cada tema está disponible en varios formatos: presentaciones, clases grabadas con ponente, una versión en PDF descargable y, de forma opcional, el temario impreso en forma de libro. Al final de cada módulo hay un examen para afianzar lo aprendido.",
  },
  {
    p: "¿El curso incluye prácticas en clínicas veterinarias?",
    r: "Sí. Las prácticas en un centro clínico forman parte del curso y te facilitamos el acceso a la estancia para que pongas en práctica lo aprendido.",
  },
  {
    p: "¿Qué son los talleres presenciales?",
    r: "Son talleres prácticos opcionales que se hacen en un fin de semana, en un aula formativa y en grupos muy reducidos. Sirven para ganar confianza antes de empezar las prácticas, trabajando lo más importante del día a día en el centro veterinario.",
  },
  {
    p: "¿Tendré profesores a los que preguntar?",
    r: "Sí. Tienes tutorías individuales por videoconferencia con veterinarios para resolver dudas, repasar casos clínicos y hacer seguimiento de tu progreso, además de seminarios en directo sobre casos clínicos y novedades del sector.",
  },
  {
    p: "¿Puedo compaginar el curso con mi trabajo?",
    r: "Sí. El campus virtual está disponible en todo momento y las clases quedan grabadas, así que puedes organizar el estudio según tus horarios de trabajo o vida personal.",
  },
  {
    p: "¿Qué título obtengo al terminar?",
    r: "Al superar el curso recibes tu diploma personal de AstraVet que acredita la superación del curso de Auxiliar Técnico Veterinario.",
  },
  {
    p: "¿Dónde puede trabajar un Auxiliar Técnico Veterinario?",
    r: "Un ATV puede trabajar en clínicas, hospitales y consultorios veterinarios, centros de investigación y de recuperación de animales, y tiendas del sector.",
  },
  {
    p: "¿Me ayudáis a encontrar trabajo después del curso?",
    r: "Sí. Al terminar te ayudamos a encontrar trabajo mediante nuestra bolsa de trabajo y conectándote con centros veterinarios.",
  },
  {
    p: "¿Puedo ver el campus virtual antes de apuntarme?",
    r: "Sí. Puedes probar gratis una demo del campus virtual, sin registrarte, en astravet.es/demo.",
  },
  {
    p: "¿Cómo pido información o reservo mi plaza?",
    r: "Puedes pedir información o reservar tu plaza desde los formularios de astravet.es, escribirnos por WhatsApp o enviarnos un correo a admin@astravet.es. También puedes reservar una reunión informativa.",
  },
];

/* ─────────────────────────── PÁGINAS / GUÍAS ───────────────────────────
 * slug       → la dirección (https://www.astravet.es/<slug>/). No cambiar una
 *              vez publicada: se perdería el posicionamiento ganado.
 * titulo     → la línea azul en Google (≈ 60 caracteres máximo).
 * descripcion→ el texto gris en Google (≈ 155 caracteres máximo).
 * h1, intro  → lo primero que se lee en la página.
 */
export const PAGINAS = {
  temario: {
    slug: "temario-auxiliar-tecnico-veterinario",
    titulo: "Temario del Curso de Auxiliar Técnico Veterinario | AstraVet",
    descripcion:
      "Temario del curso de Auxiliar Técnico Veterinario (ATV) online: 660 horas en 6 módulos y 33 temas, adaptado al RD 705/2017 y al RD 489/2026.",
    h1: "Temario del curso de Auxiliar Técnico Veterinario",
    intro:
      "Este es el temario completo del curso de Auxiliar Técnico Veterinario (ATV) online de AstraVet: 660 horas en 6 módulos formativos y 33 temas, organizados de forma progresiva, que cubren todo lo que hace un ATV en una clínica veterinaria, desde la recepción hasta el quirófano.",
    nav: "Temario",
  },
  queEs: {
    slug: "que-es-un-auxiliar-tecnico-veterinario",
    titulo: "Qué es un Auxiliar Técnico Veterinario (ATV) y qué hace",
    descripcion:
      "Qué es un Auxiliar Técnico Veterinario, qué funciones tiene, dónde trabaja y cómo formarte como ATV en España. Guía de AstraVet, escrita por veterinarios.",
    h1: "¿Qué es un Auxiliar Técnico Veterinario (ATV)?",
    intro:
      "Un Auxiliar Técnico Veterinario (ATV) es el profesional que asiste al veterinario en el día a día de un centro veterinario: atiende a los clientes, ayuda en la consulta y el quirófano, prepara y procesa muestras, y cuida de los animales hospitalizados. Es una figura clave en cualquier clínica u hospital veterinario.",
    nav: "Qué es un ATV",
    secciones: [
      {
        h2: "¿Qué funciones tiene un Auxiliar Técnico Veterinario?",
        lista: [
          "Atender a los clientes y a sus animales: recepción, agenda de citas, información al propietario y gestión administrativa de la clínica.",
          "Ayudar al veterinario en la consulta: preparación de la sala y del material, sujeción y manejo del animal durante la exploración.",
          "Recoger, preparar, conservar y procesar muestras biológicas (sangre, orina, heces y otros fluidos) para el laboratorio.",
          "Preparar el quirófano y el instrumental, y aplicar los protocolos de asepsia, desinfección y esterilización.",
          "Colaborar en la anestesia y en la monitorización del paciente, y actuar con rapidez ante una urgencia.",
          "Cuidar a los animales hospitalizados: alimentación, higiene, bienestar y control de su estado según la especie.",
          "Apoyar en los procedimientos de diagnóstico por imagen, como radiología, ecografía y endoscopia.",
          "Colaborar en la medicina preventiva: vacunación, desparasitación y consejos de cuidado a los propietarios.",
        ],
      },
      {
        h2: "¿Qué no hace un ATV?",
        parrafos: [
          "El diagnóstico, la prescripción de tratamientos y las intervenciones quirúrgicas son responsabilidad del veterinario. El ATV trabaja siempre bajo su supervisión y es su mano derecha en la clínica.",
        ],
      },
      {
        h2: "¿Dónde trabaja un Auxiliar Técnico Veterinario?",
        lista: [
          "Clínicas veterinarias",
          "Hospitales veterinarios",
          "Consultorios veterinarios",
          "Centros de investigación y de recuperación de animales",
          "Tiendas del sector veterinario y de animales de compañía",
        ],
      },
      {
        h2: "¿Qué cualidades necesita un buen ATV?",
        lista: [
          "Vocación y respeto por el bienestar animal.",
          "Trato cercano y paciente con los propietarios, que a menudo llegan preocupados.",
          "Rigor con los protocolos de higiene, seguridad y manejo de muestras.",
          "Capacidad para trabajar en equipo y mantener la calma en una urgencia.",
        ],
      },
      {
        h2: "¿Cómo formarte como Auxiliar Técnico Veterinario?",
        parrafos: [
          "La forma más habitual es un curso especializado que combine la teoría con práctica real. En AstraVet el curso de ATV es online, dura aproximadamente 12 meses y está creado por veterinarios: estudias en el campus virtual a tu ritmo, resuelves dudas en tutorías individuales, puedes hacer talleres presenciales opcionales y terminas con prácticas en un centro clínico.",
        ],
      },
    ],
  },
  faq: {
    slug: "preguntas-frecuentes",
    titulo: "Preguntas frecuentes del Curso de ATV Online | AstraVet",
    descripcion:
      "Resolvemos tus dudas sobre el curso de Auxiliar Técnico Veterinario online: duración, temario, prácticas, talleres, diploma, salidas y cómo apuntarte.",
    h1: "Preguntas frecuentes sobre el curso de Auxiliar Técnico Veterinario",
    intro:
      "Todo lo que suelen preguntarnos antes de empezar el curso de Auxiliar Técnico Veterinario (ATV) online. Si tu duda no está aquí, escríbenos y te respondemos.",
    nav: "Preguntas frecuentes",
  },
  campus: {
    slug: "campus-virtual",
    titulo: "Campus Virtual del Curso de Auxiliar Veterinario | AstraVet",
    descripcion:
      "El campus virtual del curso de Auxiliar Técnico Veterinario de AstraVet: temario por bloques, clases grabadas, exámenes y tutorías. Prueba la demo gratis.",
    h1: "El campus virtual del curso de Auxiliar Técnico Veterinario",
    intro:
      "Todo el curso de Auxiliar Técnico Veterinario de AstraVet se sigue desde un campus virtual propio, disponible en el ordenador y en el móvil. Puedes probarlo gratis antes de apuntarte, sin registrarte.",
    nav: "Campus virtual",
    secciones: [
      {
        h2: "¿Qué encontrarás en el campus virtual?",
        lista: [
          "El temario organizado por bloques y temas, que se van abriendo de forma progresiva para que avances sin agobios.",
          "Teoría, presentaciones, clases grabadas y actividades dentro de cada tema.",
          "Exámenes tipo test online, con la nota al momento.",
          "Un calendario con tus exámenes, seminarios, talleres y tutorías.",
          "Reserva de tutorías individuales con veterinarios y mensajes con tus profesores.",
          "La gestión de tus talleres y de tus prácticas en un centro clínico.",
          "Soporte por WhatsApp y correo si necesitas ayuda.",
          "Tu diploma al terminar el curso.",
        ],
      },
      {
        h2: "Prueba la demo del campus gratis",
        parrafos: [
          "Hemos preparado una demo pública del campus para que veas cómo es estudiar con AstraVet antes de decidirte. Entra sin registrarte y recórrelo como si fueras alumno.",
        ],
        cta: { texto: "Probar la demo del campus", href: CAMPUS_DEMO_URL },
      },
    ],
  },
};
