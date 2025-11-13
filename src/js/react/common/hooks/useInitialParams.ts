const coerce = (value: string, type: string) => {
  switch (type) {
    case 'boolean':
      return Boolean(value);
    case 'number':
      return Number(value);
    default:
      return value.toString();
  }
};

// biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
const useInitialParams = <T extends Record<string, any>>(params: T) => {
  const initialParams = new URLSearchParams(window.location.search);
  const entries = initialParams.entries();
  let result = entries.next();
  let hits = 0;

  while (!result.done) {
    const [key, value] = result.value;

    if (value && key in params) {
      hits += 1;
      // @ts-expect-error
      params[key as keyof T] = coerce(value, typeof params[key as keyof T]);
    }

    result = entries.next();
  }

  return hits ? params : null;
};

export default useInitialParams;
