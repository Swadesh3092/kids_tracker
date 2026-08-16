import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export interface Kid {
  id: number;
  name: string;
  birthDate: string; // ISO date, yyyy-MM-dd
  avatarEmoji: string;
}

export interface Meal {
  id: number;
  kidId: number;
  date: string; // ISO date, yyyy-MM-dd
  time: string; // HH:mm
  ml: number;
  note: string | null;
}

export interface WeightEntry {
  id: number;
  kidId: number;
  weekStartDate: string; // ISO date, yyyy-MM-dd (Monday of that week)
  weightKg: number;
  note: string | null;
}

export interface DayTotal {
  totalMl: number;
  count: number;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  DayDetail: { date: string };
  AddKid: undefined;
  EditKid: { kidId: number };
};

export type MainTabParamList = {
  CalendarTab: undefined;
  WeightTab: undefined;
};

export type CalendarScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'CalendarTab'>,
  NativeStackScreenProps<RootStackParamList>
>;
