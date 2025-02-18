import { useAtomValue } from 'jotai';

import CardItem from '@/react/common/Card';
import Result from '@/types/Result';
import { currentLanguage } from '../../query/queries';
import Job from '../../types/Job';
import { urlAtom } from '../../store';

const getResultCard = ({
  title,
  field_employment,
  field_employment_type,
  field_job_duration,
  field_jobs,
  field_organization_name,
  field_recruitment_id,
  unpublish_on,
  url,
  _language
}: Job) => {
  const langAttribute = { lang: _language === currentLanguage ? undefined : _language };

  const heading = title[0];
  const cardTitle = (
    <>
      <span {...langAttribute}>{heading}</span>
      {field_jobs?.[0] > 1 && <span>{` (${field_jobs} ${Drupal.t('jobs', {}, {context: 'Job search'})})`}</span>}
    </>
  );

  const getDate = (() => {
    let date: undefined|string;
    let dateObject: undefined|Date;
    const unpublish = unpublish_on?.[0];

    if (!unpublish || Number.isNaN(unpublish)) {
      return '-';
    }

    try {
      dateObject = new Date(unpublish * 1000);
      date = dateObject.toLocaleString('fi-FI', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.warn(`Unable to parse date for job ${field_recruitment_id?.[0]}: ${  e}`);
      return undefined;
    }

    return date;
  });

  const orgName = field_organization_name && field_organization_name.length > 0 && field_organization_name[0] || '';
  const employmentTags = Array.isArray(field_employment) ? field_employment : [];
  const typeTags = Array.isArray(field_employment_type) ? field_employment_type : [];
  const tags: any = employmentTags.concat(typeTags).map(tag => ({ tag }));

  return (
    <CardItem
      cardDescription={orgName}
      cardModifierClass='node--type-job-listing node--view-mode-teaser'
      cardTags={tags}
      cardTitle={cardTitle}
      cardUrl={url?.[0]}
      date={getDate()}
      dateLabel={Drupal.t('Application period ends', {}, {context: 'Job search'})}
      daterange={field_job_duration?.[0].toString()}
      dateRangeLabel={Drupal.t('Employment contract', {}, {context: 'Job search'})}
      langAttribute={langAttribute}
    />
  );
};

type ResultCardProps = {
  job: Job,
  innerHits: Result<Job>[]
};

const ResultCard = ({
  job,
  innerHits
}: ResultCardProps) => {
  const {
    _language,
    title,
  } = job;

  if (!title || !title.length) {
    return null;
  }

  const languageFilterActive = useAtomValue(urlAtom)?.language;
  // If no filtering by language, prefer showing current language translation
  if (!languageFilterActive && innerHits.length > 1 && !_language.includes(currentLanguage)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const hit of innerHits) {
      if (hit._source._language.includes(currentLanguage)) {
        return getResultCard(hit._source);
      }
    }
  }

  return getResultCard(job);
};

export default ResultCard;
