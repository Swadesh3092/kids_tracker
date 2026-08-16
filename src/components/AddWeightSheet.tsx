import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from './Button';
import { colors, radius, spacing } from '../theme';
import { formatWeekRange } from '../utils/date';

interface Props {
  visible: boolean;
  weekStartDate: string;
  initialWeightKg?: number;
  onClose: () => void;
  onSave: (weightKg: number, note?: string) => void;
}

export function AddWeightSheet({ visible, weekStartDate, initialWeightKg, onClose, onSave }: Props) {
  const [weight, setWeight] = useState(initialWeightKg ? String(initialWeightKg) : '');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (visible) setWeight(initialWeightKg ? String(initialWeightKg) : '');
  }, [visible, initialWeightKg]);

  const weightNumber = Number(weight);
  const canSave = weight.trim().length > 0 && weightNumber > 0;

  function handleSave() {
    if (!canSave) return;
    onSave(weightNumber, note.trim() || undefined);
    setNote('');
  }

  function handleClose() {
    setNote('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="none">
            <Text style={styles.title}>⚖️ Weekly weight</Text>
            <Text style={styles.subtitle}>Week of {formatWeekRange(weekStartDate)}</Text>

            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g. 5.4"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="e.g. after checkup"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />

            <View style={styles.actions}>
              <View style={styles.actionFlex}>
                <Button label="Cancel" onPress={handleClose} variant="ghost" />
              </View>
              <View style={styles.actionFlex}>
                <Button label="Save" onPress={handleSave} disabled={!canSave} />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(91, 70, 64, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionFlex: {
    flex: 1,
  },
});
