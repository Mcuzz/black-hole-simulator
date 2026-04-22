# Modelo Fisico

## Alcance

El simulador representa un agujero negro de Schwarzschild:

- no rotante
- sin carga
- esfericamente simetrico

La meta no es una simulacion astrophysica exhaustiva, sino una visualizacion educativa consistente y mantenible.

## Sistema de unidades

La implementacion usa unidades normalizadas para simplificar la simulacion:

- `G = 1`
- `c = 1`
- `M = 1`

Con esto se evita trabajar con magnitudes fisicas gigantescas y se mantiene estable la numerica en tiempo real.

Configuracion base:

- [simulationConfig.ts](../src/config/simulationConfig.ts)

## Radio de Schwarzschild

Ecuacion utilizada:

```text
r_s = 2GM / c^2
```

Implementacion:

- [schwarzschildPhysics.ts](../src/physics/schwarzschildPhysics.ts)

## Dilatacion temporal gravitacional

Se usa el factor:

```text
sqrt(1 - r_s / r)
```

Interpretacion:

- lejos del agujero negro, el factor se acerca a `1`
- cerca del horizonte, el factor tiende a `0`

En la simulacion:

- el reloj cercano acumula tiempo a una tasa menor que el reloj lejano
- el reloj lejano usa una escala visual estable para facilitar la comparacion

Actualizacion:

- [updateSimulation.ts](../src/physics/updateSimulation.ts)

## Corrimiento gravitacional al rojo

Se usa:

```text
1 / sqrt(1 - r_s / r)
```

Interpretacion:

- a mayor proximidad al horizonte, mayor redshift
- cerca del horizonte, el valor crece fuertemente

En la escena:

- la nave cercana cambia visualmente hacia tonos mas rojizos
- el efecto esta mapeado como feedback visual, no como espectroscopia real

## Lente gravitacional

El fondo estelar se distorsiona segun una intensidad derivada de:

```text
curvature ~= r_s / r
```

La implementacion convierte esa curvatura en un `lensingStrength` acotado para el shader del cielo.

Archivos relacionados:

- [gravitationalLensing.ts](../src/physics/gravitationalLensing.ts)
- [SkySphere.tsx](../src/render/environment/SkySphere.tsx)
- [GravitationalLensing.tsx](../src/render/effects/GravitationalLensing.tsx)

## Spaghettification

La simulacion usa una aproximacion visual controlada:

- no calcula fuerzas de marea completas
- estima un factor visual derivado de la cercania al horizonte
- estira visualmente la nave cercana a medida que cae

Esto se usa con fines expresivos y pedagogicos, no como simulacion estructural rigurosa del objeto.

## Regiones fisicas

El simulador clasifica la distancia radial en cuatro zonas:

- `safe`
- `strong`
- `photon-sphere`
- `horizon`

Umbrales actuales:

- `horizon`: `<= 1.12 r_s`
- `photon-sphere`: `<= 1.5 r_s`
- `strong`: `<= 5 r_s`
- `safe`: todo lo demas

Implementacion:

- [regionResolver.ts](../src/physics/regionResolver.ts)

## Observadores

El sistema compara dos marcos:

### Observador cercano

- nave interactiva
- puede cambiar su distancia radial objetivo
- su reloj propio se dilata
- su luz sufre redshift

### Observador lejano

- permanece fijo
- sirve como marco de referencia
- su reloj marca el tiempo comparativo del experimento

## Limites y simplificaciones

Para mantener rendimiento y claridad, el proyecto adopta varias simplificaciones:

- no simula geodesicas completas de particulas
- no modela un agujero negro de Kerr
- no hay dinamica orbital real de las naves
- el disco de acrecion es estilizado
- spaghettification y parte del lensing son aproximaciones visuales

Estas decisiones son deliberadas: el enfoque es educativo, interactivo y apropiado para navegador.

## Relacion con la UI

La UI muestra el estado fisico derivado, pero no calcula fisica.

Ejemplos:

- `Region`, `Distancia`, `Dilatacion` y `Redshift` se leen desde el estado global.
- Las ecuaciones del sidepanel muestran la formula activa segun la region actual.
- Los relojes presentan la divergencia temporal acumulada.

## Resumen

El modelo actual busca un equilibrio entre:

- consistencia conceptual
- feedback visual claro
- rendimiento en navegador
- arquitectura mantenible

Por eso la implementacion prioriza formulas base de Schwarzschild, regiones interpretables y efectos visuales que refuercen la lectura del experimento.
