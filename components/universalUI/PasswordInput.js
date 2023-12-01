import React from "react";
import InputField from "./InputField";

const PasswordInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  ...otherProps
}) => {
  const formatPassword = (value) => {
    if (value) {
      const digits = value.replace(/\D/g, ""); // Remove non-digit characters
      const maskedValue = "***-**-" + digits.slice(-4); // Add dashes and mask the value
      return maskedValue;
    }
    return value;
  };

  const handleChange = (event) => {
    const formattedValue = formatPassword(event.target.value);
    onChange(formattedValue);
  };

  return (
    <InputField
      type="password"
      value={formatPassword(value)}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      {...otherProps}
    />
  );
};

export default PasswordInput;