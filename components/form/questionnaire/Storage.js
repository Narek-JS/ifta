import { useMemo } from "react";
import NormalBtn from "@/components/universalUI/NormalBtn";
import StorageItem from "@/components/form/questionnaire/StorageItem";

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
    // Use useMemo to create a sorted list of states.
    const states = useMemo(() => {
        return data.states.map(el => el).sort();
    }, [data.states]);

    // Handle the addition of a new state.
    const handleAddStateClick = () => {
        let errors = [];

        // Validate each storage item.
        storage.forEach((item, index) => {
            errors[index] = {
                state: item.state ? "" : "Required",
                city: item.city ? "" : "Required"
            };
        });

        // Check if there are any errors.
        const isError = errors.some(el => el.state || el.city);
        if (isError) {
            // Set storage errors if any.
            setStorageErrors(errors);
        } else {
            // Add a new empty storage item and set errors.
            setStorageErrors([ ...errors, { state: "", city: "" } ]);
            setStorage((prev) => ([...prev, {}]));
        };
    };

    // Handle the closing of the question.
    const handleCloseQuestion = () => {
        setErrors(prev => {
            let newError = [...prev];

            // Update error state to false for the current question.
            newError.forEach((el => {
                if(el.id === data.id) {
                    el.error = false;
                };
            }));
            return newError;
        });

        // Set condition to "no".
        setCondition("no");
    };

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
                            onChange={() => setCondition("yes")}
                        />
                        <span> Yes </span>
                    </label>
                    <label className="flexCenter alignCenter gap5 line24 primary80">
                        <input
                            type="radio"
                            value="yes"
                            name="storage"
                            checked={condition === "no"}
                            onChange={handleCloseQuestion}
                        />
                        <span>No</span>
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
            {condition === "yes" && (
                <NormalBtn
                    onClick={handleAddStateClick}
                    className="outlined secondary bg-lighthouse-black min-w-280"
                >
                    <span>+</span> Add another state
                </NormalBtn>
            )}
        </div>
    );
};