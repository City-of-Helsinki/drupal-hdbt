import type React from 'react';
import CommonSearchMonitor from '@/react/common/SearchMonitor';
import useQueryString from '../hooks/useQueryString';
import { useVisibleSelections } from '../hooks/useVisibleSelections';
import { useSelectionTags } from '../hooks/useSelectionTags';
import SearchComponents from '../enum/SearchComponents';

const SearchMonitorContainer = ({ dialogTargetRef }: { dialogTargetRef: React.RefObject<HTMLDivElement> }) => {
  const elasticQuery = useQueryString();
  const selections = useVisibleSelections(true);
  const selectionTags = useSelectionTags(
    selections.map((selection) => {
      const [key, value] = selection;

      if (key === SearchComponents.KEYWORD) {
        return [key, `"${value.toString().trim()}"`];
      }

      return selection;
    }),
  );

  const { hakuvahti } = drupalSettings;

  if (!hakuvahti) {
    return null;
  }

  return (
    <CommonSearchMonitor
      apiUrl={hakuvahti.apiUrl}
      dialogTargetRef={dialogTargetRef}
      elasticQuery={elasticQuery}
      enabledNotificationMethods={['email']}
      selectionTags={selectionTags}
      texts={{
        tosCheckboxLabel: hakuvahti.texts.hakuvahti_tos_checkbox_label || '',
        tosLinkText: hakuvahti.texts.hakuvahti_tos_link_text || '',
        tosLinkUrl: hakuvahti.texts.hakuvahti_tos_link_url || '',
        instructionsLinkUrl: hakuvahti.texts.hakuvahti_instructions_link_url,
        noSelectionsNotification: Drupal.t(
          'You have not selected any search criteria. You will receive alerts of all new job listings.',
          {},
          { context: 'Search monitor no selections notification' },
        ),
      }}
    />
  );
};

export default SearchMonitorContainer;
