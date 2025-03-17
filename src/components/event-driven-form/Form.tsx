import React from 'react';
import { Form as BaseForm } from '@mine-scripters/minecraft-event-driven-form-base';
import { MultiButtonForm } from './forms/MultiButtonForm';
import { TriggerAction } from '../../types';
import { InputForm } from './forms/InputForm';
import { DualButtonForm } from './forms/DualButtonForm';
import { FormText } from './FormText';
import { MinecraftForm } from '../form/MinecraftForm';
import { assertNever } from '../../util';

interface FormProps {
  form: BaseForm;
  triggerAction: TriggerAction;
}

const FormContent: React.FunctionComponent<FormProps> = ({ form, triggerAction }) => {
  switch (form.type) {
    case 'multi-button':
      return <MultiButtonForm form={form} triggerAction={triggerAction} />;
    case 'input':
      return <InputForm form={form} triggerAction={triggerAction} />;
    case 'dual-button':
      return <DualButtonForm form={form} triggerAction={triggerAction} />;
  }

  assertNever(form);
};

export const Form: React.FunctionComponent<FormProps> = ({ form, triggerAction }) => {
  return (
    <MinecraftForm onClose={() => triggerAction(undefined)} title={<FormText>{form.title}</FormText>}>
      <FormContent form={form} triggerAction={triggerAction} />
    </MinecraftForm>
  );
};
