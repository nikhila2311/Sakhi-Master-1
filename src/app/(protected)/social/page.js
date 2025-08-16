'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

import PostUI from '@/components/social/PostUI';
import Learn from '@/components/social/Learn';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { toast } from '@/components/ui/Toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { HiOutlinePlusCircle } from 'react-icons/hi2';
import { BiLoaderAlt } from 'react-icons/bi';

import { db } from '@/config/firebase';

import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore/lite';

export default function Social() {
  const { data: sessionData } = useSession();
  const email = sessionData?.user?.email;

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // 🔊 Voice Input States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // New: Emotional status state
  const [emotionStatus, setEmotionStatus] = useState('');

  const openNewPostDrawer = () => {
    document.getElementById('create-new-post').click();
  };

  const loadPosts = async () => {
    setPageLoading(true);
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);

      const _posts_temp_array = [];
      querySnapshot.forEach((doc) => {
        _posts_temp_array.push({ id: doc.id, ...doc.data() });
      });

      setPosts(_posts_temp_array);
    } catch (err) {
      console.error('Error loading community posts:', err);
      toast.error('Something Went Wrong while loading posts.');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [email]);

  // Simple keyword-based emotion detection
  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('happy') ||
      lowerText.includes('great') ||
      lowerText.includes('joy') ||
      lowerText.includes('excited') ||
      lowerText.includes('good') ||
      lowerText.includes('awesome')
    )
      return '😊 Happy';
    if (
      lowerText.includes('sad') ||
      lowerText.includes('unhappy') ||
      lowerText.includes('depressed') ||
      lowerText.includes('bad') ||
      lowerText.includes('upset') ||
      lowerText.includes('down')
    )
      return '😢 Sad';
    if (
      lowerText.includes('angry') ||
      lowerText.includes('mad') ||
      lowerText.includes('frustrated') ||
      lowerText.includes('annoyed')
    )
      return '😠 Angry';
    if (
      lowerText.includes('fear') ||
      lowerText.includes('scared') ||
      lowerText.includes('anxious') ||
      lowerText.includes('worried') ||
      lowerText.includes('nervous')
    )
      return '😨 Anxious';
    // Default neutral
    return '😐 Neutral';
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewPost((prev) => prev + ' ' + transcript);

        // New: Detect emotion and update state
        const emotion = detectEmotion(transcript);
        setEmotionStatus(emotion);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast.error('Voice recognition failed.');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      toast.error('User email not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const savePostToDB = await addDoc(collection(db, 'posts'), {
        post: newPost,
        owner: email,
        createdAt: Timestamp.now(),
      });

      if (savePostToDB) {
        toast.success('Post created successfully!');
      }
    } catch (err) {
      console.error('Error saving new post:', err);
      toast.error('Something Went Wrong while posting.');
    } finally {
      setLoading(false);
      setNewPost('');
      setEmotionStatus(''); // Reset emotion after posting
      document.getElementById('close-create-new-post').click();
      loadPosts();
    }
  };

  return (
    <Tabs defaultValue='forYou' className='w-full'>
      <TabsList className='w-full bg-transparent'>
        <TabsTrigger
          value='forYou'
          className='w-full border-b-2 data-[state=active]:border-b-pink-400 data-[state=active]:text-pink-600 data-[state=active]:shadow-none font-semibold'
        >
          For You
        </TabsTrigger>
        <TabsTrigger
          value='learn'
          className='w-full border-b-2 data-[state=active]:border-b-pink-400 data-[state=active]:text-pink-600 data-[state=active]:shadow-none font-semibold'
        >
          Learn
        </TabsTrigger>
      </TabsList>

      <TabsContent value='forYou'>
        <button
          className='fixed bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-1 justify-center items-center py-2 px-6 text-lg text-slate-700 border-2 bg-white rounded-full'
          onClick={openNewPostDrawer}
        >
          <HiOutlinePlusCircle size={24} /> Post
        </button>

        <Drawer>
          <DrawerTrigger id='create-new-post' className='hidden'>
            Open
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Post what&apos;s on your mind</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <form onSubmit={handleNewPostSubmit} className="w-full">
                <textarea
                  rows={8}
                  disabled={loading}
                  placeholder={'Write Something...'}
                  value={newPost}
                  required
                  onChange={(e) => setNewPost(e.target.value)}
                  className='block border-none w-full rounded-md p-1.5 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6 focus:border-none focus:outline-none'
                ></textarea>

                {/* 🎤 Voice Input Toggle Button */}
                <button
                  type='button'
                  className='mt-2 text-sm text-blue-500 hover:underline'
                  onClick={() => {
                    if (recognitionRef.current) {
                      if (isListening) {
                        recognitionRef.current.stop();
                      } else {
                        recognitionRef.current.start();
                      }
                    } else {
                      toast.error('Voice input not supported in this browser.');
                    }
                  }}
                >
                  🎤 {isListening ? 'Listening... Click to stop' : 'Use Voice Input'}
                </button>

                {/* New: Show Emotion Status */}
                {emotionStatus && (
                  <p className="mt-2 text-center font-semibold text-lg">
                    Your Emotional Status: <span>{emotionStatus}</span>
                  </p>
                )}

                <button
                  type='submit'
                  className='rounded-md w-full mt-4 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 flex flex-row justify-center transition-all items-center gap-2'
                  disabled={loading}
                >
                  {loading ? (
                    <BiLoaderAlt className='text-xl animate-spin' />
                  ) : (
                    'Post'
                  )}
                </button>
              </form>

              <DrawerClose className='hidden'>
                <button id='close-create-new-post'>Cancel</button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {pageLoading && (
          <div className='flex flex-row justify-center items-center p-4'>
            <BiLoaderAlt className='text-4xl animate-spin' />
          </div>
        )}

        {!pageLoading && posts.length === 0 && (
          <p className='text-center text-gray-500 mt-4'>
            No posts yet. Be the first to share something!
          </p>
        )}

        {posts.map((post) => (
          <PostUI key={post.id} post={post} />
        ))}
      </TabsContent>

      <TabsContent value='learn'>
        <Learn />
      </TabsContent>
    </Tabs>
  );
}
