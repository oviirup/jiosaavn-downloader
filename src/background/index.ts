// Block ADs on JioSaavn
const adServerURLs = [
  "https://*.saavn.com/web6/admanager/*",
  "https://*.doubleclick.net/pagead/*",
];

let ruleId = 280; // Unique ID for the rule

chrome.declarativeNetRequest.getDynamicRules((rule) => {
  const usedIds = new Set(rule.map((r) => r.id));
  while (usedIds.has(ruleId)) ruleId++;
});

chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [ruleId],
  addRules: [
    {
      id: ruleId,
      priority: 1,
      action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
      condition: {
        domains: adServerURLs,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT],
      },
    },
  ],
});
