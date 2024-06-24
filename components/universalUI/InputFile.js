import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { setPopUp } from "@/store/slices/common";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { CarefullIcon } from "@/public/assets/svgIcons/CarefulIcon";
import UploadSvgIcon from "@/public/assets/svgIcons/UploadSvgIcon";
import classNames from "classnames";
import DeleteSvgIcon from "@/public/assets/svgIcons/DeleteSvgIcon";

const InputFile = forwardRef(function ({
    className,
    label,
    placeholder,
    fileName,
    exampleFilePath,
    required,
    resetFileName,
    element,
    name,
    error,
    disabled,
    ...inputProps
}, ref) {
    const dispatch = useDispatch();
    const { width } = useWindowSize();

    // Checking if the screen width is less than or equal to 1350px.
    const isTablate = width <= 1350;

    // Checking if the className includes 'memberFile'.
    const isMemberFile = String(className).includes('memberFile');

    // Function to toggle showing the example file popup.
    const toogleShowExampleFile = () => dispatch(setPopUp({
        popUp: 'exampleFile',
        popUpContent: {
            imagePath: exampleFilePath,
            title: label + ' Simple'
        }
    }));

    return (
        <div className={classNames('inputFile', {
            [className]: className,
            disabled: disabled,
            selected: fileName 
        })}>
            <div className="flexBetween alignCenter gap5 mb10 inputFileLable">
                {/* View file simple link */}
                <span className="flex gap5 secondary font14 weight700 pointer" onClick={toogleShowExampleFile}>
                    View file simple
                    <CarefullIcon />
                </span>

                {/* Label with required indicator */}
                <p className={classNames('helper primary bold500 flex alignCenter', {
                    font14: isTablate,
                    font16: !isTablate
                })}>
                    {label}
                    { Boolean(required) && (
                        <sup className={className('red', {font14: isTablate, font16: !isTablate })}> * </sup> 
                    )}
                </p>
            </div>

            {/* Placeholder text */}
            <p className={classNames("font14 primary mb5", {
                [`helper primary bold500 flex alignCenter`]: isMemberFile,
                font14: isMemberFile && isTablate,
                font16: isMemberFile && !isTablate
            })}>
                {placeholder}

                {/* Required indicator */}
                { isMemberFile && Boolean(required) && (
                    <sup className={classNames('red', { font14: isTablate, font16: !isTablate })}> * </sup>
                )}
            </p>

            {/* Input file section */}
            <label>
                { element || (
                    <input
                        type="file"
                        ref={ref}
                        name={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...inputProps}
                    />
                )}
                <UploadSvgIcon className={classNames({ selected: fileName })} />

                {/* Display file name or drag & drop message */}
                <p className="fileName font14 primary60">
                    {fileName || "Drag & Drop your file"}
                </p>

                {/* Display error message */}
                { error && (
                    <p className="err-message">{error}</p>
                )}

                {/* Display delete icon if file selected */}
                { fileName && (
                    <i className="deleteSvgIcon" onClick={(e) => resetFileName(e, name)}>
                        <DeleteSvgIcon />
                    </i>
                )}
            </label>
        </div>
    );
});

export default InputFile;