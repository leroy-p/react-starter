export function generateRoutePath<T extends keyof IRoutePathParams>(path: T, params: IRoutePathParams[T]) {
  if (path.toString() === '/') return path

  const splittedPath = path.split('/').slice(1)
  let result = ''

  for (const segment of splittedPath) {
    if (segment.startsWith(':')) {
      const key = segment.slice(1) as keyof typeof params

      if (params[key]) {
        result += `/${params[key]}`
      }
    } else {
      result += `/${segment}`
    }
  }

  return result
}

export enum RoutePath {
  ROOT = '/',
}

export interface IRoutePathParams {
  [RoutePath.ROOT]: {}
}
