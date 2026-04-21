/**
 * Representa un observador dentro del espacio-tiempo
 * del sistema Schwarzschild.
 * 
 * Puede ser:
 * - Observador estático (referencia)
 * - Nave controlada por el usuario
 */

export interface Observer {

  id: string

  /**
   * Posición radial respecto al centro del agujero negro (metros)
   */
  r: number

  /**
   * Ángulo orbital (radianes)
   * Permite representar movimiento en plano orbital
   */
  theta: number

  /**
   * Velocidad radial (m/s)
   */
  radialVelocity: number

  /**
   * Velocidad angular (rad/s)
   */
  angularVelocity: number

    /**
   * Tiempo propio del observador
   */
  properTime: number

  /**
   * Define si el usuario controla esta entidad
   */
  controllable: boolean

}