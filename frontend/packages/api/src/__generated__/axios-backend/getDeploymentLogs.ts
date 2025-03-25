import client from '@cloudcrafter/client-auth/clients'
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from '../types/GetDeploymentLogs'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

export function getGetDeploymentLogsUrl(deploymentId: GetDeploymentLogsPathParams['deploymentId']) {
  return `/api/Stacks/deployments/${deploymentId}/logs` as const
}

/**
 * {@link /api/Stacks/deployments/:deploymentId/logs}
 */
export async function getDeploymentLogs(
  deploymentId: GetDeploymentLogsPathParams['deploymentId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetDeploymentLogsQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetDeploymentLogsUrl(deploymentId).toString(),
    ...requestConfig,
  })
  return res.data
}