import React from 'react';

export interface MinecraftInputTextProps {
  label: string | React.ReactNode;
  name: string;
  value: string;
  placeholder: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MinecraftInputText: React.FunctionComponent<MinecraftInputTextProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <React.Fragment>
      <div className="minecraft-form-label">
        <label>{label}</label>
      </div>
      <div className="minecraft-form-input minecraft-form-input-text">
        <input type="text" name={name} value={value} placeholder={placeholder} onChange={onChange} />
      </div>
    </React.Fragment>
  );
};
