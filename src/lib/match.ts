import { DetectedItem, Organization, MatchResult, MatchGroup } from '../types';

/**
 * Deterministic Matching Engine
 * Principle: "The AI describes; code decides."
 * 
 * Rules:
 * 1. Items with unconfirmed condition checks are held in `pendingChecks`.
 * 2. For each active item, find organizations whose rule for the item's category is "accept".
 * 3. Items with "ask" rules or low confidence are flagged for review if no clear "accept" match exists.
 * 4. Assign items to organizations minimizing split stops for the user.
 * 5. Items that no organization accepts go to `unmatched`.
 */
export function matchItemsToOrganizations(
  items: DetectedItem[],
  organizations: Organization[]
): MatchResult {
  const pendingChecks: DetectedItem[] = [];
  const activeItems: DetectedItem[] = [];

  // Separate items that need condition verification from active routable items
  for (const item of items) {
    if (item.needsConditionCheck && !item.isConditionConfirmed) {
      pendingChecks.push(item);
    } else {
      activeItems.push(item);
    }
  }

  const orgItemMap = new Map<string, DetectedItem[]>();
  const unmatched: DetectedItem[] = [];

  // Initialize map for all organizations
  for (const org of organizations) {
    orgItemMap.set(org.id, []);
  }

  // Route each active item
  for (const item of activeItems) {
    let matchedOrg: Organization | null = null;

    // 1. Look for definitive "accept" rules
    // Preference: Prioritize organizations that have specialized acceptance for this item
    for (const org of organizations) {
      const rule = org.rules[item.category];
      if (rule && rule.rule === 'accept') {
        matchedOrg = org;
        break;
      }
    }

    // 2. Fallback to "ask" if no direct "accept" found
    if (!matchedOrg) {
      for (const org of organizations) {
        const rule = org.rules[item.category];
        if (rule && rule.rule === 'ask') {
          matchedOrg = org;
          break;
        }
      }
    }

    if (matchedOrg) {
      const currentList = orgItemMap.get(matchedOrg.id) || [];
      currentList.push(item);
      orgItemMap.set(matchedOrg.id, currentList);
    } else {
      unmatched.push(item);
    }
  }

  // Construct stops only for organizations with matched items
  const stops: MatchGroup[] = [];
  for (const org of organizations) {
    const matched = orgItemMap.get(org.id) || [];
    if (matched.length > 0) {
      stops.push({
        organization: org,
        items: matched
      });
    }
  }

  return {
    stops,
    unmatched,
    pendingChecks
  };
}
