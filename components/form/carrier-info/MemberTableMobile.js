import { useRef } from "react";
import EditSvgIcon from "@/public/assets/svgIcons/EditSvgIcon";
import DeleteSvgIcon from "@/public/assets/svgIcons/DeleteSvgIcon";

export default function MemberTableMobile({members, handleEdit, handleDelete, loading}) {
    const sectionEndElmRef = useRef(null);

    const scrollIntoEndElem = () => {
        if(sectionEndElmRef.current) {
            sectionEndElmRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        };
    };

    return (
        <div className="dataTable">
            <table>
                <thead>
                    <tr>
                        <td>Officer Type</td>
                        <td>F. Name</td>
                        <td>Address</td>
                    </tr>
                </thead>
                <tbody>
                    {members?.length ?
                        members.map((el, i) => (
                            <tr key={i}>
                                <td>{el?.officer_type?.name}</td>
                                <td>{el?.name}</td>
                                <td>{el?.home_address}</td>
                            </tr>
                        )) :
                        <tr>
                            <td className="font16" colSpan={7}>
                                Start Adding Owner/Officer Information
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <td>City</td>
                        <td>State</td>
                        <td>ZIP Code</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {members?.length ?
                        members.map((el, i) => (
                            <tr key={i}>
                                <td>{el.city}</td>
                                <td>{el.state?.state}</td>
                                <td>{el.zip_code}</td>
                                <td className="actionsBtns flexCenter alignCenter gap10">
                                    <button
                                        disabled={loading}
                                        className={`${loading ? "disableBtn": ""}`}
                                        onClick={() => {
                                            handleEdit(el);
                                            setTimeout(scrollIntoEndElem, 200);
                                        }}
                                    >
                                        <EditSvgIcon/>
                                    </button>
                                    <button disabled={loading} className={`${loading ? "disableBtn": ""}`} onClick={() => handleDelete(el.id)}>
                                        <DeleteSvgIcon/>
                                    </button>
                                </td>
                            </tr>
                        )) :
                        <tr>
                            <td className="font16" colSpan={7}>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            <p ref={sectionEndElmRef}/>
        </div>
    )
}