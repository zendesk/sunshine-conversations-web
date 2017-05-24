import { soundNotification } from '../constants/assets';

let notificationSoundPlaying = false;
let currentAudio;

export function isAudioSupported() {
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

export function playNotificationSound() {
    if (isAudioSupported() && !notificationSoundPlaying) {
        currentAudio = new Audio(soundNotification);
        currentAudio.addEventListener('playing', onNotificationPlaying);
        currentAudio.addEventListener('pause', onNotificationPause);
        currentAudio.addEventListener('ended', onNotificationEnded);
        currentAudio.play();
    }
}

export function stopNotificationSound() {
    if (currentAudio && notificationSoundPlaying) {
        currentAudio.pause();
        unloadAudio();
    }
}
