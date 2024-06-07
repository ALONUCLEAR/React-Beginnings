import { useState } from 'react';
import './toggle.css';

type ToggleInput<T = void> = {
    defaultState?: boolean;
    text?: string;
    toggleFunc?: (value: boolean) => T;
    width?: string;
    height?: string;
}

export default function Toggle({ text, defaultState, toggleFunc, width, height }: ToggleInput): JSX.Element {
    const [state, setState] = useState(defaultState ?? false);

    const handleToggle = () => {
        const toggledState = !state;
        if (toggleFunc) {
            toggleFunc(toggledState);
        }

        setState(toggledState);
    }

    const style = {
        width,
        height
    };

    return <div className="toggle-container">
        {text ? <h6 className="text">{text}</h6> : undefined}
        <button onClick={handleToggle} className={`toggle ${state ? 'on' : 'off'}`} style={style}>
            <div className="thumb"></div>
        </button>
    </div>
}