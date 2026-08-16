import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors, radius, shadow, spacing } from '../theme';
import { Kid } from '../types';
import { formatAge } from '../utils/date';

interface Props {
  visible: boolean;
  topOffset: number;
  kids: Kid[];
  activeKidId: number | undefined;
  canAddMore: boolean;
  onSelect: (id: number) => void;
  onEditKid: (id: number) => void;
  onAddKid: () => void;
  onClose: () => void;
}

export function KidDropdown({
  visible,
  topOffset,
  kids,
  activeKidId,
  canAddMore,
  onSelect,
  onEditKid,
  onAddKid,
  onClose,
}: Props) {
  if (!visible) return null;

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.card, { top: topOffset }]}>
        {kids.map((kid) => {
          const isActive = kid.id === activeKidId;
          return (
            <View key={kid.id} style={[styles.row, isActive && styles.rowActive]}>
              <Pressable
                style={styles.rowMain}
                onPress={() => {
                  onSelect(kid.id);
                  onClose();
                }}
              >
                <Text style={styles.rowAvatar}>{kid.avatarEmoji}</Text>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{kid.name}</Text>
                  <Text style={styles.rowAge}>{formatAge(kid.birthDate)}</Text>
                </View>
                {isActive && <Text style={styles.check}>✓</Text>}
              </Pressable>
              <Pressable
                hitSlop={10}
                style={styles.editBtn}
                onPress={() => {
                  onClose();
                  onEditKid(kid.id);
                }}
              >
                <Text style={styles.editIcon}>✎</Text>
              </Pressable>
            </View>
          );
        })}

        {canAddMore && (
          <View style={styles.addRow}>
            <Button
              label="+ Add new kid"
              onPress={() => {
                onClose();
                onAddKid();
              }}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
  },
  card: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.sm,
    zIndex: 20,
    ...shadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  rowActive: {
    backgroundColor: colors.primarySoft,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  rowAvatar: {
    fontSize: 28,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  rowAge: {
    fontSize: 12,
    color: colors.textMuted,
  },
  check: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDeep,
    marginRight: spacing.xs,
  },
  editBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  editIcon: {
    fontSize: 16,
    color: colors.textMuted,
  },
  addRow: {
    marginTop: spacing.xs,
  },
});
