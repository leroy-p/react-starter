const common = {
  isLocal: process.env.REACT_APP_ENV === 'local',
}

export const appEnv = { ...common }
