import path from "path";
import fs from "fs/promises";

export type UpcomingTour = {
  id: string;
  bookingCode?: string;
  name: string;
  email: string;
  phone?: string;
  tourDate: string;
  timeSlot?: string;
  groupSize: number;
  notes?: string;
  amount: number;
  paymentType: string;
  profileTag?: string;
  interests: string[];
  knowledgeLevel?: string;
  firstVisit?: string;
  country?: string;
  openQuestion?: string;
};

type Booking = {
  id: string;
  bookingCode?: string;
  name: string;
  email: string;
  phone?: string;
  tourDate?: string;
  timeSlot?: string;
  groupSize?: number;
  notes?: string;
  amount: number;
  paymentType: string;
  status: string;
  profileTag?: string;
};

type PreSurvey = {
  id: string;
  bookingId?: string;
  interests?: string[];
  knowledgeLevel?: string;
  firstVisit?: string;
  country?: string;
  openQuestion?: string;
  profileTag?: string;
};

const DATA_DIR = path.join(
  process.env.LIFEOS_ROOT ?? "/Users/mayuetong/Desktop/life-os/life-os-yuetong",
  "met-tour-business-system/data"
);

async function readFile<T>(filename: string): Promise<T[]> {
  try {
    const content = await fs.readFile(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(content) as T[];
  } catch {
    return [];
  }
}

export async function getUpcomingTours(): Promise<UpcomingTour[]> {
  const [bookings, pre] = await Promise.all([
    readFile<Booking>("bookings.json"),
    readFile<PreSurvey>("pre-surveys.json"),
  ]);

  const now = new Date();
  return bookings
    .filter((b) => b.status === "confirmed" && b.tourDate && new Date(b.tourDate) >= now)
    .sort((a, b) => new Date(a.tourDate!).getTime() - new Date(b.tourDate!).getTime())
    .map((b) => {
      const survey = pre.find((s) => s.bookingId === b.id);
      return {
        id: b.id,
        bookingCode: b.bookingCode,
        name: b.name,
        email: b.email,
        phone: b.phone,
        tourDate: b.tourDate!,
        timeSlot: b.timeSlot,
        groupSize: b.groupSize ?? 1,
        notes: b.notes,
        amount: b.amount,
        paymentType: b.paymentType,
        profileTag: b.profileTag ?? survey?.profileTag,
        interests: survey?.interests ?? [],
        knowledgeLevel: survey?.knowledgeLevel,
        firstVisit: survey?.firstVisit,
        country: survey?.country,
        openQuestion: survey?.openQuestion,
      };
    });
}
