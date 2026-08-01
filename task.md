# Backlog de la demo

## Completado

- [x] **Migrar lint y formato a BiomeJS:** reemplazar ESLint y Prettier por BiomeJS, mantener las reglas recomendadas y el formato existente, revisar que no haya cambios funcionales y validar con `npm run lint`, `npm run check` y `npm run build`.
- [x] **Eliminar el acceso "My patients":** retirar el enlace de la página de inicio.

## Alcance de la demo

- [ ] **Definir límites de la demo:** documentar que no usa datos reales, no es apta para uso clínico, no envía alertas ni integra sistemas hospitalarios.
- [ ] **Usar exclusivamente datos sintéticos:** identificar fixtures, pacientes, métricas y reportes como sintéticos en código y en interfaz.
- [ ] **Excluir explícitamente producción clínica:** dejar fuera del alcance autenticación hospitalaria, PHI, integración FHIR/HL7, IA clínica real, monitorización real y alertas de emergencia reales.

## P0 - Seguridad y transparencia

- [ ] **Etiquetar el entorno como demo:** mostrar un aviso persistente de "Demo · Datos sintéticos · No usar para atención clínica" en las vistas de personal y del kiosco.
- [ ] **Eliminar afirmaciones operativas falsas:** sustituir textos como "Live", "System operational", "auto-refresh", "sent to nurse" y métricas de IA no verificadas por estados de demostración claros.
- [ ] **Señalizar las acciones simuladas:** etiquetar como simulados los controles de emergencia, validación de prioridad, aceptación/override ESI, reconocimiento de alertas y escalamiento clínico.
- [ ] **Añadir feedback seguro a acciones simuladas:** mostrar éxito, error o cancelación de la simulación, sin implicar que se notificó a personal real.
- [ ] **Revisar terminología de emergencia:** sustituir "Code Blue" por una simulación no ambigua o exigir confirmación contextual, dejando claro que no activa ningún protocolo.
- [ ] **Corregir consistencia clínica de los fixtures:** unificar ESI, alergias, ubicación, estado, signos vitales, contadores y prioridades de cada paciente en todas las pantallas.

## P0 - Internacionalización bilingüe

- [ ] **Incorporar infraestructura i18n:** añadir `i18next` y `react-i18next`, con español e inglés como idiomas soportados.
- [ ] **Crear catálogos de traducción por dominio:** separar textos en `common`, `kiosk`, `triage`, `er`, `admin` y `validation` para ambos idiomas.
- [ ] **Eliminar textos visibles hardcodeados:** mover textos de UI, errores, etiquetas, alertas, títulos, tooltips y estados a los catálogos de traducción.
- [ ] **Definir códigos de dominio independientes del idioma:** representar síntomas, estados, zonas, niveles ESI y acciones mediante códigos estables, no textos traducidos.
- [ ] **Añadir selector de idioma:** permitir cambiar entre español e inglés desde el kiosco y desde la aplicación del personal.
- [ ] **Detectar y persistir idioma:** usar el idioma del navegador como valor inicial, guardar la preferencia y conservarla al recargar.
- [ ] **Conservar el formulario al cambiar idioma:** asegurar que el cambio de idioma no borre ni altere datos introducidos.
- [ ] **Localizar formatos regionales:** formatear fechas, horas, números y porcentajes con `Intl` según el idioma activo.
- [ ] **Actualizar idioma del documento y accesibilidad:** cambiar dinámicamente `lang` en HTML y traducir nombres accesibles, anuncios y mensajes de error.
- [ ] **Configurar lectura y reconocimiento de voz por idioma:** seleccionar voces y reconocimiento compatibles con español o inglés, con fallback si el navegador no los soporta.

## P1 - Kiosco funcional bilingüe

- [ ] **Modelar el registro del kiosco:** definir datos de identidad, contacto, motivo, síntomas, dolor, idioma preferido y estado del registro.
- [ ] **Implementar formulario validado:** usar React Hook Form y Zod para datos de identidad, fecha de nacimiento, teléfono, motivo de consulta y síntomas.
- [ ] **Validar por paso:** impedir avanzar cuando falten datos requeridos e informar los errores en el idioma activo.
- [ ] **Persistir el estado del wizard:** mantener los datos al avanzar, retroceder, cambiar idioma y recargar la página.
- [ ] **Añadir atributos de formulario adecuados:** usar `name`, tipos de entrada, `autocomplete`, `inputMode`, labels visibles y ayudas accesibles.
- [ ] **Implementar síntomas comunes:** permitir seleccionar y deseleccionar síntomas mediante códigos compartidos y mostrar su traducción correspondiente.
- [ ] **Corregir escala de dolor:** iniciar sin valor, expresar correctamente 0 como "Sin dolor" / "No pain" y usar un control accesible para los valores 0 a 10.
- [ ] **Implementar entrada escrita de síntomas:** conservar el texto original del paciente, sin traducirlo automáticamente como equivalencia clínica.
- [ ] **Implementar entrada por voz opcional:** solicitar permiso explícito, iniciar/detener captura, permitir revisar la transcripción y comunicar errores o incompatibilidad.
- [ ] **Implementar lectura en voz alta:** ofrecer iniciar, pausar y detener, usando la voz del idioma elegido y sin prometer funcionalidad no disponible.
- [ ] **Implementar accesibilidad del kiosco:** añadir ajustes de texto/contraste si se ofrecen, foco claro, navegación por teclado, anuncios de paso y soporte de movimiento reducido.
- [ ] **Simular el botón de emergencia de forma segura:** mostrar instrucciones bilingües para avisar al personal y una confirmación inequívoca de que no se envió alerta real.
- [ ] **Crear confirmación dinámica:** mostrar solo los datos introducidos, junto con prioridad, posición y espera explícitamente simuladas.
- [ ] **Finalizar y limpiar sesión:** incluir acciones para completar el registro de demostración, iniciar un nuevo registro y borrar datos del kiosco tras finalizar.
- [ ] **Adaptar kiosco a móvil y tablet:** revisar cabecera, campos, escala de dolor, resumen y acciones en 320, 375, 768 y 1024 px.

## P1 - Datos sintéticos compartidos

- [ ] **Crear modelo de dominio de la demo:** definir tipos para paciente, episodio, síntomas, observaciones, clasificación ESI, alerta, decisión y ubicación.
- [ ] **Centralizar fixtures sintéticos:** eliminar los arrays y textos clínicos duplicados de las rutas y reunirlos en una fuente común.
- [ ] **Crear repositorio local de datos:** encapsular lectura, alta, actualización, filtros y reinicio de datos para que las rutas no dependan de arrays internos.
- [ ] **Persistir la demo en almacenamiento local:** guardar pacientes y decisiones sintéticas en `localStorage` con opción de restaurar el estado inicial.
- [ ] **Derivar métricas desde los datos compartidos:** calcular pacientes, críticos, espera, ocupación y distribución ESI, sin números manuales contradictorios.
- [ ] **Registrar acciones de demostración:** guardar con hora y resultado los cambios de ESI, alertas reconocidas y acciones simuladas.

## P1 - Tablero de emergencias

- [ ] **Ordenar realmente por acuidad:** ordenar por ESI ascendente, deterioro y tiempo de espera, y mostrar el criterio activo.
- [ ] **Implementar filtro de zona:** filtrar los pacientes de la fuente común y reflejar el resultado en KPIs y tabla.
- [ ] **Implementar búsqueda de pacientes:** buscar por nombre, MRN y box, con estado vacío claro.
- [ ] **Implementar alta de paciente de demostración:** permitir crear un paciente sintético y añadirlo al tablero.
- [ ] **Hacer funcional la apertura de pacientes:** navegar desde cada fila a la vista de triaje del paciente correspondiente.
- [ ] **Derivar alertas críticas:** construir el banner desde los pacientes críticos y permitir reconocer una alerta simulada con fecha y usuario de demo.
- [ ] **Añadir estados de datos:** cubrir carga, lista vacía, error, desconexión simulada y datos desactualizados.
- [ ] **Adaptar la tabla a móvil:** usar desplazamiento horizontal seguro o tarjetas, manteniendo ESI, paciente, estado y espera visibles.
- [ ] **Añadir semántica accesible a la tabla:** incluir caption, encabezados con `scope`, acciones con nombres únicos y foco visible.

## P1 - Triaje por paciente

- [ ] **Parametrizar la ruta de triaje:** usar un identificador de paciente, por ejemplo `/triage/$patientId`, en lugar de mostrar un caso fijo.
- [ ] **Cargar datos del repositorio local:** mostrar el paciente seleccionado, su episodio y sus datos sintéticos compartidos.
- [ ] **Destacar alergias y riesgos:** presentar alergias, queja principal y factores de riesgo con jerarquía visual y texto accesible.
- [ ] **Identificar datos simulados y su antigüedad:** etiquetar signos vitales, ECG y recomendaciones como demo, incluyendo fuente y marca temporal sintéticas.
- [ ] **Implementar aceptación de ESI simulada:** permitir aceptar una recomendación y registrar la decisión en el repositorio local.
- [ ] **Implementar override de ESI simulado:** permitir cambiar el nivel y exigir un motivo, registrando la decisión y hora.
- [ ] **Implementar panel de razonamiento:** mostrar explicación, datos de entrada, limitaciones y el carácter simulado de la recomendación.
- [ ] **Implementar escalamiento simulado:** usar confirmación y feedback para alertas, sin activar protocolos reales.
- [ ] **Añadir historial local de decisiones:** presentar cambios de nivel, overrides y alertas simuladas del episodio.

## P2 - Analíticas y reportes de demostración

- [ ] **Calcular analíticas desde la fuente compartida:** sustituir series y KPIs hardcodeados por datos derivados de fixtures y acciones locales.
- [ ] **Implementar selector de período:** permitir cambiar rango de demostración y recalcular visualizaciones.
- [ ] **Corregir tendencias:** separar dirección numérica de impacto positivo, negativo o neutro, con iconos y textos coherentes.
- [ ] **Mejorar gráficas:** añadir ejes, unidades, escalas, leyendas, resumen textual y tabla equivalente accesible.
- [ ] **Implementar saturación por zona:** calcular ocupación desde pacientes sintéticos y exponer valores mediante semántica de progreso.
- [ ] **Implementar centro de reportes:** generar y descargar reportes de demostración con datos sintéticos y en el idioma activo.
- [ ] **Hacer funcionales las acciones de reportes:** habilitar período, programación simulada, "View all" y descargas con feedback observable.

## P2 - Navegación, responsive y experiencia

- [ ] **Convertir AppShell en layout compartido:** evitar duplicación de navegación y facilitar contexto de idioma, datos y avisos de demo.
- [ ] **Implementar navegación móvil:** sustituir la sidebar fija por un drawer o menú colapsable accesible bajo 768 px.
- [ ] **Hacer funcional o retirar controles inertes:** resolver búsqueda global, notificaciones y cualquier botón visible sin resultado observable.
- [ ] **Separar visualmente modos de uso:** diferenciar kiosco de paciente y vistas del personal, sin representar permisos reales aún.
- [ ] **Actualizar navegación activa:** añadir `aria-current="page"` y estados visuales consistentes.
- [ ] **Ajustar cabeceras y acciones responsivas:** permitir wrap, apilar acciones y mantener objetivos táctiles adecuados.
- [ ] **Corregir metadatos de plantilla:** reemplazar "Lovable App" y contenido genérico por identidad, títulos y descripciones bilingües de MedPriority.

## P2 - Accesibilidad transversal

- [ ] **Aplicar nombres accesibles:** añadir labels, `aria-label` y texto contextual a búsqueda, iconos, filtros, descargas y acciones de pacientes.
- [ ] **Normalizar foco visible:** asegurar un indicador de foco con contraste suficiente para todos los controles.
- [ ] **Mejorar semántica de estados y alertas:** usar regiones de estado, `role="alert"` y `aria-live` de forma controlada.
- [ ] **Exponer selecciones y progreso:** usar radios, sliders, `aria-pressed`, grupos semánticos y texto de paso actual según corresponda.
- [ ] **Añadir enlace para saltar al contenido:** permitir omitir navegación repetitiva por teclado.
- [ ] **Corregir contraste clínico:** verificar contraste AA, añadir texto/íconos y no depender solo del color para urgencia o estado.
- [ ] **Respetar movimiento reducido:** detener o simplificar ECG, pulsos y animaciones con `prefers-reduced-motion`.
- [ ] **Hacer gráficas accesibles:** añadir títulos, descripciones, resúmenes y tablas alternativas; marcar como decorativos los SVG sin significado.
- [ ] **Verificar objetivos táctiles:** asegurar dimensiones y separación suficientes para acciones táctiles, en especial en el kiosco.

## P2 - Calidad, pruebas y documentación

- [ ] **Añadir pruebas unitarias:** cubrir modelos, validaciones, traducciones, escala de dolor, ordenamiento ESI, filtros y cálculos de KPI.
- [ ] **Añadir pruebas de componentes:** verificar wizard del kiosco, cambio de idioma, preservación de datos, errores y reinicio de sesión.
- [ ] **Añadir pruebas E2E:** recorrer el kiosco en español e inglés, crear paciente, verlo en ER y abrir su triaje.
- [ ] **Añadir pruebas de accesibilidad:** ejecutar comprobaciones automáticas y revisión manual de teclado, foco, lector de pantalla y zoom al 200%.
- [ ] **Añadir pruebas visuales responsivas:** revisar las rutas principales en 320, 375, 768 y 1024 px.
- [ ] **Crear integración continua:** ejecutar `npm run lint`, `npm run check`, `tsc --noEmit`, pruebas y build en cada cambio.
- [ ] **Documentar requisitos de entorno:** declarar versión mínima de Node, comandos de desarrollo y comportamiento de almacenamiento local.
- [ ] **Actualizar README:** distinguir funciones implementadas de simulaciones y describir el flujo bilingüe de demostración.
- [ ] **Revisar configuración de calidad:** reactivar progresivamente reglas de Biome de accesibilidad y corrección que sean compatibles con el código final.

## Orden de ejecución

1. Etiquetado seguro de demo e infraestructura bilingüe.
2. Kiosco bilingüe validado, persistente y accesible.
3. Modelo compartido, fixtures y repositorio local.
4. Integración kiosco a tablero ER.
5. Triaje parametrizado por paciente y decisiones simuladas.
6. Analíticas y reportes derivados de los mismos datos.
7. Responsive, accesibilidad y navegación transversal.
8. Pruebas, CI y documentación final de la demo.
