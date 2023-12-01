import NormalBtn from "@/components/universalUI/NormalBtn";
import {useSelector} from "react-redux";
import {selectPopUpAction, selectPopUpContent} from "@/store/slices/common";
import {useState} from "react";

export default function StaticPopUp ({ handleClose }) {
    const [loading, setLoading] = useState(false);
    const popUpContent = useSelector(selectPopUpContent);
    const popUpAction = useSelector(selectPopUpAction);

    return(
        <div className="flexColumn alignCenter gap30 sectionPadding">
            <h2 className="primary font24 textCenter">
                {popUpContent}
            </h2>
            <div className="flexCenter alignCenter w100 gap20">
                <NormalBtn
                    loading={loading}
                    onClick={()=> {
                        setLoading(true);
                        popUpAction()
                            .then(() => {
                                setLoading(false)
                            })
                    }}
                    className="filled secondary"
                >
                    Yes
                </NormalBtn>
                <NormalBtn
                    loading={loading}
                    onClick={handleClose}
                    className="outlined primary"
                >
                    Cancel
                </NormalBtn>
            </div>
        </div>
    )
}