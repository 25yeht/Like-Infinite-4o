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
