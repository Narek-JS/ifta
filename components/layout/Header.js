import { authMiddleMenuLinks, authMenuLinksPopper, navLinks, mobileLinks, mobileAuthLinks } from '@/data/menu.js';
import { MenuIconClose, MenuIconOpen } from "@/public/assets/svgIcons/MenuIcons";
import { AnonymousLogoIcon } from "@/public/assets/svgIcons/AnonymousLogoIcon";
import { PhoneIcon } from "@/public/assets/svgIcons/PhoneIcon";
import { Fragment, useEffect, useRef, useState } from "react";
import { MailIcon } from "@/public/assets/svgIcons/MailIcon";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { IFTA_EMAIL, IFTA_PHONE, IFTA_PHONE_MASK } from "@/utils/constants";
import { setPopUp } from "@/store/slices/common";
import { Drawer, Popper } from "@mui/material";
import { ImageLoader } from "@/utils/helpers";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import TopPanel from "@/components/layout/TopPanel";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

// WrapperLink component handles conditional rendering of links with or without a confirmation popup.
const WrapperLink = ({ doubleCheck, path, className, children }) => {
    const dispatch = useDispatch();
    const { push } = useRouter();
    const target = path.includes('http') ? '_blank' : '';

    // Function to open a confirmation popup before redirecting.
    const openPopupBeforeRedirect = async () => {
        await dispatch(setPopUp({
            popUp: "removeQuarterPopup",
            popUpContent: "The filling process is incomplete. &nbsp Are you certain you want to proceed with this action?",
            popUpAction: () => {
                target ? window.open(path, target) : push(path);
                dispatch(setPopUp({}));
            }
        }));
    };

    return doubleCheck ? (
        <p className={className} onClick={openPopupBeforeRedirect}>{children}</p>
    ) : (
        <Link href={path} className={className} {...(target && { target } )}>{children} </Link>
    );
};

export default function Header({ disableTopPanel, user, handleLogOut }) {
    const { pathname } = useRouter();
    const { width } = useWindowSize();
    const [ menu, setMenu ] = useState(false);
    const [ anchorEl, setAnchorEl ] = useState(null);
    const [ transparent, setTransparent ] = useState(1);
    const [ isMouseInPopup, setIsMouseInPopup ] = useState(true);
    
    const topPanel = useRef(null);

    // useEffect to handle scroll event and set header transparency.
    useEffect(() => {
        setMenu(false);
        setAnchorEl(null);

        // Function to handle scroll event and update header transparency.
        const headerScroll = () => {
            const transparent = window.pageYOffset >= topPanel.current?.clientHeight ? 2 : 1;
            setTransparent(transparent);
        };

        headerScroll();

        // Add scroll event listener if on the home page.
        if (pathname === '/') {
            window.addEventListener("scroll", headerScroll);
            return () => {
                window.removeEventListener("scroll", headerScroll);
            };
        } else {
            setTransparent(2);
        };
    }, [pathname]);

    // useEffect to handle closing the popper when clicking outside.
    useEffect(() => {
        document.addEventListener("click", handleClosePopper);

        return () => {
            document.removeEventListener("click", handleClosePopper);
        };
    }, [isMouseInPopup, anchorEl]);

    // Function to close the popper if the mouse is outside.
    function handleClosePopper() {
        if (isMouseInPopup && Boolean(anchorEl)) {
            setAnchorEl(null);
        };
    };

    // Function to close the mobile menu.
    const handleCloseMenu = () => setMenu(false)

    // Function to toggle the popper anchor element.
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    // Function to handle account name click based on window width.
    const handleAccountNameClick = (event) => {
        Number(width) >= 768 ? handleClick(event) : setMenu(!menu);
    };

    return (
        <Fragment>
            {!disableTopPanel && (
                <TopPanel topPanel={topPanel} width={width} staticTopPanel={transparent === 1} />
            )}

            <header className={classNames('mPadding flexBetween alignCenter', {
                transparent: transparent === 1,
                bgGray: transparent !== 1,
                disableTopPanel: disableTopPanel,
                disabledHeader: user?.role === 'admin',
                gap20: user && Number(width) <= 1200,
                gap40: Boolean(user && Number(width) <= 1200) === false  
            })}>
                <WrapperLink 
                    className={classNames('headerLogo', {
                        [classNames({ pointer: !user?.role === 'admin' })]: pathname.includes('form/carrier-info'),
                    })}
                    path='/'
                    doubleCheck={pathname.includes('form/carrier-info')}
                >
                    <Image
                        src="/assets/images/logo3.png"
                        priority
                        quality={100}
                        width={240}
                        height={80}
                        loader={ImageLoader}
                        alt="logo"
                    />
                </WrapperLink>

                { user && authMiddleMenuLinks.map(({ path, text }, index) => (
                    <WrapperLink
                        className={classNames("pointer primary nowrap none1024", { underline: pathname === path })}
                        doubleCheck={pathname.includes('form/carrier-info')}
                        path={path}
                        children={text}
                        key={index}
                    />
                ))}
                {user ? (
                    <div
                        className="userPopper"
                        onMouseEnter={() => setIsMouseInPopup(false)}
                        onMouseLeave={() => setIsMouseInPopup(true)}
                    >
                        <button
                            className="togglePopper gap15 flexBetween alignCenter"
                            aria-describedby={Boolean(anchorEl) ? 'transition-popper' : undefined}
                            type="button"
                            onClick={handleAccountNameClick}
                        >
                            <AnonymousLogoIcon className='none-mobile' />
                            <span className="userName lighthouse-black font24 weight500">{user.name} {user.last_name}</span>
                            <div id="nav-icon3" className={classNames({ open: anchorEl })}>
                                { anchorEl ? <MenuIconClose /> : <MenuIconOpen /> }
                            </div>
                        </button>
                        <Popper
                            className="userPopperArea"
                            id={Boolean(anchorEl) ? 'transition-popper' : undefined}
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onMouseEnter={() => setIsMouseInPopup(false)}
                            onMouseLeave={() => setIsMouseInPopup(true)}
                        >
                            <ul>
                                <li>
                                    <Link className="flex alignCenter gap10" href="tel:( 800 ) 341 - 2870">
                                        <PhoneIcon />
                                        ( 800 ) 341 - 2870
                                    </Link>
                                </li>
                                <li>
                                    <Link className="flex alignCenter gap10" href={`mailto:${IFTA_EMAIL}`}>
                                        <MailIcon />
                                        {IFTA_EMAIL}
                                    </Link>
                                </li>
                                { authMenuLinksPopper.map(({ path, text, className }, index) => (
                                    <li className={className} key={index}>
                                        <WrapperLink doubleCheck={pathname.includes('form/carrier-info')} path={path} children={text} />
                                    </li>
                                ))}
                                <li>
                                    <p onClick={handleLogOut}>Logout</p>
                                </li>
                            </ul>
                        </Popper>
                    </div> 
                ) : (
                    <Fragment>
                        <nav className={Number(width) > 1500 ? "flexCenter" : "flexBetween w100"}>
                            {navLinks.map(({ path, text }, index) => (
                                <Link href={path} key={index} className="LinkPopper flexCenter alignCenter primary weight700 font16">
                                    <span>{text}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="authButtons flexCenter alignCenter gap30">
                            <Link href="/sign-in" className="normalBtn outlined primary">
                                Sign In
                            </Link>
                            <Link href="/sign-up" className="normalBtn filled">
                                Sign Up
                            </Link>
                        </div>
                    </Fragment>
                )}
                {width <= 1024 && (
                    <Drawer
                        className={`mobileMenuDrawer ${disableTopPanel ? "disableTopPanel": ""}`}
                        anchor="left"
                        open={menu}
                        onClose={handleCloseMenu}
                    >
                        <div className="mobileMenuHeader flexBetween alignCenter">
                            <div className="headerLogo">
                                <Image
                                    src="/assets/images/logo3.png" 
                                    quality={100}
                                    width={240}
                                    height={80}
                                    loader={ImageLoader}
                                    alt="logo"
                                />
                            </div>
                            { width <= 768 && (
                                <div onClick={handleCloseMenu} className="closeMobileMenu">
                                    <MenuIconClose />
                                </div>
                            )}
                        </div>
                        <div className="headerMenuMain flexColumn gap20"> 
                            <Link href={`tel:${IFTA_PHONE}`} className="contactItem flex alignCenter gap15 white">
                                <PhoneIcon />
                                <b className="weight500">{IFTA_PHONE_MASK}</b>
                            </Link>

                            {!user && mobileLinks.map(({ path, text, isHandleClick }, index) => (
                                <Link key={index} onClick={() => isHandleClick && setMenu(!menu)} className="white" href={path}>
                                    {text}
                                </Link>
                            ))}

                            {user && (
                                <Fragment>
                                    <Link onClick={() => setMenu(!menu)}  className="white" href="/">
                                        Welcome Back {user?.name + " " + user?.last_name}
                                    </Link>

                                    { mobileAuthLinks.map(({ path, text }, index) => (
                                        <Link key={index} onClick={() => setMenu(!menu)} className="white" href={path}>{text}</Link>
                                    ))}

                                    {user && (
                                        <Link onClick={handleLogOut} className="white" href="/">
                                            Logout
                                        </Link>
                                    )}
                                </Fragment>
                            )}
                        </div>
                    </Drawer>
                )}
                <div className="mobileBurgerIcon" style={{ cursor: 'pointer' }} onClick={() => setMenu(!menu)}>
                    {menu ? <MenuIconClose /> : <MenuIconOpen />}
                </div>
            </header>
        </Fragment>
    );
};