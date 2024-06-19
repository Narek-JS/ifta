import { Fragment } from "react";

export const AnimationScuareBoxes = () => (
    <Fragment>
        <span />
        <span />
        <span />
        <span />
    </Fragment>
);

export const LeftTopCornerScuares = () => (
    <div className="squares first">
        <span className="largeSquare top" />
        <span className="smallSquare" />
        <span className="largeSquare left" />
    </div>
);

export const RightBottomCornerScuares = () => (
    <div className="squares last">
        <span className="largeSquare right" />
        <span className="smallSquare" />
        <span className="largeSquare bottom" />
    </div>
);

export const CenterSquares = ({ className = "" }) => (
    <div className={className}>
        <span className="largeSquare" />
        <span className="smallSquare" />
        <span className="largeSquare" />
    </div>
);