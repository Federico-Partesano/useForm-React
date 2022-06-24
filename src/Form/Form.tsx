import { NestedKeys } from "advanced-types";
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Field, { IField } from "./../Field/Field";
import { getNestedValueFromString } from "../functions";
import useForm, {FormValidationItem} from "../useForm";
import { SpanProps } from "../models/input";

type FormType<T> = { [K in keyof T]: T[K] };

type IError<T extends object> = ({ name, ...props }: SpanProps<T>) => JSX.Element;
type ISubmit<T extends object> = (callback: (form: FormType<T>) => void) => void;
type IErrors<T extends object> = Partial<{ [x in keyof T]: string | undefined }> | FormType<T>;
type ISetForm<T extends object> = (key: NestedKeys<T, "/", 5>, value: any) => void;
interface IForm<T extends object> {
  initialValue: Record<any, any>;
  children: (props: { Field: IField<T>, setForm: ISetForm<T>, errors: IErrors<T>, Error: IError<T>, submit: ISubmit<T> }) => JSX.Element;
}

export const Form = <T extends object>({
  children,
  initialValue,
  validators
}: {
  children: IForm<T>["children"];
  initialValue: T;
  validators: { [K in NestedKeys<T, "/",5>]?: FormValidationItem<any> };

}) => {
  const { form, setForm, errors, submit, id } = useForm<T>(initialValue, validators);

  const Error = ({name, ...props}: SpanProps<T>) => {
    const errorInput = getNestedValueFromString(name, errors);
    const errorMemo = useMemo(() => {
      return errorInput ? <span {...props}>{errorInput}</span> : <></>
    }, [errors])
    return (
<>{errorMemo}</>
    )
  }

  const onChange = (key: NestedKeys<T, "/", 5>, value: any, debounce = true) => {
    setForm(key, value);
    const element = document.getElementById(`${id}-${key}`);
    element && ((element as any).value = value)
  }
    // @ts-ignore
  const child = useMemo(() => children({ Field, setForm: onChange, errors, Error, submit }), [children, errors]);
  useEffect(() => {
    console.log("form", form);
  }, [form]);

  const propsField = (
    name: NestedKeys<T, "/", 5>,
    type: React.InputHTMLAttributes<HTMLInputElement>["type"] = "string"
  ) => {
    // @ts-ignore
    const valueInput = getNestedValueFromString(name, form);
    console.log("🚀 ~ file: Form.tsx ~ line 38 ~ valueInput", valueInput)
    // @ts-ignore
    return {  onChange: ({ target: { value } }, name) => setForm(name, value),
      type,
      id: `${id}-${name}`,
      defaultValue: valueInput,
    };
  };

 




  const RecursiveMap = (element: any): any => {
    const t = React.Children.map(React.Children.toArray(element!),(element: any) => {
      if(!!element?.props?.children){
        return React.cloneElement(element, {...element?.props, children: RecursiveMap(element?.props?.children ) })
      } else {
        return element?.type?.name === "Field" ?
        React.cloneElement(element, {...element?.props,...propsField(element?.props?.name) })
        : element 
      }
  });
  return t;
}

  const ss = useMemo(() => {    
    // @ts-ignore
      console.log('inside');
      
    const newChildren =  React.Children.map(React.Children.toArray(child!) ,(element: any) => {
    if(!!element?.props?.children){
      
      return React.cloneElement(element, {...element?.props, children: RecursiveMap(element?.props?.children ) })
    }

        return element?.type?.name === "Field" ?
        React.cloneElement(element, {...element?.props,...propsField(element?.props?.name) })
        : element });
        return newChildren;
  }, [children, errors])

const cc = useCallback(() => {
        return <>{ss}</>
}, [children, errors]);


  return <>{cc()}</>;
};

export default Form;
