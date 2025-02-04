/*
 * ══════════════════════════════════════════════════════════════════════════
 *  CONTENIDOS DEL TEMARIO · AstraVet
 * ══════════════════════════════════════════════════════════════════════════
 *  Fuente única de la sección "Estructura del temario": los textos de
 *  introducción, los pasos de cómo se desarrolla el curso, los seis bloques
 *  formativos con sus horas y temas, y las formas de impartición.
 *
 *  Nada de esto está escrito dentro de los componentes: para cambiar un
 *  título, unas horas o añadir un tema, se edita AQUÍ y se vuelve a publicar
 *  (npm run build).
 *
 *  Los nombres de bloques y temas van en MAYÚSCULAS porque así los entregó el
 *  cliente. Se muestran tal cual, sin reescribirlos.
 * ══════════════════════════════════════════════════════════════════════════
 */

/* ─────────────────────── 1 · TEXTO INTRODUCTORIO ────────────────────────
 * Cada elemento es un párrafo. Los fragmentos marcados con "fuerte" se
 * muestran en negrita dentro del párrafo.
 */
export const introduccion = [
  {
    tipo: "parrafo",
    texto:
      "Todo el temario está adaptado al RD 705/2017 y, tras su publicación en el BOE en junio de 2026, se ha actualizado también a partir del RD 489/2026. Se impartirá a través de un Campus Virtual que dará acceso a todas las actividades formativas. Para seguir el ritmo del curso y aprovechar al máximo todos los recursos, recomendamos dedicar aproximadamente 8-10 horas semanales al estudio.",
  },
  {
    tipo: "parrafo",
    fuerte: "temario",
    texto:
      "El temario está estructurado en 6 módulos formativos, con un total de 660 horas (incluida la parte práctica), que abarcan las competencias recogidas en el RD 705/2017 y el RD 489/2026. Cada módulo reúne diferentes temas organizados de forma progresiva para facilitar el aprendizaje del alumno. ¿Cómo estudiarás el curso?",
  },
  {
    tipo: "lista",
    elementos: [
      "Documento impreso (opcional): temario en forma de libro, con explicaciones, imágenes, tablas y ejercicios",
      "Adaptación en PDF: versión sintetizada y descargable del temario, adaptada al contenido de las presentaciones y disponible a través del Campus Virtual.",
      "Presentaciones (Power Point): cada tema se organiza en presentaciones visuales que facilitan el estudio.",
      "Presentaciones con ponente de los Power Point: clases grabadas. Contenido didáctico y visual, explicación del temario.",
    ],
  },
  {
    tipo: "parrafo",
    fuerte: "seminarios",
    texto:
      "Los seminarios online serán clases impartidas en directo sobre temas de especial interés, de actualidad veterinaria, casos clínicos o novedades profesionales.",
  },
  {
    tipo: "parrafo",
    fuerte: "talleres",
    texto:
      "Los talleres presenciales prácticos son opcionales. Están diseñados para que el alumno gane confianza antes de comenzar sus prácticas en centros veterinarios. Se realizarán en un fin de semana y se llevarán a cabo en un aula formativa, de manera presencial, en un grupo muy reducido de alumnos. En los talleres se pondrán en práctica aquellos conceptos estudiados más relevantes para el día a día en el centro.",
  },
  {
    tipo: "parrafo",
    fuerte: "tutorías",
    texto:
      "Las tutorías online permiten al alumno resolver dudas, recibir orientación personalizada y hacer un seguimiento de su progreso durante el curso. Se realizarán mediante videoconferencia, con el objetivo de reforzar el aprendizaje y acompañar al alumno durante toda su formación.",
  },
];

/* ──────────────── 2 · ¿CÓMO SE DESARROLLA EL CURSO? ─────────────────────
 * Los pasos del recorrido del alumno, en orden. Se pintan como una línea de
 * progreso horizontal en escritorio y vertical en móvil.
 */
export const tituloDesarrollo = "¿Cómo se desarrolla el curso?";

export const pasosDesarrollo = [
  "Sigues el temario a través del Campus Virtual",
  "Asistes a seminarios",
  "Organizas tutorías con los profesores",
  "Realizas las actividades",
  "Realizas los exámenes",
  "Si lo has incluido, realizas el taller práctico",
  "Comienzas las prácticas externas",
  "Recibes tu Diploma personal acreditando la superación del curso de ATV AstraVet!",
];

/* ───────────────────── 3 · MÓDULOS FORMATIVOS ───────────────────────────
 * Los seis recuadros azules. Se pueden clicar y despliegan sus temas.
 * Temario actualizado el 16/10/2026 (adaptado al RD 705/2017 y al RD 489/2026).
 *
 *   numero → el orden que se ve en el recuadro («Módulo 1»…).
 *   titulo → nombre del módulo, tal como lo entregó el cliente.
 *   horas  → carga del módulo. ⚠️ NO se publica: incluye la parte práctica y
 *            el cliente prefiere mostrar solo el total (TOTAL_HORAS, 660 h).
 *   temas  → lo que se despliega al clicar. La numeración de los temas es
 *            correlativa en todo el curso (Tema 1 … Tema 33).
 *
 * ⚠️ El Módulo 7 (Prevención de riesgos laborales, 30 h, temas 34-37) existe
 *    en el documento del cliente pero NO se publica todavía: lo están
 *    estudiando. Para añadirlo, se copia aquí como un módulo más.
 */
export const bloques = [
  {
    id: "atencion-cliente",
    numero: 1,
    titulo: "Atención al cliente y gestión en centros veterinarios",
    horas: 60,
    temas: [
      { numero: 1, titulo: "Atención al cliente en centros veterinarios", subtemas: ["Organización y funcionamiento de un centro veterinario", "Técnicas de comunicación y atención al cliente", "Recepción de animales y propietarios", "Identificación y registro de animales", "Gestión de citas, consultas y urgencias", "Atención a reclamaciones y satisfacción del cliente"] },
      { numero: 2, titulo: "Gestión administrativa y comercial", subtemas: ["Organización del almacén veterinario", "Gestión de existencias y pedidos", "Conservación y almacenamiento de medicamentos y productos sanitarios", "Facturación y cobro de servicios veterinarios", "Gestión y cierre de caja", "Asesoramiento sobre productos y servicios veterinarios"] },
      { numero: 3, titulo: "Gestión de la información sanitaria", subtemas: ["Documentación clínica y administrativa", "Sistemas informáticos de gestión veterinaria", "Organización y archivo de historias clínicas", "Confidencialidad y protección de datos", "Enfermedades de declaración obligatoria en animales de compañía"] },
      { numero: 4, titulo: "Salud pública y programas preventivos", subtemas: ["Programas de medicina preventiva veterinaria", "Educación sanitaria de los propietarios", "Comunicación de medidas preventivas y de salud pública", "Apoyo emocional al propietario ante enfermedades graves y eutanasia", "Diseño y evaluación de programas de educación sanitaria y prevención"] },
    ],
  },
  {
    id: "muestras",
    numero: 2,
    titulo: "Análisis de muestras biológicas animales",
    horas: 120,
    temas: [
      { numero: 5, titulo: "Obtención y manejo de muestras biológicas", subtemas: ["Tipos de muestras biológicas animales", "Material e instrumental para la recogida de muestras", "Identificación, conservación y transporte de muestras", "Criterios de aceptación y rechazo de muestras"] },
      { numero: 6, titulo: "Equipamiento del laboratorio veterinario", subtemas: ["Organización del laboratorio clínico", "Equipos, instrumental y reactivos", "Preparación y procesamiento de muestras", "Mantenimiento de equipos y control de calidad"] },
      { numero: 7, titulo: "Hematología y bioquímica clínica", subtemas: ["Composición y funciones de la sangre", "Técnicas hematológicas", "Preparación y tinción de frotis sanguíneos", "Determinaciones bioquímicas habituales"] },
      { numero: 8, titulo: "Citología veterinaria y procesamiento histológico básico", subtemas: ["Tipos de muestras citológicas", "Técnicas de preparación de muestras", "Fijación y tinción citológica", "Preparación de muestras para su estudio microscópico", "Procesamiento de muestras para estudio histológico"] },
      { numero: 9, titulo: "Análisis de orina", subtemas: ["Obtención y conservación de muestras de orina", "Características físicas y químicas de la orina", "Procesamiento de muestras y análisis del sedimento urinario"] },
      { numero: 10, titulo: "Análisis coprológico", subtemas: ["Recogida y conservación de muestras fecales", "Procesamiento de muestras de heces", "Técnicas de análisis parasitológico"] },
      { numero: 11, titulo: "Procesamiento de otras muestras biológicas", subtemas: ["Muestras de semen y otros líquidos orgánicos", "Preparación de muestras para estudios microbiológicos", "Preparación y envío de muestras a laboratorios externos"] },
      { numero: 12, titulo: "Seguridad en el laboratorio veterinario", subtemas: ["Riesgos biológicos y químicos", "Medidas de protección individual y colectiva", "Clasificación y gestión de residuos biológicos", "Medidas de seguridad biosanitaria según el nivel de riesgo"] },
    ],
  },
  {
    id: "fundamentos-clinicos",
    numero: 3,
    titulo: "Fundamentos clínicos y cuidados auxiliares de veterinaria",
    horas: 210,
    temas: [
      { numero: 13, titulo: "Anatomía, fisiología y patologías frecuentes de los animales de compañía", subtemas: ["Organización anatómica del organismo animal", "Aparato locomotor", "Sistema cardiovascular", "Aparato respiratorio", "Aparato digestivo", "Aparato urinario", "Aparato reproductor", "Sistema nervioso y órganos de los sentidos", "Sistema endocrino", "Piel y anejos cutáneos", "Sistema inmunitario y principales enfermedades infecciosas", "Etología y alteraciones del comportamiento"] },
      { numero: 14, titulo: "Preparación de la consulta veterinaria", subtemas: ["Organización y equipamiento de la consulta", "Instrumental de exploración clínica", "Preparación del material para pruebas diagnósticas", "Limpieza, desinfección y esterilización", "Mantenimiento y reposición de materiales"] },
      { numero: 15, titulo: "Asistencia durante la exploración clínica", subtemas: ["Técnicas de manejo, sujeción y contención animal", "Valoración de las constantes vitales", "Preparación del animal para la exploración", "Colaboración en la obtención de muestras biológicas", "Preparación del animal para pruebas diagnósticas"] },
      { numero: 16, titulo: "Asistencia en la aplicación de tratamientos veterinarios", subtemas: ["Fundamentos de farmacología veterinaria", "Clasificación y conservación de medicamentos", "Vías de administración de medicamentos", "Preparación de tratamientos prescritos por el veterinario", "Cuidados auxiliares postoperatorios", "Asistencia durante la eutanasia: metodología, bienestar y normativa aplicable", "EPI y prevención de riesgos en la preparación y administración de tratamientos"] },
      { numero: 17, titulo: "Registro y seguimiento de la información clínica", subtemas: ["Historia clínica veterinaria", "Registro de datos de identificación y exploración", "Registro de pruebas diagnósticas y tratamientos", "Actualización y conservación de la documentación clínica", "Citación y seguimiento para revisiones"] },
    ],
  },
  {
    id: "quirofano-urgencias",
    numero: 4,
    titulo: "Asistencia quirúrgica, anestésica y de urgencias veterinarias",
    horas: 120,
    temas: [
      { numero: 18, titulo: "Heridas y cicatrización", subtemas: ["Tipos de heridas traumáticas y quirúrgicas", "Procesos de cicatrización", "Principios de limpieza y tratamiento de heridas"] },
      { numero: 19, titulo: "Organización y preparación del quirófano", subtemas: ["Distribución y equipamiento del área quirúrgica", "Preparación de equipos y superficies", "Condiciones higiénico-sanitarias del quirófano", "Checklist de apertura, entre intervenciones y cierre del quirófano"] },
      { numero: 20, titulo: "Gestión del material quirúrgico", subtemas: ["Inventario y almacenamiento", "Instrumental quirúrgico básico", "Material de sutura, curas y asepsia", "Preparación y mantenimiento del instrumental"] },
      { numero: 21, titulo: "Preparación preoperatoria del paciente", subtemas: ["Protocolos prequirúrgicos", "Preparación del animal para la intervención", "Rasurado y antisepsia de la zona quirúrgica", "Posicionamiento y sujeción del animal", "Documentación y consentimiento informado"] },
      { numero: 22, titulo: "Asistencia en anestesia veterinaria", subtemas: ["Conceptos básicos de sedación y anestesia", "Equipos y materiales de anestesia", "Preparación del paciente", "Intubación endotraqueal y mantenimiento de la vía aérea", "Monitorización anestésica", "Recuperación postanestésica"] },
      { numero: 23, titulo: "Asistencia durante las intervenciones quirúrgicas", subtemas: ["Preparación del personal y vestimenta quirúrgica", "Mantenimiento de las condiciones de asepsia", "Funciones del auxiliar durante la cirugía", "Principios de abordajes quirúrgicos frecuentes", "Manejo y conservación de muestras intraoperatorias", "Residuos biosanitarios y EPI durante la cirugía"] },
      { numero: 24, titulo: "Urgencias y emergencias veterinarias", subtemas: ["Diferencias entre urgencia y emergencia", "Reconocimiento de signos de compromiso vital", "Gestión del estrés", "Protocolos de actuación ante emergencias", "Colaboración en las maniobras de reanimación", "Preparación de medicación y procedimientos prescritos en emergencias"] },
      { numero: 25, titulo: "Limpieza y esterilización del área quirúrgica", subtemas: ["Limpieza y desinfección de instalaciones", "Esterilización del instrumental", "Conservación del material estéril", "Gestión de residuos biosanitarios", "Riesgos químicos y etiquetado de productos de limpieza, desinfección y esterilización"] },
    ],
  },
  {
    id: "hospitalizacion",
    numero: 5,
    titulo: "Atención en la hospitalización de animales",
    horas: 90,
    temas: [
      { numero: 26, titulo: "Organización del área de hospitalización", subtemas: ["Instalaciones y equipamiento", "Condiciones higiénico-sanitarias", "Preparación y mantenimiento de alojamientos", "Control de existencias e inventario del área de hospitalización"] },
      { numero: 27, titulo: "Alojamiento y bienestar del paciente hospitalizado", subtemas: ["Necesidades de alojamiento según la especie", "Manejo de animales hospitalizados", "Hospitalización de pacientes con enfermedades infectocontagiosas", "Medidas de aislamiento y bioseguridad", "Cuidados higiénicos y apoyo a la rehabilitación"] },
      { numero: 28, titulo: "Alimentación de animales hospitalizados", subtemas: ["Necesidades nutricionales de los pacientes", "Dietas según la patología", "Preparación de dietas prescritas por el veterinario", "Alteraciones de la alimentación", "Registro de la ingesta alimentaria", "Alimentación parenteral en el paciente hospitalizado"] },
      { numero: 29, titulo: "Vigilancia y cuidados del paciente hospitalizado", subtemas: ["Control y registro de constantes vitales", "Observación del estado clínico del paciente", "Colaboración en fluidoterapia y administración de tratamientos prescritos", "Registro de incidencias", "Comunicación de cambios en el estado del paciente al personal veterinario", "Registro de la administración de medicamentos y seguridad en hospitalización", "Paciente de UCI (Unidad de Cuidados Intensivos)"] },
    ],
  },
  {
    id: "imagen",
    numero: 6,
    titulo: "Asistencia en los procedimientos de imagen para el diagnóstico en centros veterinarios",
    horas: 60,
    temas: [
      { numero: 30, titulo: "Radiología veterinaria", subtemas: ["Principios físicos de los rayos X", "Equipos de radiodiagnóstico", "Preparación y posicionamiento del paciente", "Sistemas de sujeción e inmovilización", "Medidas de protección radiológica"] },
      { numero: 31, titulo: "Obtención y procesamiento de imágenes radiográficas", subtemas: ["Técnicas de obtención de imágenes", "Parámetros de calidad radiográfica", "Procesamiento y clasificación de radiografías", "Archivo y registro de imágenes", "Posicionamiento radiográfico por regiones y patologías", "Residuos biosanitarios y radiológicos del proceso"] },
      { numero: 32, titulo: "Ecografía veterinaria", subtemas: ["Principios básicos de la ecografía", "Preparación del equipo y del material", "Preparación y posicionamiento del paciente", "Asistencia durante las exploraciones ecográficas"] },
      { numero: 33, titulo: "Endoscopia veterinaria", subtemas: ["Fundamentos de la endoscopia", "Tipos de procedimientos endoscópicos", "Preparación de equipos y materiales", "Preparación del paciente", "Asistencia durante la exploración endoscópica", "Registro de la exploración endoscópica"] },
    ],
  },
];

/* Total de horas del curso: es la única cifra de horas que se publica. */
export const TOTAL_HORAS = bloques.reduce((suma, b) => suma + b.horas, 0);
export const TOTAL_TEMAS = bloques.reduce((suma, b) => suma + b.temas.length, 0);

/* Frase que va encima de la fila de módulos. */
export const instruccionBloques =
  "Haz clic sobre cada módulo para consultar los temas que incluye";

/* ─────────────────── 4 · CÓMO SE IMPARTE EL TEMARIO ─────────────────────
 * La lista de formatos de impartición. NO se pueden clicar: no tienen temas
 * propios, solo describen en qué formato se recibe la formación.
 *
 *   titulo    → nombre del formato, tal como lo entregó el cliente.
 *   modalidad → distintivo corto de la derecha. Responde a "¿dónde y cuándo
 *               ocurre esto?". Está redactado a partir de los párrafos de
 *               introducción de este mismo archivo (campus virtual, seminarios
 *               en directo, talleres de fin de semana, tutorías por
 *               videoconferencia). PENDIENTE de que el cliente lo valide.
 *   enDirecto → true pinta el distintivo en rojo con el punto tipo REC. Solo
 *               para lo que ocurre en vivo, con un profesor delante.
 *   detalles  → sublíneas opcionales que se muestran bajo el título.
 *   icono     → dibujo del recuadro de color. Valores admitidos: "libro",
 *               "pantalla", "senal", "lugar", "videollamada". Están definidos
 *               en Syllabus.jsx; para añadir uno nuevo hay que dibujarlo allí.
 *   acento    → color del icono. El color NO es decorativo: indica el canal.
 *                 amber     → material físico (temario impreso)
 *                 turquoise → online a tu ritmo (campus virtual)
 *                 coral     → online en vivo (seminarios, tutorías)
 *                 highlight → presencial (talleres)
 *               Antes el campus virtual iba en amber, igual que el temario
 *               impreso: al ser dos naranjas casi idénticos, los recuadros no
 *               se distinguían entre sí. Si el cliente prefiere el amber
 *               original, basta con cambiar esta palabra.
 *
 * ⚠️ En el boceto original aparecían dos cajas más después de "TUTORÍAS"
 *    ("IMAGEN PARA EL DIAGNÓSTICO EN VETERINARIA" y "ATENCIÓN AL CLIENTE Y
 *    GESTIÓN EN CENTROS VETERINARIOS"), pero son nombres de bloques azules y
 *    parecen un error de copiar y pegar. Quedan 5 formatos, PENDIENTE de que
 *    el cliente lo confirme.
 */
export const tituloImparticion = "¿En qué formato recibes la formación?";

export const formatosImparticion = [
  {
    id: "temario-impreso",
    titulo: "TEMARIO IMPRESO",
    modalidad: "Material físico",
    detalles: ["Opcional"],
    enDirecto: false,
    icono: "libro",
    acento: "amber",
  },
  {
    id: "campus-virtual",
    titulo: "CAMPUS VIRTUAL",
    modalidad: "Online · a tu ritmo",
    detalles: ["Clases grabadas", "Talleres grabados"],
    enDirecto: false,
    icono: "pantalla",
    acento: "turquoise",
  },
  {
    id: "seminarios",
    titulo: "SEMINARIOS EN DIRECTO",
    modalidad: "Online · en vivo",
    detalles: ["Casos clínicos y novedades profesionales"],
    enDirecto: true,
    icono: "senal",
    acento: "coral",
  },
  {
    id: "talleres",
    titulo: "TALLERES PRESENCIALES",
    modalidad: "Presencial · fin de semana",
    detalles: ["Opcional", "Grupo reducido"],
    enDirecto: true,
    icono: "lugar",
    acento: "highlight",
  },
  {
    id: "tutorias",
    titulo: "TUTORÍAS",
    modalidad: "Videoconferencia · 1 a 1",
    detalles: ["Dudas y seguimiento personalizado"],
    enDirecto: true,
    icono: "videollamada",
    acento: "coral",
  },
];
