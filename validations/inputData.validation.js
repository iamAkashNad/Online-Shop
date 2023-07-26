const storeInputData = (req, inputData, action) => {
    req.session.inputData = inputData;
    req.session.save(action);
};

const retreiveInputData = (req, defaultData) => {
    const inputData = req.session.inputData;
    if(!inputData) {
        return defaultData;
    }
    req.session.inputData = null;
    return inputData;
};

module.exports = {
    storeInputData: storeInputData,
    retreiveInputData: retreiveInputData,
};
