import React from 'react'

import * as css from './footer.module.css'

const Footer: React.FC = () => (
  <div className={css.outer}>
    <footer className={css.inner}>
      <p>
        Copyleft <span className={css.copyleft}>©</span> DL Ford 2020
      </p>
    </footer>
  </div>
)

export default Footer
