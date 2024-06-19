import { useDispatch } from "react-redux";
import { Fragment, forwardRef } from "react";
import { setPopUp } from "@/store/slices/common";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { CarefullIcon } from "@/public/assets/svgIcons/CarefulIcon";
import UploadSvgIcon from "@/public/assets/svgIcons/UploadSvgIcon";
import classNames from "classnames";
import DeleteSvgIcon from "@/public/assets/svgIcons/DeleteSvgIcon";

const InputFile = forwardRef(function ({
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
    disabled,
    fileName,
    resetFileName,
    exampleFilePath,
    onClick
}, ref) {
    const dispatch = useDispatch();
    const { width } = useWindowSize();

    const toogleShowExampleFile = () => dispatch(setPopUp({
        popUp: 'exampleFile',
        popUpContent: {
            imagePath: exampleFilePath,
            title: label + ' Simple'
        }
    }));

    const isTablate = width <= 1350;
    return (
        <Fragment>
            <div className={`inputFile ${className || ''} ${disabled ? "disabled": ""} ${fileName ? "selected": ""}`}>
                <div className="flexBetween alignCenter gap5 mb10 inputFileLable">
                    <span className="flex gap5 secondary font14 weight700 pointer" onClick={toogleShowExampleFile}>
                        View file simple
                        <CarefullIcon />
                    </span>
                    <p className={`helper primary bold500 font1${isTablate ? '4' : '6'} flex alignCenter`}>
                        {label}
                        {Boolean(required) ? <sup className={`red font1${isTablate ? '4' : '6'}`}> * </sup> : ""}
                    </p>
                </div>
                <p className={classNames("font14 primary mb5", {
                    [`helper primary bold500 font1${isTablate ? '4' : '6'} flex alignCenter`]: String(className).includes('memberFile')
                })}>
                    {placeholder}
                    {String(className).includes('memberFile') &&
                        Boolean(required) && <sup className={`red font1${isTablate ? '4' : '6'}`}> * </sup>
                    }
                </p>
                <label>
                    {element || <input
                        type="file"
                        value={value}
                        onChange={onChange}
                        onFocus={onFocus}
                        maxLength={maxLength}
                        ref={ref}
                        id={id}
                        onBlur={onBlur}
                        name={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        onClick={onClick}
                    />}
                    <UploadSvgIcon className={fileName ? "selected": ""}/>
                    <p className="fileName font14 primary60">{fileName || "Drag & Drop your file"}</p>
                    {error && <p className="err-message">{error}</p>}
                    { fileName && (
                        <i className="deleteSvgIcon" onClick={(e) => resetFileName(e, name)}><DeleteSvgIcon /></i>
                    )}
                </label>
            </div>
        </Fragment>
    );
});

export default InputFile;