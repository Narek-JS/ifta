import {Button, CircularProgress} from "@mui/material";

export default function NormalBtn({
    onClick,
    className,
    children,
    loading,
    disabled,
    type
}) {

    return (
        <Button
            disabled={Boolean(loading) || Boolean(disabled)}
            onClick={onClick}
            className={`normalBtn ${className || ""}`}
            type={type || 'button'}
        >
            {loading ? <CircularProgress style={{ color: "white" }}/> : children}
        </Button>
    )
}