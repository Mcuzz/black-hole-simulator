# Arquitectura

## Vision general

El proyecto sigue una variante de `Clean Architecture` adaptada a simulacion interactiva. La meta principal es evitar que la UI o el renderer mezclen responsabilidades con la fisica del sistema.

Capas principales:

- `config`: constantes y parametros globales.
- `core`: definiciones del estado global y construccion del estado inicial.
- `engine`: coordinacion del loop de simulacion y emision de snapshots.
- `physics`: calculos relativistas y resolucion de regiones fisicas.
- `render`: escena 3D, objetos y camara.
- `ui`: experiencia de usuario, overlays y paneles educativos.

## Flujo de datos

```text
Usuario
  -> UI
  -> SimulationEngine
  -> updateSimulation(...)
  -> updateRelativisticEffects(...)
  -> nuevo snapshot
  -> React + renderer observan cambios
```

Regla central:

- La UI puede solicitar cambios de intencion, por ejemplo una nueva distancia objetivo.
- El `SimulationEngine` traduce esa intencion a cambios seguros sobre el estado.
- La fisica recalcula los efectos relativistas.
- El renderer refleja el resultado.

## Fuente de verdad

El estado principal vive en `SimulationState`:

- `globalTime`
- `blackHole`
- `spacecraftNear`
- `spacecraftFar`
- `clocks`
- `effects`
- `targetDistance`

Archivo clave:

- [simulationState.ts](../src/core/state/simulationState.ts)

Inicializacion:

- [createSimulation.ts](../src/core/state/createSimulation.ts)

## Motor de simulacion

El `SimulationEngine` es el coordinador central.

Responsabilidades:

- Mantener el estado vivo de la simulacion.
- Aplicar `targetDistance` con interpolacion estable.
- Ejecutar `updateSimulation(dt)`.
- Emitir snapshots para `useSyncExternalStore`.

Archivo clave:

- [simulationEngine.ts](../src/engine/simulationEngine.ts)

Decisiones relevantes:

- `targetDistance` se clamppea entre un minimo seguro cercano al horizonte y un maximo relativo al observador lejano.
- Los listeners React nunca leen el estado mutable directo; reciben snapshots clonados.
- El motor evita trabajo cuando `dt` es invalido.

## Fisica

La capa `physics` contiene las funciones cientificas y las aproximaciones visuales.

Subresponsabilidades:

- `schwarzschildPhysics.ts`: ecuaciones base.
- `updateSimulation.ts`: actualizacion de tiempos y posiciones.
- `updateRelativisticEffects.ts`: recalculo de efectos visuales y metricas derivadas.
- `regionResolver.ts`: clasificacion por zonas fisicas.
- `gravitationalLensing.ts`: intensidad visual del lensing.

Separacion importante:

- La fisica no depende de React.
- La fisica no depende de la escena 3D.
- El renderer consume el resultado, no la ecuacion.

## Render

La capa `render` implementa la escena y su relacion con el estado.

Piezas principales:

- `SimulationProvider`: crea el motor una sola vez y lo inyecta por contexto.
- `useSimulationState`: suscripcion segura al snapshot del engine.
- `SimulationScene`: loop por frame y ensamblado de escena.
- `SceneCameraRig`: comportamiento de camara por modo de vista.
- `SkySphere`: lente gravitacional en el fondo estelar.
- `Spacecraft`, `BlackHole`, `AccretionDisk`: representacion visual de los objetos.

Archivos clave:

- [SimulationProvider.tsx](../src/render/context/SimulationProvider.tsx)
- [useSimulationState.ts](../src/render/hooks/useSimulationState.ts)
- [SimulationScene.tsx](../src/render/scene/SimulationScene.tsx)

## UI

La UI esta dividida entre overlays flotantes y panel lateral fijo.

### Overlays

Responsables de:

- Pantalla de inicio.
- Selector de vistas.
- Panel de metricas en tiempo real.
- Relojes comparativos.

Archivos clave:

- [SplashScreen.tsx](../src/ui/layout/SplashScreen.tsx)
- [SceneOverlay.tsx](../src/ui/overlays/SceneOverlay.tsx)
- [OverlayDock.tsx](../src/ui/overlays/components/OverlayDock.tsx)
- [StatusPanel.tsx](../src/ui/overlays/components/StatusPanel.tsx)

### SidePanel

Responsable de:

- narrativa del experimento
- control radial
- telemetria detallada
- ecuaciones activas

Archivo principal:

- [SidePanel.tsx](../src/ui/panels/SidePanel/SidePanel.tsx)

El panel esta fragmentado en componentes especializados:

- `NarrativeSection`
- `ControlSection`
- `TelemetrySection`
- `EquationsSection`

## Decisiones de diseno

### 1. Sidepanel fijo

El panel lateral principal permanece visible para reforzar el rol educativo y evitar que el simulador quede sin contexto.

### 2. Fondo 3D a pantalla completa

La escena ocupa todo el viewport y los paneles flotan sobre ella. Esto mejora inmersion y reduce la sensacion de "ventana dentro de ventana".

### 3. Overlays discretos

Cada overlay flotante puede ocultarse o volver a mostrarse de forma localizada. Eso evita un panel maestro de toggles y reduce ruido visual.

### 4. Documentacion de ayuda contextual

Las metricas y las vistas muestran ayuda integrada con `?`, lo que reduce paneles redundantes y mejora comprension.

## Redundancias heredadas

Se identificaron y dejaron separadas algunas piezas legacy:

- `src/physics/relativity.ts`
  Funciona como capa de compatibilidad hacia `schwarzschildPhysics.ts`.
- `src/ui/panels/SidePanel/content/physicsCopy.ts`
  Redirige al contenido centralizado actual.
- `src/ui/panels/tabs/*`
  Piezas antiguas ya no conectadas al layout vigente.

Estas piezas no son parte del flujo principal, pero se conservaron para evitar roturas mientras el proyecto sigue evolucionando.
