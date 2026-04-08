import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, socket } from '../config/api';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

// Fetch real notifications from API
export const fetchNotifications = async ({ pageParam = 1 }) => {
    const res = await api.get(`/notifications?page=${pageParam}`);
    // Adjusting based on standard ApiResponse structure { success, data, message }
    const notifications = res.data?.data || [];
    // Assuming backend handles pagination, otherwise return simple array
    return {
        data: notifications,
        nextPage: notifications.length === 30 ? pageParam + 1 : null
    };
};

export const useNotifications = () => {
    const queryClient = useQueryClient();
    const userId = localStorage.getItem("userId");

    const query = useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: fetchNotifications,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        staleTime: 1000 * 60 * 5, // 5 min stale time
    });

    // Real-time socket listener
    useEffect(() => {
        if (!socket || !userId) return;

        // Join personal room if not already joined
        socket.emit("join", userId);

        const handleNewNotification = (notification) => {
            console.log("New notification received:", notification);

            // Trigger a real-time toast alert
            toast.info(
                <div className="flex flex-col gap-1">
                    <p className="font-bold text-sm">{notification.title}</p>
                    <p className="text-xs opacity-90">{notification.message}</p>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    icon: "🔔"
                }
            );

            // Prepend new notification to the first page of cache
            queryClient.setQueryData(['notifications'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page, index) =>
                        index === 0
                            ? { ...page, data: [notification, ...page.data] }
                            : page
                    ),
                };
            });
        };

        socket.on("new_notification", handleNewNotification);
        return () => socket.off("new_notification", handleNewNotification);
    }, [queryClient, userId]);

    const markAsReadMutation = useMutation({
        mutationFn: (id) => api.patch(`/notifications/${id}`),
        onSuccess: (_, id) => {
            queryClient.setQueryData(['notifications'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
                    })),
                };
            });
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () => api.patch('/notifications/mark-all-read'),
        onSuccess: () => {
            queryClient.setQueryData(['notifications'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.map((n) => ({ ...n, isRead: true })),
                    })),
                };
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/notifications/${id}`),
        onSuccess: (_, id) => {
            queryClient.setQueryData(['notifications'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.filter((n) => n._id !== id),
                    })),
                };
            });
        }
    });

    return {
        ...query,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        deleteNotification: deleteMutation.mutate
    };
};
