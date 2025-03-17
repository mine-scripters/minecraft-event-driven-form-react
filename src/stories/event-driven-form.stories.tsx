import React, { useRef } from 'react';
import { EventReceiver, FormHub } from '@mine-scripters/minecraft-event-driven-form-base';
import {
  MinecraftEventDrivenForm,
  MinecraftEventDrivenFormControl,
} from '../components/event-driven-form/MinecraftEventDrivenForm';

export const DualButton = () => {
  const ref = useRef<MinecraftEventDrivenFormControl>(null);
  return (
    <MinecraftEventDrivenForm
      ref={ref}
      formHub={{
        entrypoint: 'main',
        forms: {
          main: {
            type: 'dual-button',
            title: 'I am a dual button form',
            body: 'Dual button forms have a body',
            topButton: {
              type: 'button',
              text: 'I am the top button',
            },
            bottomButton: {
              type: 'button',
              text: 'I am the bottom button',
            },
          },
        },
      }}
      receiver={{}}
    >
      <div>
        <div>The form reached an end state. Thank you!</div>
        <button
          type="button"
          onClick={() => {
            ref.current?.reset();
          }}
        >
          Reset
        </button>
      </div>
    </MinecraftEventDrivenForm>
  );
};

export const MultiButton = () => {
  const ref = useRef<MinecraftEventDrivenFormControl>(null);
  return (
    <MinecraftEventDrivenForm
      ref={ref}
      formHub={{
        entrypoint: 'main',
        forms: {
          main: {
            type: 'multi-button',
            title: 'I am a dual button form',
            body: 'Multi buton forms have a body',
            elements: [
              {
                type: 'button',
                text: 'I am button 1',
              },
              {
                type: 'button',
                text: 'I am button 2',
              },
              {
                type: 'button',
                text: 'I am button 3',
              },
            ],
          },
        },
      }}
      receiver={{}}
    >
      <div>
        <div>The form reached an end state. Thank you!</div>
        <button
          type="button"
          onClick={() => {
            ref.current?.reset();
          }}
        >
          Reset
        </button>
      </div>
    </MinecraftEventDrivenForm>
  );
};

export const InputForm = () => {
  const ref = useRef<MinecraftEventDrivenFormControl>(null);
  return (
    <MinecraftEventDrivenForm
      ref={ref}
      formHub={{
        entrypoint: 'main',
        forms: {
          main: {
            type: 'input',
            title: 'I am an input form',
            elements: [
              {
                type: 'text',
                text: 'I am a text input',
                placeholder: 'Enter some text',
                name: 'im-text',
              },
              {
                type: 'dropdown',
                name: 'the dropdown',
                text: 'I can have multiple values',
                defaultValue: 'my value',
                options: [
                  {
                    text: 'Option 1',
                    value: 'opt-1',
                  },
                  {
                    text: 'Option 2 - I am the default!',
                    value: 'my value',
                  },
                  {
                    text: 'Option 3',
                    value: 'other option',
                  },
                ],
              },
              {
                type: 'toggle',
                text: 'I am a toggle - checked by default',
                name: 'toggle-checked-by-default',
                defaultValue: true,
              },
              {
                type: 'toggle',
                text: 'Other toggle, off by default',
                name: 'off-by-default',
              },
              {
                type: 'slider',
                text: 'I am a slider',
                min: -100,
                max: 100,
                step: 50,
                defaultValue: 0,
                name: 'the slider',
              },
            ],
          },
        },
      }}
      receiver={{}}
    >
      {({ reset, args }) => {
        return (
          <div>
            <div>The form reached an end state. Thank you!</div>
            <div>
              <label>Results:</label>
              <div>
                <textarea
                  style={{
                    width: 350,
                    height: 150,
                  }}
                  readOnly
                  value={JSON.stringify(args, undefined, 4)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                reset();
              }}
            >
              Reset
            </button>
          </div>
        );
      }}
    </MinecraftEventDrivenForm>
  );
};

export const DadJokes = () => {
  const dadJokesHub: FormHub = {
    entrypoint: 'main',
    forms: {
      main: {
        type: 'multi-button',
        title: 'Dad Jokes!',
        body: 'Enjoy the selection of dad jokes',
        elements: [
          {
            type: 'button',
            text: 'Joke of the day',
            action: {
              event: 'load_joke',
              form: 'view_joke_rate_1',
            },
          },
          {
            type: 'button',
            text: 'Top rated!',
            action: {
              event: 'load_top_rated',
              form: 'view_top_joke_rate_1',
            },
          },
          {
            type: 'button',
            text: 'Settings',
            action: {
              form: 'settings',
            },
          },
          {
            type: 'button',
            text: 'Close',
            action: {
              event: 'close_app',
            },
          },
        ],
      },
      view_top_joke_rate_1: {
        type: 'multi-button',
        title: '{joke.title}',
        body: ['Likes: {joke.likes}', '\n', 'Dislikes: {joke.dislikes}', '\n', '\n', '{joke.body}'],
        elements: [
          {
            type: 'button',
            text: 'Continue',
            action: {
              form: 'view_top_joke_rate_2',
              copyArgs: true,
            },
          },
          {
            type: 'button',
            text: 'Back',
            action: {
              form: 'main',
            },
          },
        ],
      },
      view_top_joke_rate_2: {
        type: 'multi-button',
        title: '{joke.title}',
        body: [
          'Likes: {joke.likes}',
          '\n',
          'Dislikes: {joke.dislikes}',
          '\n',
          '\n',
          '{joke.body}',
          '\n',
          '\n',
          '{joke.punchline}',
        ],
        elements: [
          {
            type: 'button',
            text: 'Back',
            action: {
              form: 'main',
            },
          },
        ],
      },
      view_joke_rate_1: {
        type: 'multi-button',
        title: '{joke.title}',
        body: '{joke.body}',
        elements: [
          {
            type: 'button',
            text: 'Continue',
            action: {
              form: 'view_joke_rate_2',
              copyArgs: true,
            },
          },
          {
            type: 'button',
            text: 'Back',
            action: {
              form: 'main',
            },
          },
        ],
      },
      view_joke_rate_2: {
        type: 'multi-button',
        title: '{joke.title}',
        body: ['{joke.body}', '\n\n', '{joke.punchline}'],
        elements: [
          {
            type: 'button',
            text: 'Rate the joke',
            action: {
              form: 'view_joke_rate_3',
              copyArgs: true,
            },
          },
          {
            type: 'button',
            text: 'Back',
            action: {
              form: 'main',
            },
          },
        ],
      },
      view_joke_rate_3: {
        type: 'dual-button',
        title: 'Rate the joke!',
        body: 'Is it a good joke?',
        topButton: {
          type: 'button',
          text: 'Yep!',
          action: {
            form: 'main',
          },
        },
        bottomButton: {
          type: 'button',
          text: 'Nope!',
          action: {
            form: 'main',
          },
        },
      },
      no_top_joke: {
        type: 'multi-button',
        title: 'No top joke yet',
        body: 'We do not have enough information to call a winner!',
        elements: [
          {
            type: 'button',
            text: 'Back',
            action: {
              form: 'main',
            },
          },
        ],
      },
      settings: {
        type: 'input',
        title: 'Settings!',
        elements: [
          {
            type: 'toggle',
            name: 'cool-jokes-enabled',
            text: 'Enable cool jokes?',
            defaultValue: false,
          },
          {
            type: 'text',
            name: 'name',
            text: 'Name',
            placeholder: 'Enter your name',
          },
          {
            type: 'slider',
            name: 'jokes-per-day',
            defaultValue: 10,
            min: 1,
            max: 20,
            step: 1,
            text: 'How many jokes do you read per day?',
          },
          {
            type: 'dropdown',
            name: 'favorit-joke',
            text: 'Favorite type of joke',
            defaultValue: 'dad',
            options: [
              {
                text: 'Dad',
                value: 'dad',
              },
              {
                text: 'Other jokes',
                value: 'other',
              },
            ],
          },
        ],
        action: {
          form: 'main',
          event: 'print',
        },
        submit: 'Go!',
      },
    },
  };

  const events: EventReceiver = {
    load_joke: async (event) => {
      event.args.set('joke', {
        id: 1,
        title: 'Passport control',
        body: 'Officer: Wherea are you travelling from?\nTraveller: UK.',
        punchline: 'Officer: I am fine, thanks. Where are you travelling from?',
      });
    },
    load_top_rated: async (event) => {
      event.args.set('joke', {
        id: 1,
        title: 'Jogging',
        body: 'Person 1: I did not have time to jog this morning.\nPerson 2: But my dear, you say that every morning.',
        punchline: 'Person 1: I know. It is a running joke.',
        likes: 33,
        dislikes: 5,
      });
    },
  };

  const ref = useRef<MinecraftEventDrivenFormControl>(null);

  return (
    <MinecraftEventDrivenForm formHub={dadJokesHub} receiver={events} ref={ref}>
      <div>
        <div>The form reached an end state. Thank you!</div>
        <button
          type="button"
          onClick={() => {
            ref.current?.reset();
          }}
        >
          Reset
        </button>
      </div>
    </MinecraftEventDrivenForm>
  );
};
