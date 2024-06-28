const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const resumeSchema = mongoose.Schema(
  {
    personalInfo: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        },
      },
      phone: String,
      address: String,
      linkedIn: String,
      website: String,
    },
    education: [
      {
        school_name: { type: String, required: true },
        degree: { type: String, required: true },
        major: { type: String, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        GPA: { type: String },
        description: { type: String, trim: true },
      },
    ],
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String, trim: true },
      },
    ],
    projects: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [{ type: String }],
        startDate: { type: Date },
        endDate: { type: Date },
        url: { type: String, trim: true },
      },
    ],
    skills: [
      {
        name: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
resumeSchema.plugin(toJSON);
resumeSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
resumeSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/* 
resumeSchema.statics.getResumeById = async function (id) {
  const resume = await this.findById(id);
  if (!resume) {
    throw new Error('Resume not found');
  }
  return resume;
};

resumeSchema.statics.getResumeListbyPage = async function (page, limit) {
  const resumes = await this.find()
    .limit(limit)
    .skip(limit * page);
  return resumes;
};

resumeSchema.statics.getResumeall = async function () {
  const resumes = await this.find();
  return resumes;
};

resumeSchema.statics.uploadResume = async function (resumeData) {
  const resume = await this.create(resumeData);
  return resume;
};

resumeSchema.statics.deleteResumeById = async function (id) {
  const resume = await this.findByIdAndDelete(id);
  if (!resume) {
    throw new Error('Resume not found');
  }
  return resume;
};
*/

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
