import React from 'react';

type MinecraftButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export const MinecraftButton: React.FunctionComponent<MinecraftButtonProps> = (props) => {
  return (
    <div>
      <button className="minecraft-form-button" type="button" {...props}>
        {props.children}
      </button>
    </div>
  );
};
