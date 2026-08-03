# MedPriority Demo

> Demonstration bilingue de un flujo visual de triaje con datos sintéticos.

## Aviso importante

**No usar para atención clínica.** Este repositorio no ejecuta IA clínica, no monitoriza pacientes, no almacena ni transmite información personal o médica introducida en el kiosco y no se integra con sistemas hospitalarios. Las alertas, prioridades, acciones y reportes se simulan localmente en la interfaz.

No introduzca información personal, médica o identificable real en el kiosco.

## Idiomas

La demo está disponible en español e inglés. El idioma inicial se resuelve en este orden:

1. Preferencia guardada en la cookie `mp_locale`.
2. Idioma preferido del navegador.
3. Español como fallback.

Puede cambiarse desde el selector de idioma de la aplicación o del kiosco. La preferencia se guarda en una cookie.

## Estado de funcionalidades

| Funcionalidad | Estado |
|---|---|
| Navegación entre pantallas | Implementada |
| Interfaz bilingue | Implementada |
| Avisos persistentes de demo | Implementada |
| Kiosco visual y selección local de síntomas/dolor | Simulado localmente |
| Entrada por voz | Desactivada |
| Lectura en voz alta | Disponible según soporte del navegador, con estados de error e incompatibilidad |
| Triaje, ESI y alertas | Escenarios sintéticos predefinidos |
| Tablero ER, filtros y pacientes | Snapshot sintético local |
| Analíticas y reportes | Datos y acciones simulados |
| IA, monitorización, envíos y emergencia real | No implementados |

## Módulos

- `/`: resumen de escenarios sintéticos.
- `/kiosk`: flujo de kiosco de demostración. Descarta al finalizar el contenido escrito y solo crea un escenario no identificable en el tablero local.
- `/triage`: caso de triaje sintético predeterminado.
- `/triage/$patientId`: triaje del episodio sintético seleccionado desde el tablero. Las decisiones son simulaciones locales.
- `/er`: tablero de pacientes sintéticos sin conexión ni actualización automática.
- `/admin`: analíticas y reportes ilustrativos.

## Desarrollo local

Requiere Node.js 22.12 o superior.

```bash
npm install
npm run dev
```

Comprobaciones disponibles:

```bash
npm run lint
npm run check
npm test
npx playwright install chromium
npm run test:e2e
npx tsc --noEmit
npm run build
```

GitHub Actions ejecuta estas comprobaciones, incluidas las pruebas E2E con Chromium, en cada push y pull request.

## Fuera de alcance

La demo no incluye autenticación hospitalaria, PHI, integración FHIR/HL7, base de datos clínica, IA validada, telemetría fisiológica, alertas reales ni cumplimiento regulatorio para producción. Los escenarios sintéticos del tablero pueden conservarse localmente hasta 24 horas; no incluyen datos escritos en el kiosco.

Una integración futura con expediente clínico requiere un backend autenticado y autorizado, auditoría, cifrado, políticas de retención y una integración formal con el sistema objetivo. `localStorage` no es un mecanismo válido para PHI.
