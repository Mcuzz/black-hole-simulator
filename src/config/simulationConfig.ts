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
    minimumRadius: 0.1

}