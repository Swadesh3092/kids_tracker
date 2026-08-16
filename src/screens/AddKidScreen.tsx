import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { KidProfileForm } from '../components/KidProfileForm';
import { useKids } from '../context/KidContext';
import { addKid } from '../db/kid';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddKid'>;

export function AddKidScreen({ navigation }: Props) {
  const { refreshKids, selectKid } = useKids();

  return (
    <KidProfileForm
      headerEmoji="🍼"
      title="Add another little one"
      subtitle="Set up a profile to start tracking"
      ctaLabel="Add kid"
      onCancel={() => navigation.goBack()}
      onSubmit={(name, birthDate, avatarEmoji) => {
        const newKid = addKid(name, birthDate, avatarEmoji);
        refreshKids();
        selectKid(newKid.id);
        navigation.goBack();
      }}
    />
  );
}
