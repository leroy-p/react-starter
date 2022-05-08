import React from 'react'
import { Trans } from '@lingui/react'

import Layout from '../../../layout/public'

function Root() {  
  return (
    <Layout>
      <p><Trans id="root.title" /></p>
    </Layout>
  )
}

export default Root