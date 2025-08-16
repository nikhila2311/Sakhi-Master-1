'use client';

import Greeting from '@/components/dashboard/Greeting';
import { getUser } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FaEgg } from 'react-icons/fa6';
import { MdBloodtype } from 'react-icons/md';
import { SiEsbuild } from 'react-icons/si';
import { GiCottonFlower } from 'react-icons/gi';
import { BiLoaderAlt } from 'react-icons/bi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore/lite';
import { toast } from '@/components/ui/Toast';

export default function Tracker() {
  const { data: sessionData } = useSession();
  const userFirstName = sessionData?.user?.name ? sessionData.user.name.split(' ')[0] : '';
  const email = sessionData?.user?.email;

  const [userFireData, setUserFireData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [menstrualInput, setMenstrualInput] = useState({
    last_period_start_date: '',
    average_cycle_length: '',
    period_duration: '',
  });

  const fetchUserData = async (userEmail) => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const userData = await getUser(userEmail);
      if (userData) {
        setUserFireData(userData);
        if (userData.menstrualCycle) {
          setMenstrualInput({
            last_period_start_date: userData.menstrualCycle.last_period_start_date || '',
            average_cycle_length: userData.menstrualCycle.average_cycle_length?.toString() || '',
            period_duration: userData.menstrualCycle.period_duration?.toString() || '',
          });
        }
      } else {
        window.location.href = '/onboarding';
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchUserData(email);
    }
  }, [email]);

  const calculatePhases = () => {
    const { last_period_start_date, average_cycle_length, period_duration } = menstrualInput;

    if (!last_period_start_date || !average_cycle_length || !period_duration) {
      return {
        menstrual_phase: { start_date: 'N/A', end_date: 'N/A' },
        follicular_phase: { start_date: 'N/A', end_date: 'N/A' },
        ovulation_phase: { start_date: 'N/A', end_date: 'N/A' },
        luteal_phase: { start_date: 'N/A', end_date: 'N/A' },
      };
    }

    const cycleLength = parseInt(average_cycle_length);
    const periodDays = parseInt(period_duration);
    if (isNaN(cycleLength) || isNaN(periodDays)) {
      return {
        menstrual_phase: { start_date: 'N/A', end_date: 'N/A' },
        follicular_phase: { start_date: 'N/A', end_date: 'N/A' },
        ovulation_phase: { start_date: 'N/A', end_date: 'N/A' },
        luteal_phase: { start_date: 'N/A', end_date: 'N/A' },
      };
    }

    const startDate = new Date(last_period_start_date);
    if (isNaN(startDate)) {
      // Invalid date check
      return {
        menstrual_phase: { start_date: 'N/A', end_date: 'N/A' },
        follicular_phase: { start_date: 'N/A', end_date: 'N/A' },
        ovulation_phase: { start_date: 'N/A', end_date: 'N/A' },
        luteal_phase: { start_date: 'N/A', end_date: 'N/A' },
      };
    }

    const formatDate = (date) => date.toISOString().split('T')[0];

    const menstrualStart = startDate;
    const menstrualEnd = new Date(startDate);
    menstrualEnd.setDate(menstrualEnd.getDate() + periodDays - 1);

    const follicularStart = new Date(menstrualEnd);
    follicularStart.setDate(follicularStart.getDate() + 1);

    // Calculate ovulation day: usually cycleLength - 14, but if cycleLength too small, fallback to 14
    const ovulationDay = cycleLength - 14 > periodDays ? cycleLength - 14 : 14;
    const ovulationStart = new Date(startDate);
    ovulationStart.setDate(startDate.getDate() + ovulationDay - 1);
    const follicularEnd = new Date(ovulationStart);
    follicularEnd.setDate(ovulationStart.getDate() - 1);
    const ovulationEnd = new Date(ovulationStart);

    const lutealStart = new Date(ovulationEnd);
    lutealStart.setDate(lutealStart.getDate() + 1);
    const lutealEnd = new Date(startDate);
    lutealEnd.setDate(startDate.getDate() + cycleLength - 1);

    return {
      menstrual_phase: { start_date: formatDate(menstrualStart), end_date: formatDate(menstrualEnd) },
      follicular_phase: { start_date: formatDate(follicularStart), end_date: formatDate(follicularEnd) },
      ovulation_phase: { start_date: formatDate(ovulationStart), end_date: formatDate(ovulationEnd) },
      luteal_phase: { start_date: formatDate(lutealStart), end_date: formatDate(lutealEnd) },
    };
  };

  const getDietRecommendation = (phase) => {
    const diets = {
      menstrual_phase: [
        "Iron-rich foods like spinach, lentils, and red meat",
        "Hydrating foods like watermelon and cucumber",
        "Warm soups and herbal teas"
      ],
      follicular_phase: [
        "Fresh fruits and vegetables",
        "Lean proteins like chicken or tofu",
        "Omega-3 sources like walnuts and chia seeds"
      ],
      ovulation_phase: [
        "Zinc-rich foods like pumpkin seeds and eggs",
        "Vitamin B6 foods like bananas and salmon",
        "Anti-inflammatory foods like turmeric and ginger"
      ],
      luteal_phase: [
        "Complex carbs like brown rice and oats",
        "Calcium-rich foods like yogurt and almonds",
        "Magnesium-rich foods like dark chocolate and avocados"
      ]
    };
    return diets[phase] || ["No recommendation available"];
  };

  function getPhaseDates(phase) {
    // Prefer calculated phases if available, fallback to saved data
    const phases = userFireData?.menstrualCycle;
    if (!phases) return 'N/A';

    // Use calculated phase dates if available, else fallback to saved
    if (phases[phase]?.start_date && phases[phase]?.end_date) {
      return `${phases[phase].start_date} to ${phases[phase].end_date}`;
    }

    return 'N/A';
  }

  const handleMenstrualSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (!email) {
      toast.error("User email not found. Please log in again.");
      setSaving(false);
      return;
    }

    const averageCycle = parseInt(menstrualInput.average_cycle_length);
    const periodDuration = parseInt(menstrualInput.period_duration);
    if (isNaN(averageCycle) || isNaN(periodDuration)) {
      toast.error("Please enter valid numbers for cycle length and period duration.");
      setSaving(false);
      return;
    }

    const calculatedPhases = calculatePhases();

    try {
      const userDocRef = doc(db, 'users', email);
      await setDoc(
        userDocRef,
        {
          ...userFireData,
          menstrualCycle: {
            last_period_start_date: menstrualInput.last_period_start_date,
            average_cycle_length: averageCycle,
            period_duration: periodDuration,
            ...calculatedPhases,
          },
        },
        { merge: true }
      );

      toast.success("Menstrual data saved successfully!");
      await fetchUserData(email);
    } catch (error) {
      console.error("Error saving menstrual data:", error);
      toast.error("Failed to save menstrual data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-row justify-center items-center p-4 min-h-[calc(100vh-140px)]'>
        <BiLoaderAlt className='text-4xl animate-spin text-pink-500' />
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col'>
        <Greeting userFirstName={userFirstName} />
        <hr className='w-full opacity-20' />
        <p className='text-2xl font-semibold text-center text-rose-400'>
          Your Menstrual Tracker
        </p>

        {/* Form to input/update cycle info */}
        <form onSubmit={handleMenstrualSubmit} className="mt-8 p-4 bg-white shadow-md rounded-md flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-rose-500">Update Your Cycle Data</h3>
          {/* Inputs */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="last_period_start_date">Last Period Start Date</Label>
            <Input
              type="date"
              id="last_period_start_date"
              value={menstrualInput.last_period_start_date}
              onChange={(e) => setMenstrualInput({ ...menstrualInput, last_period_start_date: e.target.value })}
              disabled={saving}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="average_cycle_length">Average Cycle Length (days)</Label>
            <Input
              type="number"
              id="average_cycle_length"
              value={menstrualInput.average_cycle_length}
              onChange={(e) => setMenstrualInput({ ...menstrualInput, average_cycle_length: e.target.value })}
              disabled={saving}
              required
              min={10}
              max={45}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="period_duration">Period Duration (days)</Label>
            <Input
              type="number"
              id="period_duration"
              value={menstrualInput.period_duration}
              onChange={(e) => setMenstrualInput({ ...menstrualInput, period_duration: e.target.value })}
              disabled={saving}
              required
              min={1}
              max={14}
            />
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {saving ? 'Saving...' : 'Save Cycle Data'}
          </Button>
        </form>

        {/* Accordion for phase info and diet */}
        <Accordion
          type='single'
          collapsible
          className='w-full max-w-2xl mx-auto mt-10'
          defaultValue='menstrual'
        >
          {['menstrual', 'follicular', 'ovulation', 'luteal'].map((phase) => {
            const phaseKey = `${phase}_phase`;
            const phaseName = phase.charAt(0).toUpperCase() + phase.slice(1);
            const dates = calculatePhases()[phaseKey];
            const dietList = getDietRecommendation(phaseKey);

            return (
              <AccordionItem value={phaseKey} key={phaseKey} className='border rounded-lg mb-4'>
                <AccordionTrigger className='flex justify-between items-center font-semibold'>
                  <span>{phaseName} Phase</span>
                  <span className='text-sm font-normal opacity-70'>
                    {dates.start_date} to {dates.end_date}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-2'>
                    <p>
                      Recommended Diet:
                    </p>
                    <ul className='list-disc list-inside text-sm text-gray-700'>
                      {dietList.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
