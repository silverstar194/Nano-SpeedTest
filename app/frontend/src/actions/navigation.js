export const SWITCH_TAB = 'SWITCH_TAB';

export function switchTab(tab) {
  return {
    type: SWITCH_TAB,
    tab
  };
}
