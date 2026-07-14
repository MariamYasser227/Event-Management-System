import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  MOCK_ACCOUNTS,
  MOCK_EVENTS,
  MOCK_REGISTRATIONS,
  MOCK_FEEDBACK,
  MOCK_REGISTRANTS,
  MOCK_REQUESTS,
} from '../data/mockData';

// ─────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within <AppProvider>');
  return ctx;
}

// ─────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── Accounts ──────────────────────────────────────────────
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  // Default to Mariam (organizer) so dashboards render immediately
  const [currentUser, setCurrentUserState] = useState(MOCK_ACCOUNTS[2]);

  // ── Shared reactive data ───────────────────────────────────
  const [events,        setEvents]        = useState(MOCK_EVENTS);
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);
  const [feedback,      setFeedback]      = useState(MOCK_FEEDBACK);
  const [registrants,   setRegistrants]   = useState(MOCK_REGISTRANTS);
  const [requests,      setRequests]      = useState(MOCK_REQUESTS);

  // ── Derived / filtered (memoised) ─────────────────────────

  /** Events created by the current organizer */
  const myEvents = useMemo(
    () => events.filter((e) => e.organizerId === currentUser.id),
    [events, currentUser.id],
  );

  /** Registrations for the current user, enriched with event data */
  const myRegistrations = useMemo(
    () =>
      registrations
        .filter((r) => r.userId === currentUser.id)
        .map((r) => ({ ...r, event: events.find((e) => e.id === r.eventId) }))
        .filter((r) => r.event),
    [registrations, events, currentUser.id],
  );

  /** Feedback left by the current user */
  const myFeedback = useMemo(
    () => feedback.filter((f) => f.userId === currentUser.id),
    [feedback, currentUser.id],
  );

  /** Requests submitted by the current organizer */
  const myRequests = useMemo(
    () => requests.filter((r) => r.organizerId === currentUser.id),
    [requests, currentUser.id],
  );

  /** Flat user list for admin views */
  const users = useMemo(
    () =>
      accounts.map((acc) => ({
        id:       acc.id,
        name:     acc.name,
        email:    acc.email,
        initials: acc.initials,
        role:     acc.role.charAt(0).toUpperCase() + acc.role.slice(1),
        org:      acc.org,
        joined:   acc.joinedDate || 'N/A',
        status:   'Active',
      })),
    [accounts],
  );

  // ── Check if current user is registered for an event ──────
  const isRegistered = useCallback(
    (eventId) => registrations.some((r) => r.userId === currentUser.id && r.eventId === eventId && r.status !== 'Cancelled'),
    [registrations, currentUser.id],
  );

  // ── CRUD Actions ───────────────────────────────────────────

  const setCurrentUser = useCallback((account) => {
    setCurrentUserState(account);
  }, []);

  /** Register the current user for an event */
  const registerForEvent = useCallback(
    (eventId, ticketType = 'Standard Pass') => {
      if (isRegistered(eventId)) return { success: false, message: 'Already registered for this event.' };

      const newReg = {
        id: `reg-${Date.now()}`,
        userId:     currentUser.id,
        eventId,
        ticketType,
        seat:   null,
        status: 'Confirmed',
        date:   new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      };
      setRegistrations((prev) => [...prev, newReg]);
      setEvents((prev) =>
        prev.map((e) => e.id === eventId ? { ...e, registered: (e.registered || 0) + 1 } : e),
      );

      // Also add to registrants (organizer checkin list)
      const newAttendee = {
        id:       `att-${Date.now()}`,
        eventId,
        userId:   currentUser.id,
        name:     currentUser.name,
        email:    currentUser.email,
        initials: currentUser.initials,
        ticket:   ticketType,
        payment:  'Paid',
        status:   'Waiting',
      };
      setRegistrants((prev) => [...prev, newAttendee]);

      return { success: true };
    },
    [currentUser, isRegistered],
  );

  /** Cancel an existing registration */
  const cancelRegistration = useCallback(
    (registrationId) => {
      const reg = registrations.find((r) => r.id === registrationId);
      if (!reg) return;
      setRegistrations((prev) =>
        prev.map((r) => r.id === registrationId ? { ...r, status: 'Cancelled' } : r),
      );
      setEvents((prev) =>
        prev.map((e) =>
          e.id === reg.eventId ? { ...e, registered: Math.max((e.registered || 1) - 1, 0) } : e,
        ),
      );
    },
    [registrations],
  );

  /** Submit or update feedback for an attended event */
  const submitEventFeedback = useCallback(
    (eventId, rating, comment) => {
      const existing = feedback.find(
        (f) => f.userId === currentUser.id && f.eventId === eventId,
      );
      if (existing) {
        setFeedback((prev) =>
          prev.map((f) =>
            f.id === existing.id ? { ...f, rating, comment: `"${comment}"`, date: 'Just now' } : f,
          ),
        );
      } else {
        setFeedback((prev) => [
          ...prev,
          {
            id:       `fb-${Date.now()}`,
            userId:   currentUser.id,
            eventId,
            name:     currentUser.name,
            initials: currentUser.initials,
            rating,
            date:     new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            comment:  `"${comment}"`,
          },
        ]);
      }
      // Recalculate event rating from all feedback
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e;
          const allForEvent = [
            ...feedback.filter((f) => f.eventId === eventId && f.userId !== currentUser.id),
            { rating },
          ];
          const avg = allForEvent.reduce((s, f) => s + f.rating, 0) / allForEvent.length;
          return { ...e, rating: Math.round(avg * 10) / 10, reviews: allForEvent.length };
        }),
      );
    },
    [currentUser, feedback],
  );

  /** Organizer: submit a new event creation request */
  const createEventRequest = useCallback(
    (formData) => {
      const newReqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRequest = {
        id:                newReqId,
        organizerId:       currentUser.id,
        event:             formData.title,
        requester:         currentUser.org || currentUser.name,
        date:              'Today',
        status:            'Pending',
        dateProposed:      formData.dateProposed,
        capacityProposed:  formData.capacity,
        priceProposed:     formData.price,
        locationProposed:  formData.location,
        descriptionProposed: formData.description,
        imageProposed:     formData.image,
      };
      setRequests((prev) => [newRequest, ...prev]);
      return newReqId;
    },
    [currentUser],
  );

  /** Admin: approve a request → creates the event */
  const approveRequest = useCallback(
    (requestId) => {
      const req = requests.find((r) => r.id === requestId);
      if (!req) return;
      setRequests((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, status: 'Approved' } : r),
      );
      const newEvent = {
        id:          Date.now(),
        organizerId: req.organizerId,
        title:       req.event,
        date:        req.dateProposed || 'TBD',
        registered:  0,
        capacity:    req.capacityProposed || 100,
        status:      'OPENING SOON',
        price:       req.priceProposed || 0,
        location:    req.locationProposed || 'TBD',
        description: req.descriptionProposed || '',
        image:       req.imageProposed || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
        organizer:   req.requester,
        category:    'General',
      };
      setEvents((prev) => [...prev, newEvent]);
    },
    [requests],
  );

  /** Admin: reject a request */
  const rejectRequest = useCallback(
    (requestId) => {
      setRequests((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, status: 'Rejected' } : r),
      );
    },
    [],
  );

  /** Organizer / Admin: update event fields */
  const updateEvent = useCallback((eventId, changes) => {
    setEvents((prev) =>
      prev.map((e) => e.id === eventId ? { ...e, ...changes } : e),
    );
  }, []);

  /** Admin: delete an event (and its registrations) */
  const deleteEvent = useCallback((eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
    setRegistrants((prev) => prev.filter((r) => r.eventId !== eventId));
  }, []);

  /** Admin: update a user account */
  const updateUser = useCallback((userId, changes) => {
    setAccounts((prev) =>
      prev.map((a) => a.id === userId ? { ...a, ...changes } : a),
    );
    // Also reflect on currentUser if it's themselves
    setCurrentUserState((prev) => (prev.id === userId ? { ...prev, ...changes } : prev));
  }, []);

  // ── Context value ──────────────────────────────────────────
  const value = {
    // Session
    accounts,
    currentUser,
    setCurrentUser,

    // Raw data + setters (for complex mutations not covered by actions)
    events,        setEvents,
    registrations, setRegistrations,
    feedback,      setFeedback,
    registrants,   setRegistrants,
    requests,      setRequests,
    users,

    // Derived (filtered for current user)
    myEvents,
    myRegistrations,
    myFeedback,
    myRequests,

    // Helpers
    isRegistered,

    // CRUD actions
    registerForEvent,
    cancelRegistration,
    submitEventFeedback,
    createEventRequest,
    approveRequest,
    rejectRequest,
    updateEvent,
    deleteEvent,
    updateUser,

    // Keep 'user' alias so TopBar / DesktopLayout don't break
    user: currentUser,
    role: currentUser.role,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
