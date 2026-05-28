# MedPriority

> Sistema inteligente de triaje hospitalario asistido por IA para departamentos de emergencias modernos.

---

## ¿Qué es MedPriority?

**MedPriority** es una aplicación web diseñada para hospitales y departamentos de urgencias que centraliza el proceso de triaje de pacientes, la clasificación por nivel de urgencia (ESI) y la gestión operativa de la sala de emergencias — todo en un flujo de trabajo claro, defensible y respaldado por inteligencia artificial.

La aplicación unifica cuatro módulos principales que trabajan juntos:

---

## Módulos y cómo funcionan

### 1. 🖥️ Kiosco de Pacientes (`/kiosk`)

El punto de entrada para los pacientes que llegan al hospital. Permite el **auto registro** sin necesidad de interacción con el personal de recepción.

**Flujo de 4 pasos:**

1. **Identificación** — El paciente ingresa su nombre, fecha de nacimiento, teléfono y el motivo de visita.
2. **Síntomas** — Puede describir sus síntomas de forma libre ya sea por **voz** (el micrófono captura el audio) o escribiéndolos. También puede seleccionar síntomas comunes de una lista (dolor de pecho, fiebre, mareos, etc.).
3. **Nivel de dolor** — Se presenta una escala visual del 0 al 10 con colores que representan la gravedad del dolor.
4. **Confirmación** — El sistema muestra la posición en la cola de espera, el tiempo estimado y el nivel de prioridad asignado. La información es enviada automáticamente al enfermero de triaje.

El kiosco también incluye botones de **accesibilidad** (lectura en voz alta) y un botón de **EMERGENCIA** para casos críticos inmediatos.

---

### 2. 🩺 Triaje Clínico (`/triage`)

La vista de trabajo del **personal clínico** (enfermeras y médicos) para evaluar a un paciente individual.

**Lo que muestra:**

- **Encabezado del paciente** — Nombre, número de expediente (MRN), edad, sexo, hora de llegada, box asignado y alergias conocidas.
- **Signos vitales en tiempo real** — Frecuencia cardíaca, presión arterial, frecuencia respiratoria, saturación de oxígeno (SpO₂), temperatura y GCS (escala de conciencia). Cada valor se muestra con un indicador de severidad (ALTO / MEDIO / BAJO).
- **Ritmo cardíaco (Lead II)** — Un trazo de ECG en tiempo real visualizado directamente en la pantalla.
- **Recomendación de IA** — El módulo de inteligencia artificial analiza los signos vitales, los síntomas reportados y el historial del paciente para sugerir un **nivel ESI** (1–5). Muestra:
  - El nivel recomendado con porcentaje de confianza
  - Una justificación clínica en texto
  - Los factores de riesgo detectados como etiquetas (ej. "FC > 110", "SpO₂ < 94%", "Antecedentes de hipertensión")
- El clínico puede **aceptar** el nivel sugerido, **anularlo manualmente** o consultar el razonamiento detallado de la IA.
- Una barra lateral muestra el **resumen del paciente** (queja principal, inicio, nivel de dolor, medicamentos, última comida) y el **historial de visitas anteriores**.
- Si los signos vitales coinciden con un protocolo de alerta temprana, se activa un panel de **alerta crítica** con la opción de activar un Código Azul.

---

### 3. 🏥 Tablero de Emergencias (`/er`)

Una vista tipo **tablero en tiempo real** de todos los pacientes actualmente en el departamento de urgencias.

**Características:**

- **KPIs en la parte superior** — Número total de pacientes en urgencias, casos críticos activos, tiempo de espera promedio, camas disponibles y nivel de saturación del departamento.
- **Alerta de casos críticos** — Un banner visible con los pacientes críticos más urgentes del momento y la opción de acusar recibo.
- **Tabla de pacientes** — Lista completa de todos los pacientes ordenados por acuidad, que muestra:
  - Nivel ESI con color y etiqueta (Reanimación, Emergente, Urgente, Menos urgente, No urgente)
  - Nombre, ID y datos demográficos del paciente
  - Queja principal
  - Estado actual (En espera / En tratamiento / Crítico / Imágenes / Alta)
  - Tiempo de espera (resaltado en rojo si supera los 30 minutos)
  - Box asignado y hora de llegada

El tablero se actualiza automáticamente cada 5 segundos y permite filtrar por zona (Reanimación, Trauma, Pediatría, etc.).

---

### 4. 📊 Analíticas Operativas (`/admin`)

El panel de **gestión y reportes** para supervisores y administradores hospitalarios.

**Qué incluye:**

- **Indicadores clave (KPIs)** — Pacientes atendidos, tiempo de espera promedio, saturación del departamento y casos críticos del período, con comparación vs. período anterior.
- **Gráfica de flujo de pacientes vs. tiempo de espera** — Un gráfico de barras + línea que muestra la cantidad de llegadas por hora y el tiempo de espera promedio a lo largo de las últimas 24 horas.
- **Distribución de acuidad** — Gráfico de dona con el desglose porcentual de pacientes por nivel ESI (L1 al L5).
- **Saturación por zona** — Barras de progreso que muestran el porcentaje de ocupación de cada área: Reanimación, Trauma, Cuidados agudos, Pediatría y Observación.
- **Centro de reportes** — Lista de reportes descargables (PDF/XLSX) como resúmenes operativos semanales, auditorías de precisión de triaje y análisis de flujo de pacientes.

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| **React 19** | Interfaz de usuario |
| **TanStack Router** | Enrutamiento basado en archivos |
| **TanStack Query** | Gestión de datos asíncronos |
| **TailwindCSS v4** | Estilos y sistema de diseño |
| **Radix UI** | Componentes accesibles |
| **Recharts** | Gráficas y visualizaciones |
| **Lucide React** | Iconografía |
| **Vite** | Herramienta de build |
| **TypeScript** | Tipado estático |
| **Cloudflare** | Despliegue y edge functions |

---

## Instalación y uso local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Verificar errores de linting
npm run lint

# Formatear código
npm run format
```

El servidor de desarrollo estará disponible en `http://localhost:5173` por defecto.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── AppShell.tsx       # Layout principal con navegación lateral
│   └── ui/                # Componentes reutilizables (Radix UI)
├── routes/
│   ├── index.tsx          # Página de inicio con resumen general
│   ├── kiosk.tsx          # Kiosco de auto registro para pacientes
│   ├── triage.tsx         # Vista de triaje clínico con IA
│   ├── er.tsx             # Tablero en vivo de urgencias
│   └── admin.tsx          # Analíticas y reportes operativos
├── hooks/                 # Custom hooks de React
├── lib/                   # Utilidades compartidas
└── styles.css             # Estilos globales y tokens de diseño
```

---

## Niveles ESI

MedPriority utiliza la escala **Emergency Severity Index (ESI)** estándar de 5 niveles:

| Nivel | Nombre | Color |
|---|---|---|
| L1 | Reanimación | 🔴 Crítico |
| L2 | Emergente | 🟠 Alto |
| L3 | Urgente | 🟡 Medio |
| L4 | Menos urgente | 🔵 Bajo |
| L5 | No urgente | ⚫ Menor |

---

## Licencia

Este proyecto es privado. Todos los derechos reservados.
