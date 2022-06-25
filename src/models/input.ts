import { NestedKeys } from "advanced-types";
// @ts-ignore
export interface InputProps<T extends object> extends React.InputHTMLAttributes<HTMLInputElement> {
    name: NestedKeys<T, "/", 3>,
  }
export interface TextAreaProps<T extends object> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: NestedKeys<T, "/", 3>,
  }
export interface SpanProps<T extends object> extends React.HTMLAttributes<HTMLSpanElement> {
    name: NestedKeys<T, "/", 3>,
  }
export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: any
  }