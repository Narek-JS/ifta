import NormalBtn from "@/components/universalUI/NormalBtn";
import BackSvgIcon from "@/public/assets/svgIcons/BackSvgIcon";

const First = ({ setStep, phoneNumber, step, onClick }) => {
    const toNextStep = () => setStep(2);

    return (
        <div className={`nth-box phone-box step${step}`}>
            <div className="w100">
                <div onClick={onClick} className="flex go-back backBtn alignCenter gap5 secondary font20 weight700">
                    <BackSvgIcon/>
                    Back
                </div>
                <h1 className='box-title'>Phone Number</h1>
            </div>
            <div>
                <p className='primary'>Phone number you’ve added</p>
                <div className='phone-field'>
                    <p className='primary'>{phoneNumber || '(999) 999 999 9999'}</p>
                    <p className='primary60'>Use for resetting password</p>
                </div>
            </div>
            <div className='btn-field'>
                <p className='primary60 desc'>
                    Your phone number helps us keep your
                    account secure by adding an additional
                    layer of verification.
                </p>
                <div className="flexCenter">
                    <NormalBtn className='outlined bg-lighthouse-black' type='button' onClick={toNextStep}>
                        Update phone number
                    </NormalBtn>
                </div>
            </div>
        </div>
    );
};

export default First;