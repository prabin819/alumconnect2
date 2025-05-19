const Contact = require('../models/Contact.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { submitContactSchema, updateContactStatusSchema } = require('../validation/contact.schema');

const submitContactForm = asyncHandler(async (req, res, next) => {
  const result = submitContactSchema.safeParse(req.body);
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

  const { name, email, subject, message } = result.data;
  // const { name, email, subject, message } = req.body;

  // if (!name || !email || !subject || !message) {
  //   return next(new ApiError(400, 'All fields are required'));
  // }

  const contact = new Contact({
    name,
    email,
    subject,
    message,
  });

  await contact.save();

  //return new ApiResponse(res, 201, 'Message sent successfully', contact);
  const response = new ApiResponse(201, contact, 'Message sent successfully');
  res.status(response.statusCode).json(response);
});

//admin
const getAllContactMessages = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  //return new ApiResponse(res, 200, 'Contact messages fetched successfully', contacts);
  const response = new ApiResponse(200, contacts, 'Contact messages fetched successfully');
  res.status(response.statusCode).json(response);
});

//admin
const updateContactStatus = asyncHandler(async (req, res, next) => {
  const result = updateContactStatusSchema.safeParse(req.body);
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

  const { status, response } = result.data;
  // const { status, response } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ApiError(404, 'Contact message not found'));
  }

  contact.status = status;

  if (response) {
    contact.response = response;
    contact.responded = true;
  }

  await contact.save();

  //return new ApiResponse(res, 200, 'Contact status updated successfully', contact);
  const responseTosend = new ApiResponse(200, contact, 'Contact status updated successfully');
  res.status(responseTosend.statusCode).json(responseTosend);
});

module.exports = {
  submitContactForm,
  getAllContactMessages,
  updateContactStatus,
};
