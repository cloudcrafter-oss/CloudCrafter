import { ProjectEnvironmentRouteParams, validateRouteParams } from '@/src/utils/routes/schemas.ts'

interface PageProps {
    params: ProjectEnvironmentRouteParams;
}

export default function ProjectEnvironmentPage({ params }: PageProps) {
    // Validate the route params
    const validatedParams = validateRouteParams(params)

    return (
        <div>
            <h1>Project Environment Page</h1>
            <p>Project UUID: {validatedParams['project-uuid']}</p>
            <p>Environment UUID: {validatedParams['environment-uuid']}</p>
        </div>
    )
}