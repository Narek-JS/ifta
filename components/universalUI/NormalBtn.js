import {Button, CircularProgress} from "@mui/material";

export default function NormalBtn({
    onClick,
    className,
    children,
    loading,
    disabled
}) {

    return (
        <Button
            disabled={loading || disabled}
            onClick={onClick}
            className={`normalBtn ${className || ""}`}
        >
            {loading ? <CircularProgress style={{ color: "white" }}/> : children}
        </Button>
    )
}