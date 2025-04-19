import type { ProjectDto } from './ProjectDto'

export type SimpleTeamWithProjectsAndEnvironmentsDto = {
  /**
   * @type string, uuid
   */
  id: string
  /**
   * @type string
   */
  name: string
  /**
   * @type array
   */
  projects: ProjectDto[]
}