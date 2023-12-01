import CheckItem from "@/components/form/questionnaire/CheckItem";

export default function Check ({
    elRef,
    data, 
    checks, 
    setChecks, 
    condition, 
    setCondition, 
    dataIndex, 
    error, 
    setErrors 
}) {
    const states = data.states.map(el => el);

    return (
        <div>
            <div className="questionArea flex alignCenter gap20 mb10">
                <p className="primary weight500">• {data.question}</p>
                <div className="radioGroup flex gap20 alignCenter">
                    <label className="flexCenter alignCenter gap5 line24 primary">
                        <input
                            type="radio"
                            value="yes"
                            name={"check"+dataIndex}
                            checked={condition === "yes"}
                            onChange={() => setCondition("yes")}
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flexCenter alignCenter gap5 line24 primary80">
                        <input
                            type="radio"
                            value="yes"
                            name={"check"+dataIndex}
                            checked={condition === "no"}
                            onChange={() => {
                                setErrors(prev => {
                                    let newError = [...prev];
                                    newError.forEach((el => {
                                        if(el.id === data.id){
                                            el.error = false
                                        }
                                    } ))
                                    return newError
                                })
                                setCondition("no");
                            } }
                        />
                        <span>No</span>
                    </label>
                </div>
            </div>
            {condition === "yes" &&
                <CheckItem
                    dataIndex={dataIndex}
                    checks={checks}
                    setChecks={setChecks}
                    states={states}
                />
            }
            <p ref={elRef}/>
            {error && <p className="font14 red errMessage" id="errMessage" >Please, select one</p>}
        </div>
    )

}