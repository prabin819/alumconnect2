const Event = require('../models/Event.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createEventSchema, updateEventSchema } = require('../validation/event.schema');

const getAllEvents = asyncHandler(async (req, res, next) => {
  const { search, category, upcoming, past, sortBy } = req.query;
  let query = { isActive: true };

  // Search functionality
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by date
  const currentDate = new Date();
  if (upcoming === 'true') {
    query.startDate = { $gte: currentDate };
  } else if (past === 'true') {
    query.endDate = { $lt: currentDate };
  }

  // Sorting
  let sort = {};
  if (sortBy === 'latest') {
    sort = { createdAt: -1 };
  } else if (sortBy === 'upcoming') {
    sort = { startDate: 1 };
  }

  const events = await Event.find(query)
    .sort(sort)
    .populate('createdBy.id', 'name')
    .populate('attendees.userId', 'name');

  const response = new ApiResponse(200, { events }, 'Events fetched successfully');
  res.status(response.statusCode).json(response);
});

const getEventByEventId = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('createdBy.id', 'name email')
    .populate('attendees.userId', 'name');

  if (!event) {
    return next(new ApiError(404, 'Event not found'));
  }

  const response = new ApiResponse(200, { event }, 'Event fetched successfully');
  res.status(response.statusCode).json(response);
});

const getEventsByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const events = await Event.find({ 'createdBy.id': userId });

  const response = new ApiResponse(
    200,
    { events, count: events.length },
    'Events fetched successfully'
  );
  res.status(response.statusCode).json(response);
});

// const createEvent = asyncHandler(async (req, res, next) => {
//   const {
//     title,
//     description,
//     startDate,
//     endDate,
//     location,
//     isVirtual = false,
//     meetingLink,
//     maxAttendees,
//     category = 'other',
//     imageUrl = '',
//     isActive = true,
//   } = req.body;

//   // Validate input
//   const validationErrors = [];

//   // Check required fields
//   if (!title) validationErrors.push('Title is required');
//   if (!description) validationErrors.push('Description is required');
//   if (!startDate) validationErrors.push('Start date is required');
//   if (!endDate) validationErrors.push('End date is required');
//   if (!location) validationErrors.push('Location is required');
//   if (maxAttendees === undefined || maxAttendees === null)
//     validationErrors.push('Maximum attendees is required');

//   // Validate category
//   const validCategories = ['networking', 'workshop', 'seminar', 'social', 'conference', 'other'];
//   if (category && !validCategories.includes(category)) {
//     validationErrors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
//   }

//   // Validate dates
//   if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
//     validationErrors.push('End date must be after start date');
//   }

//   // If there are validation errors, throw an ApiError
//   if (validationErrors.length > 0) {
//     throw new ApiError(400, 'Validation failed', validationErrors);
//   }

//   // Prepare event data
//   const eventData = {
//     title,
//     description,
//     startDate: new Date(startDate),
//     endDate: new Date(endDate),
//     location,
//     isVirtual,
//     meetingLink: meetingLink || '',
//     maxAttendees: Number(maxAttendees),
//     category,
//     imageUrl: req.file?.path || imageUrl,
//     isActive,
//     createdBy: {
//       id: req.user.id,
//       userType: req.user.userType,
//     },
//   };

//   // Create event
//   try {
//     const event = new Event(eventData);
//     await event.save();

//     // Respond with created event
//     const response = new ApiResponse(201, { event }, 'Event created successfully');
//     res.status(response.statusCode).json(response);
//   } catch (error) {
//     // Handle mongoose validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map((err) => err.message);
//       throw new ApiError(400, 'Event validation failed', errors);
//     }

//     // Handle duplicate key errors or other mongo errors
//     if (error.code === 11000) {
//       throw new ApiError(400, 'Duplicate key error', [
//         'An event with similar unique constraints already exists',
//       ]);
//     }

//     // Rethrow any other unexpected errors
//     throw error;
//   }
// });

const createEvent = asyncHandler(async (req, res, next) => {
  const result = createEventSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
      ...(err.minimum && { minimum: err.minimum }),
      ...(err.maximum && { maximum: err.maximum }),
    }));
    throw new ApiError(400, 'Validation failed', errors);
  }

  const {
    title, // required
    description, // required
    startDate, // required
    endDate, // required
    location, // required
    isVirtual,
    meetingLink,
    maxAttendees, // required
    category,
  } = result.data;

  // Create event
  try {
    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      isVirtual,
      meetingLink,
      maxAttendees,
      category,
      imageUrl: req.file?.path.replace(/^public[\\/]/, ''),
    });

    event.createdBy.id = req.user._id;
    event.createdBy.userType = req.user.userType;

    await event.save();

    // Respond with created event
    const response = new ApiResponse(201, { event }, 'Event created successfully');
    res.status(response.statusCode).json(response);
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      throw new ApiError(400, 'Event validation failed', errors);
    }

    // Handle duplicate key errors or other mongo errors
    if (error.code === 11000) {
      throw new ApiError(400, 'Duplicate key error', [
        'An event with similar unique constraints already exists',
      ]);
    }

    // Rethrow any other unexpected errors
    throw error;
  }
});

const updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError(404, 'Event not found'));
  }

  // Check if user is the creator
  if (event.createdBy.id.toString() !== req.user.id) {
    return next(new ApiError(403, 'Not authorized to update this event'));
  }

  const result = updateEventSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
      ...(err.minimum && { minimum: err.minimum }),
      ...(err.maximum && { maximum: err.maximum }),
    }));
    throw new ApiError(400, 'Validation failed', errors);
  }

  // const {
  //   title,
  //   description,
  //   startDate,
  //   endDate,
  //   location,
  //   isVirtual,
  //   meetingLink,
  //   maxAttendees,
  //   category,
  //   imageUrl,
  //   isActive,
  // } = req.body;

  const {
    title,
    description,
    startDate,
    endDate,
    location,
    isVirtual,
    meetingLink,
    maxAttendees,
    category,
    isActive,
  } = result.data;

  const updatedImageUrl = req.file ? req.file.path.replace(/^public[\\/]/, '') : event.imageUrl;

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      startDate,
      endDate,
      location,
      isVirtual,
      meetingLink,
      maxAttendees,
      category,
      imageUrl: updatedImageUrl,
      isActive,
    },
    { new: true }
  );

  const response = new ApiResponse(200, { event: updatedEvent }, 'Event updated successfully');
  res.status(response.statusCode).json(response);
});

const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError(404, 'Event not found'));
  }

  // Check if user is the creator
  if (event.createdBy.id.toString() !== req.user.id) {
    return next(new ApiError(403, 'Not authorized to delete this event'));
  }

  await Event.findByIdAndDelete(req.params.id);

  const response = new ApiResponse(200, null, 'Event deleted successfully');
  res.status(response.statusCode).json(response);
});

const bookEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError(404, 'Event not found'));
  }

  if (!event.isActive) {
    return next(new ApiError(400, 'This event is no longer active'));
  }

  // Check if event has reached maximum attendees
  if (event.attendees.length >= event.maxAttendees) {
    return next(new ApiError(400, 'Event is at full capacity'));
  }

  // Check if user already registered
  const alreadyRegistered = event.attendees.some(
    (attendee) => attendee.userId.toString() === req.user.id
  );

  if (alreadyRegistered) {
    return next(new ApiError(400, 'You are already registered for this event'));
  }

  // Add user to attendees
  event.attendees.push({
    userId: req.user.id,
    userType: req.user.userType,
  });

  await event.save();

  const response = new ApiResponse(200, null, 'Successfully registered for the event');
  res.status(response.statusCode).json(response);
});

const cancelEventRegistration = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError(404, 'Event not found'));
  }

  // Check if user already cancelled
  const alreadyCancelled = event.attendees.some(
    (attendee) => attendee.userId.toString() === req.user.id
  );

  if (!alreadyCancelled) {
    return next(new ApiError(400, 'You have already cancelled for this event'));
  }

  // Remove user from attendees
  event.attendees = event.attendees.filter(
    (attendee) => attendee.userId.toString() !== req.user.id
  );

  await event.save();

  const response = new ApiResponse(200, null, 'Successfully cancelled event registration');
  res.status(response.statusCode).json(response);
});

module.exports = {
  getAllEvents,
  getEventByEventId,
  getEventsByUserId,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
  cancelEventRegistration,
};
