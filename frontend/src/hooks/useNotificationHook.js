import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
// notificationService.js
export const fetchMockNotifications = async ({ pageParam = 1 }) => {
  await new Promise((res) => setTimeout(res, 300));
  const total = 20;
  const pageSize = 5;
  const start = (pageParam - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  const data = Array.from({ length: end - start }, (_, i) => ({
    id: start + i + 1,
    title: `Notification ${start + i + 1}`,
    message: `This is the message for notification ${start + i + 1}.`,
    type: ['interview', 'results', 'system', 'reminders'][(start + i) % 4],
    timestamp: new Date().toLocaleTimeString(),
    read: Math.random() < 0.5,
  }));

  return { data, nextPage: end < total ? pageParam + 1 : null };
};

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: fetchMockNotifications,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60,
  });

  const markAsRead = (id) => {
    queryClient.setQueryData(['notifications'], (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      };
    });
  };

  const markAsUnread = (id) => {
    queryClient.setQueryData(['notifications'], (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((n) => (n.id === id ? { ...n, read: false } : n)),
        })),
      };
    });
  };

  const markAllAsRead = () => {
    queryClient.setQueryData(['notifications'], (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((n) => ({ ...n, read: true })),
        })),
      };
    });
  };

  return { ...query, markAsRead, markAsUnread, markAllAsRead };
};
