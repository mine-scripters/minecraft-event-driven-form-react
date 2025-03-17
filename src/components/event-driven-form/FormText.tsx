import { FormArguments, NormalizedTextContent, TextContent } from '@mine-scripters/minecraft-event-driven-form-base';
import React, { useContext } from 'react';
import { Fragment } from 'react';
import { FormArgumentContext } from './FormArgumentContext';
import { assertNever } from '../../util';

interface FormTextProps {
  children: TextContent;
}

type ContentTranslate = Extract<NormalizedTextContent, { type: 'translate' }>;

const translate = (content: ContentTranslate) => {
  // Get loaded translation - resolve arguments and return.
  return content.translate;
};

export const fromNormalizedContent = (content: NormalizedTextContent): string => {
  switch (content.type) {
    case 'text':
      return content.text;
    case 'translate':
      return translate(content);
    case 'array':
      return content.array.map(e => fromNormalizedContent(e)).join('');
  }

  assertNever(content);
};

const fromTextContent = (content: TextContent, args: FormArguments): string => {
  const normalized = args.normalize(content);
  return fromNormalizedContent(normalized);
};

const splitNewLines = (content: string, GlueComponent: React.HTMLElementType = 'p') => {
  const pieces = content.split('\n');
  return pieces.length > 1 ? pieces.map((p, i) => <GlueComponent key={i}>{p}</GlueComponent>) : pieces.join('');
};

export const FormText: React.FunctionComponent<FormTextProps> = ({ children }) => {
  const args = useContext(FormArgumentContext);

  return <Fragment>{splitNewLines(fromTextContent(children, args))}</Fragment>;
};
