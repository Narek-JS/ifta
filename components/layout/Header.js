import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Drawer, Popper } from "@mui/material";
import { useRouter } from "next/router";
import TopPanel from "@/components/layout/TopPanel";
import Fade from 'react-reveal/Fade';
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import Image from "next/image";
import { ImageLoader } from "@/utils/helpers";
import { CloseMobileMenu } from "@/public/assets/svgIcons/CloseMobileMenu";
import { IFTA_EMAIL } from "@/utils/constants";

export default function Header({disableTopPanel, user, handleLogOut}) {
    const {pathname} = useRouter();
    const {width} = useWindowSize();
    const [anchorEl, setAnchorEl] = useState(null);
    const [transparent, setTransparent] = useState(1);
    const [menu, setMenu] = useState(false);
    const [isMouseInPopup, setIsMouseInPopup] = useState(true);
    const topPanel = useRef(null);

    useEffect(() => {
        setMenu(false);
        setAnchorEl(null);
        const headerScroll = () => {
            if (window.pageYOffset >= topPanel.current?.clientHeight) {
                setTransparent(2);
            } else {
                setTransparent(1);
            }
        }
        headerScroll();
        if (pathname === '/') {
            window.addEventListener("scroll", headerScroll);
            return () => {
                window.removeEventListener("scroll", headerScroll);
            }
        } else {
            setTransparent(2)
        }
    }, [pathname]);

    const handleCloseMenu = () => {
        setMenu(false)
    };

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'transition-popper' : undefined;

    const handleClosePopper = () => {
        if (isMouseInPopup && Boolean(anchorEl)) {
            setAnchorEl(null);
        };
    };

    useEffect(() => {
        document.addEventListener("click", handleClosePopper);
    
        return () => {
            document.removeEventListener("click", handleClosePopper);
        };
    }, [isMouseInPopup, anchorEl]);

    return (
        <>
            {!disableTopPanel ? <TopPanel
                topPanel={topPanel}
                width={width}
                transparent={transparent}
            /> : ""}
            <header className={`${transparent === 1 ? "transparent" : "bgGray"} ${disableTopPanel ? "disableTopPanel": ""} mPadding flexBetween alignCenter gap40`}>
                <Link href="/" className="headerLogo">
                    <Image src="/assets/images/logo3.png" priority quality={100} width={240} height={80} loader={ImageLoader}
                           alt="logo"/>
                </Link>
                {user ?
                    <div
                        className="userPopper"
                        onMouseEnter={() => setIsMouseInPopup(false)}
                        onMouseLeave={() => setIsMouseInPopup(true)}
                    >
                        <button
                            className="togglePopper gap15 flexBetween alignCenter"
                            aria-describedby={id}
                            type="button"
                            onClick={(e) => {
                                if(Number(width) >= 768) {
                                    handleClick(e);
                                } else {
                                    setMenu(!menu);
                                };
                            }}
                        >
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1716_16772)">
                                <rect width="40" height="40" fill="#FFBF00"/>
                                <path d="M20.0013 6.66699C12.6413 6.66699 6.66797 12.6403 6.66797 20.0003C6.66797 27.3603 12.6413 33.3337 20.0013 33.3337C27.3613 33.3337 33.3346 27.3603 33.3346 20.0003C33.3346 12.6403 27.3613 6.66699 20.0013 6.66699ZM20.0013 12.0003C22.5746 12.0003 24.668 14.0937 24.668 16.667C24.668 19.2403 22.5746 21.3337 20.0013 21.3337C17.428 21.3337 15.3346 19.2403 15.3346 16.667C15.3346 14.0937 17.428 12.0003 20.0013 12.0003ZM20.0013 30.667C17.2946 30.667 14.0946 29.5737 11.8146 26.827C14.1501 24.9946 17.0328 23.9987 20.0013 23.9987C22.9698 23.9987 25.8525 24.9946 28.188 26.827C25.908 29.5737 22.708 30.667 20.0013 30.667Z" fill="black"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_1716_16772">
                                <rect width="40" height="40" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <span className="userName lighthouse-black font24 weight500">{user.name} {user.last_name}</span>
                            <div id="nav-icon3" className={anchorEl ? "open" : ""}>
                                { anchorEl ? (
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_1716_16763)">
                                        <rect width="40" height="40" fill="#FFBF00"/>
                                        <g clipPath="url(#clip1_1716_16763)">
                                        <path d="M28.6275 13.2541C29.0181 12.8636 29.0181 12.2304 28.6275 11.8399L28.1617 11.3741C27.7712 10.9836 27.1381 10.9836 26.7475 11.3741L20.7084 17.4132C20.3179 17.8037 19.6847 17.8037 19.2942 17.4132L13.2551 11.3741C12.8646 10.9836 12.2314 10.9836 11.8409 11.3741L11.3751 11.8399C10.9846 12.2304 10.9846 12.8636 11.3751 13.2541L17.4142 19.2932C17.8047 19.6837 17.8047 20.3169 17.4142 20.7074L11.3751 26.7466C10.9846 27.1371 10.9846 27.7702 11.3751 28.1608L11.8409 28.6266C12.2314 29.0171 12.8646 29.0171 13.2551 28.6266L19.2942 22.5874C19.6847 22.1969 20.3179 22.1969 20.7084 22.5874L26.7475 28.6266C27.1381 29.0171 27.7712 29.0171 28.1617 28.6266L28.6275 28.1608C29.0181 27.7702 29.0181 27.1371 28.6275 26.7466L22.5884 20.7074C22.1979 20.3169 22.1979 19.6837 22.5884 19.2932L28.6275 13.2541Z" fill="black"/>
                                        </g>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_1716_16763">
                                        <rect width="40" height="40" fill="white"/>
                                        </clipPath>
                                        <clipPath id="clip1_1716_16763">
                                        <rect width="32" height="32" fill="white" transform="translate(4 4)"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                ) : (
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_1716_16757)">
                                        <rect width="40" height="40" fill="#FFBF00"/>
                                        <rect x="8" y="12" width="24" height="3" rx="1.5" fill="black"/>
                                        <rect x="8" y="19" width="24" height="3" rx="1.5" fill="black"/>
                                        <rect x="8" y="26" width="24" height="3" rx="1.5" fill="black"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_1716_16757">
                                        <rect width="40" height="40" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                )}
                            </div>
                        </button>
                        <Popper
                            className="userPopperArea"
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onMouseEnter={() => setIsMouseInPopup(false)}
                            onMouseLeave={() => setIsMouseInPopup(true)}
                        >
                            <Fade clear duration={500}>
                                <ul >
                                    <li>
                                        <Link className="flex alignCenter gap10" href="tel:( 800 ) 341 - 2870">
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M16 5.58333C13.7899 5.58333 11.6702 6.41741 10.1074 7.90207C8.54464 9.38673 7.66667 11.4004 7.66667 13.5V15.0833H9.33333C9.77536 15.0833 10.1993 15.2501 10.5118 15.5471C10.8244 15.844 11 16.2467 11 16.6667V21.4167C11 21.8366 10.8244 22.2393 10.5118 22.5363C10.1993 22.8332 9.77536 23 9.33333 23H7.66667C7.22464 23 6.80072 22.8332 6.48816 22.5363C6.17559 22.2393 6 21.8366 6 21.4167V13.5C6 12.2524 6.25866 11.0171 6.7612 9.86451C7.26375 8.71191 8.00035 7.66464 8.92893 6.78249C9.85752 5.90033 10.9599 5.20056 12.1732 4.72314C13.3864 4.24572 14.6868 4 16 4C17.3132 4 18.6136 4.24572 19.8268 4.72314C21.0401 5.20056 22.1425 5.90033 23.0711 6.78249C23.9997 7.66464 24.7362 8.71191 25.2388 9.86451C25.7413 11.0171 26 12.2524 26 13.5V21.4167C26 21.8366 25.8244 22.2393 25.5118 22.5363C25.1993 22.8332 24.7754 23 24.3333 23H22.6667C22.2246 23 21.8007 22.8332 21.4882 22.5363C21.1756 22.2393 21 21.8366 21 21.4167V16.6667C21 16.2467 21.1756 15.844 21.4882 15.5471C21.8007 15.2501 22.2246 15.0833 22.6667 15.0833H24.3333V13.5C24.3333 11.4004 23.4554 9.38673 21.8926 7.90207C20.3298 6.41741 18.2101 5.58333 16 5.58333Z"
                                                    fill="#FFBF00"/>
                                                <path
                                                    d="M17.8734 25.6471C18.4304 25.6471 21.7722 26.1765 22.8861 23H24C23.443 26.1765 20.6582 26.7059 17.8734 26.7059C17.8734 26.7059 18.0591 27.5882 17.8734 27.7647C14.5316 28.2941 13.4177 27.7647 13.4177 27.7647C12.8608 26.7059 12.8608 25.1176 13.4177 24.5882H17.3165C17.8734 24.5882 17.8734 25.1176 17.8734 25.6471Z"
                                                    fill="#FFBF00"/>
                                            </svg>
                                            ( 800 ) 341 - 2870
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex alignCenter gap10" href={`mailto: ${IFTA_EMAIL}`}>
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M24 12L16 17L8 12V10L16 15L24 10M24 8H8C6.89 8 6 8.89 6 10V22C6 22.5304 6.21071 23.0391 6.58579 23.4142C6.96086 23.7893 7.46957 24 8 24H24C24.5304 24 25.0391 23.7893 25.4142 23.4142C25.7893 23.0391 26 22.5304 26 22V10C26 9.46957 25.7893 8.96086 25.4142 8.58579C25.0391 8.21071 24.5304 8 24 8Z"
                                                    fill="#FFBF00"/>
                                            </svg>
                                            {IFTA_EMAIL}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/profile">
                                            My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/form/carrier-info">
                                            IFTA Form
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/history">
                                           Billing History
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/contact-us">
                                            Contact Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/faq">
                                            FAQ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/about-us">
                                            About Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/services">
                                            Services
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/category/blogs">
                                            Blogs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/category/news">
                                            News
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={handleLogOut} href="">
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </Fade>
                        </Popper>
                    </div> :
                    <>
                        <nav className="flexCenter">
                            <Link href="/" className="LinkPopper flexCenter alignCenter primary weight700 font16">
                                <span>Home</span>
                            </Link>
                            <Link href="/about-us" className="LinkPopper flexCenter alignCenter primary weight700 font16">
                                <span>About Us</span>
                            </Link>
                            <Link href="/services" className="LinkPopper flexCenter alignCenter primary weight700 font16">
                                <span>Services</span>
                            </Link>
                            <Link href="/contact-us"
                                  className="LinkPopper flexCenter alignCenter primary weight700 font16">
                                <span>Contact Us</span>
                            </Link>
                            <Link href="/faq" className="LinkPopper flexCenter alignCenter primary weight700 font16">
                                <span>FAQ</span>
                            </Link>
                        </nav>
                        <div className="authButtons flexCenter alignCenter gap30">
                            <Link href="/sign-in" className="normalBtn outlined primary">
                                Sign In
                            </Link>
                            <Link href="/sign-up" className="normalBtn filled">
                                Sign Up
                            </Link>
                        </div>
                    </>}
                {width <= 1024 && <Drawer
                    className={`mobileMenuDrawer ${disableTopPanel ? "disableTopPanel": ""}`}
                    anchor="left"
                    open={menu}
                    onClose={handleCloseMenu}
                >
                    <div className="mobileMenuHeader flexBetween alignCenter">
                        <div className="headerLogo">
                            <Image src="/assets/images/logo3.png" quality={100} width={240} height={80}
                                   loader={ImageLoader} alt="logo"/>
                        </div>
                        { width <= 768 && (
                            <div onClick={handleCloseMenu} className="closeMobileMenu">
                                <CloseMobileMenu />
                            </div>
                        )}
                    </div>
                    <div className="headerMenuMain flexColumn gap20">
                        <Link href="tel: +8003412870" className="contactItem flex alignCenter gap15 white">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 5.58333C13.7899 5.58333 11.6702 6.41741 10.1074 7.90207C8.54464 9.38673 7.66667 11.4004 7.66667 13.5V15.0833H9.33333C9.77536 15.0833 10.1993 15.2501 10.5118 15.5471C10.8244 15.844 11 16.2467 11 16.6667V21.4167C11 21.8366 10.8244 22.2393 10.5118 22.5363C10.1993 22.8332 9.77536 23 9.33333 23H7.66667C7.22464 23 6.80072 22.8332 6.48816 22.5363C6.17559 22.2393 6 21.8366 6 21.4167V13.5C6 12.2524 6.25866 11.0171 6.7612 9.86451C7.26375 8.71191 8.00035 7.66464 8.92893 6.78249C9.85752 5.90033 10.9599 5.20056 12.1732 4.72314C13.3864 4.24572 14.6868 4 16 4C17.3132 4 18.6136 4.24572 19.8268 4.72314C21.0401 5.20056 22.1425 5.90033 23.0711 6.78249C23.9997 7.66464 24.7362 8.71191 25.2388 9.86451C25.7413 11.0171 26 12.2524 26 13.5V21.4167C26 21.8366 25.8244 22.2393 25.5118 22.5363C25.1993 22.8332 24.7754 23 24.3333 23H22.6667C22.2246 23 21.8007 22.8332 21.4882 22.5363C21.1756 22.2393 21 21.8366 21 21.4167V16.6667C21 16.2467 21.1756 15.844 21.4882 15.5471C21.8007 15.2501 22.2246 15.0833 22.6667 15.0833H24.3333V13.5C24.3333 11.4004 23.4554 9.38673 21.8926 7.90207C20.3298 6.41741 18.2101 5.58333 16 5.58333Z"
                                    fill="#FFBF00"/>
                                <path
                                    d="M17.8734 25.6471C18.4304 25.6471 21.7722 26.1765 22.8861 23H24C23.443 26.1765 20.6582 26.7059 17.8734 26.7059C17.8734 26.7059 18.0591 27.5882 17.8734 27.7647C14.5316 28.2941 13.4177 27.7647 13.4177 27.7647C12.8608 26.7059 12.8608 25.1176 13.4177 24.5882H17.3165C17.8734 24.5882 17.8734 25.1176 17.8734 25.6471Z"
                                    fill="#FFBF00"/>
                            </svg>
                            <b className="weight500">( 800 ) 341 - 2870</b>
                        </Link>
                        
                        {!user ? <>
                                <Link onClick={() => setMenu(!menu)} className="white" href="/sign-in">
                                    Sign In
                                </Link>
                                <Link onClick={() => setMenu(!menu)}  className="white" href="/sign-up">
                                    Sign Up
                                </Link>
                                <Link onClick={() => setMenu(!menu)}  className="white" href="/">
                                    Home
                                </Link>
                            </> :
                            <>
                                <Link onClick={() => setMenu(!menu)}  className="white" href="/">
                                    Welcome Back {user?.name + " " + user?.last_name}
                                </Link>
                                <Link onClick={() => setMenu(!menu)}  className="white" href="/">
                                    Home
                                </Link>
                                <Link onClick={() => setMenu(!menu)}  className="white" href="/profile">
                                    My Profile
                                </Link>
                                <Link onClick={() => setMenu(!menu)}  className="white" href="/form/carrier-info">
                                    IFTA Form
                                </Link>
                                <Link onClick={() => setMenu(!menu)}  className="white" href="/history">
                                    Billing History
                                </Link>
                            </>
                        }
                        <Link onClick={() => setMenu(!menu)}  className="white" href="/about-us">
                            About Us
                        </Link>
                        <Link onClick={() => setMenu(!menu)}  className="white" href="/services">
                            Services
                        </Link>
                        <Link onClick={() => setMenu(!menu)}  className="white" href="/contact-us">
                            Contact Us
                        </Link>
                        <Link onClick={() => setMenu(!menu)}  className="white" href="/faq">
                            FAQ
                        </Link>
                        <Link onClick={() => setMenu(!menu)}  className="white" href="/category/blogs">
                            Blogs
                        </Link>
                        <Link onClick={() => setMenu(!menu)}  className="white" href="/category/news">
                            News
                        </Link>

                        {user ? <Link onClick={handleLogOut} className="white" href="/">
                            Logout
                        </Link> : ""}
                    </div>
                </Drawer>}
                <div
                    className="mobileBurgerIcon"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setMenu(!menu);
                    }}
                >
                    { menu ? (
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_1716_16763)">
                            <rect width="40" height="40" fill="#FFBF00"/>
                            <g clipPath="url(#clip1_1716_16763)">
                            <path d="M28.6275 13.2541C29.0181 12.8636 29.0181 12.2304 28.6275 11.8399L28.1617 11.3741C27.7712 10.9836 27.1381 10.9836 26.7475 11.3741L20.7084 17.4132C20.3179 17.8037 19.6847 17.8037 19.2942 17.4132L13.2551 11.3741C12.8646 10.9836 12.2314 10.9836 11.8409 11.3741L11.3751 11.8399C10.9846 12.2304 10.9846 12.8636 11.3751 13.2541L17.4142 19.2932C17.8047 19.6837 17.8047 20.3169 17.4142 20.7074L11.3751 26.7466C10.9846 27.1371 10.9846 27.7702 11.3751 28.1608L11.8409 28.6266C12.2314 29.0171 12.8646 29.0171 13.2551 28.6266L19.2942 22.5874C19.6847 22.1969 20.3179 22.1969 20.7084 22.5874L26.7475 28.6266C27.1381 29.0171 27.7712 29.0171 28.1617 28.6266L28.6275 28.1608C29.0181 27.7702 29.0181 27.1371 28.6275 26.7466L22.5884 20.7074C22.1979 20.3169 22.1979 19.6837 22.5884 19.2932L28.6275 13.2541Z" fill="black"/>
                            </g>
                            </g>
                            <defs>
                            <clipPath id="clip0_1716_16763">
                            <rect width="40" height="40" fill="white"/>
                            </clipPath>
                            <clipPath id="clip1_1716_16763">
                            <rect width="32" height="32" fill="white" transform="translate(4 4)"/>
                            </clipPath>
                            </defs>
                        </svg>
                    ) : (
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_1716_16757)">
                            <rect width="40" height="40" fill="#FFBF00"/>
                            <rect x="8" y="12" width="24" height="3" rx="1.5" fill="black"/>
                            <rect x="8" y="19" width="24" height="3" rx="1.5" fill="black"/>
                            <rect x="8" y="26" width="24" height="3" rx="1.5" fill="black"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_1716_16757">
                            <rect width="40" height="40" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                    )}
                </div>
            </header>
        </>
    )
}