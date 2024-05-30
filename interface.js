var inputBox = document.querySelector("#prompt-textarea");

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
