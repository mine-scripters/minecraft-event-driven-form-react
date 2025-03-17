import React from 'react';

export interface MinecraftInputDropdownProps {
  label: string | React.ReactNode;
  name: string;
  value: string | number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const MinecraftInputDropdown: React.FunctionComponent<React.PropsWithChildren<MinecraftInputDropdownProps>> = ({
  label,
  name,
  value,
  onChange,
  children,
}) => {
  return (
    <React.Fragment>
      <div className="minecraft-form-label">
        <label>{label}</label>
      </div>
      <div className="minecraft-form-input minecraft-form-input-dropdown">
      <select
                    name={name}
                    value={value}
                    onChange={onChange}
                  >
                    {children}
                    </select>
      </div>
    </React.Fragment>
  );
};
