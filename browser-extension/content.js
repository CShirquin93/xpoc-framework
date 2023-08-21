// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

document.addEventListener('contextmenu', function(event) {
    const lastContextMenuTarget = event.target;
    console.log(`contextmenu event fired. lastContextMenuTarget`, lastContextMenuTarget);

    // XPOC URI regex
    const regex = /(xpoc:\/\/[a-zA-Z0-9\-\.]+(?:\/[a-zA-Z0-9\-\.]+)*)/;

    // extract URI from innerHTML
    console.log(`lastContextMenuTarget.innerHTML: "${lastContextMenuTarget.innerHTML}"`);
    const targetString = lastContextMenuTarget.innerHTML;
    console.log(`targetString: "${targetString}"`);

    const match = regex.exec(targetString);
    if (match) {
        const xpocUri = match[1];
        console.log("Found a valid xpoc link:", xpocUri);
        chrome.runtime.sendMessage({action: "showContextMenu", href: xpocUri});
    } else {
        console.log("Target does not contain a valid xpoc link");
        chrome.runtime.sendMessage({action: "hideContextMenu"});
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // TODO: don't use a alert popup
    if (request.action === 'displayXpocContent') {
        if (request.result) {
            const result = 
                "XPOC Information\n" +
                "\n" +
                "Origin information\n" +
                "Name: " + request.result.name + "\n" +
                "Website: " + request.result.url + "\n" +
                "\n" +
                "Content information\n" +
                "Title: " + request.result.content.title + "\n" +
                "URL: " + request.result.content.url + "\n" +
                "PUID: " + request.result.content.puid + "\n" +
                "Account: " + request.result.content.account + "\n";
            alert(result);
        }
    }
    if (request.action === 'xpocNotFound') {
        alert('Page not found in XPOC manifest');
    }
})