import React from 'react';

interface FormHeaderProps {
  isExisting: boolean;
}

export default function FormHeader({ isExisting }: FormHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-patriot-navy mb-2">
        {isExisting ? 'Complete Your Business Profile' : 'Add Your Business'}
      </h2>
      <p className="text-patriot-blue">
        Provide your business details to join our community
      </p>
    </div>
  );
}