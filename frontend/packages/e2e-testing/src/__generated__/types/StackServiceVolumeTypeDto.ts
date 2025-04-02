export const stackServiceVolumeTypeDtoEnum = {
  LocalMount: 'LocalMount',
  DockerVolume: 'DockerVolume',
} as const

export type StackServiceVolumeTypeDtoEnum = (typeof stackServiceVolumeTypeDtoEnum)[keyof typeof stackServiceVolumeTypeDtoEnum]

export type StackServiceVolumeTypeDto = StackServiceVolumeTypeDtoEnum