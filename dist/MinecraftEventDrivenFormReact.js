import * as React from 'react';
import React__default, { createContext, useContext, Fragment, useState, useEffect, useImperativeHandle } from 'react';

class FormError extends Error {
    constructor(msg) {
        super(msg);
    }
}
class FormArgumentError extends FormError {
    path;
    step;
    current;
    constructor(path, step, current) {
        super(`Invalid path: ${path} at step: ${step} in object: ${JSON.stringify(current)}`);
        this.path = path;
        this.step = step;
        this.current = current;
    }
}

class FormArguments {
    _args = {};
    set(name, arg) {
        this._args[name] = arg;
    }
    setAll(args) {
        this._args = {
            ...this._args,
            ...args,
        };
    }
    getAll() {
        return this._args;
    }
    get(name) {
        return this._args[name];
    }
    resolvePath(path) {
        let current = this._args;
        const splitPath = path.split('.');
        for (const step of splitPath) {
            if (typeof current === 'object' && step in current) {
                current = current[step];
            }
            else {
                throw new FormArgumentError(path, step, current);
            }
        }
        return current.toString();
    }
    resolveTemplate(template) {
        return template.replace(/\{\s*([^}\s]+)\s*\}/g, (_, p1) => {
            return this.resolvePath(p1);
        });
    }
    normalize(content) {
        if (typeof content === 'string') {
            return {
                type: 'text',
                text: this.resolveTemplate(content),
            };
        }
        else if (Array.isArray(content)) {
            return {
                type: 'array',
                array: content.map((c) => this.normalize(c)),
            };
        }
        else {
            return {
                type: 'translate',
                translate: this.resolveTemplate(content.translate),
                args: content.args ? content.args.map((a) => this.normalize(a)) : undefined,
            };
        }
    }
}

class FormEvent {
    _form = undefined;
    _name = undefined;
    _continueProcessing = true;
    _hub;
    _args = new FormArguments();
    _eventArgs = [];
    constructor(hub, action, previousArgs) {
        this._hub = hub;
        if (action) {
            if (action.event) {
                this._name = action.event;
            }
            if (action.form) {
                this._form = this._hub.forms[action.form];
            }
            if (action.copyArgs && previousArgs) {
                this._args.setAll(previousArgs.getAll());
            }
            if (action.eventArgs) {
                this._eventArgs = action.eventArgs;
            }
        }
    }
    loadForm(name, type) {
        if (name in this._hub.forms) {
            const form = this._hub.forms[name];
            if (type && form.type !== type) {
                throw new FormError(`Invalid type ${type} for form named ${name}. The actual type is ${form.type}`);
            }
            return JSON.parse(JSON.stringify(form));
        }
        throw new FormError(`Unknown form named ${name}`);
    }
    set form(form) {
        this._form = form;
    }
    get form() {
        return this._form;
    }
    get name() {
        return this._name;
    }
    get args() {
        return this._args;
    }
    get eventArgs() {
        return this._eventArgs;
    }
    get continueProcessing() {
        return this._continueProcessing;
    }
    cancelProcessing() {
        this._continueProcessing = false;
    }
}
const triggerEvent = async (event, receiver) => {
    if (event.name) {
        if (receiver === undefined) {
            return;
        }
        else if (typeof receiver === 'function') {
            await receiver(event);
        }
        else {
            for (const [key, eventReceiver] of Object.entries(receiver)) {
                if (!event.continueProcessing) {
                    break;
                }
                if (key === event.name) {
                    await eventReceiver(event);
                }
            }
        }
    }
    return event.form;
};

const FormArgumentContext = createContext(new FormArguments());

const assertNever = (arg) => {
    throw new Error(`Should have been never but got ${arg} instead`);
};

const translate = (content) => {
    // Get loaded translation - resolve arguments and return.
    return content.translate;
};
const fromNormalizedContent = (content) => {
    switch (content.type) {
        case 'text':
            return content.text;
        case 'translate':
            return translate(content);
        case 'array':
            return content.array.map((e) => fromNormalizedContent(e)).join('');
    }
    assertNever(content);
};
const fromTextContent = (content, args) => {
    const normalized = args.normalize(content);
    return fromNormalizedContent(normalized);
};
const splitNewLines = (content, GlueComponent = 'p') => {
    const pieces = content.split('\n');
    return pieces.length > 1 ? pieces.map((p, i) => React__default.createElement(GlueComponent, { key: i }, p)) : pieces.join('');
};
const FormText = ({ children }) => {
    const args = useContext(FormArgumentContext);
    return React__default.createElement(Fragment, null, splitNewLines(fromTextContent(children, args)));
};

const MinecraftLabel = ({ children }) => {
    return React__default.createElement("div", null, children);
};

const MinecraftButton = (props) => {
    return (React__default.createElement("div", null,
        React__default.createElement("button", { className: "minecraft-form-button", type: "button", ...props }, props.children)));
};

const MultiButtonForm = ({ form, triggerAction }) => {
    return (React.createElement(React.Fragment, null,
        form.body && (React.createElement(MinecraftLabel, null,
            React.createElement(FormText, null, form.body))),
        form.elements.map((e, index) => {
            if (e.type === 'button') {
                return (React.createElement(MinecraftButton, { key: index, onClick: () => triggerAction(e.action) },
                    React.createElement(FormText, null, e.text)));
            }
            assertNever(e.type);
        })));
};

const MinecraftInputText = ({ label, name, value, placeholder, onChange, }) => {
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: "minecraft-form-label" },
            React__default.createElement("label", null, label)),
        React__default.createElement("div", { className: "minecraft-form-input minecraft-form-input-text" },
            React__default.createElement("input", { type: "text", name: name, value: value, placeholder: placeholder, onChange: onChange }))));
};

const MinecraftInputToggle = ({ label, name, isChecked, onChange, }) => {
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: "minecraft-form-input minecraft-form-input-toggle" },
            React__default.createElement("input", { id: `minecraft-form-toggle-${name}`, type: "checkbox", name: name, checked: !!isChecked, onChange: onChange }),
            React__default.createElement("label", { htmlFor: `minecraft-form-toggle-${name}` }, label))));
};

const MinecraftInputSlider = ({ label, name, value, min, max, step, onChange, }) => {
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: "minecraft-form-label" },
            React__default.createElement("label", null, label)),
        React__default.createElement("div", { className: "minecraft-form-input minecraft-form-input-slider" },
            React__default.createElement("input", { type: "range", name: name, min: min, max: max, step: step, value: value, onChange: onChange }))));
};

const MinecraftInputDropdownItem = ({ value, children, }) => {
    return React__default.createElement("option", { value: value }, children);
};

const MinecraftInputDropdown = ({ label, name, value, onChange, children, }) => {
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: "minecraft-form-label" },
            React__default.createElement("label", null, label)),
        React__default.createElement("div", { className: "minecraft-form-input minecraft-form-input-dropdown" },
            React__default.createElement("select", { name: name, value: value, onChange: onChange }, children))));
};

const InputForm = ({ form, triggerAction }) => {
    const args = React.useContext(FormArgumentContext);
    const [state, setState] = React.useState(() => {
        const record = {};
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
    return (React.createElement(React.Fragment, null,
        form.elements.map((e, index) => {
            const key = e.name ?? index.toString();
            const value = state[key];
            const setValue = (key, value) => {
                setState((prev) => ({
                    ...prev,
                    [key]: value,
                }));
            };
            switch (e.type) {
                case 'dropdown':
                    return (React.createElement(MinecraftInputDropdown, { key: key, label: React.createElement(FormText, null, e.text), name: key, value: value, onChange: (event) => setValue(key, event.currentTarget.value) }, e.options.map((o, oIndex) => (React.createElement(MinecraftInputDropdownItem, { key: oIndex, value: o.value }, fromNormalizedContent(args.normalize(o.text)))))));
                case 'slider':
                    return (React.createElement(MinecraftInputSlider, { key: key, label: React.createElement(FormText, null, e.text), name: key, value: value, min: e.min, max: e.max, step: e.step, onChange: (event) => setValue(key, event.currentTarget.value) }));
                case 'text':
                    return (React.createElement(MinecraftInputText, { key: key, label: React.createElement(FormText, null, e.text), name: key, value: value, placeholder: fromNormalizedContent(args.normalize(e.placeholder)), onChange: (event) => setValue(key, event.currentTarget.value) }));
                case 'toggle':
                    return (React.createElement(MinecraftInputToggle, { key: key, label: React.createElement(FormText, null, e.text), name: key, isChecked: value, onChange: (event) => setValue(key, event.currentTarget.checked) }));
            }
            assertNever(e);
        }),
        React.createElement(MinecraftButton, { onClick: () => triggerAction(form.action, state) },
            React.createElement(FormText, null, form.submit ?? 'Submit'))));
};

const DualButtonForm = ({ form, triggerAction }) => {
    return (React.createElement(React.Fragment, null,
        form.body && (React.createElement(MinecraftLabel, null,
            React.createElement(FormText, null, form.body))),
        React.createElement(MinecraftButton, { onClick: () => triggerAction(form.topButton.action) },
            React.createElement(FormText, null, form.topButton.text)),
        React.createElement(MinecraftButton, { onClick: () => triggerAction(form.bottomButton.action) },
            React.createElement(FormText, null, form.bottomButton.text))));
};

const MinecraftForm = ({ children, title, onClose, }) => {
    return (React__default.createElement("form", { className: "minecraft-form" },
        React__default.createElement("div", null,
            React__default.createElement("button", { type: "button", className: "minecraft-form-close", onClick: onClose }, "x"),
            React__default.createElement("h1", null, title)),
        React__default.createElement("fieldset", null, children)));
};

const FormContent = ({ form, triggerAction }) => {
    switch (form.type) {
        case 'multi-button':
            return React__default.createElement(MultiButtonForm, { form: form, triggerAction: triggerAction });
        case 'input':
            return React__default.createElement(InputForm, { form: form, triggerAction: triggerAction });
        case 'dual-button':
            return React__default.createElement(DualButtonForm, { form: form, triggerAction: triggerAction });
    }
    assertNever(form);
};
const Form = ({ form, triggerAction }) => {
    return (React__default.createElement(MinecraftForm, { onClose: () => triggerAction(undefined), title: React__default.createElement(FormText, null, form.title) },
        React__default.createElement(FormContent, { form: form, triggerAction: triggerAction })));
};

const MinecraftEventDrivenForm = ({ ref, formHub, receiver, onFinished, children, }) => {
    const [currentForm, setCurrentForm] = useState(() => formHub.forms[formHub.entrypoint]);
    const [args, setArgs] = useState(() => new FormArguments());
    const triggerAction = async (action, newArgs) => {
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
    return (React__default.createElement(FormArgumentContext.Provider, { value: args }, currentForm === undefined ? (React__default.createElement(React__default.Fragment, null, typeof children === 'function' ? children({ reset, args: args.getAll() }) : children)) : (React__default.createElement(Form, { form: currentForm, triggerAction: triggerAction }))));
};

export { MinecraftButton, MinecraftEventDrivenForm, MinecraftForm, MinecraftInputDropdown, MinecraftInputDropdownItem, MinecraftInputSlider, MinecraftInputText, MinecraftInputToggle, MinecraftLabel };
//# sourceMappingURL=MinecraftEventDrivenFormReact.js.map
