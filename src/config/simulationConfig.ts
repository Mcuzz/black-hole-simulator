/**
 * simulationConfig.ts
 * 
 * Este archivo contiene todas las constantes físicas y
 * parámetros globales de la simulación.
 * 
 * Mantener estos valores centralizados evita números mágicos
 * distribuidos por el código.
 */

export const SIMULATION_CONFIG = {

    /**
     * Velocidad de la simulación respecto al tiempo real.
     * 1 = tiempo real
     * >1 = simulación acelerada
     */
    simulationSpeed: 1,

    /**
     * Masa del agujero negro (unidades normalizadas)
     * 
     * En esta simulación no usamos kg reales.
     * Todo se escala relativo al radio de Schwarzschild.
     */
    blackHoleMass: 1,

    /**
     * Constante gravitacional (normalizada).
     */
    G: 1,

    /**
     * Velocidad de la luz (normalizada).
     */
    C: 1,

    /**
     * Distancia inicial del observador cercano
     * medida en radios de Schwarzschild.
     */
    initialNearObserverDistance: 60,

    /**
     * Distancia del observador lejano
     * permanece fija durante la simulación.
     */
    farObserverDistance: 100,

    /**
     * Límite mínimo permitido para acercarse al centro.
     * Evita valores inestables numéricamente.
     */
    minimumRadius: 0.1,

    /**
     * Umbrales pedagógicos/visuales para los estados del panel.
     *
     * No son los valores relativistas exactos; están desplazados para que
     * la lectura del fenómeno coincida mejor con lo que vemos en escena.
     */
    regionThresholds: {
        strongGravityDistance: 65.92,
        photonSphereDistanceRs: 5,
        horizonDistanceRs: 4.5,
    },

    /**
     * Radios visuales usados para mapear distancias físicas a la escena.
     * Esto separa "qué tan lejos está físicamente" de "qué tan lejos
     * conviene verlo" para que la nave no parezca tragada demasiado pronto.
     */
    visualDistanceStops: {
        horizonRadius: 3.45,
        photonSphereRadius: 4.2,
        strongGravityRadius: 8.4,
        farFieldRadius: 13.4,
    },

}
