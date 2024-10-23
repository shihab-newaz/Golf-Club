// app/actions/index.ts

// Auth actions
export { checkRole, handleAuthError } from "./auth";

// Admin actions
export {
  getBookings,
  deleteBooking,
  addBooking,
  updateBooking,
} from "./admin/bookings";

export {
  getCourses,
  deleteCourse,
  addCourse,
  updateCourse,
  getCourseById,
} from "./admin/courses";

export {
  getEvents,
  deleteEvent,
  addEvent,
  updateEvent,
  getEventById,
} from "./admin/events";

export {
  getMembers,
  addMember,
  updateMember,
  deleteMember,
} from "./admin/members";

export {
  getHotelRooms,
  addHotelRoom,
  updateHotelRoom,
  deleteHotelRoom,
} from "./admin/rooms";

export {
  getTeeTimes,
  deleteTeeTime,
  addTeeTime,
  updateTeeTime,
} from "./admin/teetimes";

// Member actions
export {
  getMemberDashboardData,
  cancelMemberBooking,
  updateMemberPreferences,
} from "./member/dashboard";

export {
  fetchAvailableTimes,
  fetchAvailableRooms,
  bookTeeTime,
  cancelBooking,
} from "./member/booking";

export {registerForEvent, unregisterFromEvent, checkEventRegistration} from "./member/events"

// Weather action
export { getWeatherData } from "./weather";

// Utilities export
export const actionUtils = {
  handleError: async (error: unknown) => {
    console.error("Action Error:", error);
    if (error instanceof Error) {
      return {
        error: error.message,
        status: 500,
        message: "An error occurred while processing your request",
      };
    }
    return {
      error: "Unknown error",
      status: 500,
      message: "An unknown error occurred",
    };
  },

  validateSession: async () => {
    const { getServerSession } = await import("next-auth/next");
    const { authOptions } = await import("@/utils/authOptions");
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    return session;
  },

  validateAdmin: async () => {
    const session = await actionUtils.validateSession();
    if (session.user.role !== "admin") {
      throw new Error("Forbidden");
    }
    return session;
  },
};

// Validation schemas
export const validationSchemas = {
  booking: {
    teeTime: {
      date: (date: Date) => date > new Date(),
      players: (players: number) => players > 0 && players <= 4,
    },
    hotel: {
      checkInDate: (date: Date) => date > new Date(),
      checkOutDate: (date: Date, checkInDate: Date) => date > checkInDate,
    },
  },
  event: {
    date: (date: Date) => date > new Date(),
    capacity: (capacity: number) => capacity > 0,
  },
  member: {
    email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    phone: (phone: string) => /^\+?[\d\s-]{10,}$/.test(phone),
  },
};
