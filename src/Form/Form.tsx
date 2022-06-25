import { NestedKeys } from "advanced-types";
import React, { FC, InputHTMLAttributes, useCallback, useEffect, useMemo, useState } from "react";
import Field, { IField } from "./../Field/Field";
import { editValueInputOnSetForm, generatePropsInput, getNestedValueFromString } from "../functions";
import useForm, {FormValidationItem} from "../useForm";
import { SpanProps } from "../models/input";
import { ITextArea, TextArea } from "../TextArea/TextArea";

export type FormType<T> = { [K in keyof T]: T[K] };

type IError<T extends object> = ({ name, ...props }: SpanProps<T>) => JSX.Element;
type ISubmit<T extends object> = (callback: (form: FormType<T>) => void) => void;
type IErrors<T extends object> = Partial<{ [x in keyof T]: string | undefined }> | FormType<T>;
type ISetForm<T extends object> = (key: NestedKeys<T, "/", 3>, value: any) => void;
interface IForm<T extends object> {
  initialValue: Record<any, any>;
  children: (props: { Field: IField<T>, TextArea: ITextArea<T> ,setForm: ISetForm<T>, errors: IErrors<T>, Error: IError<T>, submit: ISubmit<T>, form: Partial<FormType<T>> }) => JSX.Element;
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
  // const elements = useRef<any[]>([]);
  const { form, setForm, errors, submit, id } = useForm<T>(initialValue, validators);

  const Error = ({name, ...props}: SpanProps<T>) => {
    const errorInput = getNestedValueFromString(name, errors);
    const errorMemo = useMemo(() => {
      return errorInput ? <span {...props} className={`${id}-${name}-is-invalid ${props.className}`}>{errorInput}</span> : <></>
    }, [errors, JSON.stringify(props)])
    return (
<>{errorMemo}</>
    )
  }

  const onChange = (key: NestedKeys<T, "/", 3>, value: any, debounce = true) => {
    setForm(key, value);
    const element = document.getElementById(`${id}-${key}`);
    if(!element) return;
    editValueInputOnSetForm(element.getAttribute("type"), element, value);
  }
    // @ts-ignore
  const child = useMemo(() => children({ Field, TextArea ,setForm: onChange, errors, Error, submit, form }), [children, errors, form]);

  const propsField = (
    name: string,
    type: InputHTMLAttributes<HTMLInputElement>["type"],
    element: any
  ) => {
    // @ts-ignore
    const valueInput = getNestedValueFromString(name, form);
    const valueForm = type === "checkbox" ? "checked" : "value";
    const addPropsInput = generatePropsInput(type, valueInput, element[valueForm  as keyof typeof form])
    // @ts-ignore
    return {  onChange: ({ target }, name) => setForm(name, target[valueForm]),
      id: `${id}-${name}`,
      ...addPropsInput,
    };
  };

 




  const RecursiveMap = (element: any): any => {
    const t = React.Children.map(React.Children.toArray(element!),(element: any) => {
      if(!!element?.props?.children){
        return React.cloneElement(element, {...element?.props, children: RecursiveMap(element?.props?.children ) })
      } else {
        if(element?.type?.name === "Field" || element?.type?.name === "TextArea" ){
          const clone = React.cloneElement(element, {...element?.props,...propsField(element?.props?.name, element?.props?.type, element?.props) });
          // elements.current = [...elements.current, clone.type];
          return clone;
        } else {
          return element;
        }
      }
  });
  return t;
}

  const ss = useMemo(() => {    
    // @ts-ignore
      const t0 = performance.now();

    const newChildren =  React.Children.map(React.Children.toArray(child!) ,(element: any) => {
    if(!!element?.props?.children){
      
      return React.cloneElement(element, {...element?.props, children: RecursiveMap(element?.props?.children ) })
    }

        if(element?.type?.name === "Field" || element?.type?.name === "TextArea") {
         const clone =  React.cloneElement(element, {...element?.props,...propsField(element?.props?.name, element?.props?.type, element?.props) })
        //  elements.current = [...elements.current, clone.type];
         return clone;
        } else {
          return element;
        }
      });
        const t1 = performance.now();

        return newChildren;

  }, [children, errors, form])

const cc = useCallback(() => {
        return <>{ss}</>
}, [children, errors, form]);


  return <>{cc()}</>;
};

export default Form;
