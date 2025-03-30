import type { EntityHealthDto } from './EntityHealthDto'

export type DeployedStackDto = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string
   */
  name: string
  /**
   * @type object
   */
  health: EntityHealthDto
}