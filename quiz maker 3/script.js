// ==================== APP STATE ====================
const state = {
  currentUser: null,
  currentView: 'home',
  currentQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  quizTimer: null,
  timeRemaining: 0,
  soundEnabled: true
};

// ==================== SOUND EFFECTS ====================
const sounds = {
  correct: () => playTone(523.25, 0.15),
  incorrect: () => playTone(220, 0.3),
  levelUp: () => {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2), i * 150);
    });
  },
  click: () => playTone(440, 0.05)
};

function playTone(frequency, duration) {
  if (!state.soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// ==================== CATEGORIES ====================
const CATEGORIES = [
  { name: 'Web Development',   icon: '💻' },
  { name: 'Science',           icon: '🧪' },
  { name: 'Mathematics',       icon: '➗' },
  { name: 'History',           icon: '📜' },
  { name: 'Geography',         icon: '🌍' },
  { name: 'General Knowledge', icon: '🧠' },
  { name: 'Anime',             icon: '🎌' },
  { name: 'Movies',            icon: '🎬' },
  { name: 'TV Shows',          icon: '📺' },
  { name: 'Gaming',            icon: '🎮' },
  { name: 'Music',             icon: '🎵' },
  { name: 'Sports',            icon: '⚽' },
  { name: 'Food',              icon: '🍕' },
  { name: 'Flags',             icon: '🚩' },
  { name: 'Logos',             icon: '🏷️' },
  { name: 'Space',             icon: '🚀' },
  { name: 'Cars',              icon: '🚗' },
  { name: 'Entertainment',     icon: '🎉' }
];
const CATEGORY_NAMES = CATEGORIES.map(c => c.name);
const CATEGORY_ICONS = Object.fromEntries(CATEGORIES.map(c => [c.name, c.icon]));

// ==================== DATA ====================
const sampleQuizzes = [
  // Web Development - 8 quizzes
  { id: 1, title: 'HTML Basics', category: 'Web Development', difficulty: 'Easy', icon: '💻', questions: [
    { text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correct: 0 },
    { text: 'Which tag is used for creating a paragraph?', options: ['<p>', '<paragraph>', '<para>', '<text>'], correct: 0 },
    { text: 'What is the correct HTML element for inserting a line break?', options: ['<br>', '<break>', '<lb>', '<newline>'], correct: 0 },
    { text: 'Which attribute specifies an alternate text for an image?', options: ['alt', 'src', 'title', 'href'], correct: 0 },
    { text: 'What does the <head> element contain?', options: ['Page title, meta info, scripts', 'Visible page content', 'Footer information', 'Navigation links'], correct: 0 }
  ], badge: 'recommended', plays: 234, createdAt: '2026-07-10' },
  { id: 2, title: 'CSS Flexbox Challenge', category: 'Web Development', difficulty: 'Medium', icon: '🎨', questions: [
    { text: 'What property creates a flex container?', options: ['display: flex', 'flex: container', 'flexbox: true', 'display: flexbox'], correct: 0 },
    { text: 'Which property aligns items vertically?', options: ['align-items', 'vertical-align', 'justify-content', 'flex-direction'], correct: 0 },
    { text: 'What does justify-content control?', options: ['Horizontal alignment', 'Vertical alignment', 'Flex item size', 'Flex direction'], correct: 0 },
    { text: 'Which value makes flex items wrap to next line?', options: ['flex-wrap: wrap', 'flex-wrap: scroll', 'flex-wrap: hidden', 'flex-wrap: auto'], correct: 0 },
    { text: 'What is the default flex direction?', options: ['row', 'column', 'row-reverse', 'column-reverse'], correct: 0 }
  ], badge: 'new', plays: 156, createdAt: '2026-07-14' },
  { id: 3, title: 'JavaScript Fundamentals', category: 'Web Development', difficulty: 'Easy', icon: '⚡', questions: [
    { text: 'How do you declare a variable in JavaScript?', options: ['var, let, const', 'variable, def, int', 'dim, set', 'var, variable'], correct: 0 },
    { text: 'Which operator checks equality without type conversion?', options: ['===', '==', '!=', '=:'], correct: 0 },
    { text: 'What will console.log(typeof []) output?', options: ['object', 'array', 'undefined', 'null'], correct: 0 },
    { text: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0 },
    { text: 'What is the result of 2 + "2" in JavaScript?', options: ['22', '4', 'NaN', 'Error'], correct: 0 }
  ], badge: 'popular', plays: 445, createdAt: '2026-06-20' },
  { id: 4, title: 'DOM Manipulation', category: 'Web Development', difficulty: 'Hard', icon: '🌳', questions: [
    { text: 'Which method selects an element by ID?', options: ['getElementById()', 'querySelector()', 'getElement()', 'selectById()'], correct: 0 },
    { text: 'What does document.querySelectorAll() return?', options: ['NodeList', 'Array', 'Element', 'HTMLCollection'], correct: 0 },
    { text: 'How do you add a class to an element?', options: ['element.classList.add()', 'element.addClass()', 'element.class +=', 'element.add()'], correct: 0 },
    { text: 'Which event fires when an element loses focus?', options: ['blur', 'focus', 'change', 'leave'], correct: 0 },
    { text: 'What is the correct way to create a new element?', options: ['document.createElement()', 'document.newElement()', 'document.addElement()', 'document.makeElement()'], correct: 0 }
  ], badge: 'new', plays: 89, createdAt: '2026-07-15' },
  { id: 5, title: 'Responsive Design Mastery', category: 'Web Development', difficulty: 'Medium', icon: '📱', questions: [
    { text: 'What does @media query do?', options: ['Applies styles based on conditions', 'Creates media files', 'Adds responsive images', 'Changes page title'], correct: 0 },
    { text: 'Which unit is relative to viewport width?', options: ['vw', 'vh', 'em', 'rem'], correct: 0 },
    { text: 'What is mobile-first approach?', options: ['Design for mobile first, then larger screens', 'Only design for mobile', 'Start with desktop', 'Create mobile apps first'], correct: 0 },
    { text: 'Which CSS property prevents text wrapping?', options: ['white-space: nowrap', 'text-wrap: none', 'overflow: hidden', 'flex: nowrap'], correct: 0 },
    { text: 'What breakpoint is typically used for tablets?', options: ['768px', '320px', '1024px', '480px'], correct: 0 }
  ], badge: 'recommended', plays: 178, createdAt: '2026-07-08' },
  { id: 6, title: 'CSS Grid Layout', category: 'Web Development', difficulty: 'Medium', icon: '📐', questions: [
    { text: 'What creates a grid container?', options: ['display: grid', 'grid: container', 'display: grid-container', 'grid-layout: true'], correct: 0 },
    { text: 'How do you span an item across 3 columns?', options: ['grid-column: span 3', 'column-span: 3', 'grid-span: 3', 'span: 3 columns'], correct: 0 },
    { text: 'Which property sets the gap between grid items?', options: ['gap', 'grid-gap', 'both gap and grid-gap', 'spacing'], correct: 0 },
    { text: 'What does fr unit represent in grid?', options: ['Fraction of available space', 'Fixed pixels', 'Full row', 'Frame rate'], correct: 0 },
    { text: 'How do you center an item in grid?', options: ['place-items: center', 'center: true', 'align-center: both', 'justify-center: both'], correct: 0 }
  ], badge: 'new', plays: 67, createdAt: '2026-07-16' },
  { id: 7, title: 'Git & Version Control', category: 'Web Development', difficulty: 'Easy', icon: '🔀', questions: [
    { text: 'What command initializes a Git repository?', options: ['git init', 'git start', 'git new', 'git create'], correct: 0 },
    { text: 'Which command stages changes for commit?', options: ['git add', 'git stage', 'git commit', 'git push'], correct: 0 },
    { text: 'What does git status show?', options: ['State of working directory', 'Commit history', 'Remote branches', 'File contents'], correct: 0 },
    { text: 'How do you create a new branch?', options: ['git branch <name>', 'git new branch', 'git create branch', 'git add branch'], correct: 0 },
    { text: 'What command merges branches?', options: ['git merge', 'git combine', 'git join', 'git branch merge'], correct: 0 }
  ], badge: 'recommended', plays: 201, createdAt: '2026-07-05' },
  { id: 8, title: 'React.js Essentials', category: 'Web Development', difficulty: 'Hard', icon: '⚛️', questions: [
    { text: 'What hook manages component state?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correct: 0 },
    { text: 'What is JSX?', options: ['JavaScript XML syntax', 'JavaScript Extension', 'JSON XML', 'Java Syntax'], correct: 0 },
    { text: 'How do you pass data to child components?', options: ['props', 'state', 'context', 'variables'], correct: 0 },
    { text: 'What does useEffect do?', options: ['Handles side effects', 'Creates state', 'Renders components', 'Manages routing'], correct: 0 },
    { text: 'What is the virtual DOM?', options: ['In-memory representation of DOM', 'Actual browser DOM', 'HTML file', 'CSS selector'], correct: 0 }
  ], badge: 'popular', plays: 312, createdAt: '2026-06-28' },

  // Science - 8 quizzes
  { id: 9, title: 'Human Body Systems', category: 'Science', difficulty: 'Medium', icon: '🫀', questions: [
    { text: 'What is the largest organ in the human body?', options: ['Skin', 'Liver', 'Brain', 'Heart'], correct: 0 },
    { text: 'How many bones are in the adult human body?', options: ['206', '200', '180', '256'], correct: 0 },
    { text: 'What type of blood vessel carries blood away from the heart?', options: ['Arteries', 'Veins', 'Capillaries', 'Lymphatics'], correct: 0 },
    { text: 'Which organ produces insulin?', options: ['Pancreas', 'Liver', 'Kidney', 'Stomach'], correct: 0 },
    { text: 'What is the main function of red blood cells?', options: ['Carry oxygen', 'Fight infection', 'Blood clotting', 'Produce antibodies'], correct: 0 }
  ], badge: 'popular', plays: 367, createdAt: '2026-06-25' },
  { id: 10, title: 'Physics Fundamentals', category: 'Science', difficulty: 'Easy', icon: '⚛️', questions: [
    { text: 'What is the SI unit of force?', options: ['Newton', 'Joule', 'Watt', 'Pascal'], correct: 0 },
    { text: 'What is the speed of light approximately?', options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10⁴ m/s', '3×10¹⁰ m/s'], correct: 0 },
    { text: 'What is acceleration measured in?', options: ['m/s²', 'm/s', 'm·s²', 'm²/s'], correct: 0 },
    { text: 'Which law states F = ma?', options: ['Newton\'s Second Law', 'Newton\'s First Law', 'Law of Conservation', 'Hooke\'s Law'], correct: 0 },
    { text: 'What type of energy does a moving object have?', options: ['Kinetic', 'Potential', 'Thermal', 'Nuclear'], correct: 0 }
  ], badge: 'recommended', plays: 289, createdAt: '2026-07-01' },
  { id: 11, title: 'Chemistry Basics', category: 'Science', difficulty: 'Easy', icon: '🧪', questions: [
    { text: 'What is the chemical symbol for gold?', options: ['Au', 'Ag', 'Go', 'Gd'], correct: 0 },
    { text: 'How many elements are in H₂O?', options: ['2', '3', '1', '4'], correct: 0 },
    { text: 'What is the pH of pure water?', options: ['7', '0', '14', '1'], correct: 0 },
    { text: 'What type of bond involves sharing electrons?', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correct: 0 },
    { text: 'What is Avogadro\'s number approximately?', options: ['6.02×10²³', '3.14×10²³', '9.8×10²³', '1×10²³'], correct: 0 }
  ], badge: 'popular', plays: 423, createdAt: '2026-06-18' },
  { id: 12, title: 'Space Exploration', category: 'Science', difficulty: 'Medium', icon: '🚀', questions: [
    { text: 'Who was the first human in space?', options: ['Yuri Gagarin', 'Neil Armstrong', 'John Glenn', 'Buzz Aldrin'], correct: 0 },
    { text: 'What planet is known as the Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Mercury'], correct: 0 },
    { text: 'How long does it take light from the Sun to reach Earth?', options: ['8 minutes', '8 seconds', '8 hours', '1 day'], correct: 0 },
    { text: 'What is the largest moon in our solar system?', options: ['Ganymede', 'Titan', 'The Moon', 'Europa'], correct: 0 },
    { text: 'Which space agency launched the James Webb Telescope?', options: ['NASA', 'ISRO', 'ESA', 'JAXA'], correct: 0 }
  ], badge: 'new', plays: 198, createdAt: '2026-07-12' },
  { id: 13, title: 'Biology: Cell Structure', category: 'Science', difficulty: 'Medium', icon: '🔬', questions: [
    { text: 'What is the powerhouse of the cell?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi body'], correct: 0 },
    { text: 'Which organelle contains genetic material?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Lysosome'], correct: 0 },
    { text: 'What is the function of ribosomes?', options: ['Protein synthesis', 'Energy production', 'Cell division', 'Waste removal'], correct: 0 },
    { text: 'Which cell organelle is responsible for photosynthesis?', options: ['Chloroplast', 'Mitochondria', 'Vacuole', 'Nucleus'], correct: 0 },
    { text: 'What is the cell\'s outer boundary called?', options: ['Cell membrane', 'Cell wall', 'Cytoplasm', 'Nucleus'], correct: 0 }
  ], badge: 'recommended', plays: 234, createdAt: '2026-07-03' },
  { id: 14, title: 'Environmental Science', category: 'Science', difficulty: 'Easy', icon: '🌍', questions: [
    { text: 'What is the greenhouse effect?', options: ['Trapping of heat in atmosphere', 'Cooling of Earth', 'Ozone depletion', 'Acid rain formation'], correct: 0 },
    { text: 'Which gas is most responsible for global warming?', options: ['CO₂', 'O₂', 'N₂', 'He'], correct: 0 },
    { text: 'What is biodiversity?', options: ['Variety of life species', 'Number of humans', 'Plant diversity', 'Ocean life'], correct: 0 },
    { text: 'What is a renewable energy source?', options: ['Solar power', 'Coal', 'Natural gas', 'Oil'], correct: 0 },
    { text: 'What causes ocean acidification?', options: ['Absorption of CO₂', 'Plastic pollution', 'Oil spills', 'Overfishing'], correct: 0 }
  ], badge: 'new', plays: 145, createdAt: '2026-07-14' },
  { id: 15, title: 'Electricity & Magnetism', category: 'Science', difficulty: 'Hard', icon: '⚡', questions: [
    { text: 'What is the unit of electrical resistance?', options: ['Ohm', 'Volt', 'Ampere', 'Watt'], correct: 0 },
    { text: 'What creates a magnetic field?', options: ['Moving electric charges', 'Static electrons', 'Neutrons', 'Protons only'], correct: 0 },
    { text: 'What is Ohm\'s Law?', options: ['V = IR', 'P = IV', 'E = mc²', 'F = ma'], correct: 0 },
    { text: 'Which material is a good conductor?', options: ['Copper', 'Rubber', 'Glass', 'Plastic'], correct: 0 },
    { text: 'What does an inductor store?', options: ['Magnetic energy', 'Electrical energy', 'Heat', 'Light'], correct: 0 }
  ], badge: 'popular', plays: 187, createdAt: '2026-06-30' },
  { id: 16, title: 'Weather & Climate', category: 'Science', difficulty: 'Medium', icon: '🌦️', questions: [
    { text: 'What causes wind?', options: ['Air pressure differences', 'Earth rotation', 'Ocean currents', 'Solar radiation'], correct: 0 },
    { text: 'What is a cumulonimbus cloud?', options: ['Thunderstorm cloud', 'Fair weather cloud', 'Fog', 'Cirrus cloud'], correct: 0 },
    { text: 'What is the Coriolis effect?', options: ['Deflection of moving air due to Earth\'s rotation', 'Rising warm air', 'Falling cold air', 'Ocean current'], correct: 0 },
    { text: 'What does humidity measure?', options: ['Water vapor in air', 'Air temperature', 'Air pressure', 'Wind speed'], correct: 0 },
    { text: 'What is the difference between weather and climate?', options: ['Short-term vs long-term conditions', 'Temperature vs precipitation', 'Day vs night', 'Summer vs winter'], correct: 0 }
  ], badge: 'new', plays: 156, createdAt: '2026-07-15' },

  // Mathematics - 7 quizzes
  { id: 17, title: 'Algebra Essentials', category: 'Mathematics', difficulty: 'Easy', icon: '📐', questions: [
    { text: 'Solve: 2x + 5 = 15', options: ['x = 5', 'x = 10', 'x = 2.5', 'x = 7.5'], correct: 0 },
    { text: 'What is the slope of y = 3x + 2?', options: ['3', '2', '-3', '1'], correct: 0 },
    { text: 'Simplify: 3(2x + 4)', options: ['6x + 12', '6x + 4', '5x + 7', '2x + 12'], correct: 0 },
    { text: 'Factor: x² - 9', options: ['(x+3)(x-3)', '(x+9)(x-1)', '(x-3)²', '(x+3)²'], correct: 0 },
    { text: 'What is the quadratic formula?', options: ['x = (-b ± √(b²-4ac))/2a', 'x = b² - 4ac', 'x = -b/2a', 'x = c/b'], correct: 0 }
  ], badge: 'recommended', plays: 345, createdAt: '2026-06-22' },
  { id: 18, title: 'Geometry Challenge', category: 'Mathematics', difficulty: 'Medium', icon: '🔷', questions: [
    { text: 'What is the area of a circle with radius 5?', options: ['25π', '10π', '5π', '50π'], correct: 0 },
    { text: 'What is the sum of angles in a triangle?', options: ['180°', '360°', '90°', '270°'], correct: 0 },
    { text: 'What is the Pythagorean theorem?', options: ['a² + b² = c²', 'a + b = c', 'a × b = c', 'a³ + b³ = c³'], correct: 0 },
    { text: 'What is the volume of a cube with side 3?', options: ['27', '9', '18', '81'], correct: 0 },
    { text: 'How many sides does a hexagon have?', options: ['6', '5', '7', '8'], correct: 0 }
  ], badge: 'popular', plays: 289, createdAt: '2026-06-28' },
  { id: 19, title: 'Probability Basics', category: 'Mathematics', difficulty: 'Easy', icon: '🎲', questions: [
    { text: 'What is the probability of rolling a 3 on a fair die?', options: ['1/6', '1/3', '1/2', '1/4'], correct: 0 },
    { text: 'If you flip two coins, what is P(both heads)?', options: ['1/4', '1/2', '3/4', '1'], correct: 0 },
    { text: 'What is the probability of drawing a face card from 52 cards?', options: ['3/13', '1/13', '1/4', '1/3'], correct: 0 },
    { text: 'If P(A) = 0.3, what is P(not A)?', options: ['0.7', '0.3', '0', '0.6'], correct: 0 },
    { text: 'What is the expected value of rolling a fair die?', options: ['3.5', '3', '4', '3.5 not listed'], correct: 0 }
  ], badge: 'recommended', plays: 267, createdAt: '2026-07-02' },
  { id: 20, title: 'Number Systems', category: 'Mathematics', difficulty: 'Medium', icon: '🔢', questions: [
    { text: 'What is the binary representation of 13?', options: ['1101', '1011', '1110', '1001'], correct: 0 },
    { text: 'What is the square root of 144?', options: ['12', '14', '11', '13'], correct: 0 },
    { text: 'What is 2⁰?', options: ['1', '0', '2', 'infinity'], correct: 0 },
    { text: 'What is the GCD of 12 and 18?', options: ['6', '3', '4', '36'], correct: 0 },
    { text: 'Convert 0.75 to a fraction.', options: ['3/4', '1/2', '2/3', '4/5'], correct: 0 }
  ], badge: 'new', plays: 134, createdAt: '2026-07-13' },
  { id: 21, title: 'Statistics Fundamentals', category: 'Mathematics', difficulty: 'Easy', icon: '📊', questions: [
    { text: 'What is the mean of 2, 4, 6, 8, 10?', options: ['6', '5', '7', '8'], correct: 0 },
    { text: 'What is the median of 3, 1, 4, 2, 5?', options: ['3', '2.5', '3.5', '4'], correct: 0 },
    { text: 'What is the mode of 2, 3, 2, 5, 2, 7?', options: ['2', '3', '5', 'None'], correct: 0 },
    { text: 'What does standard deviation measure?', options: ['Spread of data', 'Center of data', 'Size of data', 'Shape of data'], correct: 0 },
    { text: 'If data is normally distributed, about what % falls within 1 SD?', options: ['68%', '95%', '99%', '50%'], correct: 0 }
  ], badge: 'popular', plays: 312, createdAt: '2026-06-26' },
  { id: 22, title: 'Calculus Intro', category: 'Mathematics', difficulty: 'Hard', icon: '∫', questions: [
    { text: 'What is the derivative of x²?', options: ['2x', 'x', '2', 'x²/2'], correct: 0 },
    { text: 'What is the integral of 2x?', options: ['x² + C', '2x² + C', 'x + C', '2 + C'], correct: 0 },
    { text: 'What is d/dx(sin x)?', options: ['cos x', '-cos x', 'sin x', '-sin x'], correct: 0 },
    { text: 'What is lim(x→0) of sin(x)/x?', options: ['1', '0', '∞', 'Does not exist'], correct: 0 },
    { text: 'What is the derivative of e^x?', options: ['e^x', 'xe^(x-1)', 'e^x - 1', 'ln(x)'], correct: 0 }
  ], badge: 'new', plays: 98, createdAt: '2026-07-16' },
  { id: 23, title: 'Mental Math Master', category: 'Mathematics', difficulty: 'Hard', icon: '🧠', questions: [
    { text: 'What is 47 × 11?', options: ['517', '5177', '427', '537'], correct: 0 },
    { text: 'What is 15% of 80?', options: ['12', '8', '10', '14'], correct: 0 },
    { text: 'What is √169?', options: ['13', '12', '14', '11'], correct: 0 },
    { text: 'What is 123 + 456 + 234?', options: ['813', '8130', '703', '81300'], correct: 0 },
    { text: 'What is 1000 - 357?', options: ['643', '743', '653', '633'], correct: 0 }
  ], badge: 'recommended', plays: 234, createdAt: '2026-07-07' },

  // History - 5 quizzes
  { id: 24, title: 'World War II', category: 'History', difficulty: 'Medium', icon: '🎖️', questions: [
    { text: 'When did World War II begin?', options: ['1939', '1940', '1938', '1941'], correct: 0 },
    { text: 'What event triggered US entry into WWII?', options: ['Pearl Harbor', 'D-Day', 'Battle of Britain', 'V-J Day'], correct: 0 },
    { text: 'Who was the leader of Nazi Germany?', options: ['Hitler', 'Mussolini', 'Stalin', 'Hirohito'], correct: 0 },
    { text: 'When did D-Day occur?', options: ['June 6, 1944', 'June 6, 1943', 'May 8, 1945', 'December 7, 1941'], correct: 0 },
    { text: 'What did V-J Day celebrate?', options: ['Victory over Japan', 'Victory over Germany', 'Victory in Europe', 'Victory over Italy'], correct: 0 }
  ], badge: 'popular', plays: 387, createdAt: '2026-06-20' },
  { id: 25, title: 'Ancient Civilizations', category: 'History', difficulty: 'Easy', icon: '🏛️', questions: [
    { text: 'What was the capital of the Roman Empire?', options: ['Rome', 'Athens', 'Cairo', 'Constantinople'], correct: 0 },
    { text: 'Which river was central to Ancient Egypt?', options: ['Nile', 'Tigris', 'Euphrates', 'Indus'], correct: 0 },
    { text: 'Who built the Great Pyramid of Giza?', options: ['Pharaoh Khufu', 'Caesar', 'Alexander', 'Nebuchadnezzar'], correct: 0 },
    { text: 'What was the writing system of ancient Sumerians?', options: ['Cuneiform', 'Hieroglyphics', 'Alphabet', 'Runes'], correct: 0 },
    { text: 'Which empire was ruled by Hammurabi?', options: ['Babylonian', 'Assyrian', 'Persian', 'Roman'], correct: 0 }
  ], badge: 'recommended', plays: 298, createdAt: '2026-07-01' },
  { id: 26, title: 'Indian History', category: 'History', difficulty: 'Medium', icon: '🇮🇳', questions: [
    { text: 'Who was the first Prime Minister of India?', options: ['Jawaharlal Nehru', 'Mahatma Gandhi', ' Sardar Patel', 'B.R. Ambedkar'], correct: 0 },
    { text: 'In what year did India gain independence?', options: ['1947', '1946', '1948', '1950'], correct: 0 },
    { text: 'Who built the Taj Mahal?', options: ['Shah Jahan', 'Akbar', 'Aurangzeb', 'Humayun'], correct: 0 },
    { text: 'What was the Mauryan Empire famous for?', options: ['Ashoka\'s reign', 'Taj Mahal', 'Buddhism spread', 'All of these'], correct: 0 },
    { text: 'Which battle is known as the First War of Independence?', options: ['1857 Rebellion', 'Battle of Plassey', 'Battle of Panipat', 'Kalinga War'], correct: 0 }
  ], badge: 'popular', plays: 456, createdAt: '2026-06-25' },
  { id: 27, title: 'Renaissance & Reformation', category: 'History', difficulty: 'Hard', icon: '🎨', questions: [
    { text: 'Where did the Renaissance begin?', options: ['Italy', 'France', 'England', 'Germany'], correct: 0 },
    { text: 'Who painted the Sistine Chapel ceiling?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Botticelli'], correct: 0 },
    { text: 'Who started the Protestant Reformation?', options: ['Martin Luther', 'John Calvin', 'Henry VIII', 'Zwingli'], correct: 0 },
    { text: 'What year did Columbus reach the Americas?', options: ['1492', '1488', '1500', '1498'], correct: 0 },
    { text: 'Who wrote "The Prince"?', options: ['Machiavelli', 'Dante', 'Petrarch', 'Boccaccio'], correct: 0 }
  ], badge: 'new', plays: 167, createdAt: '2026-07-11' },
  { id: 28, title: 'Cold War Era', category: 'History', difficulty: 'Medium', icon: '🕊️', questions: [
    { text: 'What was the Cold War?', options: ['US vs Soviet tension', 'WWII continuation', 'Trade war', 'Space competition only'], correct: 0 },
    { text: 'What wall divided Berlin?', options: ['Berlin Wall', 'Iron Curtain', 'Brandenburg Wall', 'Checkpoints'], correct: 0 },
    { text: 'When did the Berlin Wall fall?', options: ['1989', '1991', '1985', '1987'], correct: 0 },
    { text: 'What was the Marshall Plan?', options: ['US aid to Europe', 'Soviet plan', 'UN resolution', 'Trade agreement'], correct: 0 },
    { text: 'Which country launched Sputnik?', options: ['Soviet Union', 'USA', 'China', 'Germany'], correct: 0 }
  ], badge: 'recommended', plays: 234, createdAt: '2026-07-04' },

  // Geography - 5 quizzes
  { id: 29, title: 'World Capitals', category: 'Geography', difficulty: 'Easy', icon: '🌍', questions: [
    { text: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Rome'], correct: 0 },
    { text: 'What is the capital of Australia?', options: ['Canberra', 'Sydney', 'Melbourne', 'Brisbane'], correct: 0 },
    { text: 'What is the capital of Brazil?', options: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'], correct: 0 },
    { text: 'What is the capital of Japan?', options: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'], correct: 0 },
    { text: 'What is the capital of Canada?', options: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], correct: 0 }
  ], badge: 'popular', plays: 567, createdAt: '2026-06-15' },
  { id: 30, title: 'Oceans & Continents', category: 'Geography', difficulty: 'Easy', icon: '🌊', questions: [
    { text: 'What is the largest ocean?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correct: 0 },
    { text: 'How many continents are there?', options: ['7', '6', '5', '8'], correct: 0 },
    { text: 'What is the smallest country?', options: ['Vatican City', 'Monaco', 'San Marino', 'Liechtenstein'], correct: 0 },
    { text: 'What is the longest river?', options: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], correct: 0 },
    { text: 'Which continent is the Sahara Desert in?', options: ['Africa', 'Asia', 'Australia', 'South America'], correct: 0 }
  ], badge: 'recommended', plays: 345, createdAt: '2026-06-28' },
  { id: 31, title: 'Mountain Ranges', category: 'Geography', difficulty: 'Medium', icon: '🏔️', questions: [
    { text: 'What is the tallest mountain in the world?', options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse'], correct: 0 },
    { text: 'In which mountain range is Mount Everest?', options: ['Himalayas', 'Alps', 'Andes', 'Rockies'], correct: 0 },
    { text: 'What mountain range runs along the US west coast?', options: ['Rocky Mountains', 'Appalachian', 'Sierra Nevada', 'Cascade Range'], correct: 0 },
    { text: 'What is the highest peak in North America?', options: ['Denali', 'Mount Whitney', 'Mount Rainier', 'Mount Elbert'], correct: 0 },
    { text: 'Which mountains separate Europe and Asia?', options: ['Ural Mountains', 'Alps', 'Carpathians', 'Caucasus'], correct: 0 }
  ], badge: 'new', plays: 178, createdAt: '2026-07-12' },
  { id: 32, title: 'Countries & Flags', category: 'Geography', difficulty: 'Easy', icon: '🚩', questions: [
    { text: 'What color is not on the US flag?', options: ['Green', 'Red', 'White', 'Blue'], correct: 0 },
    { text: 'Which country has a maple leaf on its flag?', options: ['Canada', 'USA', 'UK', 'Australia'], correct: 0 },
    { text: 'What country has a dragon on its flag?', options: ['Bhutan', 'China', 'Japan', 'Mongolia'], correct: 0 },
    { text: 'Which African country has a star on its flag?', options: ['Ethiopia', 'Nigeria', 'Kenya', 'Egypt'], correct: 0 },
    { text: 'What symbol is on the flag of Switzerland?', options: ['Cross', 'Star', 'Moon', 'Eagle'], correct: 0 }
  ], badge: 'popular', plays: 423, createdAt: '2026-06-22' },
  { id: 33, title: 'Climate Zones', category: 'Geography', difficulty: 'Medium', icon: '🌡️', questions: [
    { text: 'Which zone has extreme temperature differences between seasons?', options: ['Temperate', 'Tropical', 'Polar', 'Arid'], correct: 0 },
    { text: 'What climate is characterized by high rainfall year-round?', options: ['Tropical rainforest', 'Desert', 'Mediterranean', 'Tundra'], correct: 0 },
    { text: 'Which biome has permafrost?', options: ['Tundra', 'Desert', 'Savanna', 'Rainforest'], correct: 0 },
    { text: 'What causes monsoon seasons?', options: ['Seasonal wind changes', 'Ocean currents', 'Mountain ranges', 'Deforestation'], correct: 0 },
    { text: 'Which region receives the least annual rainfall?', options: ['Desert', 'Tundra', 'Savanna', 'Taiga'], correct: 0 }
  ], badge: 'new', plays: 145, createdAt: '2026-07-14' },

  // General Knowledge - 7 quizzes
  { id: 34, title: 'Famous Inventions', category: 'General Knowledge', difficulty: 'Easy', icon: '💡', questions: [
    { text: 'Who invented the telephone?', options: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Guglielmo Marconi'], correct: 0 },
    { text: 'What did Johannes Gutenberg invent?', options: ['Printing press', 'Telescope', 'Compass', 'Clock'], correct: 0 },
    { text: 'Who discovered penicillin?', options: ['Alexander Fleming', 'Louis Pasteur', 'Marie Curie', 'Joseph Lister'], correct: 0 },
    { text: 'What did the Wright brothers invent?', options: ['Airplane', 'Automobile', 'Telegraph', 'Light bulb'], correct: 0 },
    { text: 'Who invented the World Wide Web?', options: ['Tim Berners-Lee', 'Bill Gates', 'Steve Jobs', 'Vint Cerf'], correct: 0 }
  ], badge: 'popular', plays: 398, createdAt: '2026-06-18' },
  { id: 35, title: 'World Wonders', category: 'General Knowledge', difficulty: 'Easy', icon: '🏆', questions: [
    { text: 'Where is the Taj Mahal located?', options: ['India', 'Pakistan', 'Bangladesh', 'Nepal'], correct: 0 },
    { text: 'How many Great Pyramids of Giza are there?', options: ['3', '2', '4', '5'], correct: 0 },
    { text: 'Where is Machu Picchu?', options: ['Peru', 'Mexico', 'Brazil', 'Chile'], correct: 0 },
    { text: 'What is the Colosseum?', options: ['Roman amphitheater', 'Greek temple', 'Egyptian pyramid', 'Chinese wall'], correct: 0 },
    { text: 'Where is Christ the Redeemer?', options: ['Rio de Janeiro', 'Buenos Aires', 'São Paulo', 'Brasília'], correct: 0 }
  ], badge: 'recommended', plays: 287, createdAt: '2026-07-02' },
  { id: 36, title: 'Olympic Games', category: 'General Knowledge', difficulty: 'Medium', icon: '🏅', questions: [
    { text: 'Where did the ancient Olympic Games begin?', options: ['Greece', 'Italy', 'Egypt', 'Turkey'], correct: 0 },
    { text: 'How often are the Summer Olympics held?', options: ['Every 4 years', 'Every 2 years', 'Every 3 years', 'Every 5 years'], correct: 0 },
    { text: 'What country hosted the 2020 Summer Olympics?', options: ['Japan', 'China', 'UK', 'Brazil'], correct: 0 },
    { text: 'What do the 5 Olympic rings represent?', options: ['5 continents', '5 sports', '5 countries', '5 values'], correct: 0 },
    { text: 'When were the first modern Olympics held?', options: ['1896', '1900', '1886', '1912'], correct: 0 }
  ], badge: 'new', plays: 234, createdAt: '2026-07-10' },
  { id: 37, title: 'Computer Fundamentals', category: 'General Knowledge', difficulty: 'Easy', icon: '💻', questions: [
    { text: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], correct: 0 },
    { text: 'How many bits are in a byte?', options: ['8', '4', '16', '32'], correct: 0 },
    { text: 'What does RAM stand for?', options: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Module', 'Random Allocation Memory'], correct: 0 },
    { text: 'Who founded Microsoft?', options: ['Bill Gates & Paul Allen', 'Steve Jobs', 'Mark Zuckerberg', 'Larry Page'], correct: 0 },
    { text: 'What year was the first iPhone released?', options: ['2007', '2005', '2008', '2010'], correct: 0 }
  ], badge: 'popular', plays: 456, createdAt: '2026-06-20' },
  { id: 38, title: 'World Currencies', category: 'General Knowledge', difficulty: 'Medium', icon: '💰', questions: [
    { text: 'What is the currency of Japan?', options: ['Yen', 'Yuan', 'Won', 'Ringgit'], correct: 0 },
    { text: 'What currency is used in most of Europe?', options: ['Euro', 'Pound', 'Franc', 'Mark'], correct: 0 },
    { text: 'What is the currency symbol for British Pound?', options: ['£', '€', '¥', '$'], correct: 0 },
    { text: 'Which country uses the Baht?', options: ['Thailand', 'Taiwan', 'Tajikistan', 'Tanzania'], correct: 0 },
    { text: 'What is the weakest currency listed?', options: ['Iranian Rial', 'Vietnamese Dong', 'Indonesian Rupiah', 'Lao Kip'], correct: 0 }
  ], badge: 'recommended', plays: 198, createdAt: '2026-07-05' },
  { id: 39, title: 'Food & Cuisine', category: 'General Knowledge', difficulty: 'Easy', icon: '🍕', questions: [
    { text: 'What country is pizza from?', options: ['Italy', 'Greece', 'France', 'Spain'], correct: 0 },
    { text: 'What is sushi traditionally made with?', options: ['Rice and fish', 'Noodles and meat', 'Bread and cheese', 'Vegetables only'], correct: 0 },
    { text: 'What spice comes from the crocus flower?', options: ['Saffron', 'Cinnamon', 'Pepper', 'Nutmeg'], correct: 0 },
    { text: 'What is the main ingredient in hummus?', options: ['Chickpeas', 'Lentils', 'Black beans', 'Kidney beans'], correct: 0 },
    { text: 'Which country invented croissants?', options: ['Austria', 'France', 'Italy', 'Germany'], correct: 0 }
  ], badge: 'popular', plays: 345, createdAt: '2026-06-25' },
  { id: 40, title: 'Music & Art', category: 'General Knowledge', difficulty: 'Medium', icon: '🎵', questions: [
    { text: 'How many keys are on a standard piano?', options: ['88', '76', '61', '92'], correct: 0 },
    { text: 'Who painted the Mona Lisa?', options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Botticelli'], correct: 0 },
    { text: 'What does "forte" mean in music?', options: ['Loud', 'Fast', 'Slow', 'Soft'], correct: 0 },
    { text: 'Who composed the 9th Symphony?', options: ['Beethoven', 'Mozart', 'Bach', 'Chopin'], correct: 0 },
    { text: 'What art movement is Salvador Dalí associated with?', options: ['Surrealism', 'Impressionism', 'Cubism', 'Baroque'], correct: 0 }
  ], badge: 'new', plays: 234, createdAt: '2026-07-13' },

  // ==================== ANIME ====================
  { id: 41, title: 'Naruto Universe', category: 'Anime', difficulty: 'Easy', icon: '🍥', questions: [
    { text: 'Who is Naruto\'s father?', options: ['Minato Namikaze', 'Jiraiya', 'Hiruzen', 'Kakashi'], correct: 0 },
    { text: 'What is the name of Naruto\'s signature jutsu?', options: ['Rasengan', 'Chidori', 'Amaterasu', 'Kamui'], correct: 0 },
    { text: 'Which tailed beast is sealed inside Naruto?', options: ['Nine-Tails (Kurama)', 'Eight-Tails', 'One-Tail', 'Ten-Tails'], correct: 0 },
    { text: 'Who is the leader of the Akatsuki (real leader)?', options: ['Obito', 'Pain', 'Itachi', 'Madara'], correct: 0 },
    { text: 'What village is Naruto from?', options: ['Konoha', 'Suna', 'Kiri', 'Iwa'], correct: 0 }
  ], badge: 'popular', plays: 512, createdAt: '2026-07-01' },
  { id: 42, title: 'One Piece Adventures', category: 'Anime', difficulty: 'Medium', icon: '🏴‍☠️', questions: [
    { text: 'What is Luffy\'s dream?', options: ['Become Pirate King', 'Find the All Blue', 'Become World\'s Greatest Swordsman', 'Cure all diseases'], correct: 0 },
    { text: 'What Devil Fruit did Luffy eat?', options: ['Gomu Gomu no Mi', 'Mera Mera no Mi', 'Ope Ope no Mi', 'Hito Hito no Mi'], correct: 0 },
    { text: 'Who is the swordsman of the Straw Hat crew?', options: ['Zoro', 'Sanji', 'Usopp', 'Franky'], correct: 0 },
    { text: 'What is the name of the Straw Hats\' ship (second)?', options: ['Thousand Sunny', 'Going Merry', 'Red Force', 'Moby Dick'], correct: 0 },
    { text: 'Who is known as "Red-Haired"?', options: ['Shanks', 'Buggy', 'Kaido', 'Big Mom'], correct: 0 }
  ], badge: 'popular', plays: 489, createdAt: '2026-07-02' },
  { id: 43, title: 'Demon Slayer', category: 'Anime', difficulty: 'Easy', icon: '⚔️', questions: [
    { text: 'What breathing style does Tanjiro use?', options: ['Water/Sun Breathing', 'Thunder', 'Insect', 'Flame'], correct: 0 },
    { text: 'Who is Tanjiro\'s sister?', options: ['Nezuko', 'Kanao', 'Shinobu', 'Mitsuri'], correct: 0 },
    { text: 'Who is the leader of the demons?', options: ['Muzan Kibutsuji', 'Akaza', 'Douma', 'Kokushibo'], correct: 0 },
    { text: 'What color is Zenitsu\'s hair?', options: ['Yellow', 'Blue', 'Pink', 'Black'], correct: 0 },
    { text: 'What animal head does Inosuke wear?', options: ['Boar', 'Wolf', 'Fox', 'Bear'], correct: 0 }
  ], badge: 'new', plays: 421, createdAt: '2026-07-10' },
  { id: 44, title: 'Attack on Titan', category: 'Anime', difficulty: 'Medium', icon: '🛡️', questions: [
    { text: 'Who is the main protagonist?', options: ['Eren Yeager', 'Levi', 'Armin', 'Reiner'], correct: 0 },
    { text: 'What are the giant humanoids called?', options: ['Titans', 'Giants', 'Ogres', 'Colossi'], correct: 0 },
    { text: 'Which Titan does Eren inherit first?', options: ['Attack Titan', 'Founding Titan', 'Colossal Titan', 'Armored Titan'], correct: 0 },
    { text: 'What is humanity\'s military elite called?', options: ['Survey Corps', 'Garrison', 'Military Police', 'Warriors'], correct: 0 },
    { text: 'Who is captain of the Special Operations Squad?', options: ['Levi', 'Erwin', 'Hange', 'Mikasa'], correct: 0 }
  ], badge: 'popular', plays: 467, createdAt: '2026-06-30' },
  { id: 45, title: 'Jujutsu Kaisen', category: 'Anime', difficulty: 'Medium', icon: '👊', questions: [
    { text: 'Who is Yuji\'s cursed inhabitant?', options: ['Sukuna', 'Mahito', 'Jogo', 'Geto'], correct: 0 },
    { text: 'What technique does Gojo use?', options: ['Limitless', 'Ten Shadows', 'Cursed Speech', 'Boogie Woogie'], correct: 0 },
    { text: 'How many fingers does Sukuna have in total?', options: ['20', '10', '15', '9'], correct: 0 },
    { text: 'Who is Megumi\'s teacher?', options: ['Gojo Satoru', 'Nanami', 'Yaga', 'Utahime'], correct: 0 },
    { text: 'What is Gojo\'s domain expansion?', options: ['Unlimited Void', 'Malevolent Shrine', 'Chimera Shadow Garden', 'Idle Death Gamble'], correct: 0 }
  ], badge: 'new', plays: 398, createdAt: '2026-07-12' },
  { id: 46, title: 'Dragon Ball Legends', category: 'Anime', difficulty: 'Easy', icon: '🐉', questions: [
    { text: 'What race is Goku?', options: ['Saiyan', 'Namekian', 'Human', 'Frieza Race'], correct: 0 },
    { text: 'How many Dragon Balls are there?', options: ['7', '5', '9', '4'], correct: 0 },
    { text: 'Who is Goku\'s rival?', options: ['Vegeta', 'Piccolo', 'Krillin', 'Yamcha'], correct: 0 },
    { text: 'What is Goku\'s signature attack?', options: ['Kamehameha', 'Final Flash', 'Galick Gun', 'Special Beam Cannon'], correct: 0 },
    { text: 'Who trained Goku as a child?', options: ['Master Roshi', 'King Kai', 'Whis', 'Beerus'], correct: 0 }
  ], badge: 'popular', plays: 543, createdAt: '2026-06-25' },

  // ==================== MOVIES ====================
  { id: 47, title: 'Marvel Cinematic Universe', category: 'Movies', difficulty: 'Medium', icon: '🦸', questions: [
    { text: 'Who was the first Avenger?', options: ['Captain America', 'Iron Man', 'Thor', 'Hulk'], correct: 0 },
    { text: 'What is Thanos\'s home planet?', options: ['Titan', 'Sakaar', 'Xandar', 'Knowhere'], correct: 0 },
    { text: 'Who plays Iron Man?', options: ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo'], correct: 0 },
    { text: 'How many Infinity Stones are there?', options: ['6', '5', '7', '9'], correct: 0 },
    { text: 'What is the name of Thor\'s hammer?', options: ['Mjolnir', 'Stormbreaker', 'Gungnir', 'Excalibur'], correct: 0 }
  ], badge: 'popular', plays: 612, createdAt: '2026-06-20' },
  { id: 48, title: 'Harry Potter', category: 'Movies', difficulty: 'Easy', icon: '⚡', questions: [
    { text: 'What house is Harry in at Hogwarts?', options: ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'], correct: 0 },
    { text: 'Who is the headmaster of Hogwarts?', options: ['Albus Dumbledore', 'Snape', 'McGonagall', 'Hagrid'], correct: 0 },
    { text: 'What is Harry\'s owl called?', options: ['Hedwig', 'Errol', 'Pigwidgeon', 'Crookshanks'], correct: 0 },
    { text: 'Who kills Voldemort?', options: ['Harry Potter', 'Dumbledore', 'Neville', 'Hermione'], correct: 0 },
    { text: 'What position does Harry play in Quidditch?', options: ['Seeker', 'Chaser', 'Beater', 'Keeper'], correct: 0 }
  ], badge: 'popular', plays: 578, createdAt: '2026-06-18' },
  { id: 49, title: 'DC Universe', category: 'Movies', difficulty: 'Medium', icon: '🦇', questions: [
    { text: 'What is Batman\'s real name?', options: ['Bruce Wayne', 'Clark Kent', 'Barry Allen', 'Hal Jordan'], correct: 0 },
    { text: 'Superman\'s home planet?', options: ['Krypton', 'Mars', 'Themyscira', 'Oa'], correct: 0 },
    { text: 'Who is the Flash?', options: ['Barry Allen', 'Wally West', 'Peter Parker', 'Clark Kent'], correct: 0 },
    { text: 'What weapon does Wonder Woman use?', options: ['Lasso of Truth', 'Trident', 'Bow', 'Sword only'], correct: 0 },
    { text: 'Who is Batman\'s butler?', options: ['Alfred', 'Lucius', 'Robin', 'Gordon'], correct: 0 }
  ], badge: 'recommended', plays: 421, createdAt: '2026-07-04' },
  { id: 50, title: 'Studio Ghibli', category: 'Movies', difficulty: 'Medium', icon: '🌸', questions: [
    { text: 'Who directed Spirited Away?', options: ['Hayao Miyazaki', 'Isao Takahata', 'Makoto Shinkai', 'Mamoru Hosoda'], correct: 0 },
    { text: 'What is the cat-bus creature from?', options: ['My Neighbor Totoro', 'Kiki\'s Delivery Service', 'Ponyo', 'Howl\'s Moving Castle'], correct: 0 },
    { text: 'Who is the wizard in Howl\'s Moving Castle?', options: ['Howl', 'Sophie', 'Calcifer', 'Turnip Head'], correct: 0 },
    { text: 'What is the studio\'s mascot?', options: ['Totoro', 'Ponyo', 'Jiji', 'No Face'], correct: 0 },
    { text: 'In Princess Mononoke, what is San raised by?', options: ['Wolves', 'Bears', 'Deer', 'Boars'], correct: 0 }
  ], badge: 'new', plays: 289, createdAt: '2026-07-11' },
  { id: 51, title: 'Fast & Furious', category: 'Movies', difficulty: 'Easy', icon: '🏎️', questions: [
    { text: 'Who plays Dominic Toretto?', options: ['Vin Diesel', 'Paul Walker', 'Dwayne Johnson', 'Jason Statham'], correct: 0 },
    { text: 'What is family\'s go-to phrase?', options: ['Family', 'Speed', 'Ride or Die', 'Nitrous'], correct: 0 },
    { text: 'What car is Dom famous for?', options: ['Dodge Charger', 'Nissan Skyline', 'Toyota Supra', 'Mazda RX-7'], correct: 0 },
    { text: 'Who played Brian O\'Conner?', options: ['Paul Walker', 'Vin Diesel', 'Tyrese', 'Ludacris'], correct: 0 },
    { text: 'Which film introduced Hobbs?', options: ['Fast Five', 'Fast & Furious 6', 'Furious 7', 'Tokyo Drift'], correct: 0 }
  ], badge: 'new', plays: 345, createdAt: '2026-07-13' },

  // ==================== TV SHOWS ====================
  { id: 52, title: 'Stranger Things', category: 'TV Shows', difficulty: 'Medium', icon: '🔦', questions: [
    { text: 'What town is the show set in?', options: ['Hawkins', 'Derry', 'Salem', 'Sleepy Hollow'], correct: 0 },
    { text: 'What is the alternate dimension called?', options: ['The Upside Down', 'The Void', 'The Nether', 'The Rift'], correct: 0 },
    { text: 'Who plays Eleven?', options: ['Millie Bobby Brown', 'Sadie Sink', 'Natalia Dyer', 'Maya Hawke'], correct: 0 },
    { text: 'What monster hunts kids in Season 1?', options: ['Demogorgon', 'Mind Flayer', 'Vecna', 'Demodog'], correct: 0 },
    { text: 'What year does Season 1 take place?', options: ['1983', '1985', '1980', '1988'], correct: 0 }
  ], badge: 'popular', plays: 512, createdAt: '2026-06-28' },
  { id: 53, title: 'Friends Trivia', category: 'TV Shows', difficulty: 'Easy', icon: '☕', questions: [
    { text: 'What is the name of the coffee shop?', options: ['Central Perk', 'Java Joe\'s', 'Big Bean', 'The Grind'], correct: 0 },
    { text: 'What is Ross\'s profession?', options: ['Paleontologist', 'Chef', 'Actor', 'Doctor'], correct: 0 },
    { text: 'Who married Chandler?', options: ['Monica', 'Rachel', 'Phoebe', 'Janice'], correct: 0 },
    { text: 'What is Joey\'s catchphrase?', options: ['How you doin\'?', 'Bazinga', 'Legendary', 'Yada yada'], correct: 0 },
    { text: 'What was Phoebe\'s famous song?', options: ['Smelly Cat', 'Barracuda', 'Something About You', 'Twinkle Cat'], correct: 0 }
  ], badge: 'popular', plays: 623, createdAt: '2026-06-15' },
  { id: 54, title: 'Breaking Bad', category: 'TV Shows', difficulty: 'Hard', icon: '⚗️', questions: [
    { text: 'What is Walter White\'s alias?', options: ['Heisenberg', 'Scarface', 'Capone', 'Ghost'], correct: 0 },
    { text: 'What subject does Walter teach?', options: ['Chemistry', 'Physics', 'Math', 'Biology'], correct: 0 },
    { text: 'Who is Walter\'s partner?', options: ['Jesse Pinkman', 'Mike', 'Saul', 'Gus'], correct: 0 },
    { text: 'What is the name of Walter\'s brother-in-law?', options: ['Hank', 'Ted', 'Marco', 'Todd'], correct: 0 },
    { text: 'What color is the meth?', options: ['Blue', 'Green', 'Red', 'Clear'], correct: 0 }
  ], badge: 'recommended', plays: 434, createdAt: '2026-07-06' },
  { id: 55, title: 'Squid Game', category: 'TV Shows', difficulty: 'Easy', icon: '🦑', questions: [
    { text: 'What country is the show from?', options: ['South Korea', 'Japan', 'China', 'Vietnam'], correct: 0 },
    { text: 'What number is Seong Gi-hun?', options: ['456', '218', '067', '001'], correct: 0 },
    { text: 'What is the first game?', options: ['Red Light, Green Light', 'Tug of War', 'Marbles', 'Glass Bridge'], correct: 0 },
    { text: 'What is the prize money?', options: ['45.6 billion won', '10 billion won', '1 million dollars', '100 million won'], correct: 0 },
    { text: 'Who created the show?', options: ['Hwang Dong-hyuk', 'Bong Joon-ho', 'Park Chan-wook', 'Kim Jee-woon'], correct: 0 }
  ], badge: 'popular', plays: 587, createdAt: '2026-06-22' },
  { id: 56, title: 'Wednesday Addams', category: 'TV Shows', difficulty: 'Easy', icon: '🕷️', questions: [
    { text: 'What is Wednesday\'s last name?', options: ['Addams', 'Munster', 'Frump', 'Sinister'], correct: 0 },
    { text: 'What school does she attend?', options: ['Nevermore Academy', 'Hogwarts', 'Xavier\'s', 'Camp Half-Blood'], correct: 0 },
    { text: 'What is her pet hand called?', options: ['Thing', 'Cousin It', 'Lurch', 'Grip'], correct: 0 },
    { text: 'Who plays Wednesday?', options: ['Jenna Ortega', 'Millie Bobby Brown', 'Sydney Sweeney', 'Anya Taylor-Joy'], correct: 0 },
    { text: 'Who created the series?', options: ['Tim Burton', 'Guillermo del Toro', 'James Wan', 'M. Night Shyamalan'], correct: 0 }
  ], badge: 'new', plays: 412, createdAt: '2026-07-14' },

  // ==================== GAMING ====================
  { id: 57, title: 'Minecraft Master', category: 'Gaming', difficulty: 'Easy', icon: '⛏️', questions: [
    { text: 'What is the final boss?', options: ['Ender Dragon', 'Wither', 'Warden', 'Elder Guardian'], correct: 0 },
    { text: 'What do you need to enter the Nether?', options: ['Obsidian portal', 'End Portal', 'Diamond Key', 'Gold Ingot'], correct: 0 },
    { text: 'What mob explodes?', options: ['Creeper', 'Zombie', 'Skeleton', 'Enderman'], correct: 0 },
    { text: 'What material is strongest for tools?', options: ['Netherite', 'Diamond', 'Iron', 'Gold'], correct: 0 },
    { text: 'Who created Minecraft?', options: ['Markus Persson (Notch)', 'Gabe Newell', 'Hideo Kojima', 'Todd Howard'], correct: 0 }
  ], badge: 'popular', plays: 689, createdAt: '2026-06-18' },
  { id: 58, title: 'Valorant Agents', category: 'Gaming', difficulty: 'Medium', icon: '🎯', questions: [
    { text: 'Who is the game developed by?', options: ['Riot Games', 'Valve', 'Blizzard', 'Ubisoft'], correct: 0 },
    { text: 'What class is Jett?', options: ['Duelist', 'Controller', 'Sentinel', 'Initiator'], correct: 0 },
    { text: 'How many rounds to win?', options: ['13', '16', '10', '15'], correct: 0 },
    { text: 'What weapon is the "Operator"?', options: ['Sniper', 'SMG', 'Shotgun', 'Rifle'], correct: 0 },
    { text: 'Which agent is a radianite scientist from Russia?', options: ['Sova', 'Breach', 'Cypher', 'Killjoy'], correct: 0 }
  ], badge: 'new', plays: 356, createdAt: '2026-07-11' },
  { id: 59, title: 'GTA V Trivia', category: 'Gaming', difficulty: 'Medium', icon: '🚓', questions: [
    { text: 'What city is GTA V set in?', options: ['Los Santos', 'Vice City', 'Liberty City', 'San Fierro'], correct: 0 },
    { text: 'Which is not a playable character?', options: ['Niko Bellic', 'Michael', 'Trevor', 'Franklin'], correct: 0 },
    { text: 'What company made GTA V?', options: ['Rockstar', 'EA', 'Ubisoft', 'Bethesda'], correct: 0 },
    { text: 'What year was GTA V released?', options: ['2013', '2010', '2015', '2008'], correct: 0 },
    { text: 'Which state is Los Santos based on?', options: ['California', 'Nevada', 'Florida', 'Texas'], correct: 0 }
  ], badge: 'popular', plays: 501, createdAt: '2026-06-24' },
  { id: 60, title: 'Pokemon Trainers', category: 'Gaming', difficulty: 'Easy', icon: '⚡', questions: [
    { text: 'Who is Ash\'s first Pokemon?', options: ['Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle'], correct: 0 },
    { text: 'How many original Pokemon?', options: ['151', '150', '251', '100'], correct: 0 },
    { text: 'What type is Charizard?', options: ['Fire/Flying', 'Fire only', 'Dragon/Fire', 'Fire/Ground'], correct: 0 },
    { text: 'Who is the Team Rocket duo?', options: ['Jessie and James', 'Butch and Cassidy', 'Attila and Hun', 'Rico and Rita'], correct: 0 },
    { text: 'Legendary bird of ice?', options: ['Articuno', 'Zapdos', 'Moltres', 'Lugia'], correct: 0 }
  ], badge: 'popular', plays: 578, createdAt: '2026-06-19' },
  { id: 61, title: 'PUBG & Battle Royale', category: 'Gaming', difficulty: 'Medium', icon: '🔫', questions: [
    { text: 'What does PUBG stand for?', options: ['PlayerUnknown\'s Battlegrounds', 'Player Union Battle Game', 'Pro Unified Battle Grounds', 'Power Up Big Game'], correct: 0 },
    { text: 'How many players in a standard match?', options: ['100', '60', '150', '50'], correct: 0 },
    { text: 'What restricts the play area?', options: ['The Blue Zone', 'The Storm', 'The Ring', 'Radiation'], correct: 0 },
    { text: 'Fortnite is made by?', options: ['Epic Games', 'Riot', 'Activision', 'EA'], correct: 0 },
    { text: 'Which is not a battle royale?', options: ['Overwatch', 'Apex Legends', 'Warzone', 'Free Fire'], correct: 0 }
  ], badge: 'new', plays: 389, createdAt: '2026-07-09' },

  // ==================== MUSIC ====================
  { id: 62, title: 'Taylor Swift Era', category: 'Music', difficulty: 'Easy', icon: '🎤', questions: [
    { text: 'What was Taylor\'s debut album genre?', options: ['Country', 'Pop', 'Rock', 'Folk'], correct: 0 },
    { text: 'Which album has "Blank Space"?', options: ['1989', 'Reputation', 'Lover', 'Red'], correct: 0 },
    { text: 'What color is associated with "Lover"?', options: ['Pink', 'Red', 'Blue', 'Purple'], correct: 0 },
    { text: 'What tour was in 2023-2024?', options: ['Eras Tour', 'Reputation Tour', 'Red Tour', '1989 Tour'], correct: 0 },
    { text: 'Which album has "All Too Well (10 Minute Version)"?', options: ['Red (Taylor\'s Version)', 'Fearless', 'Midnights', 'Folklore'], correct: 0 }
  ], badge: 'popular', plays: 634, createdAt: '2026-06-17' },
  { id: 63, title: 'K-Pop Deep Dive', category: 'Music', difficulty: 'Medium', icon: '💜', questions: [
    { text: 'How many members are in BTS?', options: ['7', '9', '6', '8'], correct: 0 },
    { text: 'What company manages BLACKPINK?', options: ['YG Entertainment', 'JYP', 'SM', 'HYBE'], correct: 0 },
    { text: 'Who is the leader of BTS?', options: ['RM', 'Jin', 'Suga', 'J-Hope'], correct: 0 },
    { text: 'Which song is by BLACKPINK?', options: ['DDU-DU DDU-DU', 'Dynamite', 'Cheer Up', 'Gee'], correct: 0 },
    { text: 'What does "K-Pop" stand for?', options: ['Korean Pop', 'Kawaii Pop', 'Keen Pop', 'K-Music'], correct: 0 }
  ], badge: 'popular', plays: 545, createdAt: '2026-06-26' },
  { id: 64, title: 'Bollywood Beats', category: 'Music', difficulty: 'Medium', icon: '🎬', questions: [
    { text: 'Who is called the "King of Playback Singing"?', options: ['Arijit Singh', 'Kishore Kumar', 'Sonu Nigam', 'KK'], correct: 0 },
    { text: 'Which A.R. Rahman song won an Oscar?', options: ['Jai Ho', 'Vande Mataram', 'Kun Faya Kun', 'Roja'], correct: 0 },
    { text: 'Who sang "Tum Hi Ho"?', options: ['Arijit Singh', 'Atif Aslam', 'Sonu Nigam', 'Mohit Chauhan'], correct: 0 },
    { text: 'What language dominates Bollywood?', options: ['Hindi', 'Tamil', 'Telugu', 'Punjabi'], correct: 0 },
    { text: 'Who is the "Nightingale of India"?', options: ['Lata Mangeshkar', 'Asha Bhosle', 'Shreya Ghoshal', 'Sunidhi Chauhan'], correct: 0 }
  ], badge: 'recommended', plays: 456, createdAt: '2026-07-03' },
  { id: 65, title: 'Rock Legends', category: 'Music', difficulty: 'Hard', icon: '🎸', questions: [
    { text: 'Who is the lead singer of Queen?', options: ['Freddie Mercury', 'Mick Jagger', 'Robert Plant', 'David Bowie'], correct: 0 },
    { text: 'What band recorded "Stairway to Heaven"?', options: ['Led Zeppelin', 'The Beatles', 'Pink Floyd', 'The Who'], correct: 0 },
    { text: 'What guitar is Slash famous for?', options: ['Gibson Les Paul', 'Fender Strat', 'Ibanez RG', 'PRS Custom'], correct: 0 },
    { text: 'What band is "The Wall" by?', options: ['Pink Floyd', 'Led Zeppelin', 'The Doors', 'Genesis'], correct: 0 },
    { text: 'Kurt Cobain fronted which band?', options: ['Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains'], correct: 0 }
  ], badge: 'new', plays: 298, createdAt: '2026-07-08' },
  { id: 66, title: 'Hip-Hop Icons', category: 'Music', difficulty: 'Medium', icon: '🎧', questions: [
    { text: 'Who founded Aftermath Entertainment?', options: ['Dr. Dre', 'Jay-Z', 'Diddy', 'Snoop Dogg'], correct: 0 },
    { text: 'Which rapper is from Compton?', options: ['Kendrick Lamar', 'J. Cole', 'Drake', 'Travis Scott'], correct: 0 },
    { text: 'Who released "The Marshall Mathers LP"?', options: ['Eminem', 'Dr. Dre', '50 Cent', 'Nas'], correct: 0 },
    { text: 'What year did Tupac pass away?', options: ['1996', '1997', '1995', '2000'], correct: 0 },
    { text: 'Which label did Jay-Z co-found?', options: ['Roc-A-Fella', 'Def Jam', 'Bad Boy', 'Cash Money'], correct: 0 }
  ], badge: 'recommended', plays: 378, createdAt: '2026-07-05' },

  // ==================== SPORTS ====================
  { id: 67, title: 'Cricket & IPL', category: 'Sports', difficulty: 'Medium', icon: '🏏', questions: [
    { text: 'How many players in a cricket team?', options: ['11', '9', '10', '12'], correct: 0 },
    { text: 'Who is called "Captain Cool"?', options: ['M.S. Dhoni', 'Virat Kohli', 'Rohit Sharma', 'Kapil Dev'], correct: 0 },
    { text: 'IPL started in which year?', options: ['2008', '2010', '2005', '2007'], correct: 0 },
    { text: 'Highest ODI individual score?', options: ['264 (Rohit Sharma)', '200 (Sachin)', '237 (Guptill)', '219 (Coventry)'], correct: 0 },
    { text: 'Which team has won most IPL titles (as of 2024)?', options: ['Mumbai Indians / CSK (tied 5)', 'RCB', 'KKR', 'SRH'], correct: 0 }
  ], badge: 'popular', plays: 578, createdAt: '2026-06-22' },
  { id: 68, title: 'FIFA World Cup', category: 'Sports', difficulty: 'Medium', icon: '⚽', questions: [
    { text: 'Which country won the 2022 World Cup?', options: ['Argentina', 'France', 'Brazil', 'Germany'], correct: 0 },
    { text: 'How often is the World Cup?', options: ['Every 4 years', 'Every 2 years', 'Every 3 years', 'Yearly'], correct: 0 },
    { text: 'Who has the most World Cup goals?', options: ['Miroslav Klose', 'Ronaldo (Brazil)', 'Pele', 'Messi'], correct: 0 },
    { text: 'How many teams played the 2022 WC?', options: ['32', '24', '48', '16'], correct: 0 },
    { text: 'First World Cup was held in?', options: ['1930 (Uruguay)', '1928 (France)', '1934 (Italy)', '1950 (Brazil)'], correct: 0 }
  ], badge: 'popular', plays: 634, createdAt: '2026-06-19' },
  { id: 69, title: 'NBA Legends', category: 'Sports', difficulty: 'Medium', icon: '🏀', questions: [
    { text: 'Who is called "The GOAT" (basketball debate)?', options: ['Michael Jordan / LeBron', 'Kobe', 'Magic Johnson', 'Bird'], correct: 0 },
    { text: 'How many rings does MJ have?', options: ['6', '5', '3', '8'], correct: 0 },
    { text: 'LeBron played for which teams?', options: ['Cavs, Heat, Lakers', 'Cavs only', 'Lakers only', 'Warriors'], correct: 0 },
    { text: 'Who holds the single game scoring record (100)?', options: ['Wilt Chamberlain', 'Kobe Bryant', 'Michael Jordan', 'LeBron'], correct: 0 },
    { text: 'What year did Kobe retire?', options: ['2016', '2015', '2018', '2020'], correct: 0 }
  ], badge: 'recommended', plays: 445, createdAt: '2026-07-01' },
  { id: 70, title: 'Formula 1 Racing', category: 'Sports', difficulty: 'Hard', icon: '🏁', questions: [
    { text: 'Who has the most F1 titles (as of 2024, tied at 7)?', options: ['Hamilton & Schumacher', 'Vettel', 'Senna', 'Verstappen'], correct: 0 },
    { text: 'Which team is Verstappen with?', options: ['Red Bull', 'Ferrari', 'Mercedes', 'McLaren'], correct: 0 },
    { text: 'What is DRS?', options: ['Drag Reduction System', 'Direct Radio System', 'Dynamic Racing Setup', 'Downforce Regulation'], correct: 0 },
    { text: 'Monaco GP is famous for?', options: ['Street circuit', 'Longest race', 'Fastest track', 'Night race'], correct: 0 },
    { text: 'Who founded Ferrari?', options: ['Enzo Ferrari', 'Luigi Chinetti', 'Alfa Romeo', 'Giovanni Agnelli'], correct: 0 }
  ], badge: 'new', plays: 267, createdAt: '2026-07-15' },
  { id: 71, title: 'Olympic Trivia', category: 'Sports', difficulty: 'Easy', icon: '🏅', questions: [
    { text: 'Fastest man ever (100m WR)?', options: ['Usain Bolt', 'Justin Gatlin', 'Tyson Gay', 'Yohan Blake'], correct: 0 },
    { text: 'Most Olympic gold medals (individual)?', options: ['Michael Phelps (23)', 'Larisa Latynina', 'Paavo Nurmi', 'Mark Spitz'], correct: 0 },
    { text: 'Where were the 2024 Summer Olympics?', options: ['Paris', 'Tokyo', 'Los Angeles', 'London'], correct: 0 },
    { text: 'Which sport uses a shuttlecock?', options: ['Badminton', 'Tennis', 'Squash', 'Table Tennis'], correct: 0 },
    { text: 'What color rings represent Africa?', options: ['Black', 'Yellow', 'Blue', 'Green'], correct: 0 }
  ], badge: 'recommended', plays: 356, createdAt: '2026-07-07' },

  // ==================== FOOD ====================
  { id: 72, title: 'World Cuisine', category: 'Food', difficulty: 'Easy', icon: '🍜', questions: [
    { text: 'Sushi is from which country?', options: ['Japan', 'China', 'Korea', 'Thailand'], correct: 0 },
    { text: 'Where does paella originate?', options: ['Spain', 'Italy', 'Mexico', 'Portugal'], correct: 0 },
    { text: 'What is tikka masala?', options: ['Indian curry', 'Chinese soup', 'Thai salad', 'Japanese noodle'], correct: 0 },
    { text: 'Country of origin for tacos?', options: ['Mexico', 'Spain', 'Peru', 'Cuba'], correct: 0 },
    { text: 'Where is pho from?', options: ['Vietnam', 'Thailand', 'Cambodia', 'China'], correct: 0 }
  ], badge: 'popular', plays: 456, createdAt: '2026-06-27' },
  { id: 73, title: 'Indian Food Delights', category: 'Food', difficulty: 'Medium', icon: '🍛', questions: [
    { text: 'What is dosa made of?', options: ['Fermented rice & lentils', 'Wheat flour', 'Chickpea flour', 'Corn'], correct: 0 },
    { text: 'Biryani is famously associated with?', options: ['Hyderabad', 'Delhi', 'Mumbai', 'Chennai'], correct: 0 },
    { text: 'What is paneer?', options: ['Cottage cheese', 'Yogurt', 'Butter', 'Cream'], correct: 0 },
    { text: 'Spice known as "King of spices"?', options: ['Black pepper', 'Cardamom', 'Cinnamon', 'Cloves'], correct: 0 },
    { text: 'What is gulab jamun?', options: ['Fried milk dumplings in syrup', 'Rice pudding', 'Ice cream', 'Custard'], correct: 0 }
  ], badge: 'recommended', plays: 389, createdAt: '2026-07-02' },
  { id: 74, title: 'Desserts Around World', category: 'Food', difficulty: 'Easy', icon: '🍰', questions: [
    { text: 'Tiramisu is from?', options: ['Italy', 'France', 'Austria', 'Greece'], correct: 0 },
    { text: 'What flavor is a classic macaron\'s pistachio?', options: ['Green', 'Yellow', 'Pink', 'Brown'], correct: 0 },
    { text: 'Baklava is popular in?', options: ['Turkey/Middle East', 'India', 'Japan', 'Mexico'], correct: 0 },
    { text: 'What is mochi made from?', options: ['Rice', 'Wheat', 'Almond', 'Corn'], correct: 0 },
    { text: 'Crème brûlée is finished with?', options: ['Torched sugar crust', 'Chocolate', 'Whipped cream', 'Berries'], correct: 0 }
  ], badge: 'popular', plays: 512, createdAt: '2026-06-21' },
  { id: 75, title: 'Fast Food Empire', category: 'Food', difficulty: 'Easy', icon: '🍔', questions: [
    { text: 'What is the Big Mac from?', options: ['McDonald\'s', 'Burger King', 'Wendy\'s', 'KFC'], correct: 0 },
    { text: 'Which chain has "Have it your way"?', options: ['Burger King', 'McDonald\'s', 'Subway', 'Wendy\'s'], correct: 0 },
    { text: 'Colonel Sanders founded?', options: ['KFC', 'McDonald\'s', 'Popeyes', 'Chick-fil-A'], correct: 0 },
    { text: 'Where was Domino\'s founded?', options: ['USA (Michigan)', 'Italy', 'UK', 'Canada'], correct: 0 },
    { text: 'Subway is known for?', options: ['Submarine sandwiches', 'Burgers', 'Pizza', 'Fried chicken'], correct: 0 }
  ], badge: 'new', plays: 401, createdAt: '2026-07-10' },
  { id: 76, title: 'Fruits Trivia', category: 'Food', difficulty: 'Easy', icon: '🍎', questions: [
    { text: 'Which fruit is called "King of Fruits"?', options: ['Mango', 'Apple', 'Durian', 'Pineapple'], correct: 0 },
    { text: 'What color is a ripe banana?', options: ['Yellow', 'Green', 'Red', 'Brown'], correct: 0 },
    { text: 'Which fruit has seeds on the outside?', options: ['Strawberry', 'Watermelon', 'Apple', 'Grape'], correct: 0 },
    { text: 'Kiwi originated in?', options: ['China', 'New Zealand', 'Australia', 'Chile'], correct: 0 },
    { text: 'What is a dragon fruit\'s inside?', options: ['White with black seeds', 'Yellow', 'Red pulp', 'Orange'], correct: 0 }
  ], badge: 'recommended', plays: 289, createdAt: '2026-07-06' },

  // ==================== FLAGS ====================
  { id: 77, title: 'Guess The Flag: Easy', category: 'Flags', difficulty: 'Easy', icon: '🚩', questions: [
    { text: 'A red circle on a white background?', options: ['Japan', 'China', 'South Korea', 'Bangladesh'], correct: 0 },
    { text: 'Maple leaf on white with red bars?', options: ['Canada', 'Mexico', 'Peru', 'Denmark'], correct: 0 },
    { text: 'Blue, white, red vertical stripes (from left)?', options: ['France', 'Italy', 'Netherlands', 'Russia'], correct: 0 },
    { text: 'Green, white, orange vertical stripes?', options: ['Ireland', 'Italy', 'India', 'Ivory Coast'], correct: 0 },
    { text: 'Union Jack in top-left, stars representing states?', options: ['Australia', 'USA', 'UK', 'New Zealand'], correct: 0 }
  ], badge: 'popular', plays: 512, createdAt: '2026-06-24' },
  { id: 78, title: 'Guess The Flag: Asia', category: 'Flags', difficulty: 'Medium', icon: '🇯🇵', questions: [
    { text: 'Red flag with 5 gold stars?', options: ['China', 'Vietnam', 'North Korea', 'Laos'], correct: 0 },
    { text: 'Yin-yang symbol with trigrams?', options: ['South Korea', 'Mongolia', 'Bhutan', 'Nepal'], correct: 0 },
    { text: 'Orange, white, green with wheel in middle?', options: ['India', 'Niger', 'Ivory Coast', 'Ireland'], correct: 0 },
    { text: 'Red with white crescent and star?', options: ['Turkey', 'Tunisia', 'Pakistan', 'Malaysia'], correct: 0 },
    { text: 'Two triangles stacked, not rectangular?', options: ['Nepal', 'Bhutan', 'Sri Lanka', 'Maldives'], correct: 0 }
  ], badge: 'new', plays: 345, createdAt: '2026-07-11' },
  { id: 79, title: 'Guess The Flag: Europe', category: 'Flags', difficulty: 'Medium', icon: '🇪🇺', questions: [
    { text: 'Green, white, red vertical?', options: ['Italy', 'Mexico', 'Hungary', 'Bulgaria'], correct: 0 },
    { text: 'Black, red, yellow horizontal?', options: ['Germany', 'Belgium', 'Uganda', 'Trinidad'], correct: 0 },
    { text: 'White cross on red?', options: ['Switzerland', 'Denmark', 'Georgia', 'England'], correct: 0 },
    { text: 'Blue with yellow cross?', options: ['Sweden', 'Finland', 'Iceland', 'Norway'], correct: 0 },
    { text: 'Red-white-red horizontal?', options: ['Austria', 'Latvia', 'Peru', 'Poland'], correct: 0 }
  ], badge: 'recommended', plays: 289, createdAt: '2026-07-04' },
  { id: 80, title: 'Guess The Flag: Americas', category: 'Flags', difficulty: 'Medium', icon: '🌎', questions: [
    { text: 'Green with yellow diamond and blue globe?', options: ['Brazil', 'Argentina', 'Uruguay', 'Colombia'], correct: 0 },
    { text: 'Light blue and white stripes with sun?', options: ['Argentina', 'Uruguay', 'Panama', 'Cuba'], correct: 0 },
    { text: 'Red, white, blue with sun (in ratio)?', options: ['Cuba', 'Puerto Rico', 'Panama', 'Dominican Republic'], correct: 0 },
    { text: '50 stars, 13 stripes?', options: ['USA', 'Liberia', 'Malaysia', 'Uruguay'], correct: 0 },
    { text: 'Vertical green-white-red with eagle on cactus?', options: ['Mexico', 'Italy', 'Peru', 'Colombia'], correct: 0 }
  ], badge: 'popular', plays: 401, createdAt: '2026-06-29' },
  { id: 81, title: 'Guess The Flag: Africa', category: 'Flags', difficulty: 'Hard', icon: '🌍', questions: [
    { text: 'Six colors, forming a Y (green, black, yellow, red, blue, white)?', options: ['South Africa', 'Kenya', 'Zimbabwe', 'Namibia'], correct: 0 },
    { text: 'Green, yellow, red horizontal with star?', options: ['Ethiopia (with star)', 'Ghana', 'Guinea', 'Mali'], correct: 0 },
    { text: 'Green with white crescent and star?', options: ['Mauritania (older)/Pakistan-like', 'Comoros', 'Turkmenistan', 'Algeria'], correct: 0 },
    { text: 'Red, black, green horizontal with eagle?', options: ['Egypt', 'Iraq', 'Syria', 'Yemen'], correct: 0 },
    { text: 'Green top, gold middle, red bottom with black star?', options: ['Ghana', 'Bolivia', 'Guinea', 'Cameroon'], correct: 0 }
  ], badge: 'new', plays: 234, createdAt: '2026-07-14' },

  // ==================== LOGOS ====================
  { id: 82, title: 'Tech Logos', category: 'Logos', difficulty: 'Easy', icon: '🏷️', questions: [
    { text: 'Bitten apple silhouette?', options: ['Apple', 'Blackberry', 'Fig', 'Mango Tech'], correct: 0 },
    { text: 'Four colored letters (blue, red, yellow, green)?', options: ['Google', 'Microsoft', 'eBay', 'Yahoo'], correct: 0 },
    { text: 'Four colored squares in a window?', options: ['Microsoft', 'Google', 'Adobe', 'IBM'], correct: 0 },
    { text: 'Blue bird (before rebrand)?', options: ['Twitter', 'Facebook', 'Bluesky', 'Angry Birds'], correct: 0 },
    { text: 'Camera with rainbow gradient?', options: ['Instagram', 'Snapchat', 'TikTok', 'Pinterest'], correct: 0 }
  ], badge: 'popular', plays: 578, createdAt: '2026-06-16' },
  { id: 83, title: 'Sports Brand Logos', category: 'Logos', difficulty: 'Easy', icon: '👟', questions: [
    { text: 'Swoosh?', options: ['Nike', 'Adidas', 'Puma', 'Reebok'], correct: 0 },
    { text: 'Three stripes?', options: ['Adidas', 'Nike', 'Under Armour', 'Fila'], correct: 0 },
    { text: 'Leaping big cat?', options: ['Puma', 'Jaguar', 'Reebok', 'Kappa'], correct: 0 },
    { text: 'Crocodile logo?', options: ['Lacoste', 'Ralph Lauren', 'Tommy Hilfiger', 'Levi\'s'], correct: 0 },
    { text: 'Interlocking Gs?', options: ['Gucci', 'Chanel', 'Louis Vuitton', 'Prada'], correct: 0 }
  ], badge: 'popular', plays: 512, createdAt: '2026-06-23' },
  { id: 84, title: 'Car Brand Logos', category: 'Logos', difficulty: 'Medium', icon: '🚙', questions: [
    { text: 'Prancing horse?', options: ['Ferrari', 'Porsche', 'Mustang', 'Kentucky Derby'], correct: 0 },
    { text: 'Raging bull?', options: ['Lamborghini', 'Red Bull', 'Ferrari', 'Dodge'], correct: 0 },
    { text: 'Four interlocking rings?', options: ['Audi', 'Olympics', 'Mitsubishi', 'Chrysler'], correct: 0 },
    { text: 'Blue and white quartered roundel?', options: ['BMW', 'Mini', 'VW', 'Rolls-Royce'], correct: 0 },
    { text: 'Three-pointed star?', options: ['Mercedes-Benz', 'Chrysler', 'Subaru', 'Lexus'], correct: 0 }
  ], badge: 'recommended', plays: 434, createdAt: '2026-07-03' },
  { id: 85, title: 'Food Chain Logos', category: 'Logos', difficulty: 'Easy', icon: '🍟', questions: [
    { text: 'Golden arches?', options: ['McDonald\'s', 'Burger King', 'In-N-Out', 'Wendy\'s'], correct: 0 },
    { text: 'Green twin-tailed mermaid?', options: ['Starbucks', 'Peet\'s', 'Costa', 'Dunkin\''], correct: 0 },
    { text: 'Red-haired pigtail girl?', options: ['Wendy\'s', 'Little Caesars', 'Panera', 'Popeyes'], correct: 0 },
    { text: 'Bearded colonel?', options: ['KFC', 'Popeyes', 'Chick-fil-A', 'Church\'s'], correct: 0 },
    { text: 'Blue and yellow tilted "S"?', options: ['Subway', 'IKEA', 'Sears', 'Sonic'], correct: 0 }
  ], badge: 'new', plays: 356, createdAt: '2026-07-09' },
  { id: 86, title: 'Emoji Movies', category: 'Logos', difficulty: 'Medium', icon: '🎥', questions: [
    { text: '🦁👑 = ?', options: ['The Lion King', 'Madagascar', 'Zootopia', 'Kung Fu Panda'], correct: 0 },
    { text: '🕷️👨 = ?', options: ['Spider-Man', 'Ant-Man', 'Venom', 'Bug\'s Life'], correct: 0 },
    { text: '❄️👸 = ?', options: ['Frozen', 'Cinderella', 'Snow White', 'Ice Age'], correct: 0 },
    { text: '🚢🧊💔 = ?', options: ['Titanic', 'Poseidon', 'Life of Pi', 'Cast Away'], correct: 0 },
    { text: '🦖🏞️ = ?', options: ['Jurassic Park', 'The Land Before Time', 'Ice Age', 'King Kong'], correct: 0 }
  ], badge: 'popular', plays: 623, createdAt: '2026-06-14' },

  // ==================== SPACE ====================
  { id: 87, title: 'NASA & Missions', category: 'Space', difficulty: 'Medium', icon: '🚀', questions: [
    { text: 'First Moon landing mission?', options: ['Apollo 11', 'Apollo 8', 'Apollo 13', 'Gemini 4'], correct: 0 },
    { text: 'Who was first on the Moon?', options: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins', 'John Glenn'], correct: 0 },
    { text: 'When did Apollo 11 land?', options: ['1969', '1972', '1965', '1975'], correct: 0 },
    { text: 'Which rover explored Mars in 2021?', options: ['Perseverance', 'Curiosity', 'Opportunity', 'Spirit'], correct: 0 },
    { text: 'Which space telescope launched in 2021?', options: ['James Webb', 'Hubble', 'Kepler', 'Chandra'], correct: 0 }
  ], badge: 'popular', plays: 445, createdAt: '2026-06-28' },
  { id: 88, title: 'Planets & Solar System', category: 'Space', difficulty: 'Easy', icon: '🪐', questions: [
    { text: 'Largest planet?', options: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'], correct: 0 },
    { text: 'Closest planet to the Sun?', options: ['Mercury', 'Venus', 'Earth', 'Mars'], correct: 0 },
    { text: 'Planet with prominent rings?', options: ['Saturn', 'Jupiter', 'Uranus', 'Neptune'], correct: 0 },
    { text: 'Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Mercury'], correct: 0 },
    { text: 'Former ninth planet, now dwarf?', options: ['Pluto', 'Eris', 'Ceres', 'Sedna'], correct: 0 }
  ], badge: 'popular', plays: 534, createdAt: '2026-06-20' },
  { id: 89, title: 'ISRO & Indian Space', category: 'Space', difficulty: 'Medium', icon: '🛰️', questions: [
    { text: 'Full form of ISRO?', options: ['Indian Space Research Organisation', 'International Space Research Organisation', 'Indian Satellite Research', 'India Solar Research Org'], correct: 0 },
    { text: 'Mission that landed near lunar south pole (2023)?', options: ['Chandrayaan-3', 'Chandrayaan-2', 'Mangalyaan', 'Gaganyaan'], correct: 0 },
    { text: 'ISRO\'s Mars mission is called?', options: ['Mangalyaan', 'Chandrayaan', 'Aditya', 'Gaganyaan'], correct: 0 },
    { text: 'ISRO is headquartered in?', options: ['Bengaluru', 'Delhi', 'Mumbai', 'Chennai'], correct: 0 },
    { text: 'Aditya L1 studies?', options: ['The Sun', 'The Moon', 'Mars', 'Venus'], correct: 0 }
  ], badge: 'new', plays: 389, createdAt: '2026-07-10' },
  { id: 90, title: 'Stars & Galaxies', category: 'Space', difficulty: 'Hard', icon: '🌌', questions: [
    { text: 'Our galaxy is called?', options: ['Milky Way', 'Andromeda', 'Triangulum', 'Sombrero'], correct: 0 },
    { text: 'Closest star to Earth (other than Sun)?', options: ['Proxima Centauri', 'Sirius', 'Alpha Centauri A', 'Betelgeuse'], correct: 0 },
    { text: 'A black hole\'s point of no return is called?', options: ['Event horizon', 'Singularity', 'Ergosphere', 'Accretion disk'], correct: 0 },
    { text: 'The Sun is a?', options: ['G-type main sequence star', 'Red giant', 'White dwarf', 'Neutron star'], correct: 0 },
    { text: 'Light year measures?', options: ['Distance', 'Time', 'Brightness', 'Mass'], correct: 0 }
  ], badge: 'recommended', plays: 267, createdAt: '2026-07-06' },
  { id: 91, title: 'Astronauts Hall of Fame', category: 'Space', difficulty: 'Medium', icon: '👨‍🚀', questions: [
    { text: 'First human in space?', options: ['Yuri Gagarin', 'Neil Armstrong', 'Alan Shepard', 'John Glenn'], correct: 0 },
    { text: 'First woman in space?', options: ['Valentina Tereshkova', 'Sally Ride', 'Kalpana Chawla', 'Mae Jemison'], correct: 0 },
    { text: 'First Indian in space?', options: ['Rakesh Sharma', 'Kalpana Chawla', 'Sunita Williams', 'Vikram Sarabhai'], correct: 0 },
    { text: 'Longest single ISS stay (Frank Rubio, days)?', options: ['371', '340', '200', '450'], correct: 0 },
    { text: 'Who orbited the Earth first for USA?', options: ['John Glenn', 'Alan Shepard', 'Neil Armstrong', 'Gus Grissom'], correct: 0 }
  ], badge: 'new', plays: 312, createdAt: '2026-07-13' },

  // ==================== CARS ====================
  { id: 92, title: 'Supercar Showdown', category: 'Cars', difficulty: 'Medium', icon: '🏎️', questions: [
    { text: 'Which brand makes the Aventador?', options: ['Lamborghini', 'Ferrari', 'McLaren', 'Bugatti'], correct: 0 },
    { text: 'Bugatti Veyron top speed (approx)?', options: ['~407 km/h', '~350 km/h', '~500 km/h', '~300 km/h'], correct: 0 },
    { text: 'Ferrari is from?', options: ['Italy', 'Germany', 'France', 'UK'], correct: 0 },
    { text: 'Which is a hybrid supercar?', options: ['Porsche 918 Spyder', 'Toyota Corolla', 'Honda Civic', 'Chevy Cruze'], correct: 0 },
    { text: 'Nürburgring is in?', options: ['Germany', 'Italy', 'Belgium', 'France'], correct: 0 }
  ], badge: 'popular', plays: 512, createdAt: '2026-06-25' },
  { id: 93, title: 'Tesla & EVs', category: 'Cars', difficulty: 'Easy', icon: '⚡', questions: [
    { text: 'Tesla was founded by?', options: ['Martin Eberhard & Marc Tarpenning (Musk joined later)', 'Elon Musk alone', 'Steve Jobs', 'Henrik Fisker'], correct: 0 },
    { text: 'Tesla\'s cheapest car (long time)?', options: ['Model 3', 'Model S', 'Model X', 'Roadster'], correct: 0 },
    { text: 'What does EV stand for?', options: ['Electric Vehicle', 'Enhanced Vehicle', 'Energy Van', 'Extra Volt'], correct: 0 },
    { text: 'Cybertruck body is made of?', options: ['Stainless steel', 'Carbon fiber', 'Aluminum', 'Plastic'], correct: 0 },
    { text: 'What company competes with Tesla in China?', options: ['BYD', 'Toyota', 'Ford', 'GM'], correct: 0 }
  ], badge: 'new', plays: 434, createdAt: '2026-07-08' },
  { id: 94, title: 'Luxury Brands', category: 'Cars', difficulty: 'Medium', icon: '💎', questions: [
    { text: 'Rolls-Royce is owned by?', options: ['BMW', 'VW', 'Toyota', 'Daimler'], correct: 0 },
    { text: 'Bentley belongs to?', options: ['Volkswagen Group', 'BMW', 'Tata', 'GM'], correct: 0 },
    { text: 'Which brand is "The Ultimate Driving Machine"?', options: ['BMW', 'Audi', 'Mercedes', 'Lexus'], correct: 0 },
    { text: 'Maybach is a sub-brand of?', options: ['Mercedes-Benz', 'BMW', 'Audi', 'Rolls-Royce'], correct: 0 },
    { text: 'Aston Martin is famously in which movie franchise?', options: ['James Bond', 'Fast & Furious', 'Transformers', 'John Wick'], correct: 0 }
  ], badge: 'recommended', plays: 356, createdAt: '2026-07-01' },
  { id: 95, title: 'Motorsport Machines', category: 'Cars', difficulty: 'Hard', icon: '🏁', questions: [
    { text: 'Which car won Le Mans most times as manufacturer?', options: ['Porsche', 'Audi', 'Ferrari', 'Toyota'], correct: 0 },
    { text: 'What series is NASCAR?', options: ['American stock car racing', 'Formula racing', 'Rally', 'Drag'], correct: 0 },
    { text: 'What is WRC?', options: ['World Rally Championship', 'World Race Circuit', 'World Racing Cup', 'World Racing Cars'], correct: 0 },
    { text: 'Which is a rally legend?', options: ['Subaru Impreza', 'Lambo Huracán', 'Ferrari LaFerrari', 'BMW i8'], correct: 0 },
    { text: 'F1 engines currently (2024) are?', options: ['1.6L V6 turbo-hybrid', '3.0L V10', '2.4L V8', '5.0L V12'], correct: 0 }
  ], badge: 'new', plays: 234, createdAt: '2026-07-15' },
  { id: 96, title: 'Everyday Auto Trivia', category: 'Cars', difficulty: 'Easy', icon: '🚗', questions: [
    { text: 'Best-selling car of all time?', options: ['Toyota Corolla', 'Ford F-150', 'VW Beetle', 'Honda Civic'], correct: 0 },
    { text: 'SUV stands for?', options: ['Sport Utility Vehicle', 'Standard Utility Van', 'Super Utility Vehicle', 'Small Utility'], correct: 0 },
    { text: 'ABS in cars means?', options: ['Anti-lock Braking System', 'Auto Balance System', 'Advanced Boost System', 'Air Bag System'], correct: 0 },
    { text: 'Where was VW founded?', options: ['Germany', 'Austria', 'Netherlands', 'Denmark'], correct: 0 },
    { text: 'Which is a Japanese brand?', options: ['Suzuki', 'Peugeot', 'Fiat', 'Volvo'], correct: 0 }
  ], badge: 'popular', plays: 478, createdAt: '2026-06-30' },

  // ==================== ENTERTAINMENT / PERSONALITY ====================
  { id: 97, title: 'Which Avenger Are You?', category: 'Entertainment', difficulty: 'Easy', icon: '🛡️', questions: [
    { text: 'Iron Man\'s real name?', options: ['Tony Stark', 'Steve Rogers', 'Bruce Banner', 'Peter Parker'], correct: 0 },
    { text: 'Captain America\'s shield is made of?', options: ['Vibranium', 'Adamantium', 'Uru', 'Steel'], correct: 0 },
    { text: 'Hulk\'s alter ego?', options: ['Bruce Banner', 'Reed Richards', 'Peter Parker', 'Hank Pym'], correct: 0 },
    { text: 'Black Widow\'s real name?', options: ['Natasha Romanoff', 'Wanda Maximoff', 'Carol Danvers', 'Jean Grey'], correct: 0 },
    { text: 'Thor is god of?', options: ['Thunder', 'War', 'Sun', 'Sea'], correct: 0 }
  ], badge: 'popular', plays: 612, createdAt: '2026-06-17' },
  { id: 98, title: 'Hogwarts House Sorting', category: 'Entertainment', difficulty: 'Easy', icon: '🏰', questions: [
    { text: 'Which house values bravery?', options: ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'], correct: 0 },
    { text: 'Which house values ambition?', options: ['Slytherin', 'Gryffindor', 'Ravenclaw', 'Hufflepuff'], correct: 0 },
    { text: 'Which house values wisdom?', options: ['Ravenclaw', 'Slytherin', 'Gryffindor', 'Hufflepuff'], correct: 0 },
    { text: 'Which house values loyalty?', options: ['Hufflepuff', 'Ravenclaw', 'Slytherin', 'Gryffindor'], correct: 0 },
    { text: 'Who founded Slytherin?', options: ['Salazar Slytherin', 'Godric Gryffindor', 'Rowena Ravenclaw', 'Helga Hufflepuff'], correct: 0 }
  ], badge: 'popular', plays: 587, createdAt: '2026-06-19' },
  { id: 99, title: 'Festivals of the World', category: 'Entertainment', difficulty: 'Easy', icon: '🎉', questions: [
    { text: 'Diwali is the festival of?', options: ['Lights', 'Colors', 'Water', 'Harvest'], correct: 0 },
    { text: 'Holi is famous for?', options: ['Colors', 'Lights', 'Music only', 'Fireworks'], correct: 0 },
    { text: 'Christmas celebrates the birth of?', options: ['Jesus Christ', 'Buddha', 'Muhammad', 'Krishna'], correct: 0 },
    { text: 'Eid al-Fitr marks end of?', options: ['Ramadan', 'Hajj', 'Muharram', 'Rabi ul-Awwal'], correct: 0 },
    { text: 'Halloween is celebrated on?', options: ['October 31', 'November 1', 'October 30', 'December 1'], correct: 0 }
  ], badge: 'recommended', plays: 456, createdAt: '2026-06-27' },
  { id: 100, title: 'Guess the Character', category: 'Entertainment', difficulty: 'Medium', icon: '🎭', questions: [
    { text: 'Lightning scar, wizard boy?', options: ['Harry Potter', 'Percy Jackson', 'Frodo', 'Neo'], correct: 0 },
    { text: 'Radioactive spider bite, NYC hero?', options: ['Spider-Man', 'Daredevil', 'Punisher', 'Batman'], correct: 0 },
    { text: 'Yellow sponge in a pineapple?', options: ['SpongeBob', 'Patrick', 'Squidward', 'Sandy'], correct: 0 },
    { text: 'Orange hair, ninja, Nine-Tails?', options: ['Naruto', 'Goku', 'Ichigo', 'Kakashi'], correct: 0 },
    { text: 'Blue box, time traveler?', options: ['Doctor Who', 'Marty McFly', 'Rick Sanchez', 'Bill & Ted'], correct: 0 }
  ], badge: 'new', plays: 389, createdAt: '2026-07-12' }
];

// ==================== LEVEL SYSTEM ====================
const levels = [
  { level: 1, name: 'Newcomer', xpRequired: 0 },
  { level: 2, name: 'Beginner', xpRequired: 100 },
  { level: 3, name: 'Learner', xpRequired: 250 },
  { level: 4, name: 'Student', xpRequired: 500 },
  { level: 5, name: 'Scholar', xpRequired: 800 },
  { level: 6, name: 'Expert', xpRequired: 1200 },
  { level: 7, name: 'Master', xpRequired: 1700 },
  { level: 8, name: 'Genius', xpRequired: 2300 },
  { level: 9, name: 'Legend', xpRequired: 3000 },
  { level: 10, name: 'Quiz God', xpRequired: 4000 }
];

const achievements = [
  { id: 'first_quiz', name: 'First Steps', desc: 'Complete your first quiz', icon: '🎯', check: s => s.quizzesTaken >= 1 },
  { id: 'perfect', name: 'Perfect Score', desc: 'Get 100% on a quiz', icon: '💯', check: s => s.perfectQuizzes >= 1 },
  { id: 'streak_3', name: 'On Fire', desc: '3 day streak', icon: '🔥', check: s => s.streak >= 3 },
  { id: 'streak_7', name: 'Week Warrior', desc: '7 day streak', icon: '⚡', check: s => s.streak >= 7 },
  { id: 'quizzes_10', name: 'Quiz Machine', desc: 'Complete 10 quizzes', icon: '📚', check: s => s.quizzesTaken >= 10 },
  { id: 'quizzes_50', name: 'Quiz Addict', desc: 'Complete 50 quizzes', icon: '🧠', check: s => s.quizzesTaken >= 50 },
  { id: 'xp_500', name: 'Rising Star', desc: 'Earn 500 XP', icon: '⭐', check: s => s.totalXP >= 500 },
  { id: 'level_5', name: 'Scholar Status', desc: 'Reach Level 5', icon: '🎓', check: s => s.level >= 5 }
];

// ==================== LOCAL STORAGE HELPERS ====================
function getUsers() {
  return JSON.parse(localStorage.getItem('qm_users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('qm_users', JSON.stringify(users));
}

function getQuizzes() {
  const custom = JSON.parse(localStorage.getItem('qm_quizzes') || '[]');
  return [...sampleQuizzes, ...custom];
}

function saveQuizzes(quizzes) {
  localStorage.setItem('qm_quizzes', JSON.stringify(quizzes.filter(q => !sampleQuizzes.find(sq => sq.id === q.id))));
}

function getLeaderboard() {
  return JSON.parse(localStorage.getItem('qm_leaderboard') || '[]');
}

function updateLeaderboard(username, score) {
  const lb = getLeaderboard();
  const existing = lb.find(e => e.username === username);
  if (existing) {
    if (score > existing.xp) existing.xp = score;
    existing.quizzes = (existing.quizzes || 0) + 1;
    existing.streak = state.currentUser?.streak || 0;
  } else {
    lb.push({ username, xp: score, quizzes: 1, streak: state.currentUser?.streak || 0 });
  }
  lb.sort((a, b) => b.xp - a.xp);
  localStorage.setItem('qm_leaderboard', JSON.stringify(lb));
}

// ==================== USER HELPERS ====================
function getUserData() {
  if (!state.currentUser) return null;
  const users = getUsers();
  return users[state.currentUser] || null;
}

function saveUserData(data) {
  if (!state.currentUser) return;
  const users = getUsers();
  users[state.currentUser] = data;
  saveUsers(users);
}

function updateStreak() {
  const user = getUserData();
  if (!user) return;
  
  const today = new Date().toDateString();
  const lastActive = user.lastActiveDate;
  
  if (lastActive === today) {
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastActive === yesterday.toDateString()) {
    user.streak = (user.streak || 0) + 1;
  } else if (lastActive !== today) {
    user.streak = 1;
  }
  
  user.lastActiveDate = today;
  saveUserData(user);
}

function getLevelInfo(xp) {
  let currentLevel = levels[0];
  let nextLevel = levels[1];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xpRequired) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
      break;
    }
  }
  
  const xpInLevel = nextLevel ? xp - currentLevel.xpRequired : 0;
  const xpNeeded = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 1;
  const progress = nextLevel ? (xpInLevel / xpNeeded) * 100 : 100;
  
  return { ...currentLevel, nextLevel, xpInLevel, xpNeeded, progress };
}

function calculateXP(score, difficulty, timeSpent) {
  let baseXP = Math.round(score * 2);
  
  const difficultyBonus = { Easy: 1, Medium: 1.5, Hard: 2 };
  baseXP *= difficultyBonus[difficulty] || 1;
  
  const user = getUserData();
  if (user?.streak > 1) {
    baseXP *= 1 + (user.streak * 0.05);
  }
  
  if (score === 100) baseXP *= 1.5;
  
  return Math.round(baseXP);
}

// ==================== NAVIGATION ====================
function navigate(view) {
  state.currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const target = document.getElementById(`view-${view}`);
  if (target) target.classList.remove('hidden');
  
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-item[data-nav="${view}"]`);
  if (navBtn) navBtn.classList.add('active');
  
  window.scrollTo(0, 0);
  
  if (view === 'home') renderHome();
  if (view === 'browse') renderBrowse();
  if (view === 'analytics') renderAnalytics();
  if (view === 'leaderboard') renderLeaderboard();
  
  if (view !== 'auth') {
    document.getElementById('authModal')?.classList.remove('active');
  }
}

// ==================== AUTH ====================
function initAuth() {
  const savedUser = localStorage.getItem('qm_currentUser');
  if (savedUser) {
    state.currentUser = savedUser;
    updateStreak();
    showUserStats();
  } else {
    showAuthButtons();
  }
}

function showAuthButtons() {
  document.getElementById('userStats')?.classList.add('hidden');
  document.getElementById('authButtons')?.classList.remove('hidden');
}

function showUserStats() {
  document.getElementById('authButtons')?.classList.add('hidden');
  document.getElementById('userStats')?.classList.remove('hidden');
  
  const user = getUserData();
  if (user) {
    document.getElementById('userAvatar').textContent = state.currentUser[0].toUpperCase();
    document.getElementById('streakValue').textContent = user.streak || 0;
    
    const levelInfo = getLevelInfo(user.totalXP || 0);
    document.getElementById('xpLevelDisplay').textContent = `Lvl ${levelInfo.level}`;
    document.getElementById('xpMiniFill').style.width = levelInfo.progress + '%';
  }
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  
  const users = getUsers();
  if (!users[username] || users[username].password !== password) {
    errorEl.textContent = 'Invalid username or password';
    return;
  }
  
  state.currentUser = username;
  localStorage.setItem('qm_currentUser', username);
  updateStreak();
  
  document.getElementById('authModal').classList.remove('active');
  showUserStats();
  navigate('home');
  showNotification('Welcome back, ' + username + '! 🎉');
}

function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value;
  const errorEl = document.getElementById('signupError');
  
  if (username.length < 3) {
    errorEl.textContent = 'Username must be at least 3 characters';
    return;
  }
  
  const users = getUsers();
  if (users[username]) {
    errorEl.textContent = 'Username already exists';
    return;
  }
  
  users[username] = {
    password,
    totalXP: 0,
    quizzesTaken: 0,
    perfectQuizzes: 0,
    streak: 1,
    lastActiveDate: new Date().toDateString(),
    favorites: [],
    results: []
  };
  saveUsers(users);
  
  state.currentUser = username;
  localStorage.setItem('qm_currentUser', username);
  
  document.getElementById('authModal').classList.remove('active');
  showUserStats();
  navigate('home');
  showNotification('Welcome to ChalkQuiz, ' + username + '! 🚀');
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('qm_currentUser');
  showAuthButtons();
  navigate('home');
  showNotification('Logged out successfully');
}

// ==================== HOME RENDER ====================
function renderHome() {
  updateCategoryCounts();
  renderFeaturedQuizzes();
  renderRecentResults();
  renderFavorites();
  renderAchievements();
}

function updateCategoryCounts() {
  const quizzes = getQuizzes();
  const categories = CATEGORY_NAMES;
  
  categories.forEach(cat => {
    const count = quizzes.filter(q => q.category === cat).length;
    const el = document.querySelector(`[data-category="${cat}"] .category-count`);
    if (el) el.textContent = `${count} quizzes`;
  });
}

function renderFeaturedQuizzes() {
  const container = document.getElementById('featuredQuizzes');
  const quizzes = getQuizzes().filter(q => q.badge === 'popular' || q.badge === 'new').slice(0, 4);
  container.innerHTML = quizzes.map(q => createQuizCard(q)).join('');
}

function renderRecentResults() {
  const user = getUserData();
  const section = document.getElementById('recentSection');
  const container = document.getElementById('recentResults');
  
  if (!user || !user.results?.length) {
    section.hidden = true;
    return;
  }
  
  section.hidden = false;
  const recent = user.results.slice(-5).reverse();
  container.innerHTML = recent.map(r => `
    <div class="result-card">
      <div class="result-quiz-title">${r.quizTitle}</div>
      <div class="result-score">${r.score}%</div>
      <div class="result-date">${new Date(r.date).toLocaleDateString()}</div>
    </div>
  `).join('');
}

function renderFavorites() {
  const user = getUserData();
  const section = document.getElementById('favoritesSection');
  const container = document.getElementById('favoritesList');
  const empty = document.getElementById('favoritesEmpty');
  
  if (!user || !user.favorites?.length) {
    section.hidden = true;
    return;
  }
  
  section.hidden = false;
  const quizzes = getQuizzes().filter(q => user.favorites.includes(q.id));
  
  if (!quizzes.length) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  
  empty.classList.add('hidden');
  container.innerHTML = quizzes.map(q => createQuizCard(q)).join('');
}

function renderAchievements() {
  const user = getUserData();
  const section = document.getElementById('achievementsSection');
  const container = document.getElementById('achievementsList');
  
  if (!user) {
    section.hidden = true;
    return;
  }
  
  section.hidden = false;
  const unlocked = user.achievements || [];
  
  container.innerHTML = achievements.map(a => `
    <div class="achievement-card ${unlocked.includes(a.id) ? 'unlocked' : ''}">
      <span class="achievement-icon">${a.icon}</span>
      <span class="achievement-name">${a.name}</span>
      <span class="achievement-desc">${a.desc}</span>
    </div>
  `).join('');
}

function createQuizCard(quiz) {
  const user = getUserData();
  const isFavorite = user?.favorites?.includes(quiz.id);
  
  const badgeHtml = quiz.badge ? `<span class="quiz-badge quiz-badge-${quiz.badge}">${quiz.badge === 'new' ? '🆕' : quiz.badge === 'popular' ? '🔥' : '⭐'} ${quiz.badge}</span>` : '';
  
  return `
    <div class="quiz-card" data-quiz-id="${quiz.id}">
      <div class="quiz-card-header">
        <span class="quiz-icon">${quiz.icon}</span>
        <div class="quiz-badges">${badgeHtml}</div>
      </div>
      <div class="quiz-title">${quiz.title}</div>
      <div class="quiz-meta">
        <span>${quiz.difficulty}</span>
        <span>•</span>
        <span>${quiz.questions.length} Qs</span>
        <span>•</span>
        <span>${quiz.plays} plays</span>
      </div>
      <div class="quiz-footer">
        <span class="quiz-author">By ${quiz.author || 'ChalkQuiz'}</span>
        <div class="quiz-actions">
          <button class="quiz-action-btn ${isFavorite ? 'favorited' : ''}" data-favorite="${quiz.id}" title="Add to favorites">${isFavorite ? '★' : '☆'}</button>
          <button class="quiz-action-btn" data-play="${quiz.id}" title="Play now">▶</button>
        </div>
      </div>
    </div>
  `;
}

// ==================== BROWSE RENDER ====================
function renderBrowse() {
  const searchTerm = document.getElementById('browseSearch')?.value?.toLowerCase() || '';
  const category = document.getElementById('filterCategory')?.value || '';
  const difficulty = document.getElementById('filterDifficulty')?.value || '';
  const badge = document.getElementById('filterBadge')?.value || '';
  
  let quizzes = getQuizzes();
  
  if (searchTerm) {
    quizzes = quizzes.filter(q => 
      q.title.toLowerCase().includes(searchTerm) ||
      q.category.toLowerCase().includes(searchTerm)
    );
  }
  
  if (category) {
    quizzes = quizzes.filter(q => q.category === category);
  }
  
  if (difficulty) {
    quizzes = quizzes.filter(q => q.difficulty === difficulty);
  }
  
  if (badge) {
    quizzes = quizzes.filter(q => q.badge === badge);
  }
  
  const container = document.getElementById('browseQuizzes');
  const empty = document.getElementById('browseEmpty');
  
  if (!quizzes.length) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  
  empty.classList.add('hidden');
  container.innerHTML = quizzes.map(q => createQuizCard(q)).join('');
}

// ==================== ANALYTICS RENDER ====================
function renderAnalytics() {
  const user = getUserData();
  if (!user) {
    navigate('auth');
    document.getElementById('authModal').classList.add('active');
    return;
  }
  
  document.getElementById('statTotalQuizzes').textContent = user.quizzesTaken || 0;
  document.getElementById('statTotalXP').textContent = user.totalXP || 0;
  document.getElementById('statStreak').textContent = user.streak || 0;
  
  if (user.results?.length) {
    const avgScore = Math.round(user.results.reduce((sum, r) => sum + r.score, 0) / user.results.length);
    document.getElementById('statAvgScore').textContent = avgScore + '%';
  }
  
  const levelInfo = getLevelInfo(user.totalXP || 0);
  document.getElementById('analyticsLevel').textContent = `Level ${levelInfo.level}`;
  document.getElementById('analyticsLevelName').textContent = levelInfo.name;
  document.getElementById('analyticsXPBar').style.width = levelInfo.progress + '%';
  document.getElementById('analyticsXPText').textContent = 
    levelInfo.nextLevel 
      ? `${levelInfo.xpInLevel} / ${levelInfo.xpNeeded} XP to Level ${levelInfo.nextLevel.level}`
      : 'Max Level!';
  
  renderCategoryPerformance();
  renderRecentActivity();
  renderScoreChart();
}

function renderCategoryPerformance() {
  const user = getUserData();
  const container = document.getElementById('categoryPerformance');
  const categories = CATEGORY_NAMES;
  
  const categoryStats = categories.map(cat => {
    const catResults = user.results?.filter(r => r.category === cat) || [];
    const avgScore = catResults.length 
      ? Math.round(catResults.reduce((sum, r) => sum + r.score, 0) / catResults.length)
      : 0;
    return { cat, avgScore, count: catResults.length };
  }).filter(c => c.count > 0);
  
  if (!categoryStats.length) {
    container.innerHTML = '<p class="empty-message">Complete quizzes to see category performance</p>';
    return;
  }
  
  container.innerHTML = categoryStats.map(c => `
    <div class="category-bar-item">
      <span class="category-bar-label">${c.cat}</span>
      <div class="category-bar">
        <div class="category-bar-fill" style="width: ${c.avgScore}%"></div>
      </div>
      <span class="category-bar-value">${c.avgScore}%</span>
    </div>
  `).join('');
}

function renderRecentActivity() {
  const user = getUserData();
  const container = document.getElementById('recentActivity');
  
  if (!user.results?.length) {
    container.innerHTML = '<p class="empty-message">No activity yet</p>';
    return;
  }
  
  const recent = user.results.slice(-10).reverse();
  container.innerHTML = recent.map(r => `
    <div class="activity-item">
      <span class="activity-quiz">${r.quizTitle}</span>
      <span class="activity-score">${r.score}%</span>
    </div>
  `).join('');
}

function renderScoreChart() {
  const user = getUserData();
  const container = document.getElementById('scoreChart');
  
  if (!user.results?.length) {
    container.innerHTML = '<p class="empty-message">Complete quizzes to see your score trend</p>';
    return;
  }
  
  const recent = user.results.slice(-10);
  const maxScore = 100;
  
  container.innerHTML = recent.map((r, i) => `
    <div class="score-bar" style="height: ${(r.score / maxScore) * 100}%"></div>
  `).join('');
}

// ==================== LEADERBOARD RENDER ====================
function renderLeaderboard(sortBy = 'xp') {
  const lb = getLeaderboard();
  const container = document.getElementById('leaderboardList');
  
  let sorted = [...lb];
  if (sortBy === 'xp') sorted.sort((a, b) => b.xp - a.xp);
  else if (sortBy === 'streak') sorted.sort((a, b) => (b.streak || 0) - (a.streak || 0));
  else if (sortBy === 'quizzes') sorted.sort((a, b) => (b.quizzes || 0) - (a.quizzes || 0));
  
  if (!sorted.length) {
    container.innerHTML = '<p class="empty-message">No players yet. Start playing to appear here!</p>';
    return;
  }
  
  container.innerHTML = sorted.slice(0, 10).map((player, i) => {
    const levelInfo = getLevelInfo(player.xp || 0);
    return `
      <div class="leaderboard-item">
        <div class="leaderboard-rank ${i < 3 ? 'leaderboard-rank-' + (i + 1) : ''}">${i + 1}</div>
        <div class="leaderboard-avatar">${player.username[0].toUpperCase()}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${player.username}</div>
          <div class="leaderboard-level">Level ${levelInfo.level} - ${levelInfo.name}</div>
        </div>
        <div class="leaderboard-score">
          <div class="leaderboard-value">${sortBy === 'xp' ? player.xp : sortBy === 'streak' ? player.streak : player.quizzes}</div>
          <div class="leaderboard-label">${sortBy === 'xp' ? 'XP' : sortBy === 'streak' ? 'Day Streak' : 'Quizzes'}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== QUIZ PLAY ====================
function startQuiz(quizId) {
  if (!state.currentUser) {
    document.getElementById('authModal').classList.add('active');
    return;
  }
  
  const quizzes = getQuizzes();
  const quiz = quizzes.find(q => q.id === parseInt(quizId));
  if (!quiz) return;
  
  state.currentQuiz = quiz;
  state.currentQuestion = 0;
  state.userAnswers = [];
  state.timeRemaining = quiz.questions.length * 30;
  
  navigate('quiz');
  document.getElementById('quizPlayTitle').textContent = quiz.title;
  document.getElementById('quizMeta').textContent = `By ${quiz.author || 'ChalkQuiz'} • ${quiz.difficulty} • ${quiz.questions.length} questions`;
  document.getElementById('quizBadge').textContent = quiz.badge ? `${quiz.badge === 'new' ? '🆕' : quiz.badge === 'popular' ? '🔥' : '⭐'} ${quiz.badge}` : '';
  
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const quiz = state.currentQuiz;
  const q = quiz.questions[state.currentQuestion];
  
  document.getElementById('questionNumber').textContent = `Question ${state.currentQuestion + 1} of ${quiz.questions.length}`;
  document.getElementById('questionText').textContent = q.text;
  document.getElementById('quizProgress').style.width = `${((state.currentQuestion) / quiz.questions.length) * 100}%`;
  
  const letters = ['A', 'B', 'C', 'D'];
  const optionsHtml = q.options.map((opt, i) => `
    <button class="option-btn" data-option="${i}">
      <span class="option-letter">${letters[i]}</span>
      <span>${opt}</span>
    </button>
  `).join('');
  
  document.getElementById('optionsList').innerHTML = optionsHtml;
  document.getElementById('nextQuestionBtn').disabled = true;
  
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.option)));
  });
}

function selectAnswer(optionIndex) {
  if (state.userAnswers[state.currentQuestion] !== undefined) return;
  
  state.userAnswers[state.currentQuestion] = optionIndex;
  
  const quiz = state.currentQuiz;
  const q = quiz.questions[state.currentQuestion];
  const isCorrect = optionIndex === q.correct;
  
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    if (i === q.correct) btn.classList.add('correct');
    if (i === optionIndex && !isCorrect) btn.classList.add('incorrect');
    btn.style.pointerEvents = 'none';
  });
  
  if (isCorrect) {
    sounds.correct();
  } else {
    sounds.incorrect();
  }
  
  document.getElementById('nextQuestionBtn').disabled = false;
}

function nextQuestion() {
  if (state.currentQuestion < state.currentQuiz.questions.length - 1) {
    state.currentQuestion++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function startTimer() {
  clearInterval(state.quizTimer);
  updateTimerDisplay();
  
  state.quizTimer = setInterval(() => {
    state.timeRemaining--;
    updateTimerDisplay();
    
    if (state.timeRemaining <= 0) {
      clearInterval(state.quizTimer);
      finishQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(state.timeRemaining / 60);
  const secs = state.timeRemaining % 60;
  document.getElementById('quizTimer').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function finishQuiz() {
  clearInterval(state.quizTimer);
  
  const quiz = state.currentQuiz;
  let correct = 0;
  
  quiz.questions.forEach((q, i) => {
    if (state.userAnswers[i] === q.correct) correct++;
  });
  
  const score = Math.round((correct / quiz.questions.length) * 100);
  const xpEarned = calculateXP(score, quiz.difficulty, 0);
  
  const user = getUserData();
  user.quizzesTaken = (user.quizzesTaken || 0) + 1;
  user.totalXP = (user.totalXP || 0) + xpEarned;
  
  if (score === 100) user.perfectQuizzes = (user.perfectQuizzes || 0) + 1;
  
  user.results = user.results || [];
  user.results.push({
    quizTitle: quiz.title,
    category: quiz.category,
    score,
    xp: xpEarned,
    date: new Date().toISOString()
  });
  
  // Check achievements
  user.achievements = user.achievements || [];
  achievements.forEach(a => {
    if (!user.achievements.includes(a.id) && a.check(user)) {
      user.achievements.push(a.id);
      showNotification(`🏆 Achievement Unlocked: ${a.name}!`);
    }
  });
  
  const oldLevel = getLevelInfo(user.totalXP - xpEarned).level;
  const newLevel = getLevelInfo(user.totalXP).level;
  
  if (newLevel > oldLevel) {
    sounds.levelUp();
    showLevelUp(newLevel);
  }
  
  saveUserData(user);
  updateLeaderboard(state.currentUser, user.totalXP);
  showUserStats();
  
  // Store result for certificate
  state.lastResult = { quizTitle: quiz.title, score, xpEarned };
  
  navigate('results');
  renderResults(score, correct, quiz.questions.length, xpEarned);
}

function renderResults(score, correct, total, xpEarned) {
  document.getElementById('resultsScore').textContent = score + '%';
  document.getElementById('resultsTitle').textContent = score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Trying!';
  document.getElementById('resultsSubtitle').textContent = `You scored ${correct} out of ${total} correct`;
  document.getElementById('resultXP').textContent = '+' + xpEarned + ' XP';
  document.getElementById('resultCorrect').textContent = `${correct}/${total}`;
  document.getElementById('resultTime').textContent = '00:00';
  document.getElementById('resultStreak').textContent = 'Day ' + (getUserData().streak || 0);
}

// ==================== CERTIFICATE ====================
function showCertificate(quizTitle) {
  const user = getUserData();
  const levelInfo = getLevelInfo(user.totalXP || 0);
  
  document.getElementById('certName').textContent = state.currentUser;
  document.getElementById('certQuizTitle').textContent = quizTitle || state.lastResult?.quizTitle || 'Quiz';
  document.getElementById('certScore').textContent = (state.lastResult?.score || 0) + '%';
  document.getElementById('certXP').textContent = '+' + (state.lastResult?.xpEarned || 0) + ' XP';
  document.getElementById('certLevel').textContent = 'Level ' + levelInfo.level;
  document.getElementById('certDate').textContent = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  document.getElementById('certModal').classList.add('active');
}

function downloadCertificate() {
  const cert = document.getElementById('certificate');
  showNotification('Certificate downloaded! 🏅');
  document.getElementById('certModal').classList.remove('active');
}

// ==================== CREATE QUIZ ====================
function initCreateForm() {
  const container = document.getElementById('questionList');
  container.innerHTML = createQuestionHtml(1);
  
  document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const count = container.children.length + 1;
    container.insertAdjacentHTML('beforeend', createQuestionHtml(count));
  });
}

function createQuestionHtml(num) {
  return `
    <div class="question-item" data-question="${num}">
      <div class="question-item-header">
        <span class="question-item-number">Question ${num}</span>
      </div>
      <input type="text" placeholder="Enter your question..." required>
      <div class="option-inputs">
        <div class="option-input-row">
          <input type="radio" name="correct${num}" value="0" class="correct-radio" checked>
          <input type="text" placeholder="Option A" required>
        </div>
        <div class="option-input-row">
          <input type="radio" name="correct${num}" value="1" class="correct-radio">
          <input type="text" placeholder="Option B" required>
        </div>
        <div class="option-input-row">
          <input type="radio" name="correct${num}" value="2" class="correct-radio">
          <input type="text" placeholder="Option C" required>
        </div>
        <div class="option-input-row">
          <input type="radio" name="correct${num}" value="3" class="correct-radio">
          <input type="text" placeholder="Option D" required>
        </div>
      </div>
    </div>
  `;
}

function handleCreateQuiz(e) {
  e.preventDefault();
  
  const title = document.getElementById('quizTitle').value.trim();
  const category = document.getElementById('quizCategory').value;
  const difficulty = document.getElementById('quizDifficulty').value;
  
  const questionItems = document.querySelectorAll('.question-item');
  const questions = [];
  
  questionItems.forEach((item, i) => {
    const text = item.querySelector('input[type="text"]').value.trim();
    const inputs = item.querySelectorAll('.option-input-row input[type="text"]');
    const correctRadio = item.querySelector('input[type="radio"]:checked');
    
    if (!text || !correctRadio) return;
    
    const options = Array.from(inputs).map(inp => inp.value.trim());
    if (options.some(o => !o)) return;
    
    questions.push({
      text,
      options,
      correct: parseInt(correctRadio.value)
    });
  });
  
  if (questions.length < 1) {
    document.getElementById('createError').textContent = 'Please add at least one question';
    return;
  }
  
  const quizzes = getQuizzes();
  const newQuiz = {
    id: Date.now(),
    title,
    category,
    difficulty,
    icon: getCategoryIcon(category),
    questions,
    badge: 'new',
    plays: 0,
    author: state.currentUser,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  saveQuizzes([...quizzes, newQuiz]);
  
  document.getElementById('createForm').reset();
  document.getElementById('questionList').innerHTML = createQuestionHtml(1);
  document.getElementById('createError').textContent = '';
  
  showNotification('Quiz published successfully! 🎉');
  navigate('browse');
}

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || '📝';
}

// Populate category grid and dropdowns based on CATEGORIES config
function populateCategoryUI() {
  const grid = document.getElementById('categoriesGrid');
  if (grid) {
    grid.innerHTML = CATEGORIES.map(c => `
      <button class="category-card" data-category="${c.name}">
        <span class="category-icon">${c.icon}</span>
        <span class="category-name">${c.name}</span>
        <span class="category-count">0 quizzes</span>
      </button>
    `).join('');
  }
  const optionsHTML = CATEGORIES.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');
  const filter = document.getElementById('filterCategory');
  if (filter) filter.innerHTML = '<option value="">All Categories</option>' + optionsHTML;
  const create = document.getElementById('quizCategory');
  if (create) create.innerHTML = optionsHTML;
}

// ==================== NOTIFICATIONS ====================
function showNotification(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerHTML = `<span class="notification-icon">✨</span><span class="notification-text">${message}</span>`;
  document.body.appendChild(notif);
  
  setTimeout(() => notif.remove(), 3000);
}

function showLevelUp(level) {
  const levelInfo = levels.find(l => l.level === level);
  if (!levelInfo) return;
  
  const overlay = document.createElement('div');
  overlay.className = 'level-up-overlay';
  overlay.innerHTML = `
    <h2>🎉 LEVEL UP!</h2>
    <p>You reached Level ${level}: ${levelInfo.name}</p>
  `;
  document.body.appendChild(overlay);
  
  setTimeout(() => overlay.remove(), 3000);
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
  populateCategoryUI();
  initAuth();
  initCreateForm();
  
  // Navigation
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      sounds.click?.();
      const view = el.dataset.nav;
      if (view === 'auth') {
        document.getElementById('authModal').classList.add('active');
      } else {
        navigate(view);
      }
    });
  });
  
  // Auth modal
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const isLogin = tab.dataset.tab === 'login';
      document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
      document.getElementById('signupForm').classList.toggle('hidden', isLogin);
    });
  });
  
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('active');
    });
  });
  
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
  
  // Auth forms
  document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
  document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  
  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('qm_theme', next);
    document.getElementById('themeToggle').textContent = next === 'dark' ? '☀️' : '🌙';
  });
  
  // Sound toggle
  document.getElementById('soundToggle')?.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    document.getElementById('soundToggle').textContent = state.soundEnabled ? '🔊' : '🔇';
    showNotification(state.soundEnabled ? 'Sound on' : 'Sound off');
  });
  
  // Create quiz form
  document.getElementById('createForm')?.addEventListener('submit', handleCreateQuiz);
  
  // Browse filters
  ['browseSearch', 'filterCategory', 'filterDifficulty', 'filterBadge'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => renderBrowse());
    document.getElementById(id)?.addEventListener('change', () => renderBrowse());
  });
  
  // Leaderboard tabs
  document.querySelectorAll('[data-lb-sort]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.leaderboard-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderLeaderboard(tab.dataset.lbSort);
    });
  });
  
  // Quiz card clicks
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.quiz-card');
    const favoriteBtn = e.target.closest('[data-favorite]');
    const playBtn = e.target.closest('[data-play]');
    const randomBtn = e.target.closest('[data-random]');
    const categoryCard = e.target.closest('.category-card');
    
    if (favoriteBtn) {
      e.stopPropagation();
      if (!state.currentUser) {
        document.getElementById('authModal').classList.add('active');
        return;
      }
      const quizId = parseInt(favoriteBtn.dataset.favorite);
      const user = getUserData();
      user.favorites = user.favorites || [];
      
      if (user.favorites.includes(quizId)) {
        user.favorites = user.favorites.filter(id => id !== quizId);
        favoriteBtn.textContent = '☆';
        favoriteBtn.classList.remove('favorited');
      } else {
        user.favorites.push(quizId);
        favoriteBtn.textContent = '★';
        favoriteBtn.classList.add('favorited');
        showNotification('Added to favorites! ⭐');
      }
      saveUserData(user);
      renderFavorites();
      return;
    }
    
    if (playBtn) {
      e.stopPropagation();
      startQuiz(playBtn.dataset.play);
      return;
    }
    
    if (card) {
      startQuiz(card.dataset.quizId);
      return;
    }
    
    if (randomBtn) {
      const quizzes = getQuizzes();
      const random = quizzes[Math.floor(Math.random() * quizzes.length)];
      startQuiz(random.id);
      return;
    }
    
    if (categoryCard) {
      const category = categoryCard.dataset.category;
      document.getElementById('filterCategory').value = category;
      navigate('browse');
      return;
    }
  });
  
  // Quiz play controls
  document.getElementById('nextQuestionBtn')?.addEventListener('click', nextQuestion);
  document.getElementById('quitQuizBtn')?.addEventListener('click', () => {
    clearInterval(state.quizTimer);
    navigate('home');
  });
  
  // Results buttons
  document.querySelectorAll('[data-retry]').forEach(btn => {
    btn.addEventListener('click', () => {
      startQuiz(state.currentQuiz.id);
    });
  });
  
  // Certificate
  document.getElementById('downloadCertBtn')?.addEventListener('click', () => showCertificate());
  document.getElementById('downloadCertAnalyticsBtn')?.addEventListener('click', () => showCertificate());
  document.getElementById('saveCertBtn')?.addEventListener('click', downloadCertificate);
  
  // Set initial theme icon
  const theme = localStorage.getItem('qm_theme') || 'light';
  document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (state.currentView === 'quiz') {
    const options = document.querySelectorAll('.option-btn');
    if (e.key >= '1' && e.key <= '4') {
      const idx = parseInt(e.key) - 1;
      if (options[idx] && state.userAnswers[state.currentQuestion] === undefined) {
        options[idx].click();
      }
    }
    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      const nextBtn = document.getElementById('nextQuestionBtn');
      if (!nextBtn.disabled) nextBtn.click();
    }
  }
});