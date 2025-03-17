import React from 'react';

export interface MinecraftInputToggleProps {
  label: string | React.ReactNode;
  name: string;
  isChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MinecraftInputToggle: React.FunctionComponent<MinecraftInputToggleProps> = ({
  label,
  name,
  isChecked,
  onChange,
}) => {
  return (
    <React.Fragment>
      <div className="minecraft-form-input minecraft-form-input-toggle">
        <input
          id={`minecraft-form-toggle-${name}`}
          type="checkbox"
          name={name}
          checked={!!isChecked}
          onChange={onChange}
        />
        <label htmlFor={`minecraft-form-toggle-${name}`}>{label}</label>
      </div>
    </React.Fragment>
  );
};
