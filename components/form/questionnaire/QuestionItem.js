export default function QuestionItem ({questions, setQuestions, i, error, setErrors, data}) {
    return(
        <div className="questionArea mb20">
            <div className=" flex alignCenter gap20 ">
                <p className="primary weight500">• {data?.question}</p>
                <div className="radioGroup flex gap20 alignCenter">
                    <label className="flexCenter alignCenter gap5 line24 primary">
                        <input
                            type="radio"
                            value="yes"
                            name={"question"+i}
                            checked={questions[i]?.answer === "yes"}
                            onChange={() => {
                                setErrors(prev => {
                                    let newError = [...prev];
                                    newError.forEach((el => {
                                        if(el.id === questions[i].question){
                                            el.error = false
                                        }
                                    } ))
                                    return newError
                                })
                                setQuestions(prev=> {
                                    const newQuestions = [...prev];
                                    newQuestions[i].answer = "yes";
                                    return newQuestions;
                                })
                            } }
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flexCenter alignCenter gap5 line24 primary80">
                        <input
                            type="radio"
                            value="yes"
                            name={"question"+i}
                            checked={questions[i]?.answer === "no"}
                            onChange={() => {
                                setErrors(prev => {
                                    let newError = [...prev];
                                    newError.forEach((el => {
                                        if(el.id === questions[i].question){
                                            el.error = false
                                        }
                                    } ))
                                    return newError
                                })
                                setQuestions(prev=> {
                                    const newQuestions = [...prev];
                                    newQuestions[i].answer = "no";
                                    return newQuestions;
                                })
                            } }
                        />
                        <span>No</span>
                    </label>
                </div>
            </div>
            {error && <p className="errMessage font14 red" id="errMessage" >Please, select one</p>}
        </div>

    )
}