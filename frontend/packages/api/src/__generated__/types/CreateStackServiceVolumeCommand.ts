import type { StackServiceVolumeTypeDto } from './StackServiceVolumeTypeDto'

export type CreateStackServiceVolumeCommand = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string, uuid
   */
  stackServiceId: string
  /**
   * @minLength 1
   * @type string
   */
  name: string
  type: StackServiceVolumeTypeDto
  /**
   * @type string
   */
  source: string | null
  /**
   * @minLength 1
   * @type string
   */
  target: string
}