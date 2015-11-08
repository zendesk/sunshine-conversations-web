export const TOGGLE_WIDGET = 'TOGGLE_WIDGET';
export const OPEN_WIDGET = 'OPEN_WIDGET';
export const CLOSE_WIDGET = 'CLOSE_WIDGET';
export const SHOW_SETTINGS = 'SHOW_SETTINGS';
export const HIDE_SETTINGS = 'HIDE_SETTINGS';
export const SHOW_SETTINGS_NOTIFICATION = 'SHOW_SETTINGS_NOTIFICATION';
export const HIDE_SETTINGS_NOTIFICATION = 'HIDE_SETTINGS_NOTIFICATION';

export function toggleWidget() {
  return {
    type: TOGGLE_WIDGET
  };
}

export function openWidget() {
  return {
    type: OPEN_WIDGET
  };
}

export function closeWidget() {
  return {
    type: CLOSE_WIDGET
  };
}

export function showSettings() {
  return {
    type: SHOW_SETTINGS
  };
}

export function hideSettings() {
  return {
    type: HIDE_SETTINGS
  };
}

export function showSettingsNotification() {
  return {
    type: SHOW_SETTINGS_NOTIFICATION
  };
}

export function hideSettingsNotification() {
  return {
    type: HIDE_SETTINGS_NOTIFICATION
  };
}
