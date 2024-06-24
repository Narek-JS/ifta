import { getUserVehicles, selectVehicles, selectVehiclesStatus } from "@/store/slices/vehicles";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { selectAuthStatus, selectUserData } from "@/store/slices/auth";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { Arrow } from "@/public/assets/svgIcons/Arrow";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import NextSvgIcon from "@/public/assets/svgIcons/NextSvgIcon";
import NormalBtn from "@/components/universalUI/NormalBtn";
import Loader from "@/components/universalUI/Loader";
import Link from "next/link";

const Vehicles = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector(selectUserData);
    const authStatus = useSelector(selectAuthStatus);
    const vehicles = useSelector(selectVehicles);
    const vehiclesStatus = useSelector(selectVehiclesStatus);

    const { width } = useWindowSize();
    const [ expanded, setExpanded ] = useState(false);

    // Handle change in accordion panel expansion.
    const handleChange = (panel) => () => {
        // Collapse if the same panel is clicked again.
        if(expanded === panel) {
            return setExpanded(false);
        };

        // Expand the clicked panel.
        setExpanded(panel);
    };

    // Effect to check user authentication status.
    useEffect(() => {
        // Navigate back if user is not authenticated.
        if(authStatus !== 'initial' && !user) {
            router.back();
        };
    }, [user, authStatus]);

    // Effect to fetch user vehicles.
    useEffect(() => {
        dispatch(getUserVehicles());
    }, []);

    // Memoized vehicles JSX for rendering vehicle details
    const vehiclesJSX = useMemo(() => {
        // Return null if vehicles is not an array.
        if(!Array.isArray(vehicles)) {
            return null;
        };

        return vehicles.map((vehicle, index) => {
            // Adapt vehicle make and model for smaller screens.
            const adaptedVehicleMake = Number(width) <= 768 && vehicle?.make?.includes(' ') ? vehicle?.make?.split(' ')?.[0] + '...' : vehicle?.make;
            const adaptedVehicleModel = Number(width) <= 768 && vehicle?.model?.includes(' ') ? vehicle?.model?.split(' ')?.[0] + '...' : vehicle?.model;

            // Vehicle information groups.
            const vehcileInfo = [[
                { title: 'VIN :', value: vehicle.vin || "N/A" },
                { title: 'Type of fuel used :', value: vehicle.fuel_type?.name || "N/A" }, 
                { title: 'leased Vehicle :', value: vehicle.vehicles_leased || "N/A" },
            ],
            [   { title: 'Year :', value: vehicle.year || "N/A" },
                { title: 'Make :', value: vehicle.make || "N/A" }, 
                { title: 'Model :', value: vehicle.model || "N/A" },
            ]];

            // JSX for vehicle information rows.
            const vehcileInforJSX = vehcileInfo.map((vehcileInfoGroup, index) => {
                const vehicleRowInfo = vehcileInfoGroup.map(({ title, value }, vehcileInfoGroupIndex) => (
                    <td key={vehcileInfoGroupIndex}>
                        <div className="infoItem flex gap10 alignCenter">
                            <p className="primary nowrap">{title}</p>
                            <p className="primary60">{value}</p>
                        </div>
                    </td>
                ));
                
                return <tr key={index}>{vehicleRowInfo}</tr>
            });

            // Return the accordion item for each vehicle.
            return (
                <Accordion
                    key={vehicle?.id || index}
                    expanded={expanded === index}
                    onChange={handleChange(index)}
                >
                    <AccordionSummary  aria-controls="panel1a-content" id="panel1a-header">
                        <div className='faqSquare black' />
                        <h1 className="font20 primary flex alignCenter textCenter gap5 w100" >
                            <span className="weight400">No. { index + 1 }</span>
                            <span> :
                                {vehicle?.year}/
                                {adaptedVehicleMake}/
                                {adaptedVehicleModel}
                            </span>
                            <Arrow rotate={expanded === index ? 180 : 0} />
                        </h1>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="grayBG vehicleItemInPage">
                            <h3 className="subTitle flexCenter alignCenter gap10 font20 line24 whiteBg textCenter weight500 -transY15">
                                <span className="secondary">Vehicle</span>
                                <span className="primary"> Details</span>
                            </h3>
                            <table className="infoContainer">
                                <tbody>
                                    {vehcileInforJSX}
                                </tbody>
                            </table>
                        </div>
                    </AccordionDetails>
                </Accordion>
            );
        });
    }, [vehicles, width, expanded]);

    // Render loader if vehicles data is still loading.
    if(vehiclesStatus === '' || vehiclesStatus === 'panding') {
        return <Loader />;
    };

    return (
        <div className="historyWrapper vehiclesWrapper mPadding">
            <div className="authContainer">
                <h2 className="subTitle flexCenter alignCenter gap10 font20 line24 whiteBg textCenter weight500 mb20">
                    <span className="primary">Your Vehicles</span>
                </h2>
                <div className="grayBG faqsContainer">
                    {vehiclesJSX}

                    <div className="orderBtns flexBetween gap20">
                        <Link href="/" className="font16">
                            <NormalBtn className="prevStep gap5 primary outlined">
                                <NextSvgIcon />
                                Back to Home page
                            </NormalBtn>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vehicles;