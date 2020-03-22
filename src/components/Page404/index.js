import React from 'react'
import styles from './styles.module.scss'

function Page404(props) {
  return (
    <div className={`component-container ${styles.container}`}>
      <h1>{'404'}</h1>
      <h3>{'or'}</h3>
      <h3>{'Page under constructions'}</h3>
    </div>
  )
}

export default Page404
