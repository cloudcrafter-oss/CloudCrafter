import type { UpdateStackGithubSettings } from './UpdateStackGithubSettings'
import type { UpdateStackGitPublicSettings } from './UpdateStackGitPublicSettings'

export type UpdateStackCommand = {
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
  gitPublicSettings?: UpdateStackGitPublicSettings | null
  /**
   * @type object | undefined
   */
  githubSettings?: UpdateStackGithubSettings | null
}