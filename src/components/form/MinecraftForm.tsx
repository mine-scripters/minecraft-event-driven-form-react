import React from 'react';
import './MinecraftForm.css';

interface MinecraftFormProps {
  title: string | React.ReactNode;
  onClose?: () => void;
}

export const MinecraftForm: React.FunctionComponent<React.PropsWithChildren<MinecraftFormProps>> = ({
  children,
  title,
  onClose,
}) => {
  return (
    <form className="minecraft-form">
      <div>
        <button type="button" className="minecraft-form-close" onClick={onClose}>
          x
        </button>
        <h1>{title}</h1>
      </div>
      <fieldset>{children}</fieldset>
    </form>
  );
};
