import EditSvgIcon from "@/public/assets/svgIcons/EditSvgIcon";
import DeleteSvgIcon from "@/public/assets/svgIcons/DeleteSvgIcon";
import { getTotalFormat } from "@/utils/helpers";
import { useRef } from "react";

export default function VehicleTable({
    loading,
    vehicles,
    handleEdit,
    handleDelete,
    cost,
    activeEditLineId
}) {
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
                        <td>No.</td>
                        <td>Year/Model/Make</td>
                        <td>VIN</td>
                        <td>Fuel Type</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {vehicles?.length ?
                        vehicles.map((el, i) => (
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{el.year}/{el.make}/{el.model}</td>
                                <td>{el.vin}</td>
                                <td>{el.fuel_type?.name}</td>
                                <td className="actionsBtns flexCenter alignCenter gap10">
                                    <button
                                        disabled={loading}
                                        className={`${loading || activeEditLineId === el.id ? "disableBtn": ""}`}
                                        onClick={() => {
                                            setTimeout(scrollIntoEndElem, 100);
                                            handleEdit(el);
                                        }}
                                    >
                                        <EditSvgIcon/>
                                    </button>
                                    <button
                                        disabled={loading}
                                        className={`${loading || activeEditLineId === el.id ? "disableBtn": ""}`}
                                        onClick={() => handleDelete(el.id)}
                                    >
                                        <DeleteSvgIcon/>
                                    </button>
                                </td>
                            </tr>
                        )) :
                        <tr>
                            <td className="font16" colSpan={7}>
                                Start Adding Vehicle
                            </td>
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
            <p ref={sectionEndElmRef} />
        </div>
    )
}