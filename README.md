# Interactive Schwarzschild Black Hole Simulator

Simulador interactivo en navegador para visualizar efectos relativistas cerca de un agujero negro de Schwarzschild. El proyecto combina una escena 3D inmersiva con una capa educativa que explica, en tiempo real, conceptos como dilatacion temporal gravitacional, corrimiento gravitacional al rojo, lente gravitacional y aproximaciones visuales de spaghettification.

## Objetivo

Este proyecto fue planteado como una pieza de portafolio tecnico y visual:

- Mostrar separacion clara entre fisica, motor de simulacion, render y UI.
- Presentar fenomenos de relatividad general de forma visual e interactiva.
- Mantener una arquitectura limpia, extensible y legible.
- Priorizar una experiencia inmersiva en la que la simulacion ocupe el fondo completo.

## Estado actual

El simulador incluye actualmente:

- Pantalla de inicio interactiva con acceso por clic o tecla `Space`.
- Escena 3D a pantalla completa con agujero negro, disco de acrecion, campo estelar y dos naves.
- Selector de vistas para `Vista principal`, `Observador cercano` y `Observador lejano`.
- Panel lateral fijo con narrativa, control radial, telemetria y ecuaciones activas.
- Panel flotante de metricas en tiempo real con ayudas contextuales.
- Relojes comparativos del observador cercano y lejano.
- Modelo fisico desacoplado del renderer.

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `Three.js`
- `@react-three/fiber`
- `@react-three/drei`

## Experiencia de usuario

Flujo principal:

1. Aparece una pantalla de inicio.
2. El usuario entra tocando la pantalla o presionando `Space`.
3. La simulacion se presenta como fondo completo.
4. El panel lateral permite mover radialmente la nave cercana.
5. Los overlays flotantes permiten cambiar de vista y consultar metricas.

Controles disponibles:

- `Space` o clic en la pantalla de inicio: entrar al simulador.
- Selector de vistas: cambiar entre observador externo, cercano y lejano.
- `?` en metricas: mostrar explicaciones breves de cada variable.
- Slider radial y botones `+/- 0.5 r_s`: ajustar la distancia objetivo de la nave cercana.
- Arrastre directo de la nave cercana en escena: modificar la distancia objetivo.
- Botones discretos en overlays: ocultar o volver a mostrar paneles flotantes.

## Estructura del proyecto

```text
src/
  config/          Configuracion global de simulacion
  core/            Estado central, entidades y unidades
  engine/          Motor de simulacion y ciclo de actualizacion
  physics/         Ecuaciones relativistas y resolucion de efectos
  render/          Escena 3D, camara, entorno y objetos visuales
  ui/              Splash screen, overlays, paneles y contenido textual
```

Resumen por carpetas:

- `src/core`: define el shape del estado global y su inicializacion.
- `src/engine`: actualiza el estado a cada frame y emite snapshots para React.
- `src/physics`: contiene la logica cientifica y las aproximaciones visuales.
- `src/render`: traduce el estado del simulador a una escena Three.js.
- `src/ui`: consume el estado sin escribir fisica directamente.

## Arquitectura resumida

El flujo de datos es unidireccional:

`Input de usuario -> SimulationEngine -> World State -> Render + UI`

Principios aplicados:

- La UI observa estado, pero no calcula fisica.
- El motor mantiene una unica fuente de verdad para la simulacion.
- La fisica esta aislada en funciones puras y modulos especificos.
- El renderer solo refleja el estado actual del mundo.

Documentacion detallada:

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Modelo fisico](./docs/PHYSICS.md)

## Modelo fisico resumido

La simulacion usa unidades normalizadas:

- `G = 1`
- `c = 1`
- `M = 1`

Con esta normalizacion:

- `r_s = 2GM / c^2`
- Distancia inicial del observador cercano: `60 r_s`
- Distancia del observador lejano: `100 r_s`

Fenomenos representados:

- Dilatacion temporal gravitacional
- Corrimiento gravitacional al rojo
- Lente gravitacional
- Esfera de fotones
- Aproximacion visual de spaghettification

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Validacion

Validaciones usadas durante el desarrollo reciente:

- `npm run build`
- `eslint` sobre `src` con el runtime empaquetado del entorno

## Notas tecnicas

Hay algunos archivos legacy o de compatibilidad que se mantienen por seguridad hasta una limpieza final:

- `src/physics/relativity.ts`
- `src/ui/panels/SidePanel/content/physicsCopy.ts`
- `src/ui/panels/tabs/*`

No forman parte del flujo principal actual, pero se conservaron para evitar rupturas de imports heredados.

## Proyeccion

Posibles siguientes pasos:

- Incorporar vistas de cabinas de cada nave espacial, visibles en primera persona para el usuario, arte visual hecho por mi. 
- Incorporar mas variables fisicas actualizables.
- Dividir el bundle 3D para reducir el chunk de `@react-three/drei`.
- Agregar pruebas unitarias a fisica y resolucion de regiones.
- Incorporar una documentacion visual con capturas o GIFs del simulador.
- Extender el modelo a agujeros negros rotantes como una fase posterior.
- Reducir el gasto de recorsos que pueda consumir la aplicacion, pues su objetivo es ser un programa relativamente liviano. 
