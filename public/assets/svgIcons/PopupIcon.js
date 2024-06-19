export default function PopupIcon ({ stroke = "#072765", strokeOpacity = '0.3', rotate = 0 }) {
    return(
        <svg style={{ transition: 'all .2s', transform: `rotate(${rotate}deg)` }} width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 1L9.65217 13L2 0.999999" stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth="3" strokeLinejoin="round"/>
        </svg>
    );
};