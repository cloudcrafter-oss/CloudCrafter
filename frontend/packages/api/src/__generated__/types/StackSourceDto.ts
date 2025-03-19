import type { GitApplicationSourceDto } from './GitApplicationSourceDto'
import type { GithubApplicationSourceDto } from './GithubApplicationSourceDto'
import type { StackSourceDtoType } from './StackSourceDtoType'

export type StackSourceDto = {
  type: StackSourceDtoType
  /**
   * @type object
   */
  git: GitApplicationSourceDto | null
  /**
   * @type object
   */
  githubApp: GithubApplicationSourceDto | null
}