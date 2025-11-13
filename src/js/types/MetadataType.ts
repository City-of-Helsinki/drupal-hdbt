type MetadataType = {
  icon: JSX.Element | string;
  label: string;
  content: JSX.Element | string | Array<string>;
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
  langAttribute?: any;
};

export default MetadataType;
