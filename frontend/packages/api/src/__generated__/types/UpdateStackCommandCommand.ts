import type { GithubSettings } from './GithubSettings'
import type { GitPublicSettings } from './GitPublicSettings'

export type UpdateStackCommandCommand = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string
   */
  name?: string | null
  /**
   * @type string
   */
  description?: string | null
  /**
   * @type object | undefined
   */
  gitPublicSettings?: GitPublicSettings | null
  /**
   * @type object | undefined
   */
  githubSettings?: GithubSettings | null
}