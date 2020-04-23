import React from 'react'

import css from './footer.module.css'

const Footer = () => (
  <div className={css.outer}>
    <footer className={css.inner}>
      <p>
        Copyleft <span className={css.copyleft}>©</span> DL Ford 2020
      </p>
    </footer>
  </div>
)

export default Footer
