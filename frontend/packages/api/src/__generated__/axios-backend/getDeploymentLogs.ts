import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from '../types/GetDeploymentLogs'

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