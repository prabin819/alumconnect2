const mongoose = require('mongoose');
const Job = require('../models/Job.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createJobSchema, updateJobSchema } = require('../validation/job.schema');
const Alumni = require('../models/Alumni.model');

// Get all jobs
// exports.getAllJobs = async (req, res, next) => {
//   try {
//     const { search, company, jobType, sortBy } = req.query;
//     let query = { isActive: true };

//     // Search functionality
//     if (search) {
//       query.$text = { $search: search };
//     }

//     // Filter by company
//     if (company) {
//       query.company = company;
//     }

//     // Filter by job type
//     if (jobType) {
//       query.jobType = jobType;
//     }

//     // Sorting
//     let sort = {};
//     if (sortBy === 'latest') {
//       sort = { createdAt: -1 };
//     } else if (sortBy === 'deadline') {
//       sort = { applicationDeadline: 1 };
//     }

//     const jobs = await Job.find(query)
//       .sort(sort)
//       .populate('createdBy', 'name company position email linkedIn');

//     const response = new ApiResponse(200, { jobs }, 'Jobs fetched successfully');
//     res.status(response.statusCode).json(response);

//   } catch (error) {
//     const err = new ApiError(500, 'Failed to fetch jobs', [error.message]);
//     res.status(err.statusCode).json(err);
//   }
// };
exports.getAllJobs = asyncHandler(async (req, res, next) => {
  const { search, company, jobType, sortBy } = req.query;
  let query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }

  if (company) {
    query.company = company;
  }

  if (jobType) {
    query.jobType = jobType;
  }

  let sort = {};
  if (sortBy === 'latest') {
    sort = { createdAt: -1 };
  } else if (sortBy === 'deadline') {
    sort = { applicationDeadline: 1 };
  }

  const jobs = await Job.find(query)
    .sort(sort)
    .populate('createdBy', 'name company position email linkedIn');

  const response = new ApiResponse(200, { jobs }, 'Jobs fetched successfully');
  res.status(response.statusCode).json(response);
});

// Get job by ID
// exports.getJobById = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id).populate(
//       'createdBy',
//       'name company position email linkedIn'
//     );

//     if (!job) {
//       return res.status(404).json({ message: 'Job not found' });
//     }

//     res.status(200).json({ job });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.getJobByJobId = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, 'Invalid Job ID'));
  }
  const job = await Job.findById(req.params.id).populate(
    'createdBy',
    'name company position email linkedIn'
  );

  if (!job) {
    // If job not found, throw a 404 error
    return next(new ApiError(404, 'Job not found'));
  }

  const response = new ApiResponse(200, { job }, 'Job fetched successfully');
  res.status(response.statusCode).json(response);
});

exports.getJobsByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, 'Invalid User ID'));
  }

  const jobs = await Job.find({ createdBy: userId });

  const response = new ApiResponse(200, { jobs, count: jobs.length }, 'Jobs fetched successfully');
  res.status(response.statusCode).json(response);
});

// Create job posting
// exports.createJob = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       company,
//       location,
//       jobType,
//       salary,
//       applicationDeadline,
//       requirements,
//       applicationLink,
//     } = req.body;

//     const job = new Job({
//       title,
//       description,
//       company,
//       location,
//       jobType,
//       salary,
//       applicationDeadline,
//       requirements,
//       applicationLink,
//       createdBy: req.user.id,
//     });

//     await job.save();

//     // Add job reference to alumni
//     await Alumni.findByIdAndUpdate(req.user.id, { $push: { jobPostings: job._id } });

//     res.status(201).json({
//       message: 'Job posted successfully',
//       job,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
exports.createJob = asyncHandler(async (req, res, next) => {
  if (typeof req.body.requirements === 'string') {
    req.body.requirements = req.body.requirements
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const result = createJobSchema.safeParse(req.body);
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
    title,
    description,
    company,
    location,
    jobType,
    salary,
    applicationDeadline,
    requirements,
    applicationLink,
  } = result.data;

  // const {
  //   title,
  //   description,
  //   company,
  //   location,
  //   jobType,
  //   salary,
  //   applicationDeadline,
  //   requirements,
  //   applicationLink,
  // } = req.body;

  const job = new Job({
    title,
    description,
    company,
    location,
    jobType,
    salary,
    applicationDeadline,
    requirements,
    applicationLink,
    createdBy: req.user._id,
  });

  await job.save();

  // Add job reference to alumni
  await Alumni.findByIdAndUpdate(req.user.id, { $push: { jobPostings: job._id } });

  const response = new ApiResponse(201, { job }, 'Job posted successfully');
  res.status(response.statusCode).json(response);
});

// Update job posting
// exports.updateJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);

//     if (!job) {
//       return res.status(404).json({ message: 'Job not found' });
//     }

//     // Check if user is the creator
//     if (job.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized to update this job' });
//     }

//     const {
//       title,
//       description,
//       company,
//       location,
//       jobType,
//       salary,
//       applicationDeadline,
//       requirements,
//       applicationLink,
//       isActive,
//     } = req.body;

//     const updatedJob = await Job.findByIdAndUpdate(
//       req.params.id,
//       {
//         title,
//         description,
//         company,
//         location,
//         jobType,
//         salary,
//         applicationDeadline,
//         requirements,
//         applicationLink,
//         isActive,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: 'Job updated successfully',
//       job: updatedJob,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
exports.updateJob = asyncHandler(async (req, res, next) => {
  if (typeof req.body.requirements === 'string') {
    req.body.requirements = req.body.requirements
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, 'Invalid Job ID'));
  }
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ApiError(404, 'Job not found'));
  }

  // Check if user is the creator
  if (job.createdBy.toString() !== req.user.id) {
    return next(new ApiError(403, 'Not authorized to update this job'));
  }

  const result = updateJobSchema.safeParse(req.body);
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
  //   company,
  //   location,
  //   jobType,
  //   salary,
  //   applicationDeadline,
  //   requirements,
  //   applicationLink,
  //   isActive = true,
  // } = req.body;

  const {
    title,
    description,
    company,
    location,
    jobType,
    salary,
    applicationDeadline,
    requirements,
    applicationLink,
    isActive,
  } = req.body;

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      company,
      location,
      jobType,
      salary,
      applicationDeadline,
      requirements,
      applicationLink,
      isActive,
    },
    { new: true }
  );

  const response = new ApiResponse(200, { job: updatedJob }, 'Job updated successfully');
  res.status(response.statusCode).json(response);
});

// Delete job posting
// exports.deleteJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);

//     if (!job) {
//       return res.status(404).json({ message: 'Job not found' });
//     }

//     // Check if user is the creator
//     if (job.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized to delete this job' });
//     }

//     await Job.findByIdAndDelete(req.params.id);

//     // Remove job reference from alumni
//     await Alumni.findByIdAndUpdate(req.user.id, { $pull: { jobPostings: req.params.id } });

//     res.status(200).json({ message: 'Job deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.deleteJob = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, 'Invalid Job ID'));
  }
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ApiError(404, 'Job not found'));
  }

  // Check if user is the creator
  if (job.createdBy.toString() !== req.user.id) {
    return next(new ApiError(403, 'Not authorized to delete this job'));
  }

  await Job.findByIdAndDelete(req.params.id);

  // Remove job reference from alumni
  await Alumni.findByIdAndUpdate(req.user.id, { $pull: { jobPostings: req.params.id } });

  const response = new ApiResponse(200, null, 'Job deleted successfully');
  res.status(response.statusCode).json(response);
});

exports.applyForJob = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, 'Invalid Job ID'));
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ApiError(404, `Job not found with id of ${req.params.id}`));
  }

  // Check if already applied
  const alreadyApplied = job.applications.find(
    (application) => application.applicant.toString() === req.user._id
  );

  if (alreadyApplied) {
    return next(new ApiError(400, 'You have already applied for this job'));
  }

  // Add application
  job.applications.push({
    // applicant: req.user._id,
    // resume: req.files['resume'][0].path,
    // coverLetter: req.req.files['coverLetter'][0].path,
    applicant: req.user._id,
    ...(req.files?.resume?.[0] && { resume: req.files.resume[0].path.replace(/^public[\\/]/, '') }),
    ...(req.files?.coverLetter?.[0] && {
      coverLetter: req.files.coverLetter[0].path.replace(/^public[\\/]/, ''),
    }),
  });
  // req.file?.path.replace(/^public[\\/]/, '')

  await job.save();

  const response = new ApiResponse(200, { job }, 'Application submitted successfully');
  res.status(response.statusCode).json(response);
});
