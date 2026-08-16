import React from 'react';
import { KidProfileForm } from '../components/KidProfileForm';
import { addKid } from '../db/kid';

interface Props {
  onDone: () => void;
}

export function OnboardingScreen({ onDone }: Props) {
  return (
    <KidProfileForm
      headerEmoji="🤱"
      title="Welcome!"
      subtitle="Let's set up your little one's profile"
      ctaLabel="Start tracking 💕"
      onSubmit={(name, birthDate, avatarEmoji) => {
        addKid(name, birthDate, avatarEmoji);
        onDone();
      }}
    />
  );
}
