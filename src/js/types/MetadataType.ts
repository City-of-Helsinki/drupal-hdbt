type MetadataType = {
  icon: React.JSX.Element | string;
  label: string;
  content: React.JSX.Element | string | Array<string>;
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
  langAttribute?: any;
};

export default MetadataType;
