import InputField from "@/components/universalUI/InputField";
import Link from "next/link";
import Fade from "react-reveal/Fade";

export default function CheckIRP({
    formik,
    newApp,
    require_ifta,
    loading,
    application_typeId
}) {
    return (
        <div className="checkIRP whiteBg p20">
            <form className={`flex gap20 ${loading ? 'sectionLoading' : ''}`}>
                { (Boolean(!newApp || application_typeId === 4) && application_typeId !== 1) === false && (
                    <>
                        <div className="radioQuestion checkIrpAccount">
                            <p className="primary mb5 line24 nowrap">
                                Do you have an IRP Account?
                                <sup className="red"> * </sup>
                            </p>
                            <div className="radioGroup flex gap20 alignCenter">
                                <label className="flexCenter alignCenter gap5">
                                    <input
                                        type="radio"
                                        value="yes"
                                        name="irpAccount"
                                        checked={formik.values.irpAccount === "1"}
                                        onChange={() => {
                                            formik.setValues({
                                                ...formik.values,
                                                irpAccount: '1'
                                            });
                                        }}
                                    />
                                    <span className="primary">Yes</span>
                                </label>
                                <label className="flexCenter alignCenter gap5">
                                    <input
                                        type="radio"
                                        value="no"
                                        name="irpAccount"
                                        checked={formik.values.irpAccount === "0"}
                                        onChange={() => {
                                            formik.setValues({
                                                ...formik.values,
                                                irpAccount: '0'
                                            });
                                        }}
                                    />
                                    <span className="primary">No</span>
                                </label>
                            </div>
                            <p className="err-message">{formik.errors.irpAccount}</p>
                        </div>
                    </>
                )}
                {Boolean((!newApp || application_typeId === 4)) && application_typeId !== 1 && require_ifta === '1' && <Fade>
                    <InputField
                        onChange={(event) => {
                            const { target } = event;
                            target.value = target.value.replace(/^\s+/g, '');
                            formik.handleChange(event);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.iftaAccountNumber}
                        error={formik.errors.iftaAccountNumber}
                        required={true}
                        name="iftaAccountNumber"
                        label="IFTA Account Number"
                        placeholder="Enter Entity Number"
                    />
                </Fade>}
            </form>
        </div>
    )
}