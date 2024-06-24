import CheckItem from "@/components/form/questionnaire/CheckItem";

export default function Check({
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

    // Function to handle closing the question by setting error to false and updating the condition.
    const handleCloseQuestion = () => {
        setErrors(prev => {
            let newError = [...prev];
            newError.forEach((el => {
                if(el.id === data.id) {
                    el.error = false;
                };
            }));
            return newError
        });
        setCondition("no");
    };

    return (
        <div>
            <div className="questionArea flex alignCenter gap20 mb10">
                <p className="primary weight500">• {data.question}</p>
                <div className="radioGroup flex gap20 alignCenter">
                    <label className="flexCenter alignCenter gap5 line24 primary">
                        <input
                            type="radio"
                            value="yes"
                            name={"check" + dataIndex}
                            checked={condition === "yes"}
                            onChange={() => setCondition("yes")}
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flexCenter alignCenter gap5 line24 primary80">
                        <input
                            type="radio"
                            value="yes"
                            name={"check" + dataIndex}
                            checked={condition === "no"}
                            onChange={handleCloseQuestion}
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
                    states={data.states.map(el => el)}
                />
            }
            <p ref={elRef} />
            {error && <p className="font14 red errMessage" id="errMessage">Please, select one</p>}
        </div>
    );
};