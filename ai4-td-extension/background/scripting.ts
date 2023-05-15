/* Scripting */

async function getCurrentTab() {
    const queryOptions = {
        active: true,
        lastFocusedWindow: true
    };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function executeInCurrentTab(opts) {
    const tab = await getCurrentTab();
    return executeInTab(tab.id, opts);
}

async function executeInTab(tabId, {
    file,
    func,
    args
}) {
    const executions = await chrome.scripting.executeScript({
        world: "MAIN", // MAIN in order to access the window object
        target: {
            tabId,
            allFrames: true
        },
        ...(file && {
            files: [file]
        }),
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

interface HTTPOptions {
    method: string,
    headers: { [key: string]: string },
    body?: string | FormData | Blob | ArrayBufferView | ArrayBuffer | ReadableStream<Uint8Array> | null
}

function convertToJSON(str) {
    return JSON.stringify(str, (key, value) => {
      if (typeof value === 'string') {
        return value.replace(/[\u007F-\uFFFF]/g, (match) =>
          '\\u' + ('0000' + match.charCodeAt(0).toString(16)).slice(-4)
        );
      }
      return value;
    });
}
  

function callApi(url, bodyObject, type = 'application/json', method = 'POST') {
    const methodsWithRequestBody = ['POST', 'PUT', 'PATCH'];
    const options: HTTPOptions = {
        method: method,
        headers: {
            'Content-Type': type
        }
    };

    if (methodsWithRequestBody.includes(method.toUpperCase())) {
        options.body = type == 'application/json' ? convertToJSON(bodyObject) : bodyObject;
    };

    return fetch(url, options)
        .then(response => {
            if (response.status == 400) {
                return {probability_AI_generated: 0};
            }
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            throw error
        });
}


export {executeInTab, executeInCurrentTab, wrapResponse, callApi}