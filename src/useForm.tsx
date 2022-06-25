import { FC, useState, Fragment, useRef, useLayoutEffect, useEffect } from "react";
import { cloneObject, getNestedValueFromString, isEmailValid, resetFieldObject, sleep } from "./functions";
import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { InputProps, DivProps } from "./models/input";
import Form from "./Form/Form";

export type Form<T> = { [K in keyof T]: T[K] };
export type SetForm<T> = (key: keyof T, value: T[keyof T]) => void;


export type FormReturnType<T extends object> = {
  form: Partial<Form<T>>;
  setForm: (key: string, value: any) => void;
  setAllForm: (form: T) => void;
  Field: FC<InputProps<T>>
  propsField: (name: string, type: React.InputHTMLAttributes<HTMLInputElement>["type"]) => object,
  handleError: (key: string, value: string | undefined, autoScroll: boolean) => void;
  submit: (callback: (form: Form<T>) => void) => void;
  errors: Partial<{ [x in keyof T]: string | undefined }> | Form<T>;
};
export type ErrorsForm<T> = { [x in keyof T]: string | undefined };
// eslint-disable-next-line
// export interface FormValidationItem<T, K extends keyof T> {
export interface FormValidationItem<T> {
  required?: string;
  containSpace?: string;
  invalidEmail?: string;
  custom?: (value: any) => string | undefined;
}

// @ts-ignore
export type FormValidationObject<T extends object> = { [K in string]?: FormValidationItem<T> };

      /**
 * Custom-hook for form.
 * @constructor
 * @param {object} initialValue - initial value of the form.
 * @param {object} validators - form validators.
 * @param {object} isScrollToError - .

 */

export const useForm = <T extends object>(
  initialValue: Form<T>,
  validators?: { [K in string]?: FormValidationItem<any> },
  isScrollToError?: boolean
) => {
  const id = useRef(uuidv4());
  const [form, setForm] = useState<Form<T>>(cloneObject(initialValue));
  const [errors, setErrors] = useState<{ [x in keyof T]: string | undefined } | Form<T>>(
    () => {
      const initialErrors =  cloneObject(initialValue);
      resetFieldObject(initialErrors);
      return initialErrors;
    }
  );


  const propsField = (name: string, type: React.InputHTMLAttributes<HTMLInputElement>["type"] = "string") => {

        // @ts-ignore
    const valueInput = getNestedValueFromString(name, form);
    const container = document.getElementById(id.current);
    // @ts-ignore
  return {onBlur: ({target:{value}}) => onChange(name, value, false),onChange: ({target:{value}}, name) =>  {
    const container = document.getElementById(id.current);
    
    (container!.querySelector(`[name="${name}"]`) as any).value = value;

      },type, defaultValue: valueInput}
}



const Form = ({children, ...props}: DivProps) => {
    const [childs, setChilds] = useState<any>();

    useLayoutEffect(() => {
     setChilds(() => React.Children.map(React.Children.toArray(children!) ,(element:any) => {
      return element?.type?.name === "Field" ? React.cloneElement(element, {...element.props,...propsField(element.props.name) }) : element
    })
     )
    }, [])


      return <div id={id.current} {...props}>{childs ? childs : <></> }</div>
      
    }; 
     // const Field: FC<InputProps<T>> = ({name, ...props}) => {
  //   const valueInput = getNestedValueFromString(name, form);
  //   // return {onChange: (({target:{value}}: any) => onChange(name, type === "number" ? +value : value)), value: valueInput, type}
  //   return <input {...props} onChange={({target:{value}}: any) => onChange(name, props?.type === "number" ? +value : value)}></input>
  // }



  // const Field = useCallback(({name, form, onChange,...props}: InputProps<T>) => {
  //   const mergedProps = {...props};

  //   return <input onChange={onChange} {...mergedProps}></input>
  // }, [])



//   const handleError = (key: NestedKeys<T, "/", 5>, value: string | undefined, autoScroll: boolean = true) => {
  const handleError = (key: string, value: string | undefined, autoScroll: boolean = true) => {
    // ts-ignore
    const splittedKey = (key as string).split("/");
    if (splittedKey.length === 1) {
      setErrors((oldErrors) => ({
        ...oldErrors,
        [key]: value,
      }));
    } else {
      setErrors((oldErrors) => {
        const splittedKey = (key as string).split("/");
        const nestedKey =  splittedKey.reduce((acc: any, arr: any, index, array) => {
          return (acc = index < array.length - 1 ? acc[`${arr}`] : acc);
        }, oldErrors);
        nestedKey[splittedKey[splittedKey.length  - 1]] = value;
        return {...oldErrors}
      });
  };
  if(autoScroll && isScrollToError){
    setTimeout(() => {
    const el = document.querySelectorAll(`[class~=is-invalid]`)
    if(el.length){
      el[0].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }
  }, 50)
}
}

  const setAllForm = (allForm: T) => {
    setForm(allForm);
  };

  const onChange = (key: string, value: any, debounce = false) => {
  if(debounce) {sleep(70).then(() => {
    setForm((prev: any) => {
      //@ts-ignore
      const splittedKey: (keyof T)[] = key.split("/");
      if (splittedKey.length === 1) {
         prev[splittedKey[0]] = value;
      } else {
        splittedKey.reduce((acc: any, arr: any, index, array) => {
          return (acc = (index < array.length - 1) ? acc[arr] : acc);
        }, form)[splittedKey[splittedKey.length  - 1]] = value;

      }
      
      return {...prev}

    });
  })
} else {
  setForm((prev: any) => {
    //@ts-ignore
    const splittedKey: (keyof T)[] = key.split("/");
    if (splittedKey.length === 1) {
       prev[splittedKey[0]] = value;
    } else {
      splittedKey.reduce((acc: any, arr: any, index, array) => {
        return (acc = (index < array.length - 1) ? acc[arr] : acc);
      }, form)[splittedKey[splittedKey.length  - 1]] = value;

    }
    
    return {...prev}

  });
}
   
  };

  const submit = (callback?: (fields: Form<T>) => void) => {
    let valids: boolean[] = [];
    // @ts-ignore
    if (validators) {
      valids = Object.keys(validators).map((key) => {
        const currentKey = key as keyof typeof validators ;
        // @ts-ignore
        const currentField = getNestedValueFromString(currentKey, form);
        const validator = validators[key as keyof typeof validators];
        
        if (validator) {
          if (
            (validator.required && !currentField) || (typeof currentField === "string" && currentField === "notProvided")
          ) {
            handleError(currentKey, validator.required);
            return false;
          } else if (
            validator.invalidEmail &&
            (typeof currentField === "undefined" ||
              (typeof currentField === "string" && !isEmailValid(currentField)))
          ) {
            handleError(currentKey, validator.required);
            return false;
          } else if (
            validator.containSpace &&
            (typeof currentField === "undefined" ||
              (typeof currentField === "string" && currentField.includes(" ")))
          ) {
            handleError(currentKey, validator.containSpace);
            return false;
          } else if (validator.custom) {
            const customError = validator.custom(currentField);
            handleError(currentKey, customError);
            return !customError;
          } else {
            handleError(currentKey, "");
          }
        } else {
          handleError(currentKey, "");
        }
        return true;
      });
    }

    if (valids.every(Boolean) && callback) {
      callback(form);
    }
  };




    // @ts-ignore
  return {
    form,
    setForm: onChange,
    submit,
    Form,
    handleError,
    setAllForm,
    propsField,
    errors,
    id: id.current
  };
};


export default useForm;


