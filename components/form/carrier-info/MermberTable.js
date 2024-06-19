import { useRef, useState, useEffect } from "react";
import DeleteSvgIcon from "@/public/assets/svgIcons/DeleteSvgIcon";
import EditSvgIcon from "@/public/assets/svgIcons/EditSvgIcon";
import classNames from "classnames";

export default function MemberTable({
    members,
    handleEdit,
    handleDelete,
    loading,
    activeEditLineId
}) {
    const [ browser, setBrowser ] = useState('');
    const sectionEndElmRef = useRef(null);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isChrome = userAgent.includes('Chrome');
        setBrowser(isChrome ? 'chrome' : 'other');
    }, []);

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
                    <tr className={classNames({ 'outline': browser === 'other' })}>
                        <td>Officer Type</td>
                        <td>Full Name</td>
                        <td>Address</td>
                        <td>City</td>
                        <td>State</td>
                        <td>ZIP Code</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {members?.length ?
                        members.map((el, i) => (
                            <tr key={i} className={classNames({ 'outline': browser === 'other' })}>
                                <td>{el?.officer_type?.name}</td>
                                <td>{el?.name}</td>
                                <td>{el?.home_address}</td>
                                <td>{el?.city}</td>
                                <td>{el?.state?.state}</td>
                                <td>{el?.zip_code}</td>

                                <td className="actionsBtns flexCenter alignCenter gap10">
                                    <button
                                        disabled={loading} 
                                        className={`${loading || activeEditLineId === el?.id ? "disableBtn": ""}`}
                                        onClick={() => {
                                            setTimeout(scrollIntoEndElem, 100);
                                            handleEdit(el);
                                        }}
                                    >
                                        <EditSvgIcon />
                                    </button>
                                    <button
                                        disabled={loading}
                                        className={`${loading || activeEditLineId === el?.id ? "disableBtn": ""}`}
                                        onClick={() => handleDelete(el.id)}
                                    >
                                        <DeleteSvgIcon/>
                                    </button>
                                </td>
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
            <p ref={sectionEndElmRef} />
        </div>
    );
};