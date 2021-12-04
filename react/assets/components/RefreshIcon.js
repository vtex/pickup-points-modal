import React, { PureComponent } from 'react'

class RefreshIcon extends PureComponent {
  render() {
    const { classes } = this.props

    return (
      <svg
        className={classes}
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.094 6.211L13.555 0L11.625 1.93C10.353 0.812 8.71 0.18 7 0.18C3.14 0.18 0 3.32 0 7.18C0 11.04 3.14 14.18 7 14.18C9.491 14.18 11.814 12.839 13.063 10.681L11.332 9.68C10.439 11.222 8.779 12.18 7 12.18C4.243 12.18 2 9.937 2 7.18C2 4.423 4.243 2.18 7 2.18C8.179 2.18 9.311 2.603 10.205 3.35L7.883 5.672L14.094 6.211Z"
          fill="#347EDD"
        />
      </svg>
    )
  }
}

export default RefreshIcon
