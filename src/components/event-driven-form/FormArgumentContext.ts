import { FormArguments } from '@mine-scripters/minecraft-event-driven-form-base';
import { createContext } from 'react';

export const FormArgumentContext = createContext<FormArguments>(new FormArguments());
