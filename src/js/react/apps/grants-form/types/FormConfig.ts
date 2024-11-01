import React from 'react'
import { type FormProps } from '../types/FormProps';
import { type AnyZodObject } from 'zod'

export type FormConfigItem = {
  label: string
  render: React.FunctionComponent<FormProps>,
  schema?: AnyZodObject
}

export type FormConfig = Array<FormConfigItem>
