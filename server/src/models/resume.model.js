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
    skills: [
      {
        descriptions: [{ type: String, trim: true }],
      },
    ],
    custom: [
      {
        descriptions: [{ type: String, trim: true }],
      },
    ],
    resumePdf: {
      type: fileSchema,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
resumeSchema.plugin(toJSON);
resumeSchema.plugin(paginate);

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
