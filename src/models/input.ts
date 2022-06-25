import { NestedKeys } from "advanced-types";
import { ReactNode } from "react";
// @ts-ignore
export interface InputProps<T extends object, N extends string> extends React.InputHTMLAttributes<HTMLInputElement> {
    name: N
  }
export interface TextAreaProps<T extends object, N extends string> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: N,
  }
export interface SpanProps<T extends object, N extends string> extends React.HTMLAttributes<HTMLSpanElement> {
    name: N,
  }
export interface LabelProps<T extends object, N extends string> extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor: N,
    children?: ReactNode
  }
export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: any
  }