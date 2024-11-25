const KG = {
    // Upper Layer: Topics and their dependencies
    Topics: {
        IntroductionToPython: ['DataTypesAndVariables', 'ControlStructures'],
        DataTypesAndVariables: ['ControlStructures', 'Functions'],
        ControlStructures: ['Functions'],
        Functions: ['ModulesAndLibraries'],
        ModulesAndLibraries: ['WebScrapingWithPython'],
        WebScrapingWithPython: []
    },

    // Lower Layer: Lessons and Learning Objects
    Lessons: {
        IntroductionToPython: [
            { id: 'LO1_Intro', type: 'Interactive', time: 10, score: 90 },
            { id: 'LO2_Intro', type: 'Video', time: 10, score: 85 }
        ],
        DataTypesAndVariables: [
            { id: 'LO1_DataTypes', type: 'Interactive', time: 15, score: 85 },
            { id: 'LO2_DataTypes', type: 'Video', time: 10, score: 80 }
        ],
        ControlStructures: [
            { id: 'LO1_Control', type: 'Interactive', time: 10, score: 88 },
            { id: 'LO2_Control', type: 'Quiz', time: 5, score: 75 }
        ],
        Functions: [
            { id: 'LO1_Functions', type: 'Video', time: 15, score: 90 },
            { id: 'LO2_Functions', type: 'Exercise', time: 20, score: 95 }
        ],
        ModulesAndLibraries: [
            { id: 'LO1_Modules', type: 'Interactive', time: 20, score: 85 },
            { id: 'LO2_Modules', type: 'Video', time: 15, score: 80 }
        ],
        WebScrapingWithPython: [
            { id: 'LO1_WebScraping', type: 'Video', time: 25, score: 95 },
            { id: 'LO2_WebScraping', type: 'Project', time: 40, score: 100 }
        ]
    }
};

//   -----------------------------------------------------------------------

function selectLearningObjects(learningStyle, LOs) {
    const priority = {
        Visual: ['Video'],
        Kinesthetic: ['Interactive', 'Exercise'],
        Quiz: ['Quiz'],
        Project: ['Project']
    };

    return LOs.filter(lo => priority[learningStyle].includes(lo.type));
}

function findPaths(
    currentTopic,
    goalTopic,
    KG,
    learningStyle,
    timeLimit,
    currentTime = 0,
    currentPath = [],
    currentLOs = [],
    allPaths = []
) {
    const topicLOs = selectLearningObjects(learningStyle, KG.Lessons[currentTopic]);
    const updatedLOs = [...currentLOs, ...topicLOs];

    if (currentTopic === goalTopic) {
        allPaths.push({
            topics: [...currentPath, currentTopic],
            learningObjects: updatedLOs
        });
        return;
    }

    currentPath.push(currentTopic);

    const nextTopics = KG.Topics[currentTopic] || [];
    for (const nextTopic of nextTopics) {
        if (!currentPath.includes(nextTopic)) {
            findPaths(
                nextTopic,
                goalTopic,
                KG,
                learningStyle,
                timeLimit,
                currentTime, [...currentPath],
                updatedLOs,
                allPaths
            );
        }
    }
}

function suggestDailyPlan(paths, timeLimit) {
    const dailyPlan = [];
    let remainingTime = timeLimit;

    paths.forEach(path => {
        const topicPlan = {
            topic: path.topics[0],
            dailyObjects: []
        };

        path.learningObjects.forEach(lo => {
            if (remainingTime >= lo.time) {
                topicPlan.dailyObjects.push(lo);
                remainingTime -= lo.time;
            }
        });

        dailyPlan.push(topicPlan);
    });

    return dailyPlan;
}

// Example Usage
const allPaths = [];
findPaths('IntroductionToPython', 'WebScrapingWithPython', KG, 'Kinesthetic', 60, 0, [], [], allPaths);
console.log('All Paths:', JSON.stringify(allPaths, null, 2));

const dailyPlan = suggestDailyPlan(allPaths, 60);
console.log('Daily Plan:', JSON.stringify(dailyPlan, null, 2));