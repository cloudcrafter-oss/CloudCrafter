export const providerTypeEnum = {
  Unknown: 'Unknown',
  Github: 'Github',
} as const

export type ProviderTypeEnum = (typeof providerTypeEnum)[keyof typeof providerTypeEnum]

export type ProviderType = ProviderTypeEnum