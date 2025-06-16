const common = {
  isLocal: process.env.VITE_APP_ENV === 'local',
}

export const appEnv = { ...common }
