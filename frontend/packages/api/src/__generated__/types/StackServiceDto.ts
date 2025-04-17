import type { EntityHealthDto } from './EntityHealthDto'
import type { StackServiceHealthcheckConfigurationDto } from './StackServiceHealthcheckConfigurationDto'
import type { StackServiceHttpConfigurationDto } from './StackServiceHttpConfigurationDto'
import type { StackServiceVolumeDto } from './StackServiceVolumeDto'

export type StackServiceDto = {
  /**
   * @type string, uuid
   */
  id: string
  /**
   * @type string
   */
  name: string
  /**
   * @type string
   */
  description: string | null
  /**
   * @type object
   */
  httpConfiguration: StackServiceHttpConfigurationDto | null
  /**
   * @type object
   */
  healthcheckConfiguration: StackServiceHealthcheckConfigurationDto
  /**
   * @type object
   */
  health: EntityHealthDto
  /**
   * @type array
   */
  volumes: StackServiceVolumeDto[]
}