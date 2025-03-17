import React, { useEffect, useImperativeHandle } from 'react';
import {
  EventReceiver,
  Form,
  FormAction,
  FormArguments,
  FormEvent,
  FormHub,
  StringResolvable,
  triggerEvent,
} from '@mine-scripters/minecraft-event-driven-form-base';
import { useState } from 'react';
import { FormArgumentContext } from './FormArgumentContext';
import { Form as FormComponent } from './Form';

export interface MinecraftEventDrivenFormProps {
  formHub: FormHub;
  receiver?: EventReceiver;
  onFinished?: () => void;
  ref?: React.RefObject<MinecraftEventDrivenFormControl | null>;
  children: React.ReactNode | ((props: MinecraftEventDrivenFormControl) => React.ReactNode);
}

export interface MinecraftEventDrivenFormControl {
  reset: () => void;
  args: Record<string, StringResolvable>;
}

export const MinecraftEventDrivenForm: React.FunctionComponent<MinecraftEventDrivenFormProps> = ({
  ref,
  formHub,
  receiver,
  onFinished,
  children,
}) => {
  const [currentForm, setCurrentForm] = useState<Form | undefined>(() => formHub.forms[formHub.entrypoint]);
  const [args, setArgs] = useState<FormArguments>(() => new FormArguments());

  const triggerAction = async (action: FormAction | undefined, newArgs?: Record<string, StringResolvable>) => {
    const event = new FormEvent(formHub, action, args);
    if (newArgs) {
      event.args.setAll(newArgs);
    }

    const newForm = await triggerEvent(event, receiver);
    setArgs(event.args);
    setCurrentForm(newForm);
  };

  const reset = () => {
    setCurrentForm(formHub.forms[formHub.entrypoint]);
    setArgs(new FormArguments());
  };

  useEffect(() => {
    if (onFinished && currentForm === undefined) {
      onFinished();
    }
  }, [currentForm, onFinished]);

  useImperativeHandle(ref, () => {
    return {
      reset,
      args: args.getAll(),
    };
  });

  return (
    <FormArgumentContext.Provider value={args}>
      {currentForm === undefined ? (
        <>{typeof children === 'function' ? children({ reset, args: args.getAll() }) : children}</>
      ) : (
        <FormComponent form={currentForm} triggerAction={triggerAction} />
      )}
    </FormArgumentContext.Provider>
  );
};
