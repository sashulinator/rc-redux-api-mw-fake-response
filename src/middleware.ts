import { Middleware, Dispatch } from 'redux'

import { APIAction } from '@savchenko91/rc-redux-api-mw'
import { onStage, getResponseBody, buildRequest } from '@savchenko91/rc-redux-api-mw/dist/helper'
import { StageFunctionName, Config } from '@savchenko91/rc-redux-api-mw/dist/type'

type FakeResponseConfig = {
  enabled: true
  timeout?: number
  reduxAPIMiddlewareConfig?: Config | null
}

const fakeResponseMiddleware = (config: FakeResponseConfig | null = null): Middleware<Dispatch<APIAction>> => {
  const reduxAPIMiddlewareConfig = config?.reduxAPIMiddlewareConfig || {}

  return (store) => (next) => async (action: APIAction) => {
    if (!(action?.fakeResponse instanceof Response) || !config?.enabled) {
      return next(action)
    }

    const abortController = { abort: () => {} } as AbortController

    const startActionParams = { action, abortController, store, config: reduxAPIMiddlewareConfig }

    try {
      onStage(StageFunctionName.onStart, startActionParams)

      const request = buildRequest(startActionParams)

      const response = await new Promise<Response>((resolve, reject) => {
        abortController.abort = () => {
          reject(new DOMException('The user aborted a request.'))
        }

        setTimeout(() => {
          if (action?.fakeResponse !== undefined) {
            resolve(action?.fakeResponse)
          }
        }, config?.timeout || action?.fakeResponseTimeout || 777)
      })

      const body = await getResponseBody(action, response)

      const endActionParams = { body, request, response, ...startActionParams }

      onStage(response.ok ? StageFunctionName.onSuccess : StageFunctionName.onFail, endActionParams)
    } catch (error) {
      const failActionParams = { error, ...startActionParams }

      onStage(StageFunctionName.onFail, failActionParams)

      throw error
    }

    return action
  }
}

export default fakeResponseMiddleware
