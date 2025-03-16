import { Event, FAQ, Sponsor, TeamMember } from "./types";


export const events: Event[] = [
  {
    id: '1',
    title: 'Solo Singing',
    date: 'day 1',
    time: 'first half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741611087/mesmerizer/gallery_pic/gxewpsmbf6u0ewaqkjfg.jpg',
    location: 'New Seminar Hall',
    tagline: 'bela bose tumi pacho ki sunte',
    code: 'TALSUTRA',
    entryFees: '90',
    coordinators: [
      {
        name: 'Rudranil Das',
        contact: '6295721439'
      },
      {
        name: 'Surya Mandal',
        contact: '6289331982'
      }
    ],
    rules: [
      'Performance Duration: Each participant will have a maximum of 5 minutes on stage.',
      'Accompaniment: Participants may perform with either a guitar or an instrumental track.',
      'Theme: Open – showcase your creativity and unique style!',
      'Rule Changes: The Organizing Committee reserves the right to modify rules if necessary.',
      'Registration: Late registrations will not be accepted. Ensure timely entry.'
    ],
    teamSize: {
      min: 1,
      max: 1
    }
  },
  {
    id: '2',
    title: 'Face Painting',
    date: 'day 1',
    time: 'first half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741610358/mesmerizer/event_pic/kaqseb8lgrcgymfajbh8.jpg',
    location: 'Class Room',
    tagline: 'Aye chand sa raushan chehra',
    code: 'SHADE SHIFTERS',
    entryFees: '80',
    coordinators: [
      {
        name: 'Anusuya Pan',
        contact: '9002736700'
      },
      {
        name: 'Ridhima Das',
        contact: '9832462703'
      }
    ],
    rules: [
      'Eligibility: Participants must carry their college identity card with an official letterhead from their respective institution.',
      'Team Composition: Each team will consist of 2 members – one member will paint on the other’s face.',
      'Time Limit: Participants will have 90 minutes to complete their artwork.',
      'Theme: Fiction Comic',
      'Restrictions: Stickers, pre–drawn stencils, templates, or any makeup items are not allowed.',
      'Paint Type: Only non–toxic face paints are permitted.',
      'Materials: Participants must bring their own painting supplies, including paints, brushes, and other necessary items.'
    ],
    teamSize: {
      min: 2,
      max: 2
    }
  },
  {
    id: '3',
    title: 'Eastern Dance Solo',
    date: 'day 1',
    time: 'first half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741608271/mesmerizer/event_pic/feiijqiptidiuozz9e1u.jpg',
    location: 'Boys Common Room',
    tagline: 'chance pe dance marle',
    code: 'GRACE AND GRIN',
    entryFees: '90',
    coordinators: [
      {
        name: 'Sayan Majumder',
        contact: '6289484442'
      },
      {
        name: 'Soumili Halder',
        contact: '9733838247'
      }
    ],
    rules: [
      'Performance Duration: Each participant will have a maximum of 4 minutes + 30 Seconds on stage.',
      'Dance Forms: Any classical or creative dance form is allowed.',
      'Costume, Props & Makeup: Participants must arrange their own costumes, props, and makeup. Hazardous props, such as fire, are strictly prohibited.',
      'Music: Participants must bring their music track on a pendrive and keep a backup on a phone.',
      'Registration: Late registrations will not be accepted. Ensure timely submission of entries.',
      'Judging Criteria: Participants will be judged on the basis of their creativity, choreography and costumes.'
    ],
    teamSize: {
      min: 1,
      max: 1
    }
  },
  {
    id: '4',
    title: 'Beatboxing Battle',
    date: 'day 1',
    time: 'second half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741608229/mesmerizer/event_pic/aotgc0if6gaqam3htysf.jpg',
    location: 'Boys Common Room',
    tagline: 'Beat Pe Bawaal, Hasi Bemisaal!',
    code: 'DEXTER',
    entryFees: '90',
    coordinators: [
      {
        name: 'Aritra Ghosh',
        contact: '7439570995'
      },
      {
        name: 'Saptarshi Dutta',
        contact: '9083287666'
      },
      {
        name: 'Md Jahiruddin',
        contact: '6297989730'
      }
    ],
    rules: [
      'Participant Type: This is an individual competition.',
      'Soundtracks: No pre-recorded beatboxing on the soundtrack is allowed.',
      'Opponent Selection: Opponents will be chosen through a random draw.',
      'Judging: A panel of expert judges will determine the winner.',
      'Rule Changes: The Organizing Committee reserves the right to modify rules if necessary.',
      'Registration: Late registrations will not be accepted. Ensure timely entry.'
    ],
    teamSize: {
      min: 1,
      max: 1
    }
  },
  {
    id: '5',
    title: 'Debate',
    date: 'day 1',
    time: 'second half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741608223/mesmerizer/event_pic/hzb5kxwqchrcn3xgwtde.jpg',
    location: 'Language Lab',
    tagline: 'india wants to know',
    code: 'CLASH OF “GYANIS”',
    entryFees: '90',
    coordinators: [
      {
        name: 'Mrittika Majumder',
        contact: '9073719658'
      },
      {
        name: 'Ashutosh Roy',
        contact: '9693186464'
      },
      {
        name: 'Ritam Bhattacharya',
        contact: '9051305376'
      }
    ],
    rules: [
      'Maximum Team Members: 2 members per team from the same college.',
      'Mode of Communication: English.',
      'Topic Assignment: Topics will be assigned on the spot; judges will decide whether the team will argue for or against the topic.',
      'Suggested Topics: Relevant topics related to the genre will be provided the day before the debate.',
      'Time Allotment: 3 minutes for thinking or researching. 5-7 minutes for the pitch.',
      'Research Devices: Mobile phones are allowed only for research purposes. No other devices are permitted.',
      'Disqualification Criteria: Use of obligating language or any form of misbehavior will result in disqualification.',
      'No Interruption: No interruptions allowed while an individual is pitching.'
    ],
    teamSize: {
      min: 2,
      max: 2
    }
  },
  {
    id: '6',
    title: 'The Talent Show',
    date: 'day 1',
    time: 'second half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741608267/mesmerizer/event_pic/vonhcvgvrzhywhte7lma.jpg',
    location: 'New Seminar Hall',
    tagline: 'kya hai tere dil ke andar?',
    code: 'SPOTLIGHT HEIST',
    entryFees: '90',
    coordinators: [
      {
        name: 'Sohom Samaddar',
        contact: '8777606198'
      },
      {
        name: 'Sheikh Ikram Hossain',
        contact: '8100451304'
      },
      {
        name: 'Debarati Mondal',
        contact: '9432264128'
      }
    ],
    rules: [
      'Performance Type: We welcome all forms of individual talent.',
      'Time Limit: Participants will have 2 minutes to showcase their talent. For stand-up performances, the time limit is extended to 5 minutes. Exceeding the time limit may result in a deduction of marks.',
      'Performance Restrictions: Only solo performances are allowed for singing, and no group dancing is permitted.',
      'Judging Criteria: Uniqueness, Entertainment Value, Visual Appeal, Clarity, and Impact on the Audience.',
      'Languages Allowed: English, Hindi, and Bengali.',
      'Props: Participants are responsible for their own props, as no assistance will be provided by the hosts.',
      'Content Guidelines: Avoid vulgarity or harsh insinuations. Only light-hearted satire and humor are expected.'
    ],
    teamSize: {
      min: 1,
      max: 1
    }
  },
  {
    id: '7',
    title: 'Short Film',
    date: 'day 1',
    time: 'second half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741608225/mesmerizer/event_pic/ep95alcvvarrfbta8fkm.jpg',
    location: 'APC Hall',
    tagline: 'jab life ho out of control camera ko karke roll…',
    code: 'ABSOLUTE CINEMA',
    entryFees: '250',
    coordinators: [
      {
        name: 'Navonil Ganguly',
        contact: '9031357982'
      },
      {
        name: 'Subhodeep Kundu',
        contact: '7866885451'
      }
    ],
    rules: [
      'Duration: The film should be a minimum of 3 minutes and a maximum of 5 minutes, including title and credits.',
      'Cinematography: Both mobile and camera cinematography are allowed. Editing can be done using either a computer or mobile device.',
      'Final Output Resolution: 1080p HD in 16:9 landscape format.',
      'Output Format: MP4 format.',
      'Submission Requirements: Teams must submit the final film along with the unedited raw footage used for scrutiny.',
      'Prohibited Content: The film should not contain controversial topics, nudity, violence, racism, religious discrimination, or caste discrimination.',
      'Team Size: 5-7 members per team.',
      'Rule Changes: Rules are subject to change at the discretion of the Organizing Committee.'
    ],
    teamSize: {
      min: 2,
      max: 7
    }
  },
  {
    id: '8',
    title: 'Creative Group Dance',
    date: 'day 2',
    time: 'first half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741608225/mesmerizer/event_pic/zoyfdmousiyj4uoqjqst.jpg',
    location: 'Boys Common Room',
    tagline: 'Dance like nobody’s watching… but we all know we’re judging.',
    code: 'FUN FIASKO',
    entryFees: 'Registration Fee: 170, Extra Member: 25',
    coordinators: [
      {
        name: 'Megha Mondal',
        contact: '6290371533'
      },
      {
        name: 'Shibangi Banerjee',
        contact: '9123330680'
      }
    ],
    rules: [
      'Performance Duration: Each team will have a maximum of 6 minutes + 30seconds for their performance.',
      'Team Size: Each team can have up to 6 members.',
      'Dance Forms: Participants may perform in Classical, Western, folk or any other creative dance form.',
      'Costume, Props & Makeup: Teams are responsible for arranging their own costumes, props, and makeup. Use of hazardous props, such as fire, is strictly prohibited.',
      'Music: Teams must bring their music track on a pendrive and keep a backup on a phone.',
      'Theme: Fiction Comic',
      'Team Eligibility: Crossover teams are not allowed – all participants must be from the same college.',
      'Registration: Late registrations will not be accepted. Ensure timely submission of entries.'
    ],
    teamSize: {
      min: 1,
      max: 6
    }
  },
  {
    id: '9',
    title: 'Quiz',
    date: 'day 2',
    time: 'first half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741608273/mesmerizer/event_pic/zwmhou4c3mbfhfzdwshg.jpg',
    location: 'Language Lab',
    tagline: 'tu mere se zada janti hai kya',
    code: 'WIT WIZARDRY',
    entryFees: '80',
    coordinators: [
      {
        name: 'Sohom Basak',
        contact: '9382482742'
      },
      {
        name: 'Arpan Biswas',
        contact: '9007631646'
      }
    ],
    rules: [
      'Participation: Individual participation only.',
      'Round Division: Round 1: Guess What? \n Round 2: General Information \n Round 3: Rapid Fire – For Tie-breakers',
      'Quizmaster: The event will be conducted by an expert quizmaster.',
      'Rule Changes: Rules are subject to change at the discretion of the Organizing Committee.'
    ],
    teamSize: {
      min: 1,
      max: 1
    }
  },
  {
    id: '10',
    title: 'Street Dance Battle',
    date: 'day 2',
    time: 'second half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741610358/mesmerizer/event_pic/om7ckomgmxrtyqnvvxfe.jpg',
    location: 'Boys Common Room',
    tagline: 'Nachte na janle uthon beka',
    code: 'NATYA NINJAS',
    entryFees: '80',
    coordinators: [
      {
        name: 'Syamantak Roy',
        contact: '8927408876'
      },
      {
        name: 'Baishali Dhar',
        contact: '9433400028'
      }
    ],
    rules: [
      'Song Selection: Songs will be played on the spot by a judge or cultural coordinator.',
      'Opponent Selection: Opponents will be chosen through a random draw.',
      'Performance Duration: Each battle will last 1.5 to 2 minutes.',
      'Costume Requirement: Participants are not required to wear specific costumes.',
      'Rule Changes: The Organizing Committee reserves the right to modify rules if necessary.',
      'Registration: Late registrations will not be accepted. Ensure timely entry.'
    ],
    teamSize: {
      min: 1,
      max: 1
    }
  },
  {
    id: '11',
    title: 'Fashion Show',
    date: 'day 2',
    time: 'second half',
    image: 'https://res.cloudinary.com/dzuj9tj3y/image/upload/v1741610352/mesmerizer/event_pic/isgxizmwavktzeq1bx1q.jpg',
    location: 'Boys Common Room',
    tagline: 'kaun hai wo jo mujhe murke nehi dekha',
    code: 'VOGUE VORTEX',
    entryFees: '300',
    coordinators: [
      {
        name: 'Shramana Bhattacharya',
        contact: '8777580029'
      },
      {
        name: 'Swatick Nandy',
        contact: '9123647752'
      }
    ],
    rules: [
      'Team Composition: Each team can have a maximum of 9-10 participants. Only one team per college is allowed.',
      'Rounds: There will be only one round – no preliminaries.',
      'Performance Duration: Each team will have 12 minutes (10 + 2 minutes) on stage.',
      'Content Guidelines: Vulgarity is strictly prohibited. Any inappropriate content will lead to disqualification.',
      'Team Eligibility: Crossover teams are not allowed – all participants must be from the same college.',
      'Theme: Fiction Comic',
      'Dress & Makeup Room: A dedicated room will be provided for preparations.',
      'Rule Changes: The Organizing Committee reserves the right to modify rules if necessary.',
      'Registration: Late registrations will not be accepted. Ensure timely entry.'
    ],
    teamSize: {
      min: 1,
      max: 10
    }
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    role: 'Festival Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    social: {
      instagram: 'alexrivera',
      linkedin: 'alexrivera',
      twitter: 'alexrivera',
    },
  },
  // Add more team members...
];

export const sponsors: Sponsor[] = [
  {
    id: '1',
    name: 'TechCorp',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9',
    tier: 'platinum',
  },
  // Add more sponsors...
];

export const faqs: FAQ[] = [
  {
    question: 'How can I register for events?',
    answer: 'You can register through our online registration form available on each event\'s page.',
  },
  // Add more FAQs...
];