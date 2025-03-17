import React from 'react';

export interface MinecraftInputSliderProps {
  label: string | React.ReactNode;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MinecraftInputSlider: React.FunctionComponent<MinecraftInputSliderProps> = ({
  label,
  name,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <React.Fragment>
      <div className="minecraft-form-label">
        <label>{label}</label>
      </div>
      <div className="minecraft-form-input minecraft-form-input-slider">
      <input
                    type="range"
                    name={name}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={onChange}
                  />
      </div>
    </React.Fragment>
  );
};
