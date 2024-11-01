import { useAtomValue } from 'jotai';
import React, { type ReactNode } from 'react';
import { getCurrentStepAtom, getItemsAtom } from '../store';
import { z, ZodFormattedError } from 'zod';

type FormFieldProps = {
  element: React.FunctionComponent<any>;
  [key: string]: any;
};

export const FormField = ({
  element,
  ...props
}: FormFieldProps) => {
  const step = useAtomValue(getCurrentStepAtom);
  const items = useAtomValue(getItemsAtom);
  const item = items[step];
  const { name } = props;
  // @ts-ignore
  const error: ZodFormattedError<z.infer<typeof item.schema>>|ZodFormattedError|undefined = item?.error?.format();

  return (
    React.createElement(element, {
      ...props,
      invalid: Boolean(error?.[name]),
      errorText: error?.[name] ? error?.[name]._errors.join('\n') : undefined
    })
  );
};
