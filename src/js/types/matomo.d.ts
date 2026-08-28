type MatomoCustomDimensions = Partial<Record<`dimension${number}`, string>>;

type MatomoCommand =
  | ['trackPageView', string?, MatomoCustomDimensions?]
  | ['trackSiteSearch', string, (string | false)?, (number | false)?, MatomoCustomDimensions?]
  | ['trackEvent', string, string, string?, number?, MatomoCustomDimensions?];

declare namespace _paq {
  function push(args: MatomoCommand): void;
  function push(args: Array<string | number | boolean>): void;
}
