const common = {
  isLocal: import.meta.env.VITE_APP_ENV === 'local',
}

export const appEnv = { ...common }
