import { z } from 'zod'

export const stackServiceVolumeTypeDtoSchema = z.enum(['LocalMount', 'DockerVolume'])