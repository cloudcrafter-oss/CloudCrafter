import type { CreateProjectCommand } from './CreateProjectCommand'
import type { ProjectDto } from './ProjectDto'

/**
 * @description OK
 */
export type CreateProject200 = ProjectDto

export type CreateProjectMutationRequest = CreateProjectCommand

export type CreateProjectMutationResponse = CreateProject200

export type CreateProjectMutation = {
  Response: CreateProject200
  Request: CreateProjectMutationRequest
  Errors: any
}