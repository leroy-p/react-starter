import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '../app'

vi.mock('../pages/root', () => ({
  default: () => <div data-testid="route-root">Route Root</div>,
}))

vi.mock('../pages/error/not-found', () => ({
  default: () => <div data-testid="route-not-found">Route Not Found</div>,
}))

describe('App routes', () => {
  it('resolves "/" to the root route', async () => {
    window.history.replaceState({}, '', '/')

    render(<App />)

    expect(await screen.findByTestId('route-root')).toBeInTheDocument()
    expect(screen.queryByTestId('route-not-found')).not.toBeInTheDocument()
  })

  it('resolves unknown routes to the 404 route', async () => {
    window.history.replaceState({}, '', '/unknown-route')

    render(<App />)

    expect(await screen.findByTestId('route-not-found')).toBeInTheDocument()
    expect(screen.queryByTestId('route-root')).not.toBeInTheDocument()
  })
})
