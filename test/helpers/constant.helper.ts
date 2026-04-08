export const constantHelper = {
  superAdmin: {
    user: 'admin',
    pass: 'qwerty',
  },

  invalidSuperAdmin: {
    user: 'no-admin',
    pass: '321',
  },

  invalidId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',

  invalidToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTYxMTZhNDRmZmEyY2FlM2ExZTU3MTQiLCJpYXQiOjE3Njc5NzA0NjksImV4cCI6MTc2Nzk3MDg4OX0.3o5qU_XZ0Ru9yxL3LdWNfMEYsh9IptN2mAJ-Mw_hwHU',

  users: [
    {
      login: 'usr-1-233',
      email: 'testing@mail.com',
      password: 'string1',
    },
    {
      login: 'usr-1-223',
      email: 'testing@rail.com',
      password: 'string2',
    },
    {
      login: 'usr-1-213',
      email: 'testing@cail.com',
      password: 'string3',
    },
    {
      login: 'usr-1-133',
      email: 'testing@sail.com',
      password: 'string4',
    },
  ],

  questionBad: [
    {
      body: 'string',
      correctAnswers: ['string'],
    },
  ],

  questions: [
    {
      body: 'stringStr1',
      correctAnswers: ['string1', 'stringOne'],
    },
    {
      body: 'stringStr2',
      correctAnswers: ['string2', 'stringTwo'],
    },
    {
      body: 'stringStr3',
      correctAnswers: ['string3', 'stringThree'],
    },
    {
      body: 'stringStr4',
      correctAnswers: ['string4', 'stringFour'],
    },
    {
      body: 'stringStr5',
      correctAnswers: ['string5', 'stringFive'],
    },
  ],
};
