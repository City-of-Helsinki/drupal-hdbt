/**
 * Returns an SWR fetcher that posts the query body to the vehicle removal index.
 */
export const getFetcher = (url?: string) => async (body: string) => {
  const response = await fetch(`${url}/mobilenote_data/_search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  return response.json();
};
