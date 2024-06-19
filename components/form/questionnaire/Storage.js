import StorageItem from "@/components/form/questionnaire/StorageItem";
import NormalBtn from "@/components/universalUI/NormalBtn";

export default function Storage({
    storage,
    storageErrors,
    setStorageErrors,
    setStorage,
    data,
    condition,
    setCondition,
    error,
    setErrors
}) {
    const states = data.states.map(el => el).sort();

    return (
        <div className="question-first-step">
            <div className="questionArea flex alignCenter gap20 mb10">
                <p className="primary weight500">• {data.question}</p>
                <div className="radioGroup flex gap20 alignCenter">
                    <label className="flexCenter alignCenter gap5 line24 primary">
                        <input
                            type="radio"
                            value="yes"
                            name="storage"
                            checked={condition === "yes"}
                            onChange={() => {
                                setCondition("yes")
                            }}
                        />
                        <span> Yes </span>
                    </label>
                    <label className="flexCenter alignCenter gap5 line24 primary80">
                        <input
                            type="radio"
                            value="yes"
                            name="storage"
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
                                setCondition("no")
                            }}
                        />
                        <span> No</span>
                    </label>
                </div>
            </div>
            {condition === "yes" && storage.map((el, i) => (
                <StorageItem
                    key={i}
                    setStorage={setStorage}
                    data={el}
                    storage={storage}
                    storageErrors={storageErrors}
                    setStorageErrors={setStorageErrors}
                    i={i}
                    dataStates={data.states}
                    states={states}
                />
            ))}
            {error && <p className="font14 red errMessage" id="errMessage" >Please, select one</p>}
            {condition === "yes" && <NormalBtn
                onClick={() => {
                    let errors = [];
                    storage.forEach((item, index) => {
                        errors[index] = {
                            state: item.state ? "" : "Required",
                            city: item.city ? "" : "Required"
                        }
                    });
                    const isError = errors.some(el => el.state || el.city);
                    if (isError) {
                        setStorageErrors(errors)
                    } else {
                        setStorageErrors([
                            ...errors,
                            {state: "", city: ""}
                        ])
                        setStorage((prev) => (
                            [
                                ...prev,
                                {}
                            ]
                        ))
                    }
                }}
                className="outlined secondary bg-lighthouse-black min-w-280"
            >
                <span>+</span> Add another state
            </NormalBtn>}
        </div>
    )
}