import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Complete Events hook with real-time sync and memoization
 * useMemo prevents re-filtering on every render (VIVA EXPLANATION)
 */
export const useEvents = (userId, searchTerm = '') => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time events listener
  useEffect(() => {
    if (!userId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = q.onSnapshot(
      (snapshot) => {
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
        setLoading(false);
      },
      (err) => {
        console.error('Events error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // MEMOIZED FILTERING - KEY VIVA POINT
  /**
   * useMemo caches filtered results. Without it, filtering runs on EVERY render
   * causing performance issues with large event lists
   */
  const filteredEvents = useMemo(() => {
    if (!searchTerm) return events;
    
    return events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        creatorId: userId,
        creatorName: eventData.creatorName || 'Anonymous',
        status: 'ongoing',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateEvent = useCallback(async (eventId, updates) => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    events: filteredEvents,
    allEvents: events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent
  };
};