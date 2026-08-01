# Tareas por fase

Este archivo registra el trabajo ejecutable de cada fase de la demo. `task.md` conserva el backlog completo.

## Fase 0 - Demo segura y bilingue

### Fundacion bilingue

- [ ] Instalar `i18next` y `react-i18next`.
- [ ] Crear configuracion i18n para espanol e ingles.
- [ ] Crear catalogos `common`, `kiosk`, `triage`, `er`, `admin` y `validation` en ambos idiomas.
- [ ] Determinar idioma inicial: cookie, luego idioma del navegador y, como fallback, espanol.
- [ ] Guardar el idioma seleccionado en una cookie.
- [ ] Actualizar dinamicamente el atributo `lang` del documento.
- [ ] Crear selector de idioma reutilizable.
- [ ] Añadir selector en `AppShell` y kiosco.
- [ ] Traducir 404, error global, navegacion y metadatos.
- [ ] Crear formatters con locale explicito para numeros, porcentajes, fechas y duraciones.

### Transparencia de demo

- [ ] Crear aviso persistente para las vistas de personal: datos sinteticos, sin IA, monitorizacion ni integracion real.
- [ ] Crear aviso persistente especifico para kiosco: no introducir informacion personal o medica real.
- [ ] Etiquetar pacientes, metricas, signos vitales, ECG, alertas y reportes como datos sinteticos o simulados.
- [ ] Actualizar titulos y metadatos para incluir el contexto de demo.
- [ ] Reemplazar hospital, usuario y rol por identidades ficticias de demostracion.
- [ ] Retirar afirmaciones de datos vivos, actualizacion automatica, modelos nominales, IA real y envio de informacion.

### Simulaciones locales

- [ ] Crear dialogo reutilizable para confirmar acciones simuladas.
- [ ] Mostrar resultado local persistente que indique que no se envio ninguna alerta ni se modifico una historia clinica.
- [ ] Simular ayuda urgente en kiosco con instrucciones para contactar directamente al personal.
- [ ] Simular validacion de prioridad, aceptacion ESI, override y escalamiento en triaje.
- [ ] Simular reconocimiento de alertas, filtros, alta de paciente y apertura de resumen en ER.
- [ ] Simular cambio de periodo, programacion y exportacion de reportes en analiticas.
- [ ] Asegurar que los controles simulados no realizan solicitudes de red, no guardan datos clinicos y no solicitan microfono.

### Kiosco seguro

- [ ] Desactivar captura de voz falsa y retirar indicadores de escucha o transcripciones inventadas.
- [ ] Marcar lectura en voz alta como no disponible hasta la fase 1.
- [ ] Permitir seleccionar sintomas localmente como parte de la simulacion.
- [ ] Mantener la escala de dolor como demostracion sin derivar prioridad clinica.
- [ ] Etiquetar cola, espera y prioridad como valores predefinidos de demostracion.
- [ ] Hacer que finalizar reinicie el estado local del kiosco.

### Datos y contenido

- [ ] Unificar el caso principal como `Demo Patient 01` / `DEMO-0001` en kiosco, triaje y ER.
- [ ] Alinear ESI, alergias, dolor, estado y ubicacion del caso principal.
- [ ] Hacer coincidir los KPIs y alertas del ER con los fixtures visibles.
- [ ] Sustituir estados, sintomas, zonas, niveles ESI y acciones por codigos no traducibles en la logica.
- [ ] Actualizar README con limites, funciones simuladas y uso bilingue de la demo.

### Verificacion de fase 0

- [ ] Revisar las rutas `/`, `/kiosk`, `/triage`, `/er` y `/admin` en espanol e ingles.
- [ ] Confirmar que cambiar idioma conserva el estado local de la ruta.
- [ ] Confirmar que el idioma persiste tras recargar.
- [ ] Confirmar que no hay avisos de hidratacion SSR.
- [ ] Verificar que no se solicita permiso de microfono ni se hacen solicitudes clinicas.
- [ ] Verificar que cada control habilitado tiene un resultado observable.
- [ ] Ejecutar `npm run lint`, `npm run check`, `npx tsc --noEmit` y `npm run build`.

## Fase 1 - Kiosco y datos compartidos

- [ ] Implementar formulario del kiosco con React Hook Form y Zod.
- [ ] Validar cada paso y conservar datos al navegar, recargar o cambiar idioma.
- [ ] Implementar entrada de texto y seleccion de sintomas con accesibilidad completa.
- [ ] Corregir la escala de dolor de 0 a 10 y sus etiquetas.
- [ ] Implementar captura de voz opcional y lectura en voz alta con permisos, fallbacks y control del usuario.
- [ ] Crear modelo de dominio compartido y fixtures centralizados.
- [ ] Crear repositorio local con lectura, actualizacion y reinicio de datos sinteticos.
- [ ] Persistir datos de demostracion en `localStorage` con restauracion de estado inicial.
- [ ] Integrar el registro de demostracion del kiosco con los pacientes sinteticos del ER.

## Fase 2 - ER y triaje por paciente

- [ ] Parametrizar triaje por identificador de paciente.
- [ ] Ordenar pacientes por ESI, deterioro y tiempo de espera.
- [ ] Implementar busqueda y filtros ER sobre la fuente de datos compartida.
- [ ] Abrir el triaje del paciente desde la tabla ER.
- [ ] Derivar KPIs y alertas desde los datos sinteticos compartidos.
- [ ] Registrar decisiones locales de ESI, overrides y alertas reconocidas.
- [ ] Añadir estados de carga, vacio, error y datos desactualizados.

## Fase 3 - Analiticas, responsive y accesibilidad

- [ ] Calcular metricas y graficas desde la fuente compartida.
- [ ] Implementar reportes de demostracion descargables con datos sinteticos.
- [ ] Convertir `AppShell` en layout compartido y crear navegacion movil accesible.
- [ ] Adaptar kiosco, tabla ER, cabeceras y acciones a movil y tablet.
- [ ] Añadir labels, foco visible, semantica de alertas y nombres accesibles.
- [ ] Corregir contraste, movimiento reducido, objetivos tactiles y accesibilidad de graficas.

## Fase 4 - Calidad y entrega

- [ ] Añadir pruebas unitarias de modelos, validaciones, traducciones y calculos.
- [ ] Añadir pruebas de componentes para kiosco, idioma y simulaciones.
- [ ] Añadir pruebas E2E bilingues del flujo kiosco, ER y triaje.
- [ ] Añadir pruebas de accesibilidad y responsive.
- [ ] Configurar CI para lint, check, TypeScript, pruebas y build.
- [ ] Revisar configuracion de Biome, documentacion de Node y README final.
