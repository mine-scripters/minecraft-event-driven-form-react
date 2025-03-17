import { InputForm as BaseInputForm } from '@mine-scripters/minecraft-event-driven-form-base';
import * as React from 'react';
import { FormText, fromNormalizedContent } from '../FormText';
import { TriggerAction } from '../../../types';
import { FormArgumentContext } from '../FormArgumentContext';
import { MinecraftButton } from '../../form/MinecraftButton';
import { MinecraftInputText } from '../../form/MinecraftInputText';
import { MinecraftInputToggle } from '../../form/MinecraftInputToggle';
import { MinecraftInputSlider } from '../../form/MinecraftInputSlider';
import { MinecraftInputDropdownItem } from '../../form/MinecraftInputDropdownItem';
import { MinecraftInputDropdown } from '../../form/MinecraftInputDropdown';
import { assertNever } from '../../../util';

interface InputFormProps {
  form: BaseInputForm;
  triggerAction: TriggerAction;
}

export const InputForm: React.FunctionComponent<InputFormProps> = ({ form, triggerAction }) => {
  const args = React.useContext(FormArgumentContext);

  const [state, setState] = React.useState(() => {
    const record: Record<string, number | string | boolean> = {};
    form.elements.forEach((e, index) => {
      switch (e.type) {
        case 'slider':
          record[e.name ?? index] = e.defaultValue ?? e.min ?? 0;
          break;
        case 'text':
          record[e.name ?? index] = e.defaultValue ?? '';
          break;
        case 'dropdown':
          record[e.name ?? index] = e.defaultValue ?? e.options[0].value;
          break;
        case 'toggle':
          record[e.name ?? index] = e.defaultValue ?? false;
          break;
        default:
          assertNever(e);
      }
    });

    return record;
  });

  return (
    <>
      {form.elements.map((e, index) => {
        const key = e.name ?? index.toString();
        const value = state[key];
        const setValue = (key: string, value: string | number | boolean) => {
          setState((prev) => ({
            ...prev,
            [key]: value,
          }));
        };

        switch (e.type) {
          case 'dropdown':
            return (
              <MinecraftInputDropdown
                key={key}
                label={<FormText>{e.text}</FormText>}
                name={key}
                value={value as string | number}
                onChange={(event) => setValue(key, event.currentTarget.value)}
              >
                {e.options.map((o, oIndex) => (
                  <MinecraftInputDropdownItem key={oIndex} value={o.value as string | number}>
                    {fromNormalizedContent(args.normalize(o.text))}
                  </MinecraftInputDropdownItem>
                ))}
              </MinecraftInputDropdown>
            );
          case 'slider':
            return (
              <MinecraftInputSlider
                key={key}
                label={<FormText>{e.text}</FormText>}
                name={key}
                value={value as number}
                min={e.min}
                max={e.max}
                step={e.step}
                onChange={(event) => setValue(key, event.currentTarget.value)}
              />
            );
          case 'text':
            return (
              <MinecraftInputText
                key={key}
                label={<FormText>{e.text}</FormText>}
                name={key}
                value={value as string}
                placeholder={fromNormalizedContent(args.normalize(e.placeholder))}
                onChange={(event) => setValue(key, event.currentTarget.value)}
              />
            );
          case 'toggle':
            return (
              <MinecraftInputToggle
                key={key}
                label={<FormText>{e.text}</FormText>}
                name={key}
                isChecked={value as boolean}
                onChange={(event) => setValue(key, event.currentTarget.checked)}
              />
            );
        }

        assertNever(e);
      })}
      <MinecraftButton onClick={() => triggerAction(form.action, state)}>
        <FormText>{form.submit ?? 'Submit'}</FormText>
      </MinecraftButton>
    </>
  );
};
