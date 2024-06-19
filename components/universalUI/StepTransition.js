import classNames from "classnames";

export const StepTransition = ({ className, style }) => (
    <div className={classNames('stepTransition', { [className]: className })}>
        <span>◼</span>
        <div {...(style && { style: { ...style } })} />
        <span>▼</span>
    </div>
);