import React from 'react';

interface MinecraftLabelProps {
  children: string | React.ReactNode;
}

export const MinecraftLabel: React.FunctionComponent<MinecraftLabelProps> = ({ children }) => {
  return <div>{children}</div>;
};
