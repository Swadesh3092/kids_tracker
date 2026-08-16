import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { KidProfileForm } from '../components/KidProfileForm';
import { useKids } from '../context/KidContext';
import { updateKid } from '../db/kid';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditKid'>;

export function EditKidScreen({ route, navigation }: Props) {
  const { kidId } = route.params;
  const { kids, refreshKids } = useKids();
  const kid = kids.find((k) => k.id === kidId);

  if (!kid) return null;

  return (
    <KidProfileForm
      headerEmoji="✏️"
      title="Edit profile"
      subtitle={`Update ${kid.name}'s details`}
      ctaLabel="Save changes"
      initialName={kid.name}
      initialBirthDate={kid.birthDate}
      initialAvatarEmoji={kid.avatarEmoji}
      onCancel={() => navigation.goBack()}
      onSubmit={(name, birthDate, avatarEmoji) => {
        updateKid(kid.id, name, birthDate, avatarEmoji);
        refreshKids();
        navigation.goBack();
      }}
    />
  );
}
