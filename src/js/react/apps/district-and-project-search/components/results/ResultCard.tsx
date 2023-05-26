import Result from '../../types/Result';
import { capitalize } from '../../helpers/helpers';
import CardItem from '@/react/common/Card';
import TagType from '../../types/TagType';

const ResultCard = ({
  content_type,
  title_for_ui,
  url,
  project_image_absolute_url,
  field_project_image_alt,
  field_project_image_width,
  field_project_image_height,
  district_image_absolute_url,
  field_district_image_alt,
  field_district_image_width,
  field_district_image_height,
  project_execution_schedule,
  project_plan_schedule,
  field_project_district_title_for_ui,
  field_project_external_website,
  field_project_theme_name,
  field_district_subdistricts_title_for_ui
}: Result) => {
  const linkUrl = field_project_external_website ? field_project_external_website[0] : `${url}`;
  let imageUrl = project_image_absolute_url ? project_image_absolute_url[0] : '';
  imageUrl = district_image_absolute_url ? district_image_absolute_url[0] : imageUrl;
  let imageAlt = field_project_image_alt && field_project_image_alt?.[0] !== '""' ? field_project_image_alt[0] : '';
  imageAlt = field_district_image_alt && field_district_image_alt?.[0] !== '""' ? field_district_image_alt[0] : imageAlt;
  let imageWidth = field_project_image_width ? field_project_image_width[0] : null;
  imageWidth = field_district_image_width ? field_district_image_width[0] : imageWidth;
  let imageHeight = field_project_image_height ? field_project_image_height[0] : null;
  imageHeight = field_district_image_height ? field_district_image_height[0] : imageHeight;

  const cardImage = imageUrl ? (
    // eslint-disable-next-line react/no-unknown-property
    <img src={imageUrl} alt={imageAlt} {...imageWidth && { 'width': imageWidth }} {...imageHeight && { 'height': imageHeight }} loading="lazy" typeof="foaf:Image" />
  ) : (
    <div className="image-placeholder">
      <span className="hel-icon hel-icon--home-smoke"></span>
    </div>
  );

  const isProject = content_type[0] === 'project';
  const cardModifierClass = isProject ? 'card--project' : 'card--district';
  const cardCategoryTag: TagType = {
    tag: isProject ?
      Drupal.t('Project', {}, { context: 'District and project search' })
      :
      Drupal.t('District', {}, { context: 'District and project search' }),
    color: isProject ? 'gold' : 'coat-of-arms',
  };

  const getVisibleTime = (dateString: number): string => {
    const dateObject = new Date(dateString);
    // en-US because the date is displayed month/year.
    return dateObject.toLocaleString('en-US', {
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getHtmlTime = (dateString: number): string => {
    const d = new Date(dateString);
    return `${d.toLocaleString('fi-FI', {year: 'numeric'})}-${d.toLocaleString('fi-FI', {month: '2-digit'})}-${d.toLocaleString('fi-FI', {day: '2-digit'})}T${d.toLocaleString('fi-FI', {hour: '2-digit'})}:${d.toLocaleString('fi-FI', {minute: '2-digit'})}Z`;
  };

  const getTimeItem = (dateStrings: any): JSX.Element => (
    dateStrings.map((dateString: number, i: number) => (
      <time dateTime={getHtmlTime(dateString)} key={`${dateString}-${i}`}> {i !== 0 && '-'} {getVisibleTime(dateString)}</time>
    ))
  );

  let schedule: JSX.Element|undefined;
  if (project_plan_schedule || project_execution_schedule) {
    schedule = (
      <>
        { project_plan_schedule &&
          <span className="metadata__item--schedule metadata__item--schedule--plan-schedule">
            {Drupal.t('planning')}
            {getTimeItem(project_plan_schedule)}
          </span>
        }
        {project_plan_schedule && project_execution_schedule && ' ' }
        {project_execution_schedule &&
          <span className="metadata__item--schedule">
            {Drupal.t('execution')}
            {getTimeItem(project_execution_schedule)}
          </span>
        }
      </>
    );
  }

  let location;
  if (field_project_district_title_for_ui) {
    location = field_project_district_title_for_ui.map((item) => item).join(', ');
  }

  if (field_district_subdistricts_title_for_ui) {
    location = field_district_subdistricts_title_for_ui.map((item) => item).join(', ');
  }

  return (
    <CardItem
      cardModifierClass={cardModifierClass}
      cardImage={cardImage}
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
