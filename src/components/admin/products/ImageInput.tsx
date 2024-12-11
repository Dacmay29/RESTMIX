import React from 'react';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Imagen URL
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        placeholder="https://..."
      />
    </div>
  );
};