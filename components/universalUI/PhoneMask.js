import {forwardRef} from "react";
import {IMaskInput} from "react-imask";

const TextMaskCustom = forwardRef(function TextMaskCustom(props, ref) {
    const {onChange, ...other} = props;
    return (
        <IMaskInput
            {...other}
            mask="(#00) 000-0000"
            definitions={{
                "#": /[1-9]/
            }}
            inputRef={ref}
            onChange={onChange}
            onAccept={(value) => onChange({target: {name: props?.name, value}})}
            overwrite
        />
    );
});

export default TextMaskCustom;