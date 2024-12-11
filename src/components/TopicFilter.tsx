import React from 'react';
import { TopicType } from '../types';

interface TopicFilterProps {
  selectedTopics: TopicType[];
  onTopicChange: (topic: TopicType) => void;
}

export const TopicFilter: React.FC<TopicFilterProps> = ({
  selectedTopics,
  onTopicChange,
}) => {
  const topics: { id: TopicType; label: string }[] = [
    { id: 'premium', label: 'Premium' },
    { id: 'organico', label: 'Orgánico' },
    { id: 'vegano', label: 'Vegano' },
    { id: 'sinGluten', label: 'Sin Gluten' },
    { id: 'sinLactosa', label: 'Sin Lactosa' },
    { id: 'picante', label: 'Picante' },
    { id: 'local', label: 'Local' },
    { id: 'vegetariano', label: 'Vegetariano' },
    { id: 'pescado', label: 'Pescado' },
    { id: 'mariscos', label: 'Mariscos' },
    { id: 'keto', label: 'Keto' },
    { id: 'bajo_en_calorias', label: 'Bajo en Calorías' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {topics.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onTopicChange(id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${
              selectedTopics.includes(id)
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};