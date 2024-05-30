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

async function sendGPT(message) {
    updateEls();

    inputBox.value = message;
    await waitUntilInput();
    await wait(100);
    sendBtn.click();

    await waitUntilDone();
}
