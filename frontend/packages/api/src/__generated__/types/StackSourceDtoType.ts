export const stackSourceDtoTypeEnum = {
  Git: 'Git',
  GithubApp: 'GithubApp',
} as const

export type StackSourceDtoTypeEnum = (typeof stackSourceDtoTypeEnum)[keyof typeof stackSourceDtoTypeEnum]

export type StackSourceDtoType = StackSourceDtoTypeEnum