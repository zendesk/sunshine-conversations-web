'use strict';

exports.__esModule = true;
exports.isAudioSupported = isAudioSupported;
exports.playNotificationSound = playNotificationSound;
exports.stopNotificationSound = stopNotificationSound;

var _assets = require('../constants/assets');

var notificationSoundPlaying = false;
var currentAudio = void 0;

function isAudioSupported() {
    return !!global.Audio;
}

function onNotificationPlaying() {
    notificationSoundPlaying = true;
}

function onNotificationPause() {
    notificationSoundPlaying = false;
}

function onNotificationEnded() {
    notificationSoundPlaying = false;
    unloadAudio();
}

function unloadAudio() {
    if (currentAudio) {
        currentAudio.removeEventListener('playing', onNotificationPlaying);
        currentAudio.removeEventListener('pause', onNotificationPause);
        currentAudio.removeEventListener('ended', onNotificationEnded);
        currentAudio = undefined;
    }
}

function playNotificationSound() {
    if (isAudioSupported() && !notificationSoundPlaying) {
        currentAudio = new Audio(_assets.soundNotification);
        currentAudio.addEventListener('playing', onNotificationPlaying);
        currentAudio.addEventListener('pause', onNotificationPause);
        currentAudio.addEventListener('ended', onNotificationEnded);
        currentAudio.play();
    }
}

function stopNotificationSound() {
    if (currentAudio && notificationSoundPlaying) {
        currentAudio.pause();
        unloadAudio();
    }
}