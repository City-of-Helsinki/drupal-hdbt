import { HTMLAttributes } from 'react';
import CardItem from '@/react/common/Card';

import Job from '../../types/Job';

const ResultCard = ({
  title,
  field_copied,
  field_original_language,
  field_employment,
  field_employment_type,
  field_job_duration,
  field_jobs,
  field_organization_name,
  field_recruitment_id,
  unpublish_on,
  url,
}: Job) => {
  if (!title || !title.length) {
    return null;
  }

  const customAtts: HTMLAttributes<HTMLHeadingElement | HTMLDivElement> = {};
  if (field_copied?.length && field_original_language?.length) {
    const [ lang ] = field_original_language;
    customAtts.lang = lang;
  }

  const heading = title[0];
  const cardTitle = (
    <>
      <span {...customAtts}>{heading.charAt(0).toUpperCase() + heading.slice(1)}</span>
      {field_jobs?.[0] > 1 && <span>{` (${field_jobs} ${Drupal.t('jobs')})`}</span>}
    </>
  );

  const orgName = field_organization_name && field_organization_name.length > 0 && field_organization_name[0] || '';
  
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

  const employmentTags = Array.isArray(field_employment) ? field_employment : [];
  const typeTags = Array.isArray(field_employment_type) ? field_employment_type : [];
  const tags: any = employmentTags.concat(typeTags).map(tag => ({
      tag
    }));

  return (
    <CardItem
      cardDescription={orgName}
      cardModifierClass='node--type-job-listing node--view-mode-teaser'
      cardTags={tags}
      cardTitle={cardTitle}
      cardUrl={url?.[0]}
      date={getDate()}
      dateLabel={Drupal.t('Application period ends')}
      daterange={field_job_duration?.[0].toString()}
      dateRangeLabel={Drupal.t('Employment contract')}
    />
  );
};

export default ResultCard;
