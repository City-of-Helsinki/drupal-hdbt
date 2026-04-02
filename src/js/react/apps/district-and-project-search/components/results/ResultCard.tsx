import CardItem from '@/react/common/Card';
import CardPicture from '@/react/common/CardPicture';
import { capitalize } from '../../helpers/helpers';
import type Result from '../../types/Result';
import type TagType from '../../types/TagType';
import { useMainImage } from '@/react/common/hooks/useMainImage';

const ResultCard = ({
  _id,
  content_type,
  field_district_image_alt,
  field_district_subdistricts_title_for_ui,
  field_project_district_title_for_ui,
  field_project_external_website,
  field_project_image_alt,
  field_project_theme_name,
  main_image_url,
  project_execution_schedule,
  project_plan_schedule,
  title_for_ui,
  url,
}: Result) => {
  const linkUrl = field_project_external_website ? field_project_external_website[0] : `${url}`;
  let imageAlt = field_project_image_alt && field_project_image_alt?.[0] !== '""' ? field_project_image_alt[0] : '';
  imageAlt =
    field_district_image_alt && field_district_image_alt?.[0] !== '""' ? field_district_image_alt[0] : imageAlt;
  const { src, keyedStyles } = useMainImage(main_image_url);

  const getImage = () => {
    if (!main_image_url?.toString()?.length) {
      return undefined; // No image to display
    }

    return <CardPicture alt={imageAlt} imageUrls={keyedStyles} src={src} />;
  };

  const isProject = content_type[0] === 'project';
  const cardModifierClass = isProject ? 'card--project' : 'card--district';
  const cardCategoryTag: TagType = {
    tag: isProject
      ? Drupal.t('Project', {}, { context: 'District and project search' })
      : Drupal.t('District', {}, { context: 'District and project search' }),
    color: isProject ? 'gold' : 'coat-of-arms',
  };

  const getVisibleTime = (dateString: string): string => {
    const dateObject = new Date(dateString);
    // en-US because the date is displayed month/year.
    return dateObject.toLocaleString('en-US', { month: '2-digit', year: 'numeric' });
  };

  const getHtmlTime = (dateString: string): string => {
    const d = new Date(dateString);
    return `${d.toLocaleString('fi-FI', { year: 'numeric' })}-${d.toLocaleString('fi-FI', { month: '2-digit' })}-${d.toLocaleString('fi-FI', { day: '2-digit' })}T${d.toLocaleString('fi-FI', { hour: '2-digit' })}:${d.toLocaleString('fi-FI', { minute: '2-digit' })}Z`;
  };

  const getTimeItem = (dateStrings: string[], idPrefix: string = '') =>
    dateStrings.map((dateString: string, i: number) => {
      const timestamp = new Date(dateString).getTime();
      const uniqueId = `${idPrefix}-${timestamp}`;
      return (
        <time dateTime={getHtmlTime(dateString)} key={uniqueId}>
          {' '}
          {i !== 0 && '-'} {getVisibleTime(dateString)}
        </time>
      );
    });

  let schedule: JSX.Element | undefined;
  if (project_plan_schedule || project_execution_schedule) {
    schedule = (
      <>
        {project_plan_schedule && (
          <span className='metadata__item--schedule metadata__item--schedule--plan-schedule'>
            {Drupal.t('planning', {}, { context: 'District and project search' })}
            {getTimeItem(project_plan_schedule, _id)}
          </span>
        )}
        {project_plan_schedule && project_execution_schedule && ' '}
        {project_execution_schedule && (
          <span className='metadata__item--schedule'>
            {Drupal.t('execution', {}, { context: 'District and project search' })}
            {getTimeItem(project_execution_schedule, _id)}
          </span>
        )}
      </>
    );
  }

  let location: string | undefined;
  if (field_project_district_title_for_ui) {
    location = field_project_district_title_for_ui.map((item) => item).join(', ');
  }

  if (field_district_subdistricts_title_for_ui) {
    location = field_district_subdistricts_title_for_ui.map((item) => item).join(', ');
  }

  return (
    <CardItem
      cardModifierClass={cardModifierClass}
      cardImage={getImage()}
      cardTitle={title_for_ui[0]}
      cardUrl={linkUrl}
      cardUrlExternal={!!field_project_external_website}
      cardCategoryTag={cardCategoryTag}
      location={location}
      theme={field_project_theme_name?.map((item) => capitalize(item)).join(', ')}
      daterange={schedule && schedule}
    />
  );
};

export default ResultCard;
