import { PasswordEyeClose, PasswordEyeOpen } from "@/public/assets/svgIcons/passwordEye";
import { forwardRef, useState } from "react";
import classNames from "classnames";

const InputField = forwardRef(function ({
    className,
    element,
    onBlur,
    value,
    onChange,
    onFocus,
    maxLength,
    label,
    placeholder,
    id,
    name,
    error,
    required,
    type,
    disabled,
    params,
    eye,
    autoComplete = 'off',
    width,
    defaultValue = '',
    onClick = () => {},
    loading,
    toogleIsOpenLeatter, // Function to toggle the visibility of the password letters.
    mobileLableWrap, // Flag to enable wrapping of label text on mobile devices.
    ...props
}, ref) {
    const [show, setShow] = useState(false);

    // Function to toggle password visibility.
    const togglePasswordVisibility = () => {
        setShow(!show);

        // Invoking the function to toggle password letter visibility if provided.
        toogleIsOpenLeatter && toogleIsOpenLeatter();
    };

    return (
        <div className={classNames('inputField', className, {
            additional: element || type === 'password',
            widthFull: width === 'full',
        })}>
            <label onClick={onClick}>
                {/* Label section */}
                <p className={classNames("helper mb5 bold500 font16 line24 flex white-space-nowrap", {
                    'white-space-wrap-mobile': mobileLableWrap 
                })}>
                    {label}

                    {/* Displaying required indicator if 'required' prop is true */}
                    {required && (
                        <sup className="red font16">*</sup>
                    )}
                </p>

                {/* Input element */}
                {element || (
                    <input
                        {...((Boolean(defaultValue) && !Boolean(value)) && { defaultValue })}
                        autoComplete={autoComplete}
                        type={type === "password" ? show ? "text" : "password" : type}
                        value={value}
                        onChange={onChange}
                        onFocus={onFocus}
                        maxLength={maxLength || params?.maxLength || 50}
                        ref={ref}
                        id={id}
                        onBlur={onBlur}
                        name={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...params}
                        {...props}
                    />
                )}

                {/* Password visibility toggle icon */}
                {(type === "password" || eye) && (
                    <div className="showIcon" onClick={togglePasswordVisibility}>
                        { show ? <PasswordEyeOpen /> : <PasswordEyeClose /> }
                    </div>
                )}

                {/* Error message display */}
                <p className="err-message">{error}</p>
            </label>
        </div>
    );
});

export default InputField;