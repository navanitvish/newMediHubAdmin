const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'api/v1/users/login',
    PROFILE: '/api/v1/users/profile',
  },
  USER: {
    GET_PROFILE: '/api/v1/users/profile/id',
    UPDATE_PROFILE: '/user/profile/update',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
  BOOKINGS: {
    BOOK_APPOINTMENT: 'api/v1/bookings/book/appointment/receptionist',
    GET_APPOINTMENTS: '/api/v1/bookings/booking',
    GET_SINGLE: '/api/v1/bookings/booking',
    GET_PRESCRIPTION: '/api/v1/bookings/getPrescriptions',
    CANCEL_APPOINTMENT: 'api/v1/bookings/cancel-appointment',
    VITAL_BOOKING: '/api/v1/receptionist/vitelPateint',
    
  },
  DOCTORS: {
    GET_ALL_DOCTOR: '/api/v1/doctors',
  },
  LAB: {
    GET_ALL: '/api/v1/users/lab',
    EDIT_LAB: '/api/v1/labs/update',
    ADD_LAB: '/api/v1/labs/add',
    LAB_REPORT: '/api/v1/labs/uploadReport/id',
    GET_TESTLIST: '/api/v1/labs/testList',
    GET_TEST: '/api/v1/labs/testList/id',
    
  }
};

export default API_ENDPOINTS;