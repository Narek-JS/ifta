import StepController from "@/components/form/StepController";
import {useRouter} from "next/router";
import NormalBtn from "@/components/universalUI/NormalBtn";
import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getPermitId,
    getQuestionnaires, selectPermitId,
    selectQuestionnaires,
    setQuestionnaireLoading,
    storeQuestionnaires
} from "@/store/slices/questionnaire";
import Storage from "@/components/form/questionnaire/Storage";
import Check from "@/components/form/questionnaire/Check";
import QuestionItem from "@/components/form/questionnaire/QuestionItem";
import { toast } from "react-toastify";
import { useRef } from "react";
import classNames from "classnames";

export default function Questionnaire() {
    const router = useRouter();
    const dispatch = useDispatch();
    const questionnaires = useSelector(selectQuestionnaires);
    const permit_id = useSelector(selectPermitId);
    const storageData = questionnaires?.find(el => el.after_opening === "api");
    const checkData = questionnaires?.filter(el => el.after_opening === "allStates");
    const questionsData = questionnaires?.filter(el => !el.after_opening);
    const [loading, setLoading] = useState(false);
    const [condition1, setCondition1] = useState("");
    const [checkCondition, setCheckCondition] = useState(new Array(checkData?.length).fill(""));
    const [storage, setStorage] = useState([{state: '', city: ''}]);
    const [checks, setChecks] = useState(new Array(checkData?.length).fill([]));
    const [questions, setQuestions] = useState({});
    const [errors, setErrors] = useState([]);
    const [storageErrors, setStorageErrors] = useState([{state: '', city: ''}]);
    const questionOneRef = useRef(null);
    const questionTwoRef = useRef(null);

    useEffect(() => {
        dispatch(setQuestionnaireLoading(true))
        dispatch(getPermitId())
            .then(res => {
                if(res?.payload?.data?.form_id) {
                    dispatch(getQuestionnaires(res?.payload?.data?.form_id))
                        .then((resQuestionnaires) => {
                            if(resQuestionnaires?.payload?.result?.action === false) {
                                toast.error(resQuestionnaires?.payload?.result?.message, {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                                return router.push("/form/carrier-info");
                            };
                            dispatch(setQuestionnaireLoading(false))
                        })
                } else {
                    router.push('/form/carrier-info')
                }
            })
        return () => {
            dispatch(setQuestionnaireLoading(false))
        }
    }, []);

    useEffect(() => {
        if (questionnaires) {
            setStorage(storageData.questionnaire_answer?.answer?.length ? storageData.questionnaire_answer?.answer : [{state: '', city: ''}]);

            setChecks(checkData.map(el => el.questionnaire_answer?.answer || []))
            setQuestions(questionsData.map(el => ({
                question: el.id,
                answer: el.questionnaire_answer?.answer?.[0] || "no"
            })))
            if (storageData.questionnaire_answer?.answer) {
                setCondition1(storageData.questionnaire_answer?.answer.length ? "yes": "no")
            } else {
                setCondition1("no")
            }
            setCheckCondition(checkData.map(el => el.questionnaire_answer?.answer?.length ? "yes" : "no"))
        }
    }, [questionnaires]);

    const handleNextStep = () => {
        let allData = [];
        let newAllErrors = [];
        let newStorageErrors = [];

        if(condition1 === "yes"){
            storage.forEach((item, index) => {
                newStorageErrors[index] = {
                    state: item.state ? "" : "Required",
                    city: item.city ? "" : "Required"
                }
            });
            const isError = newStorageErrors.some(el => el.state || el.city);
            newAllErrors.push({id: storageData.id, error: isError})
        }

        if (newStorageErrors.some(el => el.state || el.city)) {
            setStorageErrors(newStorageErrors);
            window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
            allData.push({
                question: storageData.id,
                answer: condition1 === "yes" ? (storage.every(el => el.state && el.city) ? storage: null) : null
            });
            const checkAnswers = checkData.map((el, i) => {
                newAllErrors.push({
                    id: el.id,
                    error: checkCondition[i] === "yes" && !checks[i].length
                });

                return {
                    question: el.id,
                    answer: checkCondition[i] === 'yes' ? checks[i] : [],
                }
            });
            allData.push(...checkAnswers, ...questions.map(el => ({question: el.question, answer: [el.answer]})));

            questions.forEach((el, i) => {
                newAllErrors.push({
                    id: el.question,
                    error: !el.answer
                })
            });

            setErrors(newAllErrors);
            if (!newAllErrors.some(el => el.error)) {
                setLoading(true)
                dispatch(storeQuestionnaires({
                    questionnaires: allData,
                    permit_id
                }))
                    .then(res => {
                        if (res?.payload?.action) {
                            router.push("/form/payment-info");
                        } else{
                            setLoading(false);
                        }
                    })
            } else {
                const errorEL = newAllErrors.find(el => el.error);
                switch(errorEL?.id) {
                    case 2:
                        questionOneRef.current?.scrollIntoView({ behavior: 'smooth' });
                        break;
                    case 3:
                        questionTwoRef.current?.scrollIntoView({ behavior: 'smooth' });
                        break;
                    case 4:
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        break;
                };
            };
        }
    }

    return (
        <main className={classNames("formPage mPadding grayBG", {
            'pointer-eventsNone': loading
        })}>
            <div className="formPageCard"> 
                <h1 className="formTitle font24 line24 textCenter" style={{ background: "#FFFFFF" }}>
                    <span className="primary">IFTA Application Form</span>
                </h1>
                <StepController />
                <h2 className="subTitle font20 line24 whiteBg textCenter weight500">
                    <span className="lighthouse-black">Questionnaire</span>
                </h2>
                <div className="questionnaireMain">
                    {storageData &&
                        <Storage
                            error={errors.find(el => el.id === storageData.id)?.error}
                            setErrors={setErrors}
                            storage={storage}
                            setStorage={setStorage}
                            condition={condition1}
                            setCondition={setCondition1}
                            data={storageData}
                            storageErrors={storageErrors}
                            setStorageErrors={setStorageErrors}
                        />
                    }
                    {checkData?.map((el, i) => (
                        <Check
                            elRef={el.id === 2 ? questionOneRef : questionTwoRef}
                            error={errors.find(er => er.id === el.id)?.error}
                            setErrors={setErrors}
                            key={i}
                            data={el}
                            dataIndex={i}
                            checks={checks}
                            setChecks={setChecks}
                            condition={checkCondition[i]}
                            setCondition={(newValue) => {
                                setCheckCondition(prev => {
                                    const newCondition = [...prev];
                                    newCondition[i] = newValue;
                                    return newCondition;
                                })
                            }}
                        />
                    ))}
                    {questionsData?.map((el, i) => (
                        <QuestionItem
                            setErrors={setErrors}
                            error={errors.find(er => er.id === el.id)?.error}
                            data={el}
                            key={i}
                            i={i}
                            questions={questions}
                            setQuestions={setQuestions}
                        />
                    ))}
                </div>
                <div className="steBtns flexBetween mt20">
                    <NormalBtn onClick={() => {
                        router.push("/form/carrier-info" + (permit_id ? `?permitId=${permit_id}` : ''))
                    }} className="prevStep gap5 bg-lighthouse-black outlined">
                        <NextSvgIcon/>
                        Previous Step
                    </NormalBtn>
                    <NormalBtn loading={loading} onClick={handleNextStep} className="nextStep gap5 secondary outlined">
                        Next Step
                        <NextSvgIcon/>
                    </NormalBtn>
                </div>
            </div>
        </main>
    )
}