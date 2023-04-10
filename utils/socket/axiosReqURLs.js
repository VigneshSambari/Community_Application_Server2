const config = require('config');

const currentUrl = config.get("CurrentURL");

const profileURLS = {
    "setOnline": `${currentUrl}profile/setonline/`,
    "setOfflineLastSeen": `${currentUrl}profile/setoffline/`,
    
}


const roomURLS = {
    "checkIfMemberOfRoom": `${currentUrl}room/checkmember/`,
    "sendMessage": `${currentUrl}room/sendmessage/`
}


const messageUrls = {
    "createMessage": `${currentUrl}message/create/`
}

const personalChatURLS = {
    "checkIfMemberOfChat": `${currentUrl}textuser/checkmember/`,
}

module.exports = {
    profileURLS,
    roomURLS,
    personalChatURLS,
    messageUrls
}