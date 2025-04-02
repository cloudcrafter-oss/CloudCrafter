import type { StackServiceVolumeType } from './StackServiceVolumeType'

export type UpdateStackServiceVolumeCommand = {
  /**
   * @type string, uuid
   */
  id: string
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
  /**
   * @type integer
   */
  type: StackServiceVolumeType
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