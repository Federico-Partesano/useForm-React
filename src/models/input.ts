import { NestedKeys } from "advanced-types";
// @ts-ignore
export interface InputProps<T extends object> extends React.InputHTMLAttributes<HTMLInputElement> {
    name: NestedKeys<T, "/", 5>,
  }
export interface SpanProps<T extends object> extends React.HTMLAttributes<HTMLSpanElement> {
    name: NestedKeys<T, "/", 5>,
  }
export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: any
  }