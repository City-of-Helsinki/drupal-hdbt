import ApiKeys from '../enum/ApiKeys';
import { TargetGroups } from '../enum/TargetGroups';
import type OptionType from '../types/OptionType';
import type { TargetGroup } from '../types/TargetGroup';

export const targetGroupsToParams = (selectedGroups: OptionType[]) => {
  const result = selectedGroups.reduce(
    (targetGroups: [string[], string[]], group: OptionType) => {
      // @ts-expect-error
      const target: TargetGroup = TargetGroups[group.value];
      if (target.ids) {
        targetGroups[0] = targetGroups[0].concat(target.ids);
      }
      if (target.negateIds) {
        targetGroups[1] = targetGroups[1].concat(target.negateIds);
      }
      return targetGroups;
    },
    [[], []],
  );

  // Filter out intersecting target groups
  const negateIds = result[1].filter((targetGroup) => result[0].indexOf(targetGroup) === -1).join(',');

  return {
    [ApiKeys.KEYWORDS]: result[0].join(','),
    // When no negating ids are present, return null to remove keyword! param entirely or '' to return params to initial value
    [ApiKeys.NEGATE_KEYWORDS]: negateIds || (selectedGroups.length ? null : ''),
  };
};
