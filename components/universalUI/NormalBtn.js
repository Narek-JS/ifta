import { Button, CircularProgress } from "@mui/material";
import classNames from "classnames";

export default function NormalBtn({
    onClick,
    className,
    children,
    loading,
    disabled,
    type = 'button'
}) {
    const isDisabled = Boolean(loading) || Boolean(disabled);

    return (
        <Button
            disabled={isDisabled}
            onClick={onClick}
            className={classNames('normalBtn', { [className]: className })}
            type={type}
        >
            { loading ? (
                <CircularProgress style={{ color: "white" }} /> 
            ) : (
                children
            )}
        </Button>
    );
};