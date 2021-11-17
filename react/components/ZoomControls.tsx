import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import PlusIcon from '../assets/icons/plus_icon.svg'
import MinusIcon from '../assets/icons/minus_icon.svg'
import styles from './ZoomControls.css'
import { SIDEBAR } from '../constants'
import { useModalState } from '../modalStateContext'
import { useMaps } from './GoogleMap'

interface Props {
  shouldShow?: boolean
  isLargeScreen?: boolean
}

const ZoomControls: React.FC<Props> = ({
  shouldShow = false,
  isLargeScreen = false,
}) => {
  const { activeState } = useModalState()
  const { onZoomIn, onZoomOut } = useMaps()

  const [root, setRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setRoot(document.getElementById('controls-wrapper'))
  }, [])

  if (root == null) {
    return null
  }

  return ReactDOM.createPortal(
    <div
      className={`${styles.zoomWrapper} ${
        shouldShow && activeState === SIDEBAR && isLargeScreen
          ? ''
          : styles.hide
      }`}
    >
      <button
        className={`pkpmodal-zoom-in ${styles.zoomIn}`}
        type="button"
        onClick={onZoomIn}
      >
        <img src={PlusIcon} alt="plus icon" />
      </button>
      <hr className={styles.hr} />
      <button
        className={`pkpmodal-zoom-out ${styles.zoomOut}`}
        type="button"
        onClick={onZoomOut}
      >
        <img src={MinusIcon} alt="minus icon" />
      </button>
    </div>,
    root
  )
}

ZoomControls.propTypes = {
  shouldShow: PropTypes.bool,
  isLargeScreen: PropTypes.bool,
}

export default ZoomControls
