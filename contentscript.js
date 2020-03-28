const allCardIdsStorageKey = "allCardIds";
const cardInfoStoragePrefix = "cardInfo";

printMessage = (message) => {
    console.log(`Jirasol: ${message}`);
}

getCardInfoStorageKey = (cardId) => cardInfoStoragePrefix + cardId;

saveInfo = (key, info, callback) => {
    chrome.storage.sync.set({
        [key]: info
    }, callback);
}

getInfo = (key, callback) => {
    chrome.storage.sync.get(key, (obj) => {
        var value = obj[key];
        callback(key, value);
    });
};

saveCardInfo = (cardId, info, callback) => {
    var key = cardInfoStoragePrefix + cardId;
    saveInfo(key, info, callback);
}

getCardInfo = (cardId, callback) => {
    var key = cardInfoStoragePrefix + cardId;

    getInfo(key, (x, y) => callback(x, y));
}

printMessage(`jQuery type: ${typeof (jQuery)}`);

if (!jQuery || !$) {
    printMessage("jQuery not loaded");
} else {

    var cardIdElements = $(".ghx-key[aria-label]");

    printMessage(`Found cards: ${cardIdElements.length}`);

    var cardsInfo = [];

    $(cardIdElements).each((index, element) => { cardsInfo.push([element, $(element).attr('aria-label')]) });

    var cardIdsInfo = $(cardsInfo).map((index, x) => x[1]).get();

    getInfo(allCardIdsStorageKey, (x, y) => printMessage(`Current number of cards ${x} = ${y.length}`));

    saveInfo(allCardIdsStorageKey, cardIdsInfo, () => printMessage(`Info stored for all cards ${allCardIdsStorageKey} = ${cardIdsInfo.length}`));

    var now = new Date().getTime().toString();

    $(cardsInfo).each((index, cardInfo) => {

        printMessage(cardInfo[1]);

        getCardInfo(cardInfo[1], (x, y) => printMessage(`Current value for card ${x} = ${y}`));

        saveCardInfo(cardInfo[1], now, () => printMessage(`Info stored for card ${cardInfo[1]} = ${now}`));
    });
}

messageReceived = (message, sender, sendResponse) => {
    printMessage(message.txt);
}

chrome.runtime.onMessage.addListener(messageReceived);