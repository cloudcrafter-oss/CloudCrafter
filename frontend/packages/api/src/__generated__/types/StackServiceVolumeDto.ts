import type { StackServiceVolumeType } from './StackServiceVolumeType'

export type StackServiceVolumeDto = {
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
  sourcePath: string | null
  /**
   * @type string
   */
  destinationPath: string
  /**
   * @type integer
   */
  type: StackServiceVolumeType
}