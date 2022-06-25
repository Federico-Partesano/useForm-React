import React, { FC, useMemo } from 'react';
import { InputProps } from '../models/input';



const Field = <T extends object = {prova: string}>({name, id,form,onChange,...props}: InputProps<T>) => {
  const input = useMemo(() =>  {

    // @ts-ignore
  return<input {...props}  id={id} name={name} onChange={(e) => onChange(e, name, false)}></input>}, [id, name, JSON.stringify(props), JSON.stringify(onChange)])
    return <>{input}</>
  }

export default Field;

export type IField<T extends object> = ({ name, id, form, onChange, ...props }: InputProps<T>) => JSX.Element