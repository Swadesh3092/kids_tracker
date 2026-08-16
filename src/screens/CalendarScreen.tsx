import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { KidDropdown } from '../components/KidDropdown';
import { StatPill } from '../components/StatPill';
import { useKids } from '../context/KidContext';
import { getDailyTotalsForMonth } from '../db/meals';
import { colors, radius, spacing } from '../theme';
import { CalendarScreenProps, DayTotal } from '../types';
import { formatAge, todayISO } from '../utils/date';

type Props = CalendarScreenProps;

export function CalendarScreen({ navigation }: Props) {
  const { kids, activeKid, canAddMore, selectKid, refreshKids } = useKids();
  const [visibleMonth, setVisibleMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [totals, setTotals] = useState<Record<string, DayTotal>>({});
  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const today = todayISO();

  const load = useCallback(() => {
    refreshKids();
  }, [refreshKids]);

  useFocusEffect(load);

  useFocusEffect(
    useCallback(() => {
      if (activeKid) {
        setTotals(getDailyTotalsForMonth(activeKid.id, visibleMonth));
      }
    }, [activeKid, visibleMonth])
  );

  const monthTotalMl = useMemo(
    () => Object.values(totals).reduce((sum, t) => sum + t.totalMl, 0),
    [totals]
  );
  const todayTotal = totals[today];

  function renderDay({ date, state }: { date?: DateData; state?: string }) {
    if (!date) return <View />;
    const dayTotal = totals[date.dateString];
    const isToday = date.dateString === today;
    const isOtherMonth = state === 'disabled';
    return (
      <Pressable
        style={styles.dayCell}
        onPress={() => navigation.navigate('DayDetail', { date: date.dateString })}
      >
        <View style={[styles.dayCircle, isToday && styles.dayCircleToday]}>
          <Text style={[styles.dayNumber, isOtherMonth && styles.dayNumberMuted, isToday && styles.dayNumberToday]}>
            {date.day}
          </Text>
        </View>
        {dayTotal ? (
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>{dayTotal.totalMl}</Text>
          </View>
        ) : (
          <View style={styles.dayBadgePlaceholder} />
        )}
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Pressable
        style={styles.header}
        onPress={() => setSwitcherVisible((v) => !v)}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}
      >
        <Text style={styles.avatar}>{activeKid?.avatarEmoji ?? '👶'}</Text>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.kidName}>{activeKid?.name ?? 'Baby'}</Text>
            <View style={styles.chevronBadge}>
              <Text style={styles.chevron}>{switcherVisible ? '▲' : '▼'}</Text>
            </View>
          </View>
          <Text style={styles.kidAge}>{activeKid ? formatAge(activeKid.birthDate) : ''}</Text>
        </View>
      </Pressable>

      <View style={styles.statsRow}>
        <StatPill emoji="🍼" label="Today" value={`${todayTotal?.totalMl ?? 0} ml`} tone="primary" />
        <StatPill emoji="📆" label="This month" value={`${monthTotalMl} ml`} tone="secondary" />
      </View>

      <Card style={styles.calendarCard}>
        <Calendar
          onMonthChange={(m: DateData) => setVisibleMonth(m.dateString.slice(0, 7))}
          dayComponent={renderDay}
          theme={{
            backgroundColor: colors.card,
            calendarBackground: colors.card,
            monthTextColor: colors.text,
            textMonthFontWeight: '800',
            textMonthFontSize: 18,
            arrowColor: colors.primaryDark,
            textSectionTitleColor: colors.textMuted,
          }}
        />
      </Card>

      <Text style={styles.hint}>Tap a day to log feeds 🍼</Text>

      <KidDropdown
        visible={switcherVisible}
        topOffset={headerHeight}
        kids={kids}
        activeKidId={activeKid?.id}
        canAddMore={canAddMore}
        onSelect={selectKid}
        onEditKid={(id) => navigation.navigate('EditKid', { kidId: id })}
        onAddKid={() => navigation.navigate('AddKid')}
        onClose={() => setSwitcherVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  avatar: {
    fontSize: 40,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  kidName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  chevronBadge: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 9,
    color: colors.primaryDark,
  },
  kidAge: {
    fontSize: 13,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  calendarCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: 4,
    width: 40,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleToday: {
    backgroundColor: colors.primary,
  },
  dayNumber: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  dayNumberMuted: {
    color: colors.textMuted,
    opacity: 0.5,
  },
  dayNumberToday: {
    color: colors.white,
    fontWeight: '800',
  },
  dayBadge: {
    marginTop: 2,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 5,
  },
  dayBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text,
  },
  dayBadgePlaceholder: {
    height: 14,
    marginTop: 2,
  },
  hint: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.md,
  },
});
