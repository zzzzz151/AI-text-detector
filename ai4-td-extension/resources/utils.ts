/* Scripting */

async function getCurrentTab() {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function executeInCurrentTab(opts) {
    console.log(opts);
    const tab = await getCurrentTab();
    return executeInTab(tab.id, opts);
}

async function executeInTab(tabId, { file, func, args }) {
    if (process.env.DEBUG)
    console.log("INFO: Calling executeInTab")
    const executions = await chrome.scripting.executeScript({
        world: "MAIN", // MAIN in order to access the window object
        target: { tabId, allFrames: true },
        ...(file && { files: [file] }),
        func,
        args,
    });

    if (executions.length === 1) {
        return executions[0].result;
    }

    // If there are many frames, concatenate the results
    return executions.flatMap((execution) => execution.result);
}

function wrapResponse(promise, sendResponse) {
    promise.then((response) => sendResponse({
        success: true,
        response,
    })).catch((error) => sendResponse({
        success: false,
        error: error.message,
    }));
}

/* API */

function callApi(url, bodyObject) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyObject)
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
    });
}
    

/* Other */

const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export { executeInCurrentTab, executeInTab, wrapResponse, callApi, generateRandomColor };