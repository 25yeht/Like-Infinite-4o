var inputBox;
var sendBtn;

function updateEls() {
    inputBox = document.querySelector("#prompt-textarea");
    sendBtn = document.querySelector("[data-testid=send-button]");
}

async function wait(ms) {
    await new Promise(function(r) {
        setTimeout(r, ms);
    });
}

async function waitUntilInput() {
    var resolve;
    var promise = new Promise(function(r) {
        resolve = r;
    });

    inputBox.oninput = function() {
        inputBox.oninput = null;
        resolve();
    };

    await promise;
}

function isGenerating() {
    return !!document.querySelector("[aria-label='Stop generating']");
}

function getLatestMessage() {
    var messages = document.querySelectorAll("[data-message-author-role=assistant]");
    return messages[messages.length - 1].textContent;
}

async function waitUntilDone() {
    var lastIG = false;

    var resolve;
    var promise = new Promise(function(r) {
        resolve = r;
    });
    
    var observer = new MutationObserver(function() {
        var ig = isGenerating();

        if(!ig && ig !== lastIG) {
            observer.disconnect();
            resolve();
        }

        lastIG = ig;
    });

    observer.observe(document, { attributes: true, subtree: true, childList: true });

    await promise;
    await wait(200);
}

async function sendGPT(message) {
    updateEls();

    inputBox.value = message;
    await waitUntilInput();
    await wait(100);
    sendBtn.click();

    await waitUntilDone();
    return getLatestMessage();
}

async function processResponse(msg) {
    if(msg.startsWith("/request-tool:")) {
        var tool = msg.slice(15).split(" ")[0];

        switch(tool) {
            case "google":
                await sendGPT("/tool-response:\n" + prompt("tool response (google)"));
                break;
            case "pedia":
                await sendGPT("/request-failed:");
                break;
        }
    }
}

function startListening() {
    var lastIG = false;
    var observer = new MutationObserver(async function() {
        var ig = isGenerating();

        if(!ig && ig !== lastIG) {
            await wait(200);
            processResponse(getLatestMessage());
        }

        lastIG = ig;
    });

    observer.observe(document, { attributes: true, subtree: true, childList: true });
}

var thePrompt = prompt("Enter init prompt:");
var response = (await sendGPT(thePrompt)).trim();

if(response !== "/init:") throw new Error("Not init!");
startListening();
