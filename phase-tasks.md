# Tareas por fase

Este archivo registra el trabajo ejecutable de cada fase de la demo. `task.md` conserva el backlog completo.

## Fase 0 - Demo segura y bilingue

### Fundacion bilingue

- [x] Instalar `i18next` y `react-i18next`.
- [x] Crear configuracion i18n para espanol e ingles.
- [x] Crear catalogos `common`, `kiosk`, `triage`, `er`, `admin` y `validation` en ambos idiomas.
- [x] Determinar idioma inicial: cookie, luego idioma del navegador y, como fallback, espanol.
- [x] Guardar el idioma seleccionado en una cookie.
- [x] Actualizar dinamicamente el atributo `lang` del documento.
- [x] Crear selector de idioma reutilizable.
- [x] Añadir selector en `AppShell` y kiosco.
- [x] Traducir 404, error global, navegacion y metadatos.
- [x] Crear formatters con locale explicito para numeros, porcentajes, fechas y duraciones.

### Transparencia de demo

- [x] Crear aviso persistente para las vistas de personal: datos sinteticos, sin IA, monitorizacion ni integracion real.
- [x] Crear aviso persistente especifico para kiosco: no introducir informacion personal o medica real.
- [x] Etiquetar pacientes, metricas, signos vitales, ECG, alertas y reportes como datos sinteticos o simulados.
- [x] Actualizar titulos y metadatos para incluir el contexto de demo.
- [x] Reemplazar hospital, usuario y rol por identidades ficticias de demostracion.
- [x] Retirar afirmaciones de datos vivos, actualizacion automatica, modelos nominales, IA real y envio de informacion.

### Simulaciones locales

- [x] Crear dialogo reutilizable para confirmar acciones simuladas.
- [x] Mostrar resultado local persistente que indique que no se envio ninguna alerta ni se modifico una historia clinica.
- [x] Simular ayuda urgente en kiosco con instrucciones para contactar directamente al personal.
- [x] Simular validacion de prioridad, aceptacion ESI, override y escalamiento en triaje.
- [x] Simular reconocimiento de alertas, filtros, alta de paciente y apertura de resumen en ER.
- [x] Simular cambio de periodo, programacion y exportacion de reportes en analiticas.
- [x] Asegurar que los controles simulados no realizan solicitudes de red, no guardan datos clinicos y no solicitan microfono.

### Kiosco seguro

- [x] Desactivar captura de voz falsa y retirar indicadores de escucha o transcripciones inventadas.
- [x] Marcar lectura en voz alta como no disponible hasta la fase 1.
- [x] Permitir seleccionar sintomas localmente como parte de la simulacion.
- [x] Mantener la escala de dolor como demostracion sin derivar prioridad clinica.
- [x] Etiquetar cola, espera y prioridad como valores predefinidos de demostracion.
- [x] Hacer que finalizar reinicie el estado local del kiosco.

### Datos y contenido

- [x] Unificar el caso principal como `Demo Patient 01` / `DEMO-0001` en kiosco, triaje y ER.
- [x] Alinear ESI, alergias, dolor, estado y ubicacion del caso principal.
- [x] Hacer coincidir los KPIs y alertas del ER con los fixtures visibles.
- [x] Sustituir estados, sintomas, zonas, niveles ESI y acciones por codigos no traducibles en la logica.
- [x] Actualizar README con limites, funciones simuladas y uso bilingue de la demo.

### Verificacion de fase 0

- [x] Revisar las rutas `/`, `/kiosk`, `/triage`, `/er` y `/admin` en espanol e ingles.
- [x] Confirmar que cambiar idioma conserva el estado local de la ruta.
- [x] Confirmar que el idioma persiste tras recargar.
- [x] Confirmar que no hay avisos de hidratacion SSR.
- [x] Verificar que no se solicita permiso de microfono ni se hacen solicitudes clinicas.
- [x] Verificar que cada control habilitado tiene un resultado observable.
- [x] Ejecutar `npm run lint`, `npm run check`, `npx tsc --noEmit` y `npm run build`.

## Fase 1 - Kiosco y datos compartidos

- [x] Implementar formulario del kiosco con React Hook Form y Zod.
- [x] Validar cada paso y conservar datos al navegar o cambiar idioma; descartar el contenido escrito al recargar o finalizar.
- [x] Implementar entrada de texto y seleccion de sintomas con accesibilidad completa.
- [x] Corregir la escala de dolor de 0 a 10 y sus etiquetas.
- [ ] Implementar captura de voz opcional con consentimiento, privacidad, fallbacks y control del usuario. La demo actual mantiene la captura desactivada.
- [x] Crear modelo de dominio compartido y fixtures centralizados.
- [x] Centralizar los datos de triaje del caso principal: alergias, medicacion, dolor, signos vitales, visitas y factores predefinidos.
- [x] Asignar un escenario de triaje sintético tipado a todos los pacientes de fixtures y a los nuevos escenarios locales.
- [x] Crear repositorio local con lectura, actualizacion y reinicio de datos sinteticos.
- [x] Persistir datos de demostracion en `localStorage` con restauracion de estado inicial.
- [x] Integrar el registro de demostracion del kiosco con los pacientes sinteticos del ER.

## Cierre de fases 0 y 1 - Antes de fase 2

### Privacidad, voz y sesion de kiosco

- [x] Corregir el contrato de privacidad: eliminar datos identificables libres o documentar de forma visible la persistencia local, su alcance y sus limites.
- [x] Añadir expiracion, borrado global y limpieza inmediata de los datos del kiosco al completar, cancelar o abandonar una sesion compartida.
- [x] Evitar etiquetar automaticamente como sinteticos los datos introducidos libremente por una persona.
- [x] Desactivar temporalmente la captura de voz o implementar consentimiento previo, aviso de posible procesamiento externo, estados de permiso/error y compatibilidad por navegador.
- [x] Mantener la captura de voz desactivada y corregir los estados de lectura: inicio, detencion, incompatibilidad y error.

### Modelo, persistencia y coherencia de datos

- [x] Completar el modelo compartido con identidad de demo, episodio, sintomas, dolor, alergias, observaciones, ESI, alertas, decisiones y ubicacion.
- [x] Definir un contrato kiosco a ER que conserve los datos sinteticos permitidos y aplique de forma explicita los valores predefinidos del escenario.
- [x] Validar en runtime y versionar los datos de `localStorage`; manejar datos vacios, corruptos, incompatibles, cuota agotada y almacenamiento bloqueado.
- [x] Eliminar datos clinicos duplicados de triaje y preparar la fuente compartida para la futura ruta por paciente.
- [x] Derivar KPIs, alertas y metricas desde la misma fuente de datos o declarar explicitamente que cada pantalla es un snapshot estatico.

### Internacionalizacion, responsive y accesibilidad

- [x] Resolver el singleton mutable de i18n durante SSR mediante instancias aisladas por arbol de renderizado.
- [x] Verificar hidratacion concurrente en espanol e ingles con un entorno SSR de integracion.
- [x] Localizar metadatos, titulos de rutas, fixtures codificados, formatos regionales y contenidos aun hardcodeados.
- [x] Implementar navegacion movil accesible antes de ampliar las vistas de personal; revisar 320, 375, 768 y 1024 px.
- [x] Corregir el aviso de demo superpuesto por la cabecera del kiosco en movil.
- [x] Completar el patron modal accesible: atrapar y restaurar foco, impedir interaccion con el fondo y bloquear scroll cuando corresponda.
- [x] Corregir contraste de niveles ESI, foco visible, anuncios de cambio de paso y alternativas accesibles para graficas.

### Verificacion y trazabilidad

- [x] Auditar y ajustar las casillas de fases 0 y 1 que solo se cumplian parcialmente.
- [x] Definir `phase-tasks.md` como seguimiento vigente y `task.md` como catalogo historico de requisitos.
- [x] Añadir pruebas unitarias iniciales para persistencia versionada, expiracion, rechazo de datos no sinteticos y contrato kiosco a ER.
- [x] Añadir pruebas unitarias de validacion, persistencia, idioma, formatos y KPIs.
- [x] Añadir pruebas de componentes y E2E del flujo kiosco a ER, en espanol e ingles, incluyendo limpieza de sesion y datos corruptos.
- [x] Configurar CI para lint, check, TypeScript, pruebas, build, accesibilidad y responsive.

## Fase 2 - ER y triaje por paciente

- [x] Parametrizar triaje por identificador de paciente.
- [x] Ordenar pacientes por ESI, deterioro y tiempo de espera.
- [x] Implementar busqueda y filtros ER sobre la fuente de datos compartida.
- [x] Abrir el triaje del paciente desde la tabla ER.
- [x] Derivar KPIs y alertas desde los datos sinteticos compartidos.
- [x] Registrar decisiones locales de ESI, overrides y alertas reconocidas.
- [x] Añadir estados de carga, vacio, error y datos desactualizados.

## Fase 3 - Analiticas, responsive y accesibilidad

### Contrato de datos para analiticas

- El snapshot compartido actual permite derivar pacientes presentes, casos criticos, espera media, capacidad, saturacion, distribucion ESI y ocupacion por zona.
- Llegadas y altas por periodo, series temporales, tendencias y comparaciones requieren fixtures historicos versionados o un registro de eventos sinteticos; no deben inferirse del snapshot actual.
- Los reportes descargables deben indicar si representan el snapshot actual o un periodo historico sintetico y usar exclusivamente los contratos anteriores.

- [ ] Calcular metricas y graficas desde la fuente compartida.
- [ ] Implementar reportes de demostracion descargables con datos sinteticos.
- [x] Convertir `AppShell` en layout compartido y crear navegacion movil accesible.
- [x] Adaptar kiosco, tabla ER, cabeceras y acciones a movil y tablet.
- [x] Añadir labels, foco visible, semantica de alertas y nombres accesibles.
- [x] Corregir contraste, movimiento reducido, objetivos tactiles y accesibilidad de graficas.

## Fase 4 - Calidad y entrega

- [x] Añadir pruebas unitarias de modelos, validaciones, traducciones y calculos.
- [x] Añadir pruebas de componentes para kiosco, idioma y simulaciones.
- [x] Añadir pruebas E2E bilingues del flujo kiosco, ER y triaje.
- [x] Añadir pruebas de accesibilidad y responsive.
- [x] Configurar CI para lint, check, TypeScript, pruebas y build.
- [ ] Revisar configuracion de Biome, documentacion de Node y README final.
