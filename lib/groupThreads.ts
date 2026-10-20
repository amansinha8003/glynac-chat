import { Thread } from '@/types/chat';
import { isToday, isYesterday, differenceInCalendarDays } from 'date-fns';

export type ThreadGroupLabel =
  | 'Pinned'
  | 'Today'
  | 'Yesterday'
  | 'Previous 7 Days'
  | 'Older';

export interface ThreadGroup {
  label: ThreadGroupLabel;
  threads: Thread[];
}

export function groupThreads(threads: Thread[], searchQuery: string = ''): ThreadGroup[] {
  const query = searchQuery.trim().toLowerCase();
  const filteredThreads = query
    ? threads.filter((t) => t.title.toLowerCase().includes(query))
    : threads;

  const pinned: Thread[] = [];
  const today: Thread[] = [];
  const yesterday: Thread[] = [];
  const previous7Days: Thread[] = [];
  const older: Thread[] = [];

  const now = new Date();

  // Sort by updatedAt descending
  const sorted = [...filteredThreads].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  for (const thread of sorted) {
    if (thread.pinned) {
      pinned.push(thread);
      continue;
    }

    const updatedDate = new Date(thread.updatedAt);

    if (isToday(updatedDate)) {
      today.push(thread);
    } else if (isYesterday(updatedDate)) {
      yesterday.push(thread);
    } else {
      const daysDiff = differenceInCalendarDays(now, updatedDate);
      if (daysDiff <= 7 && daysDiff > 1) {
        previous7Days.push(thread);
      } else {
        older.push(thread);
      }
    }
  }

  const groups: ThreadGroup[] = [
    { label: 'Pinned', threads: pinned },
    { label: 'Today', threads: today },
    { label: 'Yesterday', threads: yesterday },
    { label: 'Previous 7 Days', threads: previous7Days },
    { label: 'Older', threads: older },
  ];

  return groups.filter((g) => g.threads.length > 0);
}
