const SERVER_URL = process.env.TEST_SERVER_URL || 'http://localhost:3000';

async function testSyllabusAndChat() {
  console.log('Testing Syllabus Parsing & Conversational Chatbot APIs...');

  // 1. Test Syllabus Parsing
  const syllabusRes = await fetch(`${SERVER_URL}/api/syllabus/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      raw_text: 'CS301: Operating Systems\nUnit 1: Process Scheduling\nUnit 2: Virtual Memory\n\nCS302: Computer Networks\nUnit 1: Transport Layer TCP/UDP',
    }),
  });

  const syllabusData = await syllabusRes.json();
  if (!syllabusData.success || syllabusData.subjects.length < 2) {
    throw new Error(`Syllabus parsing failed: ${JSON.stringify(syllabusData)}`);
  }
  console.log('✓ Syllabus Parser: successfully extracted', syllabusData.subjects.length, 'subjects.');

  // 2. Test Chatbot Study Unit Roadmap
  const chatRes = await fetch(`${SERVER_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Study Unit: CS301 Operating Systems - Virtual Memory',
      proficiency: 'Intermediate',
      learning_goal: 'Pass exam',
      prompt_version: 'v3',
    }),
  });

  const chatData = await chatRes.json();
  if (!chatData.success || !chatData.recommendationRun) {
    throw new Error(`Chat roadmap failed: ${JSON.stringify(chatData)}`);
  }

  // Verify all 5 stages completed
  const inProgressStages = chatData.stages.filter((s) => s.status !== 'completed');
  if (inProgressStages.length > 0) {
    throw new Error(`Stages not completed: ${JSON.stringify(inProgressStages)}`);
  }
  console.log('✓ Chatbot Roadmap: generated verified resources with all 5 stages completed (0 stuck in progress).');

  // 3. Test Chatbot Conversational Follow-up
  const followUpRes = await fetch(`${SERVER_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Can you give me a summary of how TLBs work in virtual memory?',
    }),
  });

  const followUpData = await followUpRes.json();
  if (!followUpData.success || !followUpData.reply) {
    throw new Error(`Chat follow-up failed: ${JSON.stringify(followUpData)}`);
  }
  console.log('✓ Chatbot Conversational Follow-up: responded cleanly.');

  console.log('\nAll Syllabus & Chat tests passed successfully!');
}

testSyllabusAndChat().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

