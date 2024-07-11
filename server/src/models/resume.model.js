const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const fileSchema = new mongoose.Schema(
  {
    fileUrl: String,
    cloudinaryId: String,
  },
  { timestamps: true }
);

const resumeSchema = mongoose.Schema(
  {
    profile: {
      email: String,
      location: String,
      name: String,
      phone: String,
      summmary: String,
      url: String,
    },
    educations: [
      {
        school: { type: String },
        degree: { type: String },
        date: { type: String },
        gpa: { type: String },
        descriptions: [{ type: String, trim: true }],
      },
    ],
    workExperiences: [
      {
        company: { type: String },
        data: { type: String },
        jobTitle: { type: String },
        descriptions: [{ type: String, trim: true }],
      },
    ],
    projects: [
      {
        date: { type: String },
        descriptions: [{ type: String, trim: true }],
        project: [{ type: String }],
      },
    ],
    skills: {
      descriptions: [{ type: String, trim: true }],
      featuredSkill: [{ skill: String, rating: Number }],
    },
    custom: {
      descriptions: [{ type: String, trim: true }],
    },
    resumePdf: {
      type: fileSchema,
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({
  'profile.name': 'text',
  'profile.email': 'text',
  'profile.location': 'text',
  'profile.summmary': 'text',
  'educations.school': 'text',
  'educations.degree': 'text',
  'workExperiences.company': 'text',
  'workExperiences.jobTitle': 'text',
  'workExperiences.descriptions': 'text',
  'projects.descriptions': 'text',
  'skills.descriptions': 'text',
  'skills.featuredSkill.skill': 'text',
  'custom.descriptions': 'text'
});

// add plugin that converts mongoose to json
resumeSchema.plugin(toJSON);
resumeSchema.plugin(paginate);

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
