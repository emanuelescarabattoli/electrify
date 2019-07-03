
// A function to parse the state string received from server to an object
const parseState = stateString => {
    let state = {};
    const states = stateString.split(";");
    states.map(item => {
        const stateValue = item.split("#");
        switch (stateValue[0]) {
            case "LIGHTGROUP1":
                state.lightGroupOne = stateValue[1];
                break;
            case "LIGHTGROUP2":
                state.lightGroupTwo = stateValue[1];
                break;
            case "LIGHTGROUP3":
                state.lightGroupGate = stateValue[1];
                break;
            case "GATE":
                state.gate = stateValue[1];
                break;
        }
    });
    return state;
}

// Export of utils
module.exports = { parseState };