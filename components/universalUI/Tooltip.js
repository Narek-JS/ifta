import classNames from "classnames";
import React, { useState } from "react";

const Tooltip = ({
  children,
  content,
  delay = 150,
  noteColor,
  ...props
}) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => setActive(true), delay);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className='tooltip-wrapper'
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      {...props}
    >
      {children}
      {active && (
        <div className="tooltip-note">
          <div className={classNames('tooltip-tip carrierTooltip', {
            'note-refound': noteColor === '1',
            'note-void': noteColor === '2',
            'note-dispute': noteColor === '3'
          })}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export { Tooltip };