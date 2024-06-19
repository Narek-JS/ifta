export const Arrow = ({ rotate = 0, stroke = '#FFBF00', marginLeft = 'auto' }) => {
    return (
        <svg
            width="18"
            height="13"
            viewBox="0 0 18 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                marginLeft,
                transform: `rotate(${rotate}deg)`
            }}
        >
            <path
                d="M15.8574 1.42843L8.70214 10.5713L2.14314 1.42843"
                stroke={stroke}
                strokeWidth="3"
                strokeLinejoin="round"
            />
        </svg>
    );
};