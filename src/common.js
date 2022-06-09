const APPLICABLE_PROTOCOLS = ["http:", "https:"];

function protocolIsApplicable(url) {
    const protocol = (new URL(url)).protocol;
    return APPLICABLE_PROTOCOLS.includes(protocol);
}

function doThing() {
    function removeInputAttribute(array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].hasAttribute('readonly')) {
                array[i].removeAttribute('readonly');
            }
            if (array[i].hasAttribute('disabled')) {
                array[i].removeAttribute('disabled');
            }
        }
    };

    removeInputAttribute(document.querySelectorAll('input[type="text"]'));
    removeInputAttribute(document.querySelectorAll('input[type="password"]'));
}

export { protocolIsApplicable, doThing };
