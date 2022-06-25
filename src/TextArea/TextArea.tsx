import React, { FC, useMemo } from 'react';
import { TextAreaProps } from '../models/input';



export const TextArea = <T extends object, N extends string>({name, id,form,onChange,...props}: TextAreaProps<T, N>) => {
  const textareaInput = useMemo(() =>  {
    // @ts-ignore
  return<textarea {...props}  id={id} name={name} onChange={(e) => onChange(e, name, false)}></textarea>}, [id, name, JSON.stringify(props), JSON.stringify(onChange)])
    return <>{textareaInput}</>
  }

export default TextArea;

export type ITextArea<T extends object, N extends string> = ({ name, id, form, onChange, ...props }: TextAreaProps<T, N>) => JSX.Element