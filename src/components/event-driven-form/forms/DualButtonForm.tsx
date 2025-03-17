import { DualButtonForm as BaseDualButtonForm } from '@mine-scripters/minecraft-event-driven-form-base';
import * as React from 'react';
import { FormText } from '../FormText';
import { TriggerAction } from '../../../types';
import { MinecraftLabel } from '../../form/MinecraftLabel';
import { MinecraftButton } from '../../form/MinecraftButton';

interface DualButtonFormProps {
  form: BaseDualButtonForm;
  triggerAction: TriggerAction;
}

export const DualButtonForm: React.FunctionComponent<DualButtonFormProps> = ({ form, triggerAction }) => {
  return (
    <>
      {form.body && (
        <MinecraftLabel>
          <FormText>{form.body}</FormText>
        </MinecraftLabel>
      )}
      <MinecraftButton onClick={() => triggerAction(form.topButton.action)}>
        <FormText>{form.topButton.text}</FormText>
      </MinecraftButton>
      <MinecraftButton onClick={() => triggerAction(form.bottomButton.action)}>
        <FormText>{form.bottomButton.text}</FormText>
      </MinecraftButton>
    </>
  );
};
