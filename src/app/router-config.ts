import { generatePath } from 'react-router-dom'

export function generateRoutePath<T extends keyof IRoutePathParams>(path: T, params: IRoutePathParams[T]) {
  return generatePath(path, params)
}

export enum RoutePath {
  ROOT = '/',
}

export interface IRoutePathParams {
  [RoutePath.ROOT]: {}
}