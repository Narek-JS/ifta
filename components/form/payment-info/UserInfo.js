import InputField from "@/components/universalUI/InputField";
import NormalBtn from "@/components/universalUI/NormalBtn";
import SignatureCanvas from 'react-signature-canvas';
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setPopUp } from "@/store/slices/common";
import { useWindowSize } from "@/utils/hooks/useWindowSize";

export default function UserInfo ({
    formik,
    data,
    condition,
    setCondition
}) {
    const sigRef = useRef();
    const [signature, setSignature] = useState(null);
    const dispatch = useDispatch();
    const { width } = useWindowSize();

    const handleSignatureEnd = () => {
        formik.setValues({
            ...formik.values,
            signature: sigRef.current.toDataURL()
        });
        setSignature(sigRef.current.toDataURL());
    };

    const clearSignature = () => {
        formik.setValues({
            ...formik.values,
            signature: ""
        });
        sigRef.current.clear();
        setSignature(null);
    };

    const handleInitialChange = (e)=> {
        let value = e.target.value;
        const test = /^[A-Za-z]+$/.test(value);

        if(!test && value !== ""){
            return;
        };

        if(value.length <= 2){
            e.target.value = value.toUpperCase();
            formik.handleChange(e);
        };
    };

    return(
       <div className="userInfo">
            <div className="userInfoArea">
                <div className="initialItem mb15 flex gap25">
                    <InputField
                        placeholder="Initials"
                        onChange={handleInitialChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.initial1}
                        error={formik.touched?.initial1 && formik.errors?.initial1}
                        id={`initial1`}
                        name={`initial1`}
                    />
                    <p className="initialRule primary60">
                        I certify that I am the authorized holder and signer of the credit card referenced above. I certify that all information above is complete and accurate. 
                    </p>
                </div>
               <div className="initialItem mb15 flex gap25">
                    <InputField
                        placeholder="Initials"
                        onChange={handleInitialChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.initial2}
                        error={formik.touched?.initial2 && formik.errors?.initial2}
                        id={`initial2`}
                        name={`initial2`}
                    />
                    <p className="initialRule primary60">
                        I understand that the information input is correct to my knowledge. Submitting false information could result in penalties and fines. It is a federal crime to submit false information in an attempt to commit fraud. I hereby authorize the collection of payment for all charges as indicated above. I acknowledge that charges may not exceed the total amount listed under the “TOTAL COST” field. I understand that this authorization is only in effect during the time period of this transaction. If any additional charges are to need authorization, a new authorization form will have to be completed.
                    </p>
                </div>
               <div className="initialItem mb15 flex gap25">
                    <InputField
                        placeholder="Initials"
                        onChange={handleInitialChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.initial3}
                        error={formik.touched?.initial3 && formik.errors?.initial3}
                        id={`initial3`}
                        name={`initial3`}
                    />
                    <p className="initialRule primary60">
                        I acknowledge that the total amount of today’s transaction, indicated under the “TOTAL COST” field includes any and all Federal, State, and Local Government fees. 
                    </p>
               </div>
               <div className="initialItem mb20 flex gap25">
                    <InputField
                        placeholder="Initials"
                        onChange={handleInitialChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.initial4}
                        error={formik.touched?.initial4 && formik.errors?.initial4}
                        id={`initial4`}
                        name={`initial4`}
                    />
                    <p className="initialRule primary60">
                        I hereby acknowledge and agree that after the charges are authorized, an IFTA Online agent will be assigned within 15 minutes to run the order. Once the agent has been assigned, the charges become non-refundable.
                    </p>
               </div>
                <div className="orderCreator flexBetween gap20">
                        <div className="userDataItem flexColumn flexBetween alignCenter font14 weight500 line24">
                            <p className="primary">Name of Person Signing</p>
                            <p className="primary80">{data?.name}</p>
                            <span />
                        </div>
                    <div className="userDataItem flexColumn flexBetween alignCenter font14 weight500 line24">
                            <p className="primary">Title</p>
                            <p className="primary80">{data.title}</p>
                            <span />
                        </div>
                    <div className="userDataItem flexColumn flexBetween alignCenter font14 weight500 line24">
                        <p className="primary">Date signed</p>
                        <p className="primary80">
                            {
                                new Date().toLocaleDateString('en-US', {
                                    year: '2-digit',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).replace(/\//g, '/')
                            }
                        </p>
                        <span />
                    </div>
                    <div className="signatureArea userDataItem flexColumn flexBetween alignCenter font14 weight500">
                        <p className="primary">Signature </p>
                            <SignatureCanvas
                                penColor="#000000"
                                canvasProps={{
                                    className: 'signature signaturePointer',
                                    width: Number(width) > 768 ? '237px' : (Number(width) - 110) || '237px',
                                    height: Number(width) > 768 ? 65 : 105
                                }}
                                ref={sigRef}
                                onEnd={handleSignatureEnd}
                            />
                            <NormalBtn onClick={clearSignature} className="outlined primary">
                                Clear Signature
                            </NormalBtn>
                        <span className="errMessage red font14">{formik.touched.signature && formik.errors.signature && "Signature is required!"}</span>
                    </div>
                </div>
                <div className="flexColumn mt20 gap10">
                    <div className="conditions flex alignEnd gap5 line24">
                        <label className="flexCenter gap5 alignCenter primary">
                            <input
                                checked={condition}
                                onChange={() => {
                                    setCondition(!condition)
                                }}
                                type={"checkbox"}
                            />
                            <span>I agree with the </span>
                        </label>
                        <p className="lighthouse-black pointer underline size14-mb" onClick={() => {
                            dispatch(setPopUp({
                                popUp: 'termsPopup',
                            }));
                        }}> Terms and Conditions </p>
                    </div>
                </div>
           </div>
       </div>
    )
};