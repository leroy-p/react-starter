import React from 'react'
import { Trans } from '@lingui/react'

import Layout from '../../layout/public'

function NotFound() {
  return (
    <Layout>
      <p><Trans id="not-found.title" /></p>
    </Layout>
  )
}

export default NotFound