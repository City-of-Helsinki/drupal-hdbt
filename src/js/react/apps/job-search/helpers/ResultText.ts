const statlineContext = { context: 'Job search results statline' };

export const getResultText = (jobs: number): string =>
  Drupal.formatPlural(jobs, '1 open position', '@count open positions', {}, statlineContext);

export const getOptionalResultText = (total: number): string =>
  Drupal.formatPlural(total, '1 job listing', '@count job listings', {}, statlineContext);

export const getEmptyResultText = (): string =>
  Drupal.t('No results', {}, { context: 'Content list with count no results title' });

export const getStatusText = (jobs: number, total: number, error?: unknown): string => {
  if (error) {
    return Drupal.t('An error occurred while loading the content', {}, { context: 'React search' });
  }

  if (total <= 0) {
    return getEmptyResultText();
  }

  return `${getResultText(jobs)}, ${getOptionalResultText(total)}`;
};
