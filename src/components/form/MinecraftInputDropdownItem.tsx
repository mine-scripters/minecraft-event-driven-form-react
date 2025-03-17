import React from 'react';

export interface MinecraftInputDropdownItemProps {
  value: string | number;
  children: string;
}

export const MinecraftInputDropdownItem: React.FunctionComponent<MinecraftInputDropdownItemProps> = ({
  value,
  children,
}) => {
  return (
    <option value={value}>
      {children}
    </option>
  );
};
