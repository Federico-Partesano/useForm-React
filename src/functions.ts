import { InputHTMLAttributes } from "react";

export const isEmailValid = (email: string) =>
  email.match(
    // eslint-disable-next-line
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

export const getNestedValueFromString = <T = any>(
  key: string,
  form: Record<string, any>
): T => {
  const splittedKey = key.split("/");
  if (splittedKey.length === 1) {
    return form[splittedKey[0]];
  } else {
    return splittedKey.reduce((acc, arr, index, array) => {
      return (acc = index < array.length - 1 ? acc[`${arr}`] : acc);
    }, form)[splittedKey[splittedKey.length - 1]];
  }
};

export const resetFieldObject = (obj: Record<any, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === null) {
        obj[key] = null;
      } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        resetFieldObject(obj[key]);
      } else {
        obj[key] = "";
      }
    } else {
    }
  });
};
export const cloneObject = (obj: Record<any, any>) =>
  JSON.parse(JSON.stringify(obj));

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const generatePropsInput = (
  type: InputHTMLAttributes<HTMLInputElement>["type"],
  value: any,
  formValue: any
) => {
  switch (type) {
    case "checkbox":
      return { defaultChecked: value };
    case "radio":
      return formValue === value ?  { defaultChecked: true } : {};
    default:
      return { defaultValue: value };
  }
};
export const editValueInputOnSetForm = (
  type: InputHTMLAttributes<HTMLInputElement>["type"] | null,
  element: any,
  value: any
) => {
  switch (type) {
    case null:
      break;
    case "checkbox":
       element.checked = value;
       break;
    default:
      element.value = value;
      break;
  }
};
