import type React from 'react';
import { useAtomValue } from 'jotai';
import CommonSearchMonitor from '@/react/common/SearchMonitor';
import type TagType from '@/types/TagType';
import useQueryString from '../hooks/useQueryString';
import { groupOptionsAtom, neighbourhoodOptionsAtom, topicOptionsAtom, urlAtom } from '../store';

const SearchMonitorContainer = ({ dialogTargetRef }: { dialogTargetRef: React.RefObject<HTMLDivElement> }) => {
  const urlParams = useAtomValue(urlAtom);
  const topicOptions = useAtomValue(topicOptionsAtom);
  const neighbourhoodOptions = useAtomValue(neighbourhoodOptionsAtom);
  const groupOptions = useAtomValue(groupOptionsAtom);
  const elasticQuery = useQueryString(urlParams);

  const { hakuvahti } = drupalSettings;

  if (!hakuvahti) {
    return null;
  }

  const selectionTags: TagType[] = [];

  if (urlParams.keyword?.length) {
    selectionTags.push({ tag: `"${urlParams.keyword.trim()}"` });
  }

  const resolveLabels = (ids: number[] | undefined, options: { label: string; value: string }[]) => {
    ids?.forEach((id) => {
      const option = options.find((o) => Number(o.value) === id);
      if (option) {
        selectionTags.push({ tag: option.label });
      }
    });
  };

  resolveLabels(urlParams.topic, topicOptions);
  resolveLabels(urlParams.neighbourhoods, neighbourhoodOptions);
  resolveLabels(urlParams.groups, groupOptions);

  return (
    <CommonSearchMonitor
      apiUrl={hakuvahti.apiUrl}
      dialogTargetRef={dialogTargetRef}
      elasticQuery={elasticQuery}
      enabledNotificationMethods={['email']}
      selectionTags={selectionTags}
      texts={{
        tosCheckboxLabel: Drupal.t(
          'I consent to the processing of my personal data for the purpose of the news alert service',
          {},
          { context: 'News search monitor' },
        ),
        tosLinkText: Drupal.t('Read the privacy notice', {}, { context: 'News search monitor' }),
        tosLinkUrl: hakuvahti.texts.hakuvahti_tos_link_url || '',
        instructionsLinkUrl: hakuvahti.texts.hakuvahti_instructions_link_url,
        noSelectionsNotification: Drupal.t(
          'You have not selected any search criteria.',
          {},
          { context: 'News search monitor' },
        ),
      }}
    />
  );
};

export default SearchMonitorContainer;
