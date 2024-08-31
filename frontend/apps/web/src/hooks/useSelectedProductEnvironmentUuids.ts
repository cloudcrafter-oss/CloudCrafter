import { useParams } from 'next/navigation'

export const useSelectedProductEnvironmentUuids = () => {
    const params = useParams()
    const { 'project-uuid': projectUuid, 'environment-uuid': environmentUuid } = params

    return { projectUuid, environmentUuid }
}