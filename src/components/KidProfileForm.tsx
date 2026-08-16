import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Card } from './Card';
import { colors, radius, spacing } from '../theme';
import { ISO_DATE } from '../utils/date';

const AVATAR_OPTIONS = ['👶', '🍼', '🧸', '🌸', '🐣', '🦋'];

interface Props {
  headerEmoji: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  initialName?: string;
  initialBirthDate?: string; // ISO yyyy-MM-dd
  initialAvatarEmoji?: string;
  onSubmit: (name: string, birthDate: string, avatarEmoji: string) => void;
  onCancel?: () => void;
}

export function KidProfileForm({
  headerEmoji,
  title,
  subtitle,
  ctaLabel,
  initialName,
  initialBirthDate,
  initialAvatarEmoji,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialName ?? '');
  const [birthDate, setBirthDate] = useState(() =>
    initialBirthDate ? new Date(`${initialBirthDate}T00:00:00`) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [avatar, setAvatar] = useState(initialAvatarEmoji ?? AVATAR_OPTIONS[0]);

  const canSave = name.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    onSubmit(name.trim(), format(birthDate, ISO_DATE), avatar);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{headerEmoji}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.fieldLabel}>Choose an avatar</Text>
            <View style={styles.avatarRow}>
              {AVATAR_OPTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => setAvatar(emoji)}
                  style={[styles.avatarOption, avatar === emoji && styles.avatarOptionSelected]}
                >
                  <Text style={styles.avatarEmoji}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Baby's name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Luna"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Birth date</Text>
            <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
              <Text style={styles.dateText}>{format(birthDate, 'MMMM d, yyyy')}</Text>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                maximumDate={new Date()}
                onChange={(_event, selectedDate) => {
                  setShowPicker(Platform.OS === 'ios');
                  if (selectedDate) setBirthDate(selectedDate);
                }}
              />
            )}
          </Card>

          <View style={styles.footer}>
            <Button label={ctaLabel} onPress={handleSave} disabled={!canSave} />
            {onCancel && (
              <View style={styles.cancelSpacing}>
                <Button label="Cancel" onPress={onCancel} variant="ghost" />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  card: {
    marginHorizontal: spacing.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  avatarOption: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    padding: spacing.lg,
  },
  cancelSpacing: {
    marginTop: spacing.sm,
  },
});
