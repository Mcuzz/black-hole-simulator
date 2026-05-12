# Interactive Schwarzschild Black Hole Simulator

Simulador interactivo en navegador para visualizar efectos relativistas cerca de un agujero negro de Schwarzschild. El proyecto combina una escena 3D inmersiva, un modelo fisico simplificado pero consistente y una capa educativa que explica en tiempo real conceptos como dilatacion temporal, corrimiento gravitacional al rojo, lente gravitacional, disco de acrecion y spaghettification visual.

## Objetivo del proyecto

Este repositorio fue construido como una pieza de portafolio tecnico y visual con cuatro metas claras:

1. Separar fisica, motor, render y UI para evitar acoplamiento innecesario.
2. Mostrar relatividad general de forma interpretable en tiempo real dentro del navegador.
3. Mantener una base de codigo legible y extensible para nuevas vistas, fenomenos y objetos.
4. Cuidar la presentacion audiovisual sin perder rendimiento ni claridad arquitectonica.

## Estado actual

El simulador incluye actualmente:

- Pantalla de inicio interactiva.
- Escena 3D a pantalla completa con agujero negro, disco de acrecion, campo estelar y dos naves.
- Selector de vistas entre observador externo, cercano y lejano.
- Panel lateral con control de trayectoria y pestanas tematicas.
- Panel de estado con region fisica y distancia actual.
- Dos relojes comparativos para mostrar la divergencia temporal entre observadores.
- Modelo fisico desacoplado del renderer.
- Efectos visuales derivados de relatividad sin mezclar calculo fisico con React.

## Stack y tecnologias

### Base de aplicacion

- `React 19`: composicion de la interfaz, overlays y panel lateral.
- `TypeScript`: tipado del estado, del motor y de los contratos entre capas.
- `Vite`: servidor de desarrollo y empaquetado.
- `ESLint`: validacion estatica del codigo.

### Escena 3D

- `Three.js`: primitives, materiales, texturas, luces y camaras.
- `@react-three/fiber`: puente declarativo e imperativo entre React y Three.js.
- `@react-three/drei`: utilidades de escena como `Stars` y `OrbitControls`.

### Tecnicas visuales usadas

- `CanvasTexture` para generar halo y sombra del agujero negro de manera procedural.
- `ShaderMaterial` custom para lente gravitacional en la esfera celeste.
- Shader GLSL para el disco de acrecion con ruido procedural, temperatura aproximada y coloracion tipo blackbody.
- Textura `blackbody.png` como lookup table para colorear el disco de acrecion.
- Mapeo no lineal de distancias fisicas a radios visibles para mantener legibilidad visual.

### Estrategias de arquitectura y funcionamiento

- Estado mutable central en `SimulationEngine` y snapshots inmutables para React.
- `useSyncExternalStore` para suscribir la UI al estado del motor sin acoplarla a la fisica.
- `useFrame` para actualizar simulacion y elementos visuales por frame.
- Capas separadas para configuracion, estado, motor, fisica, render y UI.
- Unidades normalizadas (`G = 1`, `c = 1`, `M = 1`) para mantener la numerica simple y estable.
- Uso de `memo` en el viewport 3D para reducir reconciliaciones de React sobre el `Canvas`.
- Interaccion por intencion: la UI pide una distancia objetivo y el motor decide como aplicarla con clamps e interpolacion.

## Flujo general

```text
Usuario
  -> UI / overlays / panel lateral
  -> SimulationEngine
  -> updateSimulation(...)
  -> updateRelativisticEffects(...)
  -> snapshot del estado
  -> React + renderer actualizan representacion
```

## Experiencia de usuario

Flujo principal:

1. El usuario entra con clic o tecla `Space`.
2. La escena se muestra como fondo completo.
3. El panel lateral permite mover la nave cercana radialmente.
4. Los overlays muestran vista activa, estado general y relojes comparativos.
5. Las pestanas del panel desarrollan explicaciones y ecuaciones del fenomeno activo.

Controles disponibles:

- `Space` o clic: entrar al simulador.
- Botones de vista: cambiar entre `Vista principal`, `Observador cercano` y `Observador lejano`.
- Slider radial: modificar la distancia objetivo de la nave cercana.
- Botones `-0.5 r_s` y `+0.5 r_s`: mover la nave por incrementos fijos.
- Arrastre directo de la nave cercana: modificar su distancia objetivo desde la escena.
- Botones `?` y ocultar/mostrar: desplegar ayuda o limpiar overlays.

## Modelo fisico resumido

La simulacion representa un agujero negro de Schwarzschild:

- no rotante
- sin carga
- con simetria esferica

Variables base:

- `G = 1`
- `c = 1`
- `M = 1`
- `r_s = 2GM / c^2`

Fenomenos representados:

- dilatacion temporal gravitacional
- corrimiento gravitacional al rojo
- lente gravitacional
- esfera de fotones
- clasificacion por regiones fisicas
- disco de acrecion estilizado
- spaghettification como aproximacion visual

## Estructura general del proyecto

```text
.
|-- docs/
|-- public/
|-- src/
|   |-- assets/
|   |-- config/
|   |-- core/
|   |-- engine/
|   |-- physics/
|   |-- render/
|   |-- simulation/          (reservado)
|   |-- systems/
|   |-- types/
|   `-- ui/
|-- index.html
|-- package.json
|-- tsconfig*.json
|-- vite.config.ts
`-- eslint.config.js
```

## Carpetas y utilidad

### `docs/`

- `ARCHITECTURE.md`: explica la separacion por capas y el flujo de datos.
- `PHYSICS.md`: resume el modelo fisico, sus ecuaciones y simplificaciones.

### `public/`

- `favicon.svg`: icono base de la aplicacion.
- `icons.svg`: sprite o recurso SVG auxiliar para iconografia.
- `textures/starmap_4k.jpg`: mapa estelar usado por el cielo de fondo.

### `src/assets/`

- `hero.png`: recurso grafico auxiliar para material visual del proyecto.
- `vite.svg`: asset heredado del scaffold inicial.

### `src/config/`

- `simulationConfig.ts`: constantes maestras del simulador. Define masa del agujero negro, distancias iniciales, umbrales por region y radios visuales del mapeo de distancia.

### `src/core/`

Responsabilidad: definir el dominio minimo compartido por motor, fisica y render.

#### `src/core/entities/`

- `Observer.ts`: interfaz conceptual para representar observadores del sistema.

#### `src/core/state/`

- `simulationState.ts`: define `Vector3`, `BlackHoleState`, `SpacecraftState`, `ClockState`, `PhysicsEffectsState` y `SimulationState`. Es el contrato principal de estado global.
- `createSimulation.ts`: crea el estado inicial completo de la simulacion, incluyendo posiciones visuales y efectos derivados de arranque.

#### `src/core/units/`

- `renderScale.ts`: contiene `BLACK_HOLE_VISUAL_RADIUS`, umbrales de distancia y el mapeo de distancias fisicas a radios visibles para la escena.

### `src/engine/`

Responsabilidad: coordinar el loop de simulacion y actuar como unica fuente de verdad viva.

- `simulationEngine.ts`: define la clase `SimulationEngine`.

Utilidad de `SimulationEngine`:

- guarda el estado mutable de la simulacion
- recibe intenciones de usuario como `setTargetDistance(...)`
- interpola la distancia objetivo de la nave cercana
- ejecuta `updateSimulation(dt)`
- genera snapshots seguros para React
- mantiene listeners para `useSyncExternalStore`

### `src/physics/`

Responsabilidad: implementar formulas, regiones fisicas y efectos derivados.

- `schwarzschildPhysics.ts`: funciones base como radio de Schwarzschild, dilatacion temporal, redshift, factor de spaghettification, temperatura de Hawking y glow asociado.
- `updateSimulation.ts`: actualiza tiempos propios y posiciones renderizadas a partir del estado y `dt`.
- `updateRelativisticEffects.ts`: recalcula region, lensing, redshift, dilatacion y efectos secundarios a partir de la distancia actual.
- `regionResolver.ts`: decide si la nave esta en `safe`, `strong`, `photon-sphere` u `horizon`; tambien expone umbrales en unidades de `r_s`.
- `gravitationalLensing.ts`: convierte proximidad y curvatura en una intensidad visual utilizable por shaders.
- `relativity.ts`: capa heredada de compatibilidad para formulas reutilizadas por codigo antiguo.

### `src/render/`

Responsabilidad: convertir el estado en escena 3D y mantener la integracion con Three.js.

#### `src/render/context/`

- `SimulationContext.tsx`: contexto React para compartir la instancia del motor.
- `SimulationProvider.tsx`: crea una unica instancia de `SimulationEngine` y la inyecta a la aplicacion.

#### `src/render/hooks/`

- `useSimulationEngine.ts`: hook para recuperar el motor desde contexto.
- `useSimulationState.ts`: hook basado en `useSyncExternalStore` que devuelve snapshots del estado.

#### `src/render/scene/`

- `SimulationScene.tsx`: arma la escena completa y ejecuta `engine.step(delta)` en cada frame.
- `SceneCameraRig.tsx`: gestiona la camara segun la vista activa y controla `OrbitControls` en modo externo.

#### `src/render/environment/`

- `SkySphere.tsx`: esfera celeste con textura estelar y shader de lente gravitacional.

#### `src/render/effects/`

- `GravitationalLensing.tsx`: registra o define el material shader custom usado por el cielo.

#### `src/render/objects/`

- `BlackHole.tsx`: representa el agujero negro con esfera central, halo fotonico y sombra billboard procedural.
- `AccretionDisk.tsx`: monta las capas del disco de acrecion, aplica textura blackbody y actualiza el tiempo del shader.
- `Spacecraft.tsx`: dibuja las naves cercana y lejana, aplica cambios de color por redshift, stretch por spaghettification y drag interactivo para la nave cercana.
- `PhotonSphere.tsx`: objeto auxiliar para representar la esfera de fotones cuando se usa.
- `HawkingParticles.tsx`: sistema de particulas estilizado para sugerir radiacion de Hawking.

#### `src/render/objects/accretionDisk/`

- `config.ts`: define `AccretionDiskLayerConfig`, capas del disco, densidades, radios y velocidades de rotacion.
- `mesh.ts`: crea y destruye las mallas por capas del disco.
- `material.ts`: fabrica materiales shader, aplica textura blackbody y actualiza uniformes temporales.
- `shaders.ts`: vertex y fragment shader del disco de acrecion.
- `useBlackbodyTexture.ts`: hook para cargar y configurar la textura de blackbody.
- `textures/blackbody.png`: lookup texture para coloracion termica.

#### `src/render/materials/`

- Carpeta reservada para materiales futuros. Actualmente no contiene archivos activos.

### `src/simulation/`

- Carpeta reservada para posibles modulos futuros de simulacion avanzada. Actualmente esta vacia.

### `src/systems/`

- `inputMapping.ts`: helper para convertir inputs normalizados a distancia fisica.

### `src/types/`

- `r3f.d.ts`: declaracion de tipos para extender JSX de React Three Fiber con materiales custom.

### `src/ui/`

Responsabilidad: toda la capa de experiencia de usuario y contenido educativo.

#### `src/ui/content/`

- `simulationCopy.ts`: centraliza textos de vistas, regiones, etiquetas y ayudas cortas.

#### `src/ui/layout/`

- `SplashScreen.tsx`: pantalla de inicio con entrada por clic o teclado.
- `AppHeader.tsx`: barra superior heredada o alternativa, no usada por el layout principal actual pero conservada como referencia.

#### `src/ui/overlays/`

- `SceneOverlay.tsx`: compone los overlays flotantes activos sobre la escena.

##### `src/ui/overlays/components/`

- `OverlayDock.tsx`: selector de vistas y texto contextual asociado.
- `StatusPanel.tsx`: resumen corto de region y distancia actual.

#### `src/ui/panels/`

- `ClockPanel.tsx`: reloj analogico para tiempo propio de cada observador.

##### `src/ui/panels/controlPanel/`

- `ControlPanel.tsx`: panel de control legado o alternativo para trayectoria; actualmente no es la superficie principal porque la version activa vive dentro del `SidePanel`.

##### `src/ui/panels/SidePanel/`

- `SidePanel.tsx`: panel lateral principal. Orquesta control, pestanas y contenido educativo.
- `index.ts`: punto de export del panel.

###### `src/ui/panels/SidePanel/hooks/`

- `usePhysicsMetrics.ts`: transforma `SimulationState` en metricas derivadas listas para UI.

###### `src/ui/panels/SidePanel/logic/`

- `narrativeEngine.tsx`: genera lectura narrativa segun region, dilatacion y redshift.

###### `src/ui/panels/SidePanel/content/`

- `physicsCopy.ts`: archivo heredado de contenido o compatibilidad textual.

###### `src/ui/panels/SidePanel/utils/`

- `visualMapping.ts`: helper heredado para mapear distancia a intensidad visual.

###### `src/ui/panels/SidePanel/components/`

- `NarrativeSection.tsx`: narrativa contextual de lo que esta ocurriendo.
- `ControlSection.tsx`: seccion de control radial heredada o alternativa.
- `TelemetrySection.tsx`: metricas en vivo con interpretacion.
- `EquationsSection.tsx`: ecuaciones activas segun fenomeno y region.
- `HawkingSection.tsx`: bloque explicativo sobre radiacion de Hawking.
- `types/panelTypes.ts`: tipos compartidos por secciones del panel.

###### `src/ui/panels/SidePanel/tabs/`

- `tabRegistry.ts`: registro de pestanas activas y sus componentes.
- `types.ts`: define `TabId` y `PhenomenonTabProps`.
- `RedshiftTab.tsx`: explica y cuantifica el corrimiento gravitacional al rojo.
- `LensingTab.tsx`: describe el comportamiento de la lente gravitacional.
- `HawkingTab.tsx`: presenta radiacion de Hawking y escalas asociadas.
- `AccretionTab.tsx`: explica disco de acrecion, ISCO, masa y densidad de referencia.
- `PhotonSphereTab.tsx`: describe la esfera de fotones y sus implicaciones visuales.

###### `src/ui/panels/SidePanel/tabs/shared/`

- `TrajectoryControl.tsx`: control activo de trayectoria integrado al `SidePanel`.
- `PhenomenonHero.tsx`: cabecera editorial para cada pestana.
- `EquationCard.tsx`: tarjeta reutilizable para formulas, variables y valores.
- `FormulaText.tsx`: contenedor tipografico para formulas matematicas.

##### `src/ui/panels/tabs/`

- `TabTheory.tsx`
- `TabAstronautNear.tsx`
- `TabAstronautFar.tsx`

Estas piezas pertenecen a una iteracion anterior del panel y se mantienen como legado para evitar roturas mientras el proyecto evoluciona.

#### `src/ui/state/`

- `useViewState.ts`: maneja vista activa y visibilidad de overlays locales.

## Archivos raiz y utilidad

- `src/App.tsx`: composicion principal de la aplicacion. Monta el `Canvas`, el overlay y el panel lateral.
- `src/main.tsx`: punto de entrada de React; aplica `SimulationProvider` y monta `App`.
- `src/styles.css`: sistema visual global de la aplicacion y layout responsive.
- `index.html`: shell HTML base para Vite.
- `package.json`: scripts y dependencias del proyecto.
- `package-lock.json`: versionado exacto del arbol de dependencias.
- `vite.config.ts`: configuracion del build y entorno de Vite.
- `eslint.config.js`: reglas de lint.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: configuracion TypeScript.
- `.gitignore`: exclusiones de control de versiones.

## Estrategias de implementacion destacadas

### 1. Separacion fuerte entre UI y fisica

La UI nunca calcula relatividad directamente. Solo lee `SimulationState` o dispara intenciones como cambiar la distancia objetivo.

### 2. Motor central con snapshots

El motor mantiene el estado real mutable por rendimiento, pero React consume snapshots clonados para mantener una API segura y predecible.

### 3. Render imperativo controlado

Los objetos 3D criticos usan `useFrame` para modificar materiales, escalas y posiciones directamente sobre refs, evitando reconciliacion excesiva de React.

### 4. Distancias fisicas y distancias visuales desacopladas

El proyecto no usa la distancia fisica cruda como posicion visible. En su lugar usa un mapeo por tramos para que el horizonte sea legible y la escena siga siendo comprensible.

### 5. Shader custom para disco y lensing

Los efectos visuales mas costosos o continuos se resuelven en GPU mediante shaders dedicados, en vez de recomputar grandes volumenes de geometria en CPU.

### 6. Interfaz analogica y overlays modulables

La UI esta pensada como un tablero de observacion. Cada overlay se puede ocultar de forma localizada y el panel lateral sirve como bitacora activa del experimento.

### 7. Optimizaciones recientes

- Memoizacion del viewport 3D para reducir re-render de `Canvas`.
- Drag de la nave cercano resuelto con refs en lugar de estado React por evento.
- Estilo visual replanteado para usar menos efectos de blur y menos capas costosas.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Validacion recomendada

Durante cambios de arquitectura, UI o render:

```bash
npm run lint
npm run build
```

## Documentacion adicional

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Modelo fisico](./docs/PHYSICS.md)

## Limitaciones actuales

- No hay geodesicas completas ni mecanica orbital real.
- El agujero negro sigue siendo de Schwarzschild, no de Kerr.
- Parte de los efectos son pedagogicos y no astrofisicamente exhaustivos.
- Existen carpetas y modulos legacy preservados por compatibilidad.

## Posibles siguientes pasos

- dividir mejor el bundle 3D
- agregar pruebas unitarias para fisica y resolucion de regiones
- limpiar piezas legacy cuando dejen de ser necesarias
- incorporar cabinas en primera persona con arte propio
- extender el modelo a agujeros negros rotantes
- seguir reduciendo costo visual y de CPU para equipos modestos
