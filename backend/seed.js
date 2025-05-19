// // seed.js
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const User = require('./models/User');

// dotenv.config();

// const MONGO_URI = 'mongodb://localhost:27017/mydatabase'; // Replace with your DB

// const seedUsers = [
//   { name: 'Alice', email: 'alice@example.com' },
//   { name: 'Bob', email: 'bob@example.com' },
// ];

// async function seed() {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//     console.log('Connected to MongoDB');

//     // Clear existing data (optional)
//     await User.deleteMany();

//     // Insert new data
//     await User.insertMany(seedUsers);
//     console.log('Users seeded!');

//     process.exit(); // Exit after completion
//   } catch (err) {
//     console.error('Seeding failed:', err);
//     process.exit(1);
//   }
// }

// seed();

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('./models/User.model');
const Alumni = require('./models/Alumni.model');
const Student = require('./models/Student.model');
const News = require('./models/News.model');
const Job = require('./models/Job.model');
const Event = require('./models/Event.model');
const Contact = require('./models/Contact.model');
const Comment = require('./models/Comment.model');
const dotenv = require('dotenv');

dotenv.config();

// Data configuration
const NUM_ALUMNI = 20;
const NUM_STUDENTS = 20;
const NUM_NEWS = 30;
const NUM_JOBS = 15;
const NUM_EVENTS = 10;
const NUM_CONTACTS = 8;
const COMMENTS_PER_NEWS = 3;

// Shared data pools
const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Engineering'];
const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];
const eventCategories = ['networking', 'workshop', 'seminar', 'social', 'conference', 'other'];
const newsCategories = ['academic', 'career', 'announcement', 'achievement', 'general'];
const contactSubjects = ['Question', 'Feedback', 'Complaint', 'Partnership', 'Other'];

// Generate random date within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Seed function
const seedDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/alumconnect1`);
    console.log('Connected to MongoDB');
    // Clear existing data
    await mongoose.connection.dropDatabase();
    console.log('Cleared existing database');

    // Seed Users (Alumni and Students)
    console.log('Seeding users...');
    const users = [];

    // Create Alumni
    for (let i = 0; i < NUM_ALUMNI; i++) {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const alumni = await Alumni.create({
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        name: faker.person.fullName(),
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.paragraph(),
        userType: 'Alumni',
        isVerified: true,
        graduationYear: faker.number.int({ min: 2010, max: 2022 }),
        degree: faker.helpers.arrayElement(['BSc', 'BA', 'MSc', 'MBA', 'PhD']),
        company: faker.company.name(),
        position: faker.person.jobTitle(),
        industry: faker.helpers.arrayElement(industries),
        linkedIn: `https://linkedin.com/in/${faker.string.alphanumeric(10)}`,
        skills: faker.helpers.arrayElements(
          ['JavaScript', 'Python', 'Java', 'C++', 'Project Management', 'Data Analysis'],
          { min: 3, max: 6 }
        ),
      });
      users.push(alumni);
    }

    // Create Students
    for (let i = 0; i < NUM_STUDENTS; i++) {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const enrollmentYear = faker.number.int({ min: 2018, max: 2023 });
      const student = await Student.create({
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        name: faker.person.fullName(),
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.paragraph(),
        userType: 'Student',
        isVerified: true,
        enrollmentYear,
        expectedGraduationYear: enrollmentYear + 4,
        major: faker.helpers.arrayElement([
          'Computer Science',
          'Electrical Engineering',
          'Business Administration',
        ]),
        studentId: `${faker.string.alpha(2).toUpperCase()}${faker.number.int({ min: 1000, max: 9999 })}`,
        interests: faker.helpers.arrayElements(
          ['AI', 'Web Development', 'Cybersecurity', 'Entrepreneurship'],
          { min: 2, max: 5 }
        ),
      });
      users.push(student);
    }
    console.log(`Created ${users.length} users`);

    // Seed News with Comments
    console.log('Seeding news and comments...');
    const newsArticles = [];
    for (let i = 0; i < NUM_NEWS; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const news = await News.create({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(5),
        summary: faker.lorem.sentence(),
        imageUrl: faker.image.urlLoremFlickr({ category: 'business' }),
        tags: faker.helpers.arrayElements(['education', 'technology', 'Alumni', 'campus'], {
          min: 1,
          max: 3,
        }),
        category: faker.helpers.arrayElement(newsCategories),
        createdBy: {
          id: randomUser._id,
          userType: randomUser.userType,
          name: randomUser.name,
        },
        viewCount: faker.number.int({ min: 0, max: 1000 }),
        likes: Array.from({ length: faker.number.int({ min: 0, max: 20 }) }, () => ({
          userId: faker.helpers.arrayElement(users)._id,
          addedAt: randomDate(new Date(2023, 0, 1), new Date()),
        })),
      });

      // Add comments to this news article
      const comments = [];
      for (let j = 0; j < COMMENTS_PER_NEWS; j++) {
        const commentUser = faker.helpers.arrayElement(users);
        const comment = await Comment.create({
          userId: commentUser._id,
          userType: commentUser.userType,
          name: commentUser.name,
          text: faker.lorem.paragraph(),
        });
        comments.push(comment._id);
      }

      // Update news with comments
      news.comments = comments.map((commentId) => ({ commentId }));
      await news.save();
      newsArticles.push(news);
    }
    console.log(`Created ${newsArticles.length} news articles with comments`);

    // Seed Jobs
    console.log('Seeding jobs...');
    const jobs = [];
    for (let i = 0; i < NUM_JOBS; i++) {
      const alumniCreator = faker.helpers.arrayElement(
        users.filter((u) => u.userType === 'Alumni')
      );
      const job = await Job.create({
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraphs(3),
        company: alumniCreator.company || faker.company.name(),
        location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
        jobType: faker.helpers.arrayElement(jobTypes),
        salary: faker.helpers.arrayElement([
          '$50,000 - $70,000',
          '$70,000 - $90,000',
          '$90,000+',
          'Not specified',
        ]),
        applicationDeadline: randomDate(new Date(), new Date(2024, 11, 31)),
        requirements: faker.helpers.arrayElements(
          ["Bachelor's degree", '3+ years experience', 'Team player', 'Communication skills'],
          { min: 2, max: 5 }
        ),
        applicationLink: faker.internet.url(),
        createdBy: alumniCreator._id,
        isActive: true,
      });
      jobs.push(job);
    }
    console.log(`Created ${jobs.length} jobs`);

    // Seed Events
    console.log('Seeding events...');
    const events = [];
    for (let i = 0; i < NUM_EVENTS; i++) {
      const startDate = randomDate(new Date(), new Date(2024, 11, 31));
      const endDate = new Date(
        startDate.getTime() + faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000
      );
      const creator = faker.helpers.arrayElement(users);

      const event = await Event.create({
        title: faker.lorem.words(3),
        description: faker.lorem.paragraphs(2),
        startDate,
        endDate,
        location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
        isVirtual: faker.datatype.boolean(),
        meetingLink: faker.internet.url(),
        maxAttendees: faker.number.int({ min: 20, max: 100 }),
        category: faker.helpers.arrayElement(eventCategories),
        imageUrl: faker.image.urlLoremFlickr({ category: 'business' }),
        createdBy: {
          id: creator._id,
          userType: creator.userType,
        },
        isActive: true,
      });

      // Add some random attendees
      const numAttendees = faker.number.int({ min: 5, max: 20 });
      const attendees = faker.helpers.arrayElements(users, numAttendees);
      event.attendees = attendees.map((user) => ({
        userId: user._id,
        userType: user.userType,
        registeredAt: randomDate(
          new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000),
          startDate
        ),
      }));
      await event.save();
      events.push(event);
    }
    console.log(`Created ${events.length} events`);

    // Seed Contacts
    console.log('Seeding contacts...');
    const contacts = [];
    for (let i = 0; i < NUM_CONTACTS; i++) {
      const contact = await Contact.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        subject: faker.helpers.arrayElement(contactSubjects),
        message: faker.lorem.paragraphs(2),
        status: faker.helpers.arrayElement(['New', 'In Progress', 'Resolved']),
        responded: faker.datatype.boolean(),
        response: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
      });
      contacts.push(contact);
    }
    console.log(`Created ${contacts.length} contact messages`);

    console.log('Database seeding completed successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
