// Journal.js
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Used for image display
import { useSession } from 'next-auth/react';
import Greeting from '@/components/dashboard/Greeting';
var Sentiment = require('sentiment'); // Assuming sentiment library is correctly installed

import {
  BiAngry,
  BiHappyHeartEyes,
  BiLoaderAlt,
  BiSad,
  BiSmile,
} from 'react-icons/bi';

import { HiOutlineMicrophone, HiPlus } from 'react-icons/hi2';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  // orderBy, // Keep commented if you don't have an index
  query,
  where,
} from 'firebase/firestore/lite'; // Import Firestore functions

import { db } from '@/config/firebase'; // Import db from your firebase config

import { toast } from '@/components/ui/Toast'; // Assuming you have a toast component

export default function Journal() {
  const { data: sessionData } = useSession(); // Renamed data to sessionData
  const userFirstName = sessionData?.user?.name ? sessionData.user.name.split(' ')[0] : '';
  const email = sessionData?.user?.email;

  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false); // For new note submission

  const [pageLoading, setPageLoading] = useState(true); // For initial page load

  const [currentViewNote, setCurrentViewNote] = useState({
    note: '',
    createdAt: '',
  });

  const viewNote = (note) => {
    setCurrentViewNote({
      note: note.note,
      createdAt: note.createdAt,
    });
    document.getElementById('view-note').click();
  };

  const [notes, setNotes] = useState([]);

  const openNewNoteDrawer = () => {
    document.getElementById('create-new-note').click();
  };

  const getTextSentiments = (text) => {
    const sentiment = new Sentiment();
    var result = sentiment.analyze(text);
    if (result.score > 0) {
      return 'happy';
    } else if (result.score < 0) {
      return 'sad';
    } else {
      return 'neutral';
    }
  };

  const loadNotes = async () => { // Removed email parameter as it's available from closure
    try {
      if (email) {
        // Query notes for the current user, ordered by creation date
        // IMPORTANT: If you uncomment orderBy, you might need a Firestore index.
        // If you encounter errors, check your Firebase console for index suggestions.
        const q = query(
          collection(db, 'journals'),
          where('owner', '==', email),
          // orderBy('createdAt', 'desc') // This line requires a Firestore index
        );
        const querySnapshot = await getDocs(q);
        const _temporary_array_for_journals = [];
        querySnapshot.forEach((doc) => {
          _temporary_array_for_journals.push({ id: doc.id, ...doc.data() });
        });
        // Sort in memory if orderBy is commented out or index is not present
        _temporary_array_for_journals.sort((a, b) => {
          // Ensure createdAt is a number (timestamp) for comparison
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return bTime - aTime; // Descending order
        });
        setNotes(_temporary_array_for_journals);
      }
    } catch (err) {
      console.error("Error loading journal notes:", err);
      toast.error('Something Went Wrong while loading notes.');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadNotes(); // Call loadNotes when component mounts or email changes
  }, [email]); // Depend on email from sessionData

  const handleNewNoteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      toast.error("User email not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const saveNoteToDB = await addDoc(collection(db, 'journals'), {
        note: newNote,
        owner: email, // Use email from sessionData
        mood: getTextSentiments(newNote),
        createdAt: Timestamp.now(),
      });

      if (saveNoteToDB) {
        toast.success('Note Saved successfully!');
      }
    } catch (err) {
      console.error("Error saving journal note:", err);
      toast.error('Something Went Wrong while saving note.');
    } finally {
      setLoading(false);
      setNewNote('');
      document.getElementById('close-create-new-note').click(); // Close drawer
      loadNotes(); // Reload notes to show the new one
    }
  };

  const getMoodBasedEmoji = (mood) => {
    switch (mood) {
      case 'happy':
        return BiHappyHeartEyes;
      case 'sad':
        return BiSad;
      case 'angry':
        return BiAngry;
      default:
        return BiSmile;
    }
  };

  const getMoodBasedColor = (mood) => {
    switch (mood) {
      case 'happy':
        return 'amber';
      case 'sad':
        return 'cyan';
      case 'angry':
        return 'rose';
      default:
        return 'green';
    }
  };

  const getDateAndMonthFromDate = (firebaseTimestamp) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    if (firebaseTimestamp && firebaseTimestamp.toDate) { // Check if it's a valid Firebase Timestamp
      const dateObj = firebaseTimestamp.toDate();
      const day = dateObj.getDate();
      const month = months[dateObj.getMonth()];
      return `${day} ${month}`;
    } else {
      return ''; // Return empty string or a placeholder if timestamp is invalid
    }
  };

  const getLimitedCharacters = (string) => {
    if (string.length > 30) {
      return string.slice(0, 30) + '...';
    } else {
      return string;
    }
  };

  // Image path: src='/assets/journal/journal.jpg'
  // This means the image should be located in your 'public/assets/journal/' directory.
  // Ensure 'public/assets/journal/journal.jpg' exists.
  return (
    <div className='h-[calc(100vh-140px)]'>
      <Greeting userFirstName={userFirstName} />
      <div className='flex flex-row p-4'>
        <div className='w-2/3'>
          <div className='text-base font-semibold'>
            Write down what&apos;s on your mind today
          </div>
          <button
            className='bg-gradient-to-tr from-emerald-300 to-emerald-200 text-emerald-950 shadow-sm shadow-gray-200 py-2 px-4 mt-2 rounded-lg'
            onClick={() => {
              openNewNoteDrawer();
            }}
          >
            Daily Check in
          </button>
        </div>
        <Image
          src='/assets/journal/journal.jpg'
          alt="Journal illustration" // Added alt text for accessibility
          width={500}
          height={500}
          className='self-center w-1/3'
          // Add onError for fallback if image fails to load
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/500x500/cccccc/white?text=Journal+Image"; }}
        />
      </div>
      <div className='p-4'>
        <div className='text-base pb-4 font-semibold'>Recent Notes</div>

        {pageLoading && (
          <div className='flex flex-row justify-center items-center p-4'>
            <BiLoaderAlt className='text-4xl animate-spin' />
          </div>
        )}

        {!pageLoading && notes.length === 0 && (
          <p>
            You don&apos;t have any notes yet. Click on the button above to
            create one.
          </p>
        )}

        {notes.map((note, index) => (
          <button
            className={`w-full grid gap-2 text-left grid-cols-12 rounded-md mb-4 p-2 shadow-md bg-gradient-to-br from-${getMoodBasedColor(note.mood)}-100 to-${getMoodBasedColor(note.mood)}-200 text-${getMoodBasedColor(note.mood)}-950`}
            onClick={() => viewNote(note)}
            key={note.id || index} // Use note.id if available, otherwise index
          >
            <div className='col-span-2 text-center h-full grid place-items-center'>
              {getDateAndMonthFromDate(note.createdAt)}
            </div>

            <div className={`col-span-8 h-full flex flex-wrap items-center border-l-2 border-${getMoodBasedColor(note.mood)}-900/50 pl-2`}>{getLimitedCharacters(note.note)}
            </div>

            <div className='col-span-2 h-full grid place-items-center'>
              {React.createElement(getMoodBasedEmoji(note.mood), {
                size: 36,
                className: `fill-${getMoodBasedColor(note.mood)}-900 `,
              })}
            </div>
          </button>
        ))}
      </div>

      <Drawer>
        <DrawerTrigger id='create-new-note' className='hidden'>
          Open
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Write down what&apos; on your mind</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <form onSubmit={handleNewNoteSubmit}>
              <textarea
                rows={8}
                disabled={loading}
                placeholder={'Write Something...'}
                value={newNote}
                required={true}
                onChange={(e) => setNewNote(e.target.value)}
                className='block border-none w-full rounded-md p-1.5 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6 focus:border-none focus:outline-none'
              ></textarea>
              <button
                type='submit'
                className='rounded-md w-full mt-4 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 flex flex-row justify-center transition-all items-center gap-2'
                disabled={loading}
              >
                {loading ? (
                  <BiLoaderAlt className='text-xl animate-spin' />
                ) : (
                  'Save'
                )}
              </button>
            </form>

            <DrawerClose className='hidden'>
              <button id='close-create-new-note'>Cancel</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* view any notes */}
      <Drawer>
        <DrawerTrigger id='view-note' className='hidden'>
          Open
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {getDateAndMonthFromDate(currentViewNote.createdAt)}
            </DrawerTitle>
          </DrawerHeader>
          <p className='whitespace-pre-wrap p-4 max-h-[70vh] overflow-y-auto'>
            {currentViewNote.note}
          </p>
          <DrawerFooter>
            <DrawerClose className='hidden'>
              <button id='close-view-note'>Cancel</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className='h-36'>
        {/* This div is only for page to get a full scroll */}
      </div>

      <div className='fixed bottom-20 left-1/2 -translate-x-1/2 z-10 p-2 rounded-full flex flex-row justify-center items-center gap-2 bg-white ring-1 ring-gray-200'>
        <button
          className='h-12 aspect-square flex justify-center items-center rounded-full bg-black text-pink-50'
          onClick={() => {
            openNewNoteDrawer();
          }}
        >
          <HiPlus size={24} />
        </button>
        <button className='h-12 aspect-square flex justify-center items-center rounded-full bg-black/5 text-pink-950'>
          <HiOutlineMicrophone size={24} />
        </button>
      </div>
    </div>
  );
}
