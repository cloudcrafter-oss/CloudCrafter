import type { CreateStackServiceVolumeCommand } from './CreateStackServiceVolumeCommand'

export type PostCreateStackServiceVolumePathParams = {
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
 * @description Created
 */
export type PostCreateStackServiceVolume201 = any

export type PostCreateStackServiceVolumeMutationRequest = CreateStackServiceVolumeCommand

export type PostCreateStackServiceVolumeMutationResponse = PostCreateStackServiceVolume201

export type PostCreateStackServiceVolumeMutation = {
  Response: PostCreateStackServiceVolume201
  Request: PostCreateStackServiceVolumeMutationRequest
  PathParams: PostCreateStackServiceVolumePathParams
  Errors: any
}