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

  return {
    [ApiKeys.KEYWORDS]: result[0].join(','),
    // Filter out intersecting target groups
    [ApiKeys.NEGATE_KEYWORDS]: result[1]
      .filter((targetGroup) => result[0].indexOf(targetGroup) === -1)
      .join(','),
  };
};
