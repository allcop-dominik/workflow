import { z } from 'zod';

export const VideoCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  videos: z.array(z.object({
    id: z.string(),
    title: z.string(),
    duration: z.string(),
  })),
});

export type VideoCategory = z.infer<typeof VideoCategorySchema>;

export const mockVideoLibrary: VideoCategory[] = [
  {
    id: 'onboarding',
    name: 'Onboarding',
    videos: [
      { id: 'vid_welcome', title: 'Welcome to Medical Intake', duration: '2:30' },
      { id: 'vid_consent', title: 'Consent Form Overview', duration: '3:15' },
      { id: 'vid_privacy', title: 'Privacy Policy', duration: '1:45' },
    ],
  },
  {
    id: 'vitals',
    name: 'Vitals Collection',
    videos: [
      { id: 'vid_height', title: 'Height Measurement', duration: '1:20' },
      { id: 'vid_weight', title: 'Weight Measurement', duration: '1:30' },
      { id: 'vid_bp', title: 'Blood Pressure', duration: '2:10' },
      { id: 'vid_temp', title: 'Temperature Check', duration: '1:15' },
    ],
  },
  {
    id: 'symptoms',
    name: 'Symptom Assessment',
    videos: [
      { id: 'vid_pain', title: 'Pain Assessment', duration: '2:45' },
      { id: 'vid_headache', title: 'Headache Questions', duration: '2:20' },
      { id: 'vid_fever', title: 'Fever Symptoms', duration: '1:50' },
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency Protocols',
    videos: [
      { id: 'vid_emergency_exit', title: 'Emergency Exit', duration: '1:00' },
      { id: 'vid_urgent_care', title: 'Urgent Care Referral', duration: '1:30' },
    ],
  },
];