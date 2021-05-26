require('dotenv').config();
var Genre = require('../models/genre')
var Subgenre = require('../models/subgenre')
var Course = require('../models/course')
var User = require('../models/user')
var Lecture = require('../models/lecture')
var Review = require('../models/review')
var Payment = require('../models/payment')
var Notification = require('../models/notification')
var rimraf = require("rimraf");
var fs = require('fs');//Handle files
var http = require('http');

var mongoose = require('mongoose');
var db = mongoose.connection;

const verifytokenGenerator = () => {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

const genresName = {
  'Development': ['Web Development', 'Data Science', 'Mobile Development', 'Programming Languages', 'Game Development', 'Database Design & Development', 'Software Testing', 'Software Engineering', 'Development Tools', 'No-Code Development'],
  'Business': ["Entrepreneurship", "Communications", "Management", "Sales", "Business Strategy", "Operations", "Project Management", "Business Law", "Business Analytics &amp; Intelligence", "Human Resources", "Industry", "E-Commerce", "Media", "Real Estate", "Other Business"],
  'Finance & Accounting': ["Accounting &amp; Bookkeeping", "Compliance", "Cryptocurrency &amp; Blockchain", "Economics", "Finance", "Finance Cert &amp; Exam Prep", "Financial Modeling &amp; Analysis", "Investing &amp; Trading", "Money Management Tools", "Taxes", "Other Finance &amp; Accounting"],
  'IT & Software': ["IT Certification", "Network &amp; Security", "Hardware", "Operating Systems", "Other IT &amp; Software"],
  'Office Productivity': ["Microsoft", "Apple", "Google", "SAP", "Oracle", "Other Office Productivity"],
  'Personal Development': ["Personal Transformation", "Personal Productivity", "Leadership", "Career Development", "Parenting &amp; Relationships", "Happiness", "Esoteric Practices", "Religion &amp; Spirituality", "Personal Brand Building", "Creativity", "Influence", "Self Esteem &amp; Confidence", "Stress Management", "Memory &amp; Study Skills", "Motivation", "Other Personal Development"],
  'Design': ["Web Design", "Graphic Design &amp; Illustration", "Design Tools", "User Experience Design", "Game Design", "Design Thinking", "3D &amp; Animation", "Fashion Design", "Architectural Design", "Interior Design", "Other Design"],
  'Marketing': ["Digital Marketing", "Search Engine Optimization", "Social Media Marketing", "Branding", "Marketing Fundamentals", "Marketing Analytics &amp; Automation", "Public Relations", "Advertising", "Video &amp; Mobile Marketing", "Content Marketing", "Growth Hacking", "Affiliate Marketing", "Product Marketing", "Other Marketing"],
  'Lifestyle': ["Arts &amp; Crafts", "Beauty &amp; Makeup", "Esoteric Practices", "Food &amp; Beverage", "Gaming", "Home Improvement", "Pet Care &amp; Training", "Travel", "Other Lifestyle"],
  'Photography & Video': ["Digital Photography", "Photography", "Portrait Photography", "Photography Tools", "Commercial Photography", "Video Design", "Other Photography &amp; Video"],
  'Health & Fitness': ["Instruments", "Music Production", "Music Fundamentals", "Vocal", "Music Techniques", "Music Software", "Other Music"],
  'Music': ["Instruments", "Music Production", "Music Fundamentals", "Vocal", "Music Techniques", "Music Software", "Other Music"],
  'Teaching & Academics': ["Engineering", "Humanities", "Math", "Science", "Online Education", "Social Science", "Language", "Teacher Training", "Test Prep", "Other Teaching &amp; Academics"],
};

const usernames = [
  'Alista', 'Atrox', 'Amumu', 'Akali', 'Bard', 'Nunu', 'Katarian', 'Yasuo', 'Twitch', 'Sivir',
  'Midleas', 'Yansioqsad', 'Sejuanie', 'Anie Tiber', 'Ahiri', 'Vayne', 'Jinx', 'Ashe', 'Jhin',
  'What men', 'Json snow', 'Son Go Ku', 'Kakalot', 'Conan', 'Haibarra', 'Cusiu', 'Darius', 'Faker',
  'Garne an hanhd', 'Kennen', 'Jayce Juie', 'Xmithy Jungle', 'Ambition', 'How do you do'
]

const coursesNames = [
  'Learn and Understand AngularJS',
  'JavaScript: Understanding the Weird Parts',
  'Build Responsive Real World Websites with HTML5 and CSS3',
  'Modern React with Redux',
  'Learn and Understand NodeJS',
  'Advanced React and Redux',
  'ES6 Javascript: The Complete Developer\'s Guide',
  'Understanding TypeScript',
  'AngularJS JumpStart with Dan Wahlin',
  'The Complete ASP.NET MVC 5 Course',
  'Angular 2 with TypeScript for Beginners: The Pragmatic Guide',
  'Meteor and React for Realtime Apps',
  'The Web Developer Bootcamp',
  'The Professional Ruby on Rails Developer',
  'Build Websites from Scratch with HTML & CSS',
  'Ultimate Web Designer & Developer Course: Build 23 Projects!',
  'The Complete React Web App Developer Course',
  'The Complete Web Developer Course 2.0',
  'Angular 2 - The Complete Guide',
  'Accelerated JavaScript Training',
  'PHP for Beginners -Become a PHP Master - Project Included',
  'The Complete Ruby on Rails Developer Course',
  'Angular 2 and NodeJS - The Practical Guide to MEAN Stack 2.0',
  'Learn Bootstrap Development By Building 10 Projects'
]

const lectureNames = [
  'Course Intro',
  'Project Intro',
  'Installing Nodejs',
  'Your First Application',
  'Creating a Real Web Server',
  'Adding Pages',
]

const reviewContent = [
  'Best explanation of if / else I found on the web. Awesome so far!',
  'Filled in the basics that I needed to understand to have a solid foundation for learning advanced topics.',
  'Great course! Very thorough and detailed explanations',
  'clear and consise delivery',
  'So far so god',
  'A very sound foundation, combined with a detailed application of JavaScript. This course will certainly have you programming in JavaScript with confidence.  This is a',
  'Awesome course till now. The explanation was great!!',
  'JS refresher going well, looking forward to the challenges',
  'So far the course and the authors presentation was good',
  'Excellent teacher who made difficult concepts easy to learn and understand. Highly recommend taking this course if you want to learn JavaScript!',
  'Is really easy to understand and mobile. Thanks for the udemy & instructor.',
  'So far he is very thorough and precise in how he is describing the plans to learn javascript.',
  'I\'m learning a lot of stuff, definitely worth the money. Thank you Jonas for this amazing course.',
  'The course has a very good structure and explanation. Although I have only the seen the initial stage, I am quite sure it exceeds my expectation. Thanks',
  'Intro was good, clear and precise !',
  'Ce cours est très clair et bien expliqué. Hâte de coder en Javascript après toutes ces indications.',
  'great course. complex and advanced theory explained in a way which makes it easy for me to understand. plus good examples of the theory. i think understanding all these advanced concepts will make it a lot easier to code.'
]

const imageUrls = [
  'https://img-a.udemycdn.com/course/240x135/756914_8bd3_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/922484_52a1_5.jpg',
  'https://img-a.udemycdn.com/course/240x135/627730_83d0_10.jpg',
  'https://img-a.udemycdn.com/course/240x135/412738_4543.jpg',
  'https://img-a.udemycdn.com/course/240x135/408430_1b9a_5.jpg',
  'https://img-a.udemycdn.com/course/240x135/655208_5bdf.jpg',
  'https://img-a.udemycdn.com/course/240x135/914296_3670.jpg',
  'https://img-a.udemycdn.com/course/240x135/951618_0839_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/540090_c68f_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/520116_edf5.jpg',
  'https://img-a.udemycdn.com/course/240x135/888716_4225_3.jpg',
  'https://img-a.udemycdn.com/course/240x135/484114_6ad5_3.jpg',
  'https://img-a.udemycdn.com/course/240x135/637930_9a22_15.jpg',
  'https://img-a.udemycdn.com/course/240x135/673654_d677_7.jpg',
  'https://img-a.udemycdn.com/course/240x135/822660_1527_3.jpg',
  'https://img-a.udemycdn.com/course/240x135/714724_b3b4_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/581854_4c7e_3.jpg',
  'https://img-a.udemycdn.com/course/240x135/959700_8bd2_9.jpg',
  'https://img-a.udemycdn.com/course/240x135/764164_de03_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/892102_963b.jpg',
  'https://img-a.udemycdn.com/course/240x135/895786_7b4b_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/625204_436a_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/707876_9e82_4.jpg',
  'https://img-a.udemycdn.com/course/240x135/969242_3548_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/817466_c0e0.jpg',
  'https://img-a.udemycdn.com/course/240x135/966658_b0ee_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/957194_444a.jpg',
  'https://img-a.udemycdn.com/course/240x135/809522_82dc_2.jpg',
  'https://img-a.udemycdn.com/course/240x135/754112_7441_2.jpg'
]
const avatarUrls = [
  'https://img-a.udemycdn.com/user/200_H/14214490_3956_2.jpg',
  'https://img-a.udemycdn.com/user/200_H/17082766_0590_5.jpg',
  'https://img-a.udemycdn.com/user/200_H/4387876_78bc.jpg',
  'https://img-a.udemycdn.com/user/200_H/4466306_6fd8_2.jpg',
  'https://img-a.udemycdn.com/user/200_H/4355282_676b.jpg',
  'https://img-a.udemycdn.com/user/200_H/16903220_be08_2.jpg',
  'https://img-a.udemycdn.com/user/200_H/14703256_c1bf_4.jpg',
  'https://img-a.udemycdn.com/user/200_H/8180238_7afd_4.jpg',
  'https://img-a.udemycdn.com/user/200_H/5487312_0554.jpg',
  'https://img-a.udemycdn.com/user/200_H/14942868_3ed6_4.jpg',
  'https://img-a.udemycdn.com/user/200_H/1681918_d7a1_6.jpg',
  'https://img-a.udemycdn.com/user/200_H/797726_5aff_3.jpg',
  'https://img-a.udemycdn.com/user/200_H/18187_dbc6_6.jpg',
  'https://img-a.udemycdn.com/user/200_H/10663828_2f0b.jpg',
  'https://img-a.udemycdn.com/user/200_H/15601054_5545_14.jpg',
  'https://img-a.udemycdn.com/user/200_H/402489_0bc6_4.jpg',
  'https://img-a.udemycdn.com/user/200_H/7231684_bc0d_3.jpg',
  'https://img-a.udemycdn.com/user/200_H/19352882_1818.jpg',
  'https://img-a.udemycdn.com/user/200_H/635204_baf4.jpg',
  'https://img-a.udemycdn.com/user/200_H/18279718_4883_2.jpg',
  'https://img-a.udemycdn.com/user/200_H/5141498_91b8_3.jpg',
  'https://img-a.udemycdn.com/user/200_H/11098324_91cb.jpg'
]

const clearFile = async () => {
  return new Promise((resolve) => {
    rimraf('public/uploads/avatars', () => { fs.mkdirSync('public/uploads/avatars') })
    rimraf('public/uploads/courses-photo', () => { fs.mkdirSync('public/uploads/courses-photo') })
    rimraf('public/uploads/courses-video', () => { fs.mkdirSync('public/uploads/courses-video') })
    rimraf('uploads/courses-video', () => { fs.mkdirSync('uploads/courses-video') })

    setTimeout(resolve, 5000);
  })
}

const clearDatabase = async () => {
  await User.deleteMany({});
  await Course.deleteMany({});
  await Genre.deleteMany({});
  await Subgenre.deleteMany({});
  await Review.deleteMany({});
  await Lecture.deleteMany({});
  await Notification.deleteMany({});
  await Payment.deleteMany({});
}

const createGenres = async () => {
  for (const genreName in genresName) {
    const subGenresName = genresName[genreName];
    const genre = new Genre({ name: genreName, subgenres: [] })
    await genre.save()
    for (const subGenreName of subGenresName) {
      const subGenre = new Subgenre({ name: subGenreName, genre: genre._id });
      await subGenre.save();
      await genre.updateOne({ $push: { subgenres: subGenre._id } })
    }
  }
}

const createUser = async () => {
  for (let i = 0; i < usernames.length; i++) {
    let user = new User({
      username: usernames[i],
      email: 'trinhthevi' + (i + 28).toString() + '@gmail.com',
      verified: true,
      verifytoken: verifytokenGenerator(),
      biography: "<p><strong>Photographer, Adventurer &amp; Conservationist.</strong></p><p>Born in 1983, Chris grew up sailing around the world and then leading world-first cart-hauling expeditions across the arctic before becoming an award-winning Australian Geographic photographer, Lowepro ambassador and Canon&rsquo;s Australian ambassador for five years.&nbsp;<br /><br /><em>Chris&rsquo;s work has appeared in National Geographic (along with Australian and Canadian Geographic) as well as TIME Magazine and Discovery Channel. He&rsquo;s written a successful book &#39;The 1000 Hour Day&#39; (now a multi award-winning documentary &#39;The Crossing&#39;), sits on the advisory committee for&nbsp;The Australian Geographic Society, is a International Fellow of the&nbsp;Explorers Club&nbsp;and is also founder and CEO of&nbsp;Conservation United, crowd-funding the world&rsquo;s critical conservation projects.&nbsp;<br /><br />Besides running 1-day photography courses and photo tours around the world, Chris and his wife Jess recently became the first people to sail a junk-rig sailboat through the Northwest Passage over the arctic.</em></p><p>&nbsp;</p>",
      linkedin: "in/thế-vĩ-trịnh-237574bb",
      twitter: "trinhthevils",
      website: "http://caubechankiu.com",
      youtube: "user/trinhthevils",
      password: "$2b$12$raBE9DMTroDe1hC0HMCpnO7cZE48ATUfhQ5cXUBTpyOl1iCVJgtHi",
      creditbalance: Math.floor(Math.random() * 1000),
    })
    await user.save()
  }
}

const createCourse = async () => {
  const users = await User.find();
  for (let user of users) {
    for (let j = 0; j < 100; j++) {
      let course = new Course({
        name: coursesNames[Math.floor(Math.random() * coursesNames.length)],
        lecturer: user._id,
        star: Math.random() * 5,
        numberofstudent: Math.floor(Math.random() * 1000),
        numberofreviews: Math.floor(Math.random() * 1000),
        revenue: Math.floor(Math.random() * 1000),
        cost: Math.floor(Math.random() * 200),
        level: Math.floor(Math.random() * 4),
        public: true,
        willableto: [
          "Launch their own Node applications, switch careers, or freelance as Node developers",
          "Create Node apps that support user accounts and authentication",
          "Use awesome third-party Node modules like MongoDB, Mongoose, SocketIO, and Express",
          "Create real-time web applications"
        ],
        targetstudent: [
          "Anyone looking to launch their own Node applications, switch careers, or freelance as a Node developer"
        ],
        needtoknow: [
          "A computer on which you can install software (Windows, MacOS, or Linux) is required",
          "A basic understanding of vanilla JavaScript (variables, if statements, basic functions, basic objects)"
        ],
        description: "<p>Are you looking to create real-world Node applications? Maybe you want to switch careers or launch a side-project to generate some extra income. Either way, you&#39;re in the right place.</p><p>I&#39;ve designed this course around a single goal:&nbsp;<strong>Turning you into a professional Node developer capable of developing, testing, and deploying real-world production applications.</strong></p><p>There&#39;s no better time to dive in.&nbsp;According to the 2016 Stack Overflow Survey, Node is in the top ten for back-end popularity and back-end salary, with an average salary of $85k. This means more jobs and more opportunities for you!</p><p><em>&quot;Andrew Mead is perhaps the best instructor in Udemy&#39;s portfolio. His explanations are clear, his pace is great, and he is super responsive to questions. I highly recommend his courses.&quot; Bert McLees</em></p>"
      })
      await course.save()
      await User.updateOne({ _id: user._id }, { $push: { "mycourses": course._id } })
    }
  }
}

const updateCourseGenre = async () => {
  const genres = await Genre.find({}).populate({ path: 'subgenres' });
  const courses = await Course.find();
  for (let course of courses) {
    let genre = genres[Math.floor(Math.random() * genres.length)]
    course.genre = genre._id
    course.subgenre = genre.subgenres[Math.floor(Math.random() * genre.subgenres.length)]
    await course.save()
  }
}

const createLecture = async () => {
  const courses = await Course.find({ lectures: { $size: 0 } })
  for (let course of courses) {
    for (let j = 0; j < lectureNames.length; j++) {
      let lecture = new Lecture({ name: lectureNames[j] })
      await lecture.save()
      await Course.updateOne({ _id: course._id }, { $push: { "lectures": lecture._id } })
    }
  }
}

const updateLecturePreview = async () => {
  const courses = await Course.find({}).populate({ path: 'lectures' })
  for (let course of courses) {
    for (let j = 0; j < 3; j++) {
      let lecture = course.lectures[j]
      lecture.preview = true
      await lecture.save();
    }
  }
}

const updateReviews = async () => {
  const users = await User.find({}).select({ _id: 1 })
  const courses = await Course.find({}).select({ _id: 1 })
  for (let course of courses) {
    for (let j = 0; j < 30; j++) {
      let review = new Review({
        user: users[Math.floor(Math.random() * users.length)],
        course: course._id,
        star: Math.floor(Math.random() * 5),
        content: reviewContent[Math.floor(Math.random() * reviewContent.length)]
      })
      await review.save()
    }
  }
}

const updateCourseVideo = async () => {
  const courses = await Course.find({});
  for (const course of courses) {
    fs.copyFileSync('extensioncode/video.mp4', 'public/uploads/courses-video/' + course._id)
    course.previewvideo = '/uploads/courses-video/' + course._id
    await course.save()
  }
}

const updateLectureVideo = async () => {
  const lectures = await Lecture.find({})
  for (const lecture of lectures) {
    fs.copyFileSync('extensioncode/video.mp4', 'uploads/courses-video/' + lecture._id)
    lecture.video = 'uploads/courses-video/' + lecture._id
    await lecture.save()
  }
}

const updateCoursePhoto = async () => {
  const courses = await Course.find({})
  for (let course of courses) {
    let fileToDownload = imageUrls[Math.floor(Math.random() * imageUrls.length)].replace('https', 'http');
    let file = fs.createWriteStream('public/uploads/courses-photo/' + course._id)
    http.get(fileToDownload, function (response) {
      response.pipe(file).on('finish', async () => {
        course.coverphoto = '/uploads/courses-photo/' + course._id
        await course.save()
      })
    })
  }
}

const updateUserPhoto = async () => {
  const users = await User.find({})
  for (let user of users) {
    let fileToDownload = avatarUrls[Math.floor(Math.random() * avatarUrls.length)].replace('https', 'http');
    let file = fs.createWriteStream('public/uploads/avatars/' + user._id)
    http.get(fileToDownload, function (response) {
      response.pipe(file).on('finish', async () => {
        user.photo = '/uploads/avatars/' + user._id
        await user.save()
      })
    })
  }
}

db.once('open', async () => {
  await clearFile()
  await clearDatabase()
  await createGenres()
  await createUser()
  await createCourse()
  await updateCourseGenre()
  await createLecture()
  await updateLecturePreview()
  await updateReviews()
  await updateCourseVideo()
  await updateLectureVideo()
  await updateCoursePhoto()
  await updateUserPhoto()
  console.log('Done')
})

mongoose.connect(process.env.MONGODB_URL);