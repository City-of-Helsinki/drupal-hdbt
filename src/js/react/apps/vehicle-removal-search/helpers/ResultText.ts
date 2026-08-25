const context = { context: 'Vehicle removal search' };

const resultCountText = (total: number): string =>
  Drupal.formatPlural(String(total), '1 result', '@count results', {}, context);

export const getResultText = (total: number): string => (total > 0 ? resultCountText(total) : '');

export const getStatusText = (total: number, error?: string | Error): string => {
  if (error) {
    return Drupal.t('An error occurred while loading the content', {}, { context: 'React search' });
  }

  return total > 0 ? resultCountText(total) : Drupal.t('No vehicle removal requests', {}, context);
};
