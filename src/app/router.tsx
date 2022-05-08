import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { RoutePath } from './router-config'
import Root from '../pages/public/root'
import NotFound from '../pages/error/not-found'
import Loading from '../pages/loading'

enum RouteType {
  GUEST = 'guest',
  PUBLIC = 'public',
  PRIVATE = 'private',
}

interface IRouteParams {
  Component: JSX.Element
  path: RoutePath
  type: RouteType
}

const routes: IRouteParams[] = [
  {
    Component: <Root />,
    path: RoutePath.ROOT,
    type: RouteType.PUBLIC,
  },
]

function Router() {
  return (
    <Suspense fallback={Loading()}>
    <BrowserRouter>
      <Routes>
        {routes.map(({ Component, path }) => (
          <Route key={path} path={path} element={Component} />
        ))}
        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>
  </Suspense>
  )
}

export default Router
