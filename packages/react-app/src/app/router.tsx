import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { RoutePath } from './router-config'
import NotFound from '../pages/error/not-found'
import Loading from '../pages/loading/loading'
import Root from '../pages/root'
import Page from './page'

interface IRouteParams {
  component: React.ReactNode
  path: RoutePath
  pageKey?: string
}

const routes: IRouteParams[] = [
  {
    component: <Root />,
    path: RoutePath.ROOT,
    pageKey: 'root',
  },
]

export default function Router() {
  return (
    <Suspense fallback={Loading()}>
      <BrowserRouter>
        <Routes>
          {routes.map(({ component, path, pageKey }) => (
            <Route element={<Page children={component} pageKey={pageKey} />} key={path} path={path} />
          ))}
          <Route element={<Page children={<NotFound />} pageKey="not-found" />} path="*" />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}
