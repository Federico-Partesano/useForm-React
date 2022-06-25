import React, { FC, useMemo } from 'react';
import { TextAreaProps } from '../models/input';



export const TextArea = <T extends object = {prova: string}>({name, id,form,onChange,...props}: TextAreaProps<T>) => {
  const textareaInput = useMemo(() =>  {
    // @ts-ignore
  return<textarea {...props}  id={id} name={name} onChange={(e) => onChange(e, name, false)}></textarea>}, [id, name, JSON.stringify(props), JSON.stringify(onChange)])
    return <>{textareaInput}</>
  }

export default TextArea;

export type ITextArea<T extends object> = ({ name, id, form, onChange, ...props }: TextAreaProps<T>) => JSX.Element