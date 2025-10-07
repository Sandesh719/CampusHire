// server/seeder.js
const dotenv = require('dotenv')
dotenv.config({path:"./config/config.env"})
const mongoose = require('mongoose');

const User = require("./models/UserModel");   // adjust path if needed
const Job = require('./models/JobModel');     // adjust path if needed
const Application = require('./models/AppModel'); // adjust path if needed

const MONGO_URI = process.env.DB; 

const placeholderImage = 'https://via.placeholder.com/512x512.png?text=avatar';
const placeholderLogo = 'https://via.placeholder.com/256x128.png?text=logo';
const placeholderResume = 'https://via.placeholder.com/800x1000.png?text=resume';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    // Wipe collections
    await Application.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared users, jobs, applications');

    // Create recruiters
    const recruiters = await User.create([
      {
        name: 'ACME Labs',
        email: 'acme.recruiter@example.com',
        password: 'hashed_placeholder', // you can replace later; not used for demo login
        role: 'recruiter',
        companyName: 'ACME Labs',
        companyDescription: 'Campus-focused creative agency',
        verifiedRecruiter: true,
        avatar: { public_id: null, url: placeholderLogo }
      },
      {
        name: 'Beta Corp',
        email: 'beta.recruiter@example.com',
        password: 'hashed_placeholder',
        role: 'recruiter',
        companyName: 'Beta Corp',
        companyDescription: 'Small enterprise hiring students',
        verifiedRecruiter: false,
        avatar: { public_id: null, url: placeholderLogo }
      }
    ]);
    console.log('Created recruiters:', recruiters.map(r => r.email).join(', '));

    // Create students
    const students = await User.create([
      {
        name: 'Aarav Kumar',
        email: 'aarav.student@example.com',
        password: 'hashed_placeholder',
        role: 'student',
        college: 'IIT Demo',
        year: 2,
        skills: ['javascript', 'react', 'css'],
        resume: { public_id: null, url: placeholderResume },
        avatar: { public_id: null, url: placeholderImage }
      },
      {
        name: 'Neha Sharma',
        email: 'neha.student@example.com',
        password: 'hashed_placeholder',
        role: 'student',
        college: 'NIT Example',
        year: 3,
        skills: ['python', 'data-science', 'ml'],
        resume: { public_id: null, url: placeholderResume },
        avatar: { public_id: null, url: placeholderImage }
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.student@example.com',
        password: 'hashed_placeholder',
        role: 'student',
        college: 'IIIT Example',
        year: 1,
        skills: ['c++', 'algorithms'],
        resume: { public_id: null, url: placeholderResume },
        avatar: { public_id: null, url: placeholderImage }
      },
      {
        name: 'Priya Patel',
        email: 'priya.student@example.com',
        password: 'hashed_placeholder',
        role: 'student',
        college: 'College of Demo',
        year: 4,
        skills: ['ui/ux', 'figma', 'design'],
        resume: { public_id: null, url: placeholderResume },
        avatar: { public_id: null, url: placeholderImage }
      }
    ]);
    console.log('Created students:', students.map(s => s.email).join(', '));

    // Create jobs/gigs
    const jobsToCreate = [
      {
        title: '3 Short Reels for College Fest',
        description: 'Create 3 short reels (15-30s) for our fest. Basic editing and captions required.',
        companyName: recruiters[0].companyName,
        companyLogo: { public_id: null, url: placeholderLogo },
        location: 'On-campus (ACME Labs)',
        skillsRequired: ['video-editing', 'content'],
        category: 'Marketing',
        employmentType: 'micro-gig',
        experience: 'No experience required',
        payType: 'fixed',
        payMin: 1500,
        payMax: 2000,
        durationWeeks: 1,
        hoursPerWeek: 6,
        remoteType: 'on-site',
        eligibility: { minYear: 1, maxYear: 4 },
        maxApplicants: 10,
        attachments: [],
        postedBy: recruiters[0]._id,
        isStudentGig: true,
        isApproved: true
      },
      {
        title: 'Front-end bug fixes (React)',
        description: 'Fix UI bugs and add small features to an existing student project.',
        companyName: recruiters[0].companyName,
        companyLogo: { public_id: null, url: placeholderLogo },
        location: 'Remote',
        skillsRequired: ['react', 'javascript', 'css'],
        category: 'Technology',
        employmentType: 'freelance',
        experience: 'Beginner',
        payType: 'hourly',
        payMin: 150,
        payMax: 300,
        durationWeeks: 2,
        hoursPerWeek: 8,
        remoteType: 'remote',
        eligibility: { minYear: 1, maxYear: 3 },
        maxApplicants: 5,
        attachments: [],
        postedBy: recruiters[0]._id,
        isStudentGig: true,
        isApproved: true
      },
      {
        title: 'Data cleaning assistant',
        description: 'Help clean and label a small dataset (CSV). Great for data beginners.',
        companyName: recruiters[1].companyName,
        companyLogo: { public_id: null, url: placeholderLogo },
        location: 'Remote',
        skillsRequired: ['python', 'pandas'],
        category: 'Data',
        employmentType: 'internship',
        experience: 'No experience',
        payType: 'stipend',
        payMin: 2000,
        payMax: 3000,
        durationWeeks: 4,
        hoursPerWeek: 10,
        remoteType: 'remote',
        eligibility: { minYear: 2, maxYear: 4 },
        maxApplicants: 20,
        attachments: [],
        postedBy: recruiters[1]._id,
        isStudentGig: true,
        isApproved: false // unverified recruiter -> not approved
      },
      {
        title: 'UI mockups for mobile app',
        description: 'Design 3 mobile screens and provide assets in Figma.',
        companyName: recruiters[0].companyName,
        companyLogo: { public_id: null, url: placeholderLogo },
        location: 'Remote / Hybrid',
        skillsRequired: ['figma', 'ui', 'design'],
        category: 'Design',
        employmentType: 'freelance',
        experience: 'Beginner',
        payType: 'fixed',
        payMin: 2500,
        payMax: 3500,
        durationWeeks: 2,
        hoursPerWeek: 6,
        remoteType: 'hybrid',
        eligibility: { minYear: 1, maxYear: 4 },
        maxApplicants: 8,
        attachments: [],
        postedBy: recruiters[0]._id,
        isStudentGig: true,
        isApproved: true
      },
      {
        title: 'Short research survey - data entry',
        description: 'Enter survey responses into Google Sheets.',
        companyName: recruiters[1].companyName,
        companyLogo: { public_id: null, url: placeholderLogo },
        location: 'Remote',
        skillsRequired: ['excel', 'data-entry'],
        category: 'Research',
        employmentType: 'micro-gig',
        experience: 'No experience',
        payType: 'fixed',
        payMin: 500,
        payMax: 800,
        durationWeeks: 1,
        hoursPerWeek: 4,
        remoteType: 'remote',
        eligibility: { minYear: 1, maxYear: 4 },
        maxApplicants: 50,
        attachments: [],
        postedBy: recruiters[1]._id,
        isStudentGig: true,
        isApproved: false
      },
      {
        title: 'Campus photography (event)',
        description: 'Photograph the college event and provide 20 edited photos.',
        companyName: recruiters[0].companyName,
        companyLogo: { public_id: null, url: placeholderLogo },
        location: 'On-site',
        skillsRequired: ['photography', 'lightroom'],
        category: 'Media',
        employmentType: 'part-time',
        experience: 'Some experience',
        payType: 'fixed',
        payMin: 3000,
        payMax: 5000,
        durationWeeks: 0,
        hoursPerWeek: 8,
        remoteType: 'on-site',
        eligibility: { minYear: 2, maxYear: 4 },
        maxApplicants: 6,
        attachments: [],
        postedBy: recruiters[0]._id,
        isStudentGig: true,
        isApproved: true
      }
    ];

    const createdJobs = await Job.create(jobsToCreate);
    console.log(`Created ${createdJobs.length} jobs`);

    // Create some applications: let some students apply to some approved gigs
    // ---------- replace the application creation block with this ----------
const app1 = await Application.create({
  job: createdJobs[0]._id,
  applicant: students[0]._id,
  // ensure applicantResume.public_id is non-null (seed id fallback)
  applicantResume: {
    public_id: students[0].resume && students[0].resume.public_id
      ? students[0].resume.public_id
      : `seed_resume_${students[0]._id}`,
    url: (students[0].resume && students[0].resume.url) ? students[0].resume.url : placeholderResume
  },
  coverLetter: 'I can make 3 reels in 3 days. I have experience editing on Premiere.',
  availability: { from: new Date(), to: new Date(Date.now() + 7 * 24 * 3600 * 1000) },
  expectedEarnings: 1800,
  portfolioLink: 'https://github.com/aarav',
  workSamples: [],
  status: 'pending'
});

const app2 = await Application.create({
  job: createdJobs[1]._id,
  applicant: students[1]._id,
  applicantResume: {
    public_id: students[1].resume && students[1].resume.public_id
      ? students[1].resume.public_id
      : `seed_resume_${students[1]._id}`,
    url: (students[1].resume && students[1].resume.url) ? students[1].resume.url : placeholderResume
  },
  coverLetter: 'I have worked with React and can fix bugs quickly.',
  availability: { from: new Date(), to: new Date(Date.now() + 14 * 24 * 3600 * 1000) },
  expectedEarnings: 200,
  portfolioLink: 'https://github.com/neha',
  workSamples: [],
  status: 'pending'
});

// link application IDs in users and increment job counters
students[0].appliedJobs = students[0].appliedJobs || [];
students[0].appliedJobs.push(app1._id);
await students[0].save();

students[1].appliedJobs = students[1].appliedJobs || [];
students[1].appliedJobs.push(app2._id);
await students[1].save();

// increment applicationCount safely
await Job.findByIdAndUpdate(createdJobs[0]._id, { $inc: { applicationCount: 1 } });
await Job.findByIdAndUpdate(createdJobs[1]._id, { $inc: { applicationCount: 1 } });

    console.log('Created 2 demo applications and linked them');

    console.log('Seeding complete. Summary:');
    console.log('- Recruiters:', recruiters.map(r => ({ id: r._id, email: r.email })));
    console.log('- Students:', students.map(s => ({ id: s._id, email: s.email, year: s.year })));
    console.log('- Jobs:', createdJobs.map(j => ({ id: j._id, title: j.title, postedBy: j.postedBy })));

    await mongoose.disconnect();
    console.log('Disconnected from DB');
    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
