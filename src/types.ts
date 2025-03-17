import { FormAction, StringResolvable } from '@mine-scripters/minecraft-event-driven-form-base';

export type TriggerAction = (action: FormAction | undefined, newArgs?: Record<string, StringResolvable>) => void;
