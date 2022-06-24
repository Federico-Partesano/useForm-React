import React, { FC } from 'react';
import { InputProps } from '../models/input';



const Field = <T extends object = {prova: string}>({name, id,form,onChange,...props}: InputProps<T>) => {
    // @ts-ignore
    return <input {...props}  id={id} name={name} onBlur={(e) => onChange(e, name, false)}></input>
  }

export default Field;

export type IField<T extends object> = ({ name, id, form, onChange, ...props }: InputProps<T>) => JSX.Element