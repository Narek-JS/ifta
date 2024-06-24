import { useRef } from "react";
import { getTotalFormat } from "@/utils/helpers";

import DeleteSvgIcon from "@/public/assets/svgIcons/DeleteSvgIcon";
import EditSvgIcon from "@/public/assets/svgIcons/EditSvgIcon";
import classNames from "classnames";

export default function VehicleTableMobile({ loading, vehicles, handleEdit, handleDelete, cost }) {
    const sectionEndElmRef = useRef(null);

    // Function to scroll into the end element of the section.
    const scrollIntoEndElem = () => {
        if(sectionEndElmRef.current) {
            sectionEndElmRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        };
    };

    return (
        <div className="dataTable weight400">
            <table>
                <thead>
                    <tr>
                        <td>No.</td>
                        <td>VIN</td>
                    </tr>
                </thead>
                <tbody>
                    {vehicles?.length ?
                        vehicles.map((el, i) => (
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{el.vin}</td>
                            </tr>
                        )) :
                        <tr>
                            <td className="font16" colSpan={7}>
                                Start Adding Vehicle
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <td>Fuel Type</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {vehicles?.length ?
                        vehicles.map((el, i) => (
                            <tr key={i}>
                                <td>{el.fuel_type?.name}</td>
                                <td className="actionsBtns flexCenter alignCenter gap10">
                                    <button
                                        disabled={loading}
                                        className={`${loading ? "disableBtn": ""}`}
                                        onClick={() => {
                                            setTimeout(scrollIntoEndElem, 200);
                                            handleEdit(el);
                                        }}>
                                        <EditSvgIcon/>
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() => handleDelete(el.id)}
                                        className={classNames({ disableBtn: loading })}
                                    >
                                        <DeleteSvgIcon/>
                                    </button>
                                </td>
                            </tr>
                        )) :
                        <tr>
                            <td className="font16" colSpan={7} />
                        </tr>
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={7}>
                            Total: ${getTotalFormat(cost)}
                        </td>
                    </tr>
                </tfoot>
            </table>
            <p ref={sectionEndElmRef}/>
        </div>
    );
};