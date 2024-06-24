import { IMaskInput } from "react-imask";
import { forwardRef } from "react";

const TextMaskCustom = forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;

    // Function to handle the accept event from IMaskInput.
    const handleAccept = (value) => {
        // Trigger the onChange event passed from props with the new value.
        onChange({ target: { name: props?.name, value } })
    };

    return (
        <IMaskInput
            {...other}
            mask="(#00) 000-0000"
            definitions={{ "#": /[1-9]/ }} // Defining the custom pattern for the mask
            inputRef={ref}
            onChange={onChange}
            onAccept={handleAccept}
            overwrite
        />
    );
});

export default TextMaskCustom;