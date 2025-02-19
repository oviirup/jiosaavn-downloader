// Block ADs on JioSaavn
const adServerURLs = ['https://*.saavn.com/web6/admanager/*', 'https://*.doubleclick.net/pagead/*'];
const DNR = chrome.declarativeNetRequest;
DNR.updateDynamicRules({
  removeRuleIds: [56099],
  addRules: [
    {
      id: 56099,
      priority: 1,
      action: { type: DNR.RuleActionType.BLOCK },
      condition: { domains: adServerURLs, resourceTypes: [DNR.ResourceType.SCRIPT] },
    },
  ],
});
