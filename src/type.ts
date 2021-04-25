import { IStringifyOptions } from 'qs'

declare module '@savchenko91/rc-redux-api-mw/dist/type.d' {
  type ActionName = 'endAction' | 'APIAction'

  export interface APIAction<
    ResponseBody = unknown,
    RequestBody = unknown,
    Payload = unknown,
    DispatchReturns extends ActionName = 'APIAction'
  > extends Omit<RequestInit, 'headers' | 'body'> {
    url: string
    type: string
    returnResponse?: boolean
    headers?: APIHeaders
    body?: RequestBody
    dispatchReturns?: DispatchReturns
    responseBodyType?: ResponseBodyType
    stageActionTypes: StageActionTypes
    onStart?: OnStart<ResponseBody, RequestBody, Payload>
    onSuccess?: OnSuccess<ResponseBody, RequestBody, Payload>
    onFail?: OnFail<ResponseBody, RequestBody, Payload>
    payload?: Payload
    fakeResponse?: Response
    fakeResponseTimeout?: number
  }
}
