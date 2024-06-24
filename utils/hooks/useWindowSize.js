import { useEffect, useState } from 'react'

// Custom hook to track window size.
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });

    // Effect to update window size on resize.
    useEffect(() => {
        // Function to handle window resize event.
        function handleResize() {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        // Add event listener for window resize.
        window.addEventListener('resize', handleResize);

        // Call handleResize function immediately to set initial window size.
        handleResize();

        // Cleanup: remove event listener when component unmounts.
        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, []);

    // Return window size state.
    return windowSize;
};