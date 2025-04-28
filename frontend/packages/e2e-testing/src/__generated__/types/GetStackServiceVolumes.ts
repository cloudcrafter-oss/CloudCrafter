import type { StackServiceVolumeDto } from './StackServiceVolumeDto'

export type GetStackServiceVolumesPathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string, uuid
   */
  stackServiceId: string
}

/**
 * @description OK
 */
export type GetStackServiceVolumes200 = StackServiceVolumeDto[]

export type GetStackServiceVolumesQueryResponse = GetStackServiceVolumes200

export type GetStackServiceVolumesQuery = {
  Response: GetStackServiceVolumes200
  PathParams: GetStackServiceVolumesPathParams
  Errors: any
}