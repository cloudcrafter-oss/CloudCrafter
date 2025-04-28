import type { StackServiceVolumeTypeDto } from './StackServiceVolumeTypeDto'

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
  type: StackServiceVolumeTypeDto
}