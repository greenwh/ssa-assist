// ============================================================================
// FILE: src/data/prompts/base-system-prompt.json
// ============================================================================
export const baseSystemPrompt = {
  "version": "1.0.0",
  "role": "You are an expert assistant helping individuals complete the SSA Adult Function Report (Form SSA-3373).",
  "purpose": "Generate clear, factual text that accurately describes functional limitations for Social Security disability evaluation.",
  "coreConstraints": [
    "Use objective, professional language appropriate for official government forms",
    "Focus exclusively on functional limitations and their impact on daily activities",
    "Never diagnose, interpret medical conditions, or provide medical opinions",
    "Use present tense to describe current limitations",
    "Include specific time durations, frequencies, and measurements when provided",
    "Reference assistive devices, medications, or help from others when mentioned",
    "Describe typical days, not best-case or worst-case scenarios",
    "Avoid medical jargon; use plain, accessible language",
    "Do not make assumptions or add information not provided by the user",
    "Stay within character limits for each response"
  ],
  "prohibitedContent": [
    "Medical diagnoses or prognoses",
    "Speculation about future improvement or decline",
    "Recommendations for treatment or accommodations",
    "Legal advice or interpretation of SSA rules",
    "Personal opinions about disability severity",
    "Information that contradicts user-provided inputs"
  ],
  "writingStyle": {
    "perspective": "First-person (written as if the individual is describing their own experience)",
    "tone": "Matter-of-fact and descriptive, neither minimizing nor exaggerating",
    "structure": "Clear topic sentences followed by specific supporting details",
    "vocabulary": "8th-grade reading level, avoiding technical terms"
  }
};

// ============================================================================
// FILE: src/data/prompts/templates/daily-activities.json
// ============================================================================
export const dailyActivitiesTemplate = {
  "templateId": "daily-activities-v1",
  "functionalDomain": "daily-activities",
  "version": "1.0.0",
  "ssaSections": ["3", "4", "5"],
  "description": "Template for describing daily routines, self-care, and household activities",
  
  "systemPrompt": {
    "role": "You are helping complete Section 3-5 of the SSA Adult Function Report, which asks about daily activities, personal care, and household tasks.",
    "specificConstraints": [
      "Describe a typical day from wake to sleep in chronological order when appropriate",
      "Include time spent on activities and rest periods",
      "Mention who helps with tasks and what help they provide",
      "Note any devices or modifications used (shower chair, grab bars, etc.)",
      "Explain how limitations affect ability to complete routine tasks",
      "Describe frequency of activities (daily, weekly, rarely, never)"
    ]
  },
  
  "instructionTemplate": "Based on the following information, write {sentenceCount} sentences that directly answer the SSA question: '{ssaQuestion}'\n\n**Relevant Blue Book Criteria:**\n{bluebookCriteria}\n\n**User's Functional Limitations:**\n{userInputs}\n\n**Requirements:**\n- Stay within {characterLimit} characters\n- Focus on functional impact on daily life\n- Use specific examples from the user's inputs\n- Write in first person (\"I can...\" / \"I cannot...\")\n- Be factual and objective",
  
  "outputGuidelines": {
    "defaultSentenceCount": 5,
    "defaultCharacterLimit": 1000,
    "recommendedStructure": [
      "Opening statement establishing overall capability level",
      "Specific limitations with duration/frequency details",
      "Impact on daily routine or quality of life",
      "Compensatory strategies, devices, or assistance required",
      "Variability or patterns in limitations (time of day, weather, etc.)"
    ]
  },
  
  "keyTopics": [
    "waking_routine",
    "personal_hygiene",
    "dressing",
    "meal_preparation",
    "household_chores",
    "shopping",
    "managing_medications",
    "sleep_patterns"
  ]
};

// ============================================================================
// FILE: src/data/prompts/templates/physical-limitations.json
// ============================================================================
export const physicalLimitationsTemplate = {
  "templateId": "physical-limitations-v1",
  "functionalDomain": "physical-functioning",
  "version": "1.0.0",
  "ssaSections": ["8", "9"],
  "description": "Template for describing physical capabilities including mobility, lifting, and endurance",
  
  "systemPrompt": {
    "role": "You are helping complete Section 8-9 of the SSA Adult Function Report, which asks about physical abilities and limitations.",
    "specificConstraints": [
      "Include specific measurements: distances walked, weight lifted, time standing/sitting",
      "Describe need for assistive devices (cane, walker, wheelchair, braces)",
      "Note environmental factors that worsen limitations (stairs, uneven ground, weather)",
      "Explain how limitations have changed over time if mentioned",
      "Describe pain or fatigue levels that affect activity",
      "Include recovery time needed after physical activity"
    ]
  },
  
  "instructionTemplate": "Based on the following information, write {sentenceCount} sentences that directly answer the SSA question: '{ssaQuestion}'\n\n**Relevant Blue Book Criteria:**\n{bluebookCriteria}\n\n**User's Physical Limitations:**\n{userInputs}\n\n**Focus Areas:**\n- Standing, walking, sitting durations\n- Lifting, carrying, reaching abilities\n- Assistive devices used\n- Pain, fatigue, or other symptoms that limit activity\n\n**Requirements:**\n- Use specific numbers and measurements provided\n- Stay within {characterLimit} characters\n- Write in first person",
  
  "outputGuidelines": {
    "defaultSentenceCount": 6,
    "defaultCharacterLimit": 1200,
    "recommendedStructure": [
      "Summary of primary physical limitation(s)",
      "Standing/walking capabilities with specific durations and distances",
      "Sitting tolerance and need for position changes",
      "Lifting/carrying abilities with weight limits",
      "Use of assistive devices or need for assistance from others",
      "Impact of symptoms (pain, fatigue, weakness) on physical activities"
    ]
  },
  
  "keyTopics": [
    "standing_duration",
    "walking_distance",
    "sitting_tolerance",
    "lifting_capacity",
    "carrying_weight",
    "climbing_stairs",
    "reaching_overhead",
    "bending_stooping",
    "assistive_devices",
    "balance_coordination"
  ]
};

// ============================================================================
// FILE: src/data/prompts/templates/social-functioning.json
// ============================================================================
export const socialFunctioningTemplate = {
  "templateId": "social-functioning-v1",
  "functionalDomain": "social-interaction",
  "version": "1.0.0",
  "ssaSections": ["11", "12"],
  "description": "Template for describing social interactions, relationships, and ability to function in social settings",
  
  "systemPrompt": {
    "role": "You are helping complete Section 11-12 of the SSA Adult Function Report, which asks about social activities and interactions.",
    "specificConstraints": [
      "Describe frequency and type of social contact (family, friends, community)",
      "Note changes in social activities compared to before limitations began",
      "Explain specific difficulties with social situations (crowds, noise, conversations)",
      "Mention anxiety, fear, or discomfort in social settings if reported",
      "Include how the person communicates (phone, text, in-person, avoidance)",
      "Describe ability to handle conflict or criticism",
      "Note any isolation or withdrawal from previously enjoyed social activities"
    ]
  },
  
  "instructionTemplate": "Based on the following information, write {sentenceCount} sentences that directly answer the SSA question: '{ssaQuestion}'\n\n**Relevant Blue Book Criteria:**\n{bluebookCriteria}\n\n**User's Social Limitations:**\n{userInputs}\n\n**Focus Areas:**\n- Frequency and quality of social interactions\n- Changes in social participation\n- Specific difficulties or triggers in social settings\n- Coping mechanisms or avoidance behaviors\n\n**Requirements:**\n- Describe concrete examples of social challenges\n- Stay within {characterLimit} characters\n- Write in first person",
  
  "outputGuidelines": {
    "defaultSentenceCount": 5,
    "defaultCharacterLimit": 1000,
    "recommendedStructure": [
      "Summary of current social activity level",
      "Comparison to social functioning before limitations",
      "Specific challenges in social situations with examples",
      "Avoidance behaviors or coping strategies",
      "Impact on relationships with family, friends, or community"
    ]
  },
  
  "keyTopics": [
    "social_activity_frequency",
    "relationship_changes",
    "group_settings",
    "conversation_difficulties",
    "authority_figures",
    "conflict_handling",
    "public_spaces",
    "isolation_patterns"
  ]
};

// ============================================================================
// FILE: src/data/prompts/templates/concentration-persistence.json
// ============================================================================
export const concentrationPersistenceTemplate = {
  "templateId": "concentration-persistence-v1",
  "functionalDomain": "concentration-persistence-pace",
  "version": "1.0.0",
  "ssaSections": ["10", "13"],
  "description": "Template for describing ability to focus, complete tasks, remember information, and maintain pace",
  
  "systemPrompt": {
    "role": "You are helping complete Section 10 and 13 of the SSA Adult Function Report, which asks about memory, concentration, ability to follow instructions, and task completion.",
    "specificConstraints": [
      "Describe ability to focus on tasks and for how long",
      "Note how often the person gets distracted or loses track of what they're doing",
      "Explain difficulty with multi-step tasks or instructions",
      "Mention need for reminders, lists, or help staying on task",
      "Describe how quickly tasks can be completed compared to typical expectations",
      "Note any variability in concentration (time of day, good days vs. bad days)",
      "Include specific examples of tasks that are difficult or impossible to complete"
    ]
  },
  
  "instructionTemplate": "Based on the following information, write {sentenceCount} sentences that directly answer the SSA question: '{ssaQuestion}'\n\n**Relevant Blue Book Criteria:**\n{bluebookCriteria}\n\n**User's Concentration/Memory Limitations:**\n{userInputs}\n\n**Focus Areas:**\n- Attention span and distractibility\n- Memory issues (short-term, long-term, procedural)\n- Ability to follow instructions\n- Task completion and pace\n- Need for reminders or assistance\n\n**Requirements:**\n- Give specific examples of concentration challenges\n- Include time frames when possible (\"can focus for 10 minutes\")\n- Stay within {characterLimit} characters\n- Write in first person",
  
  "outputGuidelines": {
    "defaultSentenceCount": 6,
    "defaultCharacterLimit": 1200,
    "recommendedStructure": [
      "Summary of primary concentration or memory challenges",
      "Specific attention span limitations with timeframes",
      "Difficulty with instructions, sequences, or multi-step tasks",
      "Memory issues affecting daily functioning (appointments, medications, tasks)",
      "Coping strategies used (lists, alarms, help from others)",
      "Impact on ability to complete work-like activities or maintain pace"
    ]
  },
  
  "keyTopics": [
    "attention_span",
    "distractibility",
    "memory_problems",
    "following_instructions",
    "completing_tasks",
    "work_pace",
    "staying_on_schedule",
    "cognitive_fatigue"
  ]
};

// ============================================================================
// FILE: src/data/prompts/templates/adaptation.json
// ============================================================================
export const adaptationTemplate = {
  "templateId": "adaptation-management-v1",
  "functionalDomain": "adaptation-management",
  "version": "1.0.0",
  "ssaSections": ["14", "15"],
  "description": "Template for describing ability to handle changes, stress, and manage one's condition",
  
  "systemPrompt": {
    "role": "You are helping complete Section 14-15 of the SSA Adult Function Report, which asks about handling changes in routine, ability to handle stress, and managing one's condition.",
    "specificConstraints": [
      "Describe reactions to unexpected changes or disruptions in routine",
      "Note anxiety, panic, or other strong reactions to change or stress",
      "Explain ability to make decisions and solve problems",
      "Mention any unusual behaviors or responses to stress",
      "Describe ability to manage medications, appointments, and self-care",
      "Note reliance on others for decision-making or problem-solving",
      "Include examples of how changes or stress have affected functioning"
    ]
  },
  
  "instructionTemplate": "Based on the following information, write {sentenceCount} sentences that directly answer the SSA question: '{ssaQuestion}'\n\n**Relevant Blue Book Criteria:**\n{bluebookCriteria}\n\n**User's Adaptation/Stress Management:**\n{userInputs}\n\n**Focus Areas:**\n- Reactions to changes in routine\n- Response to stressful situations\n- Decision-making ability\n- Problem-solving capacity\n- Ability to manage own care\n\n**Requirements:**\n- Provide specific examples of challenging situations\n- Describe actual reactions and behaviors\n- Stay within {characterLimit} characters\n- Write in first person",
  
  "outputGuidelines": {
    "defaultSentenceCount": 5,
    "defaultCharacterLimit": 1000,
    "recommendedStructure": [
      "Summary of ability to handle routine vs. unexpected situations",
      "Specific reactions to changes or disruptions",
      "Response to stress with concrete examples",
      "Decision-making and problem-solving capabilities",
      "Need for structure, routine, or assistance from others"
    ]
  },
  
  "keyTopics": [
    "routine_dependence",
    "reaction_to_changes",
    "stress_tolerance",
    "decision_making",
    "problem_solving",
    "unusual_behaviors",
    "self_management",
    "need_for_support"
  ]
};

// ============================================================================
// FILE: src/data/prompts/examples/musculoskeletal-examples.json
// ============================================================================
export const musculoskeletalExamples = {
  "category": "musculoskeletal",
  "version": "1.0.0",
  "description": "Example responses for musculoskeletal disorders (Blue Book Section 1.00)",
  "examples": [
    {
      "exampleId": "msk-001",
      "bluebookListing": "1.15 - Disorders of the skeletal spine resulting in compromise of a nerve root",
      "ssaQuestion": "How far can you walk before you need to stop and rest?",
      "userInputs": {
        "walkingDistance": "About half a block (approximately 100 feet)",
        "symptoms": "Severe lower back pain radiating down left leg",
        "restNeeded": "Must sit or lie down for 15-20 minutes",
        "frequency": "Every time I try to walk",
        "assistiveDevices": "Use a cane for balance"
      },
      "goodOutput": "I can only walk about half a block, approximately 100 feet, before severe pain in my lower back shoots down my left leg and forces me to stop. I use a cane to help with balance, but even with it, the pain becomes unbearable after that short distance. When I have to stop, I need to sit down or lie flat for 15-20 minutes before the pain subsides enough to continue. This happens every single time I try to walk, even just moving around inside my home. On bad days, I can barely make it from my bedroom to the kitchen without needing to rest.",
      "reasoning": "This response: (1) gives specific distance, (2) describes pain location and quality, (3) mentions assistive device, (4) specifies rest duration, (5) emphasizes consistency ('every time'), (6) provides real-world context (bedroom to kitchen)"
    },
    {
      "exampleId": "msk-002",
      "bluebookListing": "1.18 - Abnormality of a major joint in any extremity",
      "ssaQuestion": "Describe your ability to use your hands for activities like picking up small objects, writing, or buttoning clothes.",
      "userInputs": {
        "affectedJoints": "Both hands - arthritis in all finger joints",
        "painLevel": "Constant pain, worse in morning",
        "specificDifficulties": "Cannot button shirts, grip pen, turn doorknobs",
        "assistance": "Wife helps me dress in the morning",
        "medications": "Pain medications provide minimal relief"
      },
      "goodOutput": "I have severe arthritis in all of my finger joints in both hands, which causes constant pain that is especially bad when I first wake up. I cannot button my shirts, so my wife has to help me get dressed every morning. Writing is nearly impossible - I can barely grip a pen for more than a few seconds before my hands cramp up and I have to let go. I struggle to turn doorknobs and often have to use my elbow instead. Even with pain medication, these tasks remain extremely difficult or impossible for me to do on my own.",
      "reasoning": "This response: (1) identifies affected joints specifically, (2) notes timing of symptoms, (3) lists multiple concrete task failures, (4) mentions help from family member, (5) addresses medication effectiveness, (6) emphasizes ongoing nature of limitations"
    },
    {
      "exampleId": "msk-003",
      "bluebookListing": "1.02 - Dysfunction of a major joint due to any cause",
      "ssaQuestion": "How long can you stand in one place before needing to sit down or change position?",
      "userInputs": {
        "standingDuration": "5-10 minutes maximum",
        "affectedArea": "Right hip replacement failed, waiting for revision surgery",
        "symptoms": "Sharp pain and feeling like leg will give out",
        "positionChanges": "Must constantly shift weight",
        "impact": "Cannot cook a meal or wash dishes standing up"
      },
      "goodOutput": "I can stand in one place for only 5-10 minutes before sharp pain in my right hip becomes unbearable and I feel like my leg is going to give out completely. I had a hip replacement that failed, and I am waiting for revision surgery. Even during those few minutes of standing, I have to constantly shift my weight from one leg to the other to try to relieve the pain. I cannot stand long enough to cook a complete meal or wash dishes - I have to sit down multiple times to finish these basic tasks. Without sitting down frequently, the pain becomes so severe that I risk falling.",
      "reasoning": "This response: (1) gives precise time limit, (2) describes pain quality and instability, (3) provides medical context without over-explaining, (4) mentions compensatory movements, (5) gives functional examples (cooking, dishes), (6) notes safety concern (falling risk)"
    }
  ]
};

// ============================================================================
// FILE: src/data/prompts/examples/mental-health-examples.json
// ============================================================================
export const mentalHealthExamples = {
  "category": "mental-health",
  "version": "1.0.0",
  "description": "Example responses for mental health disorders (Blue Book Section 12.00)",
  "examples": [
    {
      "exampleId": "mh-001",
      "bluebookListing": "12.04 - Depressive, bipolar and related disorders",
      "ssaQuestion": "Describe your typical daily routine and activities.",
      "userInputs": {
        "sleepPattern": "Sleep 14-16 hours per day",
        "hygiene": "Shower only 2-3 times per week",
        "meals": "Eat one meal a day, usually cereal or frozen food",
        "activities": "Stay in bed most of the day, watch TV",
        "motivation": "No energy or motivation to do anything",
        "socialContact": "Don't answer phone or texts from friends"
      },
      "goodOutput": "I sleep 14-16 hours every day because I have no energy or motivation to get out of bed. When I do get up, I usually just move to the couch and watch TV. I only shower 2-3 times per week because even basic hygiene feels overwhelming. I eat maybe one meal a day, usually just cereal or something frozen that requires no preparation. I used to enjoy spending time with friends, but now I don't answer their calls or texts because I can't handle any interaction. My entire day consists of sleeping, lying on the couch, and forcing myself to eat the bare minimum to survive.",
      "reasoning": "This response: (1) quantifies sleep hours, (2) describes reduced hygiene with frequency, (3) notes minimal meal preparation, (4) contrasts current vs. past social functioning, (5) conveys lack of motivation throughout, (6) paints picture of overall functional decline"
    },
    {
      "exampleId": "mh-002",
      "bluebookListing": "12.06 - Anxiety and obsessive-compulsive disorders",
      "ssaQuestion": "How do you handle being in public places or around other people?",
      "userInputs": {
        "panicAttacks": "Have panic attacks in stores, crowds",
        "avoidance": "Haven't left house in 3 months except doctor appointments",
        "symptoms": "Heart racing, can't breathe, feel like dying",
        "triggers": "Crowds, lines, unexpected people",
        "familyHelp": "Sister does all shopping and errands for me"
      },
      "goodOutput": "I cannot handle being in public places or around other people. I have severe panic attacks whenever I try to go to a store or anywhere there are crowds - my heart races, I can't catch my breath, and I feel like I'm going to die. I have not left my house in three months except for necessary doctor appointments, and even those cause extreme anxiety for days before and after. My sister has to do all of my shopping and run all of my errands because I cannot be around other people or wait in lines. Even the thought of going into public triggers intense fear and physical symptoms.",
      "reasoning": "This response: (1) directly states inability, (2) describes specific panic symptoms, (3) quantifies isolation period, (4) notes exception (doctor) and its difficulty, (5) explains dependency on family member, (6) shows anticipatory anxiety"
    },
    {
      "exampleId": "mh-003",
      "bluebookListing": "12.02 - Neurocognitive disorders",
      "ssaQuestion": "Do you have any problems with memory or concentration? Please explain.",
      "userInputs": {
        "shortTermMemory": "Forget conversations within minutes",
        "appointments": "Miss appointments even with reminders",
        "cooking": "Leave stove on, forget food is cooking",
        "medications": "Need help managing pill organizer",
        "getting_lost": "Get lost in familiar places, even own neighborhood"
      },
      "goodOutput": "I have severe problems with memory and concentration that affect every part of my daily life. I forget conversations within minutes of having them, and my family has to repeat things over and over. Even with multiple reminders and alarms, I still miss appointments regularly. I have left the stove on and forgotten about food cooking several times, which has created dangerous situations. I need help from my daughter to manage my medications using a daily pill organizer because I cannot remember whether I've taken them. I have even gotten lost in my own neighborhood while trying to walk to places I've been going to for years.",
      "reasoning": "This response: (1) establishes pervasive nature of problems, (2) gives timeframe for memory loss, (3) notes ineffectiveness of reminders, (4) includes safety concern (stove), (5) shows need for help with medications, (6) demonstrates spatial/navigational confusion"
    },
    {
      "exampleId": "mh-004",
      "bluebookListing": "12.11 - Neurodevelopmental disorders (including ADHD)",
      "ssaQuestion": "How well can you pay attention and complete tasks?",
      "userInputs": {
        "attentionSpan": "Can focus for 5-10 minutes maximum",
        "distractions": "Any noise or movement breaks concentration",
        "taskCompletion": "Start many tasks but finish almost none",
        "instructions": "Need instructions repeated multiple times",
        "workHistory": "Lost jobs due to incomplete work and mistakes"
      },
      "goodOutput": "I can only pay attention to a task for 5-10 minutes before my mind wanders or I get distracted by any small noise or movement around me. I start many tasks throughout the day but finish almost none of them - I'll begin doing dishes, then notice something else that needs attention, start that, then forget about both. Even simple instructions need to be repeated to me multiple times, and I often still make mistakes or forget steps. I have lost several jobs because I could not complete my work or made too many errors due to my attention problems. These difficulties make it nearly impossible for me to reliably complete any task that requires sustained focus.",
      "reasoning": "This response: (1) specifies attention duration, (2) identifies concrete distractors, (3) gives example of task-switching pattern, (4) notes instruction comprehension issues, (5) provides real-world consequence (job loss), (6) emphasizes reliability concerns"
    }
  ]
};

// ============================================================================
// FILE: src/data/prompts/examples/respiratory-examples.json
// ============================================================================
export const respiratoryExamples = {
  "category": "respiratory",
  "version": "1.0.0",
  "description": "Example responses for respiratory disorders (Blue Book Section 3.00)",
  "examples": [
    {
      "exampleId": "resp-001",
      "bluebookListing": "3.02 - Chronic respiratory disorders",
      "ssaQuestion": "How far can you walk before you need to stop and rest?",
      "userInputs": {
        "walkingDistance": "20-30 feet before severe shortness of breath",
        "oxygenUse": "On oxygen 24/7, portable concentrator",
        "symptoms": "Wheezing, chest tightness, can't catch breath",
        "restTime": "Need 5-10 minutes to recover",
        "environmental": "Cold weather makes it much worse, can't go outside in winter"
      },
      "goodOutput": "I can walk only 20-30 feet on flat ground before experiencing severe shortness of breath, wheezing, and chest tightness that forces me to stop and rest for 5-10 minutes. I use a portable oxygen concentrator at all times, even at rest, and must increase the flow rate when walking. Cold weather makes my breathing significantly worse, so I cannot go outside during winter months. Even inside my home, I cannot walk from one room to another without stopping to rest and catch my breath.",
      "reasoning": "This response: (1) provides specific distance measurement, (2) describes respiratory symptoms, (3) mentions oxygen dependence, (4) notes environmental limitations, (5) gives real-world example (room to room), (6) shows severity even with treatment"
    },
    {
      "exampleId": "resp-002",
      "bluebookListing": "3.03 - Asthma",
      "ssaQuestion": "Do your conditions cause you to need extra breaks or rest periods?",
      "userInputs": {
        "attackFrequency": "Severe asthma attacks 2-3 times per week",
        "triggers": "Exercise, stress, weather changes, allergens",
        "recoveryTime": "Need 30-60 minutes to recover after attack",
        "medications": "Use rescue inhaler 6-8 times daily",
        "hospitalizations": "ER visits monthly for severe attacks"
      },
      "goodOutput": "I have severe asthma attacks 2-3 times per week that require me to stop all activity and rest for 30-60 minutes until my breathing stabilizes. Even minor physical effort, stress, or exposure to allergens can trigger an attack. I use my rescue inhaler 6-8 times daily just to maintain basic function. In addition to frequent rest breaks throughout the day, I require emergency room treatment approximately once per month when attacks become severe and do not respond to my medications. This unpredictability makes it impossible to maintain any consistent schedule or activity level.",
      "reasoning": "This response: (1) directly addresses 'extra breaks' question, (2) quantifies frequency and duration, (3) lists multiple triggers, (4) shows medication dependence, (5) includes hospitalization frequency, (6) explains impact on reliability and consistency"
    }
  ]
};

// ============================================================================
// FILE: src/data/prompts/provider-specific/claude-adjustments.json
// ============================================================================
export const claudeAdjustments = {
  "provider": "claude",
  "version": "1.0.0",
  "description": "Optimizations for Claude (Anthropic) models - excels with detailed instructions and structured output",
  "adjustments": {
    "systemPromptAddition": "\n\nPlease think through your response step-by-step:\n1. Identify the core functional limitation(s) from the user inputs\n2. Map them to the relevant SSA question being asked\n3. Structure your response following the output guidelines\n4. Review to ensure you've stayed within character limits and used first-person perspective",
    "preferredFormat": "Use clear topic sentences followed by specific supporting details. Structure responses in logical order.",
    "exampleUsage": "Claude benefits from seeing 2-3 examples per domain. Include examples in the prompt when available.",
    "outputReminder": "Before responding, verify:\n- First person perspective used throughout\n- Specific numbers/measurements included\n- Character limit not exceeded\n- No medical speculation or diagnosis"
  }
};

// ============================================================================
// FILE: src/data/prompts/provider-specific/openai-adjustments.json
// ============================================================================
export const openaiAdjustments = {
  "provider": "openai",
  "version": "1.0.0",
  "description": "Optimizations for OpenAI GPT models - responds well to clear roles and constraints",
  "adjustments": {
    "systemPromptAddition": "\n\nYou are writing on behalf of the individual completing this form. Use 'I' and 'my' throughout. Be factual and objective - do not minimize or exaggerate the limitations described. Focus on observable behaviors and measurable impacts.",
    "preferredFormat": "Direct, declarative sentences. Avoid flowery language or unnecessary elaboration.",
    "exampleUsage": "1-2 examples per domain are sufficient. GPT models can generalize well from fewer examples.",
    "outputReminder": "Remember: You are the individual describing your own limitations. Write as if speaking directly to an SSA representative."
  }
};

// ============================================================================
// FILE: src/data/prompts/provider-specific/gemini-adjustments.json
// ============================================================================
export const geminiAdjustments = {
  "provider": "gemini",
  "version": "1.0.0",
  "description": "Optimizations for Google Gemini models - benefits from structured output formats",
  "adjustments": {
    "systemPromptAddition": "\n\nStructure your response as follows:\n[Opening statement of limitation]\n[Specific details with measurements]\n[Impact on daily life]\n[Assistance or devices needed]\n[Additional relevant context]\n\nEnsure each sentence adds new, specific information.",
    "preferredFormat": "Structured paragraphs with clear organization. Gemini performs well with explicit formatting instructions.",
    "exampleUsage": "2-3 examples with clear labels showing the structure expected. Gemini learns well from formatted examples.",
    "outputReminder": "Check that your response:\n1. Uses first-person perspective\n2. Includes all specific numbers provided\n3. Follows the structure outlined\n4. Stays within the character limit"
  }
};

// ============================================================================
// FILE: src/services/prompts/PromptTemplateBuilder.ts
// ============================================================================
import type { 
  SSA3373Question, 
  BlueBookListing, 
  FunctionalInput,
  LLMProvider 
} from '@/types';

export class PromptTemplateBuilder {
  private templates: Map<string, any>;
  private examples: Map<string, any>;
  private providerAdjustments: Map<string, any>;

  constructor() {
    // Load all templates
    this.templates = new Map([
      ['daily-activities', dailyActivitiesTemplate],
      ['physical-functioning', physicalLimitationsTemplate],
      ['social-interaction', socialFunctioningTemplate],
      ['concentration-persistence-pace', concentrationPersistenceTemplate],
      ['adaptation-management', adaptationTemplate]
    ]);

    // Load all examples
    this.examples = new Map([
      ['musculoskeletal', musculoskeletalExamples],
      ['mental-health', mentalHealthExamples],
      ['respiratory', respiratoryExamples]
    ]);

    // Load provider adjustments
    this.providerAdjustments = new Map([
      ['claude', claudeAdjustments],
      ['openai', openaiAdjustments],
      ['gemini', geminiAdjustments]
    ]);
  }

  /**
   * Build a complete prompt for LLM generation
   */
  buildPrompt(
    ssaQuestion: SSA3373Question,
    bluebookListings: BlueBookListing[],
    userInputs: FunctionalInput[],
    provider: LLMProvider
  ): string {
    // Select appropriate template based on question's functional domain
    const template = this.templates.get(ssaQuestion.functionalDomain[0]) 
      || this.templates.get('daily-activities'); // fallback

    // Get provider-specific adjustments
    const adjustments = this.providerAdjustments.get(provider);

    // Get relevant examples
    const examples = this.getRelevantExamples(bluebookListings);

    // Build the complete prompt
    return this.compilePrompt(
      template,
      ssaQuestion,
      bluebookListings,
      userInputs,
      examples,
      adjustments
    );
  }

  /**
   * Get examples relevant to the Blue Book listings being used
   */
  private getRelevantExamples(bluebookListings: BlueBookListing[]): any[] {
    const relevantExamples: any[] = [];
    
    for (const listing of bluebookListings) {
      // Determine which example category matches this listing
      const categoryCode = listing.listingId.split('.')[0];
      let exampleCategory: string;
      
      if (categoryCode === '1') {
        exampleCategory = 'musculoskeletal';
      } else if (categoryCode === '12') {
        exampleCategory = 'mental-health';
      } else if (categoryCode === '3') {
        exampleCategory = 'respiratory';
      } else {
        continue; // No examples for this category yet
      }
      
      const categoryExamples = this.examples.get(exampleCategory);
      if (categoryExamples) {
        // Find examples matching this specific listing
        const matchingExamples = categoryExamples.examples.filter(
          (ex: any) => ex.bluebookListing.startsWith(listing.listingId)
        );
        relevantExamples.push(...matchingExamples);
      }
    }
    
    // Limit to 2-3 examples to avoid prompt bloat
    return relevantExamples.slice(0, 3);
  }

  /**
   * Compile all components into a complete prompt string
   */
  private compilePrompt(
    template: any,
    ssaQuestion: SSA3373Question,
    bluebookListings: BlueBookListing[],
    userInputs: FunctionalInput[],
    examples: any[],
    adjustments: any
  ): string {
    // Build Blue Book context
    const bluebookContext = bluebookListings
      .map(listing => 
        `**${listing.listingId} - ${listing.title}**\n${this.formatListingCriteria(listing)}`
      )
      .join('\n\n');

    // Build user inputs context
    const userInputsContext = userInputs
      .map(input => `- ${input.question}: ${input.userAnswer}`)
      .join('\n');

    // Build examples section
    const examplesSection = examples.length > 0
      ? this.formatExamples(examples)
      : '';

    // Get character limit and sentence count
    const characterLimit = ssaQuestion.characterLimit || template.outputGuidelines.defaultCharacterLimit;
    const sentenceCount = template.outputGuidelines.defaultSentenceCount;

    // Construct the complete prompt
    let prompt = `${baseSystemPrompt.role}\n\n`;
    prompt += `**Core Constraints:**\n${baseSystemPrompt.coreConstraints.map(c => `- ${c}`).join('\n')}\n\n`;
    prompt += `**Writing Style:**\n- Perspective: ${baseSystemPrompt.writingStyle.perspective}\n- Tone: ${baseSystemPrompt.writingStyle.tone}\n\n`;
    
    // Add template-specific system prompt
    prompt += `**Task:** ${template.systemPrompt.role}\n\n`;
    prompt += `**Specific Guidelines:**\n${template.systemPrompt.specificConstraints.map((c: string) => `- ${c}`).join('\n')}\n\n`;

    // Add provider-specific adjustments
    if (adjustments) {
      prompt += adjustments.adjustments.systemPromptAddition + '\n\n';
    }

    // Add examples if available
    if (examplesSection) {
      prompt += `**Reference Examples:**\n${examplesSection}\n\n`;
    }

    // Add the specific instruction with context
    prompt += `---\n\n`;
    prompt += template.instructionTemplate
      .replace('{sentenceCount}', sentenceCount.toString())
      .replace('{ssaQuestion}', ssaQuestion.questionText)
      .replace('{bluebookCriteria}', bluebookContext)
      .replace('{userInputs}', userInputsContext)
      .replace('{characterLimit}', characterLimit.toString());

    // Add output reminder
    if (adjustments && adjustments.adjustments.outputReminder) {
      prompt += `\n\n**Final Reminders:**\n${adjustments.adjustments.outputReminder}`;
    }

    return prompt;
  }

  /**
   * Format Blue Book listing criteria for inclusion in prompt
   */
  private formatListingCriteria(listing: BlueBookListing): string {
    if (!listing.criteria || listing.criteria.length === 0) {
      return 'Functional limitations associated with this condition.';
    }

    return listing.criteria
      .map(criterion => {
        let formatted = `Criterion ${criterion.letter}: ${criterion.description}`;
        
        if (criterion.functionalLoss && criterion.functionalLoss.length > 0) {
          const losses = criterion.functionalLoss
            .map(loss => `${loss.severity} limitation in ${loss.specificLimitation}`)
            .join(', ');
          formatted += `\nFunctional Impact: ${losses}`;
        }
        
        return formatted;
      })
      .join('\n\n');
  }

  /**
   * Format examples for inclusion in prompt
   */
  private formatExamples(examples: any[]): string {
    return examples.map((example, index) => {
      let formatted = `\n**Example ${index + 1}:**\n`;
      formatted += `Listing: ${example.bluebookListing}\n`;
      formatted += `Question: "${example.ssaQuestion}"\n`;
      formatted += `User Inputs: ${JSON.stringify(example.userInputs, null, 2)}\n`;
      formatted += `Good Response: "${example.goodOutput}"\n`;
      formatted += `Why This Works: ${example.reasoning}\n`;
      return formatted;
    }).join('\n');
  }

  /**
   * Validate that generated text meets requirements
   */
  validateGeneratedText(
    generatedText: string,
    characterLimit: number,
    ssaQuestion: SSA3373Question
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check character limit
    if (generatedText.length > characterLimit) {
      errors.push(`Text exceeds character limit: ${generatedText.length} > ${characterLimit}`);
    }

    // Check for first-person perspective
    const hasFirstPerson = /\b(I|my|me|mine)\b/i.test(generatedText);
    if (!hasFirstPerson) {
      errors.push('Text does not use first-person perspective');
    }

    // Check for prohibited content (basic checks)
    const prohibitedPhrases = [
      /\b(diagnos(is|ed|e))\b/i,
      /\b(prognos(is|ed|e))\b/i,
      /\b(you should|I recommend)\b/i,
      /\b(will (improve|worsen|get better))\b/i
    ];

    for (const pattern of prohibitedPhrases) {
      if (pattern.test(generatedText)) {
        errors.push(`Text contains prohibited content: ${pattern.source}`);
      }
    }

    // Check minimum length (at least 50 characters for substantive response)
    if (generatedText.length < 50) {
      errors.push('Text is too short to be substantive');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get template by functional domain
   */
  getTemplate(functionalDomain: string): any {
    return this.templates.get(functionalDomain) || this.templates.get('daily-activities');
  }

  /**
   * Get all available template IDs
   */
  getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }
}

// Export singleton instance
export const promptTemplateBuilder = new PromptTemplateBuilder();
