import { MultiButtonForm as BaseMultiButtonForm } from '@mine-scripters/minecraft-event-driven-form-base';
import * as React from 'react';
import { FormText } from '../FormText';
import { TriggerAction } from '../../../types';
import { MinecraftLabel } from '../../form/MinecraftLabel';
import { MinecraftButton } from '../../form/MinecraftButton';
import { assertNever } from '../../../util';

interface MultiButtonFormProps {
  form: BaseMultiButtonForm;
  triggerAction: TriggerAction;
}

export const MultiButtonForm: React.FunctionComponent<MultiButtonFormProps> = ({ form, triggerAction }) => {
  return (
    <>
      {form.body && (
        <MinecraftLabel>
          <FormText>{form.body}</FormText>
        </MinecraftLabel>
      )}
      {form.elements.map((e, index) => {
        if (e.type === 'button') {
          return (
            <MinecraftButton key={index} onClick={() => triggerAction(e.action)}>
              <FormText>{e.text}</FormText>
            </MinecraftButton>
          );
        }

        assertNever(e.type);
      })}
    </>
  );
};
