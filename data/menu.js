export const authMiddleMenuLinks = [
    { path: "/permits", text: "IFTA Application" },
    { path: "/quarters", text: "Quarterly Fillings" },
    { path: "/vehicles", text: "Vehicles" },
    { path: "/history", text: "Billing History" }
];

export const authMenuLinksPopper = [
    { path: "/profile", text: "My Profile", className: "" },
    { path: "https://www.irpregistrationservices.com", text: "IRP", className: "" },
    { path: "/permits", text: "IFTA Application", className: "after1024" },
    { path: "/quarters", text: "Quarterly Fillings", className: "after1024" },
    { path: "/vehicles", text: "Vehicles", className: "after1024" },
    { path: "/history", text: "Billing History", className: "after1024" },
    { path: "/category/blogs", text: "Blog", className: "" },
    { path: "/category/news", text: "News", className: "" },
    { path: "/about-us", text: "About Us", className: "" },
    { path: "/services", text: "Services", className: "" },
    { path: "/contact-us", text: "Contact Us", className: "" },
    { path: "/faq", text: "FAQ", className: "" }
];

export const navLinks = [
    { path: "/", text: "Home" },
    { path: "/about-us", text: "About Us" },
    { path: "/services", text: "Services" },
    { path: "/contact-us", text: "Contact Us" },
    { path: "/faq", text: "FAQ" }
];

export const mobileLinks = [
    { path: "/sign-in", text: "Sign In", "isHandleClick": true },
    { path: "/sign-up", text: "Sign Up", "isHandleClick": true },
    { path: "/", text: "Home", "isHandleClick": true },
    { path: "/about-us", text: "About Us", "isHandleClick": false },
    { path: "/services", text: "Services", "isHandleClick": false },
    { path: "/contact-us", text: "Contact Us", "isHandleClick": false },
    { path: "/faq", text: "FAQ", "isHandleClick": false }
];

export const mobileAuthLinks = [
    { path: "/", text: "Home" },
    { path: "/profile", text: "My Profile" },
    { path: "/permits", text: "IFTA Application" },
    { path: "/quarters", text: "Quarterly Fillings" },
    { path: "/vehicles", text: "Vehicles" },
    { path: "/history", text: "Billing History" },
    { path: "/category/blogs", text: "Blog" },
    { path: "/category/news", text: "News" },
    { path: "/about-us", text: "About Us" },
    { path: "/services", text: "Services" },
    { path: "/contact-us", text: "Contact Us" },
    { path: "/faq", text: "FAQ" }
];

export const profileLinks = [
    "/profile",
    "/history",
    "/permits",
    "/permits",
    "/quarters",
    "/vehicles"
];

export const authLinks = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password"
];

const menuData = {
    authMiddleMenuLinks,
    authMenuLinksPopper,
    navLinks,
    mobileLinks,
    mobileAuthLinks,
    profileLinks,
    authLinks
};

export default menuData;