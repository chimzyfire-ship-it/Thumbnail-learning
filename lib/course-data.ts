export type Topic = {
  id: string;
  number: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  videoUrl?: string;
  cheatSheetHtml?: string;
};

export type Module = {
  id: string;
  title: string;
  topics: Topic[];
};

export type Tier = {
  id: string;
  title: string;
  focus: string;
  modules: Module[];
};

export const courseData: Tier[] = [
  {
    id: "tier-1",
    title: "Tier 1: The Basics (Beginner)",
    focus: "Getting comfortable, dropping the fear, and using AI to solve everyday problems fast.",
    modules: [
      {
        id: "module-a",
        title: "Module A: Talking to AI the Right Way",
        topics: [
          { 
            id: "topic-1", 
            number: 1, 
            title: "The Power of Screenshots", 
            description: "How to take a picture of your screen and show it to AI so it understands exactly what you need.", 
            progress: 100, 
            completed: true,
            cheatSheetHtml: `<div class="space-y-10 text-gray-300">
  <div class="border-b border-gray-800 pb-6">
    <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-4 tracking-tight">The Screenshot Superpower</h2>
    <p class="text-lg leading-relaxed text-gray-400">Typing out a tech problem is a waste of your time. Modern AI doesn't just read—it <strong class="text-teal-300">sees</strong>. By uploading a picture, you bypass the hardest part of problem-solving: explaining the problem. This Lab Note is your ultimate cheat sheet for using images to force the AI to do the heavy lifting.</p>
  </div>
  <div>
    <h3 class="text-xl font-bold text-teal-400 mb-4 flex items-center">
      <span class="bg-teal-900/50 text-teal-300 p-2 rounded-lg mr-3 border border-teal-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </span>
      The S.U.C. Framework
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all">
        <div class="text-2xl font-black text-teal-500 mb-2">1. Snap</div>
        <p class="text-sm text-gray-400">Capture the exact error on your screen, or take a clear photo of the physical document or broken item in front of you.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all">
        <div class="text-2xl font-black text-teal-500 mb-2">2. Upload</div>
        <p class="text-sm text-gray-400">Drop the image directly into your AI chat box. (Works on both mobile and laptop).</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all">
        <div class="text-2xl font-black text-teal-500 mb-2">3. Command</div>
        <p class="text-sm text-gray-400">Add a simple 1-sentence instruction. Tell it what you want it to do with the image. Never leave the text box blank.</p>
      </div>
    </div>
  </div>
  <div>
    <h3 class="text-2xl font-bold text-white mb-2">The Prompt Vault</h3>
    <p class="text-sm text-gray-400 mb-6">Copy and paste these exact templates alongside your images to get instant results.</p>
    <div class="space-y-5">
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-teal-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-teal-400 uppercase font-bold tracking-widest bg-teal-900/30 px-2 py-1 rounded">Digital Dashboards & Apps</span>
        </div>
        <p class="text-white italic text-lg leading-relaxed mb-3">"I am looking at this screen and I am completely stuck. Based on this picture, exactly which button should I click next to achieve [insert your goal]?"</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> Facebook Ads Manager, confusing bank apps, software setup.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-cyan-400 uppercase font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded">The Physical World</span>
        </div>
        <p class="text-white italic text-lg leading-relaxed mb-3">"Look at this photo. This [insert item, e.g., generator / car dashboard] is making a weird noise and showing this error. Explain what is broken in very simple English, and tell me the first thing I should do to fix it."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> Mechanical faults, blinking router lights, home appliances.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-blue-400 uppercase font-bold tracking-widest bg-blue-900/30 px-2 py-1 rounded">Paperwork & Documents</span>
        </div>
        <p class="text-white italic text-lg leading-relaxed mb-3">"Read this physical document. Extract all the important numbers and dates, and rewrite the main point of this paper as a 3-bullet-point summary so a 10-year-old can understand it."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> Tenancy agreements, tax letters, messy handwritten receipts from the market.</p>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    <div class="bg-orange-900/20 p-5 rounded-xl border border-orange-800/50">
      <h4 class="text-orange-400 font-bold mb-2 flex items-center text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> The Privacy Rule
      </h4>
      <p class="text-sm text-orange-200/80 leading-relaxed">
        AI saves what you upload. <strong>Never</strong> upload a raw screenshot of your bank account balance, your BVN, your passwords, or your customers' private phone numbers. Always use your phone's photo editor to scribble over sensitive numbers before you upload the image.
      </p>
    </div>
    <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
      <h4 class="text-gray-200 font-bold mb-2 flex items-center text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Quick Fixes
      </h4>
      <ul class="text-sm text-gray-400 space-y-2">
        <li><strong class="text-white">"AI says it can't read the text"</strong>: Your image is too blurry. Wipe your camera lens or zoom in and snap again.</li>
        <li><strong class="text-white">"AI gives a generic answer"</strong>: You didn't give it a command. Don't just upload the picture—tell it <em>why</em> you uploaded it.</li>
      </ul>
    </div>
  </div>
  <div class="bg-gradient-to-br from-teal-900/40 to-gray-900 p-6 rounded-2xl border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)] mt-8">
    <div class="flex items-center space-x-3 mb-4 border-b border-teal-800/50 pb-3">
      <div class="bg-teal-500 text-gray-900 font-extrabold px-3 py-1 rounded text-sm uppercase tracking-widest shadow-lg">Live Mission</div>
      <h3 class="text-2xl font-bold text-teal-300">Test Your Superpower</h3>
    </div>
    <p class="text-teal-50 leading-relaxed mb-5 text-lg">Knowledge is useless without execution. Let's do this right now.</p>
    <div class="space-y-4 text-teal-100 font-medium">
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
        <p class="pt-1">Take a picture of something confusing in your room right now (a label on a product, a gadget's remote control, or a messy drawer).</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
        <p class="pt-1">Upload it to your AI.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
        <p class="pt-1">Paste this exact text: <strong class="text-white bg-black/30 px-2 py-1 rounded">"Look at this image. Tell me 3 interesting or useful things I can do with what is in this picture."</strong></p>
      </div>
    </div>
  </div>
</div>
`
          },
          { 
            id: "topic-2", 
            number: 2, 
            title: "Asking the Right Questions", 
            description: "How to ask for exactly what you want without typing too much.", 
            progress: 100, 
            completed: true,
            cheatSheetHtml: `<div class="space-y-10 text-gray-300">
  
  <div class="border-b border-gray-800 pb-6">
    <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-4 tracking-tight">
      The "Market List" Framework
    </h2>
    <p class="text-lg leading-relaxed text-gray-400">
      Sending AI a lazy prompt like <em>"write an email"</em> is like sending someone to the market with ₦50,000 but no list. You won't get what you actually want. AI is not a mind reader; it is an eager assistant. To get perfect results without typing long, stressful paragraphs, you must master the <strong>Thumbnail Formula: Who, What, How.</strong>
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-red-900/20 p-5 rounded-xl border border-red-800/50">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-red-400 font-bold text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> The Lazy Way</span>
      </div>
      <p class="text-sm text-gray-400 mb-3 italic">
        "Write a message to a customer who owes me money."
      </p>
      <div class="bg-black/30 p-2 rounded text-xs text-red-200/70 border-l-2 border-red-800">
        <strong>Result:</strong> A robotic, aggressive message that sounds like it came from a debt collection agency and ruins your relationship with the customer.
      </div>
    </div>
    
    <div class="bg-teal-900/20 p-5 rounded-xl border border-teal-800/50">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-teal-400 font-bold text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-teal-500"><path d="M20 6 9 17l-5-5"/></svg> The Thumbnail Way</span>
      </div>
      <p class="text-sm text-gray-400 mb-3 italic">
        "Act as a friendly business owner. Write a WhatsApp DM to a loyal customer who owes ₦150k. Ask for the money politely but firmly so I can restock. Keep it short, warm, and no big grammar."
      </p>
      <div class="bg-black/30 p-2 rounded text-xs text-teal-200/70 border-l-2 border-teal-800">
        <strong>Result:</strong> A perfect, human-sounding message you can copy, paste, and send immediately.
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-xl font-bold text-teal-400 mb-4 flex items-center">
      <span class="bg-teal-900/50 text-teal-300 p-2 rounded-lg mr-3 border border-teal-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      </span>
      The 3 Pillars of a Perfect Prompt
    </h3>
    <div class="space-y-4">
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">1</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">WHO (Set the Stage)</h4>
          <p class="text-sm text-gray-400">Give the AI a role. Tell it exactly who it is pretending to be and who it is talking to. <em>(e.g., "Act as an expert accountant explaining taxes to a beginner.")</em></p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">2</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">WHAT (The Exact Goal)</h4>
          <p class="text-sm text-gray-400">Give it the facts. State the specific problem or desired outcome so the AI doesn't have to invent lies. <em>(e.g., "I need a 3-day workout plan because I want to lose weight.")</em></p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">3</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">HOW (Build Fences)</h4>
          <p class="text-sm text-gray-400">Set the tone and put up fences. Tell it what <strong>not</strong> to do. <em>(e.g., "Keep it under 3 paragraphs, do not use corporate jargon, and format it as bullet points.")</em></p>
        </div>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-2">The Prompt Vault</h3>
    <p class="text-sm text-gray-400 mb-6">Fill in the brackets and use these templates to get exactly what you want.</p>
    
    <div class="space-y-5">
      
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-teal-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-teal-400 uppercase font-bold tracking-widest bg-teal-900/30 px-2 py-1 rounded">Customer Crisis Control</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "Act as the manager of a [insert your business type]. Write a WhatsApp DM to a customer who is angry because [insert what went wrong]. Assure them we are fixing it by [insert your solution]. Keep it under 4 sentences. Make the tone deeply apologetic and respectful. Do not use corporate jargon."
        </p>
      </div>

      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-cyan-400 uppercase font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded">The Brainstorm Engine</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "Act as a brilliant business strategist in Nigeria. I want to start a [insert business idea], but I only have [insert your budget/resources]. Give me 5 highly creative, low-cost ways to get my first 10 paying customers. Do not suggest running paid ads. Format the answer as a simple, actionable list."
        </p>
      </div>

      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-blue-400 uppercase font-bold tracking-widest bg-blue-900/30 px-2 py-1 rounded">The "Explain Like I'm 5" Method</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "Act as a friendly, patient teacher. I am completely new to [insert topic, e.g., real estate investing]. Explain the absolute basics to me using simple, everyday analogies like going to the market. Stop frequently to check if I understand. Do not use any technical words without explaining them first."
        </p>
      </div>

    </div>
  </div>

  <div class="bg-blue-900/20 border-l-4 border-blue-500 p-5 rounded-r-xl mt-8">
    <h4 class="text-blue-400 font-bold mb-2 flex items-center text-lg">
      <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></span> The Power of Negative Fences
    </h4>
    <p class="text-sm text-blue-200/80 leading-relaxed mb-3">
      The smartest way to control AI is telling it what it <strong>cannot</strong> do. AI models naturally love to write long, boring essays. You must constrain them.
    </p>
    <ul class="text-sm text-blue-100 font-medium space-y-1 list-disc list-inside">
      <li>"Do not use words like 'delve', 'furthermore', or 'crucial'."</li>
      <li>"Do not write more than 100 words."</li>
      <li>"Do not make up facts; if you don't know, say you don't know."</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-teal-900/40 to-gray-900 p-6 rounded-2xl border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)] mt-8">
    <div class="flex items-center space-x-3 mb-4 border-b border-teal-800/50 pb-3">
      <div class="bg-teal-500 text-gray-900 font-extrabold px-3 py-1 rounded text-sm uppercase tracking-widest shadow-lg">Live Mission</div>
      <h3 class="text-2xl font-bold text-teal-300">Draft Your Perfect Prompt</h3>
    </div>
    <p class="text-teal-50 leading-relaxed mb-5 text-lg">
      Think of a difficult message, email, or planning task you have been avoiding this week. Let the AI do the heavy lifting for you right now.
    </p>
    <div class="space-y-4 text-teal-100 font-medium">
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
        <p class="pt-1">Open your AI chat window.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
        <p class="pt-1">Type your <strong>WHO</strong> (e.g., Act as my personal assistant...)</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
        <p class="pt-1">Type your <strong>WHAT</strong> (e.g., I need an email to my boss asking for Friday off because...)</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span>
        <p class="pt-1">Type your <strong>HOW</strong> (e.g., Keep it strictly to two paragraphs, sound highly professional but not robotic.)</p>
      </div>
      <div class="bg-black/40 p-3 rounded-lg mt-4 text-center text-teal-400 font-bold border border-teal-900/50">
        Hit send and watch the magic happen.
      </div>
    </div>
  </div>

  <div class="mt-16 pt-10 border-t border-gray-800 border-dashed">
    <h3 class="text-3xl font-extrabold text-white mb-6">🚨 Deep Dive: The Perfect Prompt Anatomy</h3>
    <div class="prose prose-invert prose-lg max-w-none prose-p:text-gray-400">
      <p>In 2023, a junior salesperson at a Lagos real estate firm lost a massive client because of a lazy prompt. They asked the AI to "Write an email to Chief Adebayo pitching the new Ikoyi property." The AI wrote a long, poetic email starting with "Greetings to you, esteemed Sir, I hope this missive finds you well..." Chief Adebayo blocked the number instantly.</p>
      <p>If that salesperson had used the WHO-WHAT-HOW framework, they would have commanded:</p>
      <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 my-8 italic text-cyan-100/80">
        "<strong>[WHO]:</strong> Act as a high-end, confident luxury real estate broker. I am pitching an ultra-wealthy Nigerian billionaire. <strong>[WHAT]:</strong> Write a 3-sentence WhatsApp hook pitching an off-market 5-bedroom penthouse in Ikoyi. Tell him it offers total privacy from the press. <strong>[HOW]:</strong> Tone must be highly exclusive and respectful, but not begging. Start with 'Good evening Chief.' Do not use complex vocabulary. Use a single bullet point for the price."
      </div>
      <p>The difference between the two prompts is exactly $15,000 in commission. The WHO gives it a personality. The WHAT gives it a brain. The HOW gives it a leash.</p>
    </div>
  </div>
</div>`
          },
          { 
            id: "topic-3", 
            number: 3, 
            title: "Chatting, Not Searching", 
            description: "Why talking to AI is a back-and-forth conversation, not a Google search.", 
            progress: 100, 
            completed: true,
            cheatSheetHtml: `<div class="space-y-10 text-gray-300">
  
  <div class="border-b border-gray-800 pb-6">
    <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-4 tracking-tight">
      The Tailor Rule (The Pushback)
    </h2>
    <p class="text-lg leading-relaxed text-gray-400">
      Google is a vending machine—if you get the wrong result, you have to type a brand new search. AI is a conversation. If the first answer it gives you isn't perfect, <strong>never delete the chat</strong>. Treat the AI like a Nigerian tailor: if the suit is too tight on the shoulders, you don't throw it away. You just tell them to adjust the measurements. 
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-red-900/20 p-5 rounded-xl border border-red-800/50">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-red-400 font-bold text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> The Google Hangover</span>
      </div>
      <p class="text-sm text-gray-400 mb-3 italic">
        Asking the AI for a business proposal, getting one that sounds too expensive and uses too much big grammar, getting frustrated, deleting the chat, and trying to write a completely new prompt from scratch.
      </p>
      <div class="bg-black/30 p-2 rounded text-xs text-red-200/70 border-l-2 border-red-800">
        <strong>Result:</strong> Wasted time, frustration, and settling for average results.
      </div>
    </div>
    
    <div class="bg-teal-900/20 p-5 rounded-xl border border-teal-800/50">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-teal-400 font-bold text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-teal-500"><path d="M20 6 9 17l-5-5"/></svg> The Thumbnail Pushback</span>
      </div>
      <p class="text-sm text-gray-400 mb-3 italic">
        Reading the expensive proposal and simply replying in the same chat: "This is good, but the budget is too high. Rewrite this using cheaper local materials and make it sound friendlier."
      </p>
      <div class="bg-black/30 p-2 rounded text-xs text-teal-200/70 border-l-2 border-teal-800">
        <strong>Result:</strong> The AI instantly molds the original idea into exactly what you need.
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-xl font-bold text-teal-400 mb-4 flex items-center">
      <span class="bg-teal-900/50 text-teal-300 p-2 rounded-lg mr-3 border border-teal-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>
      </span>
      How to Mold the Clay
    </h3>
    <p class="text-sm text-gray-400 mb-5">When the first draft isn't perfect, use one of these three adjustments:</p>
    
    <div class="space-y-4">
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">1</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Adjust the Tone (The Vibe)</h4>
          <p class="text-sm text-gray-400">"This sounds too robotic. Rewrite it to sound like a warm, modern Nigerian entrepreneur chatting on WhatsApp."</p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">2</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Adjust the Constraints (The Facts)</h4>
          <p class="text-sm text-gray-400">"Remove the part about using imported salmon. Replace it with local fisherman soup and party jollof."</p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">3</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Adjust the Length (The Cut)</h4>
          <p class="text-sm text-gray-400">"This is way too long. My boss won't read this. Cut it down to 3 sharp bullet points."</p>
        </div>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-2">The Pushback Vault</h3>
    <p class="text-sm text-gray-400 mb-6">Use these templates to argue with the AI and force it to give you better work.</p>
    
    <div class="space-y-5">
      
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-teal-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-teal-400 uppercase font-bold tracking-widest bg-teal-900/30 px-2 py-1 rounded">The Budget Pivot</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "This plan is great, but I do not have the money or equipment for this yet. Adjust this entire strategy so I can start tomorrow with zero budget, using only my smartphone and free tools."
        </p>
      </div>

      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-cyan-400 uppercase font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded">The Options Command</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "I don't really like this angle. Give me 3 completely different, highly creative options to choose from. Make one safe, one risky, and one funny."
        </p>
      </div>

      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-blue-400 uppercase font-bold tracking-widest bg-blue-900/30 px-2 py-1 rounded">The Clarification Check</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "I understand steps 1 and 3, but I am completely lost on step 2. Break down step 2 for me again in much simpler English."
        </p>
      </div>

    </div>
  </div>

  <div class="bg-blue-900/20 border-l-4 border-blue-500 p-5 rounded-r-xl mt-8">
    <h4 class="text-blue-400 font-bold mb-2 flex items-center text-lg">
      <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/></svg></span> Pro-Tip: The AI Has Memory
    </h4>
    <p class="text-sm text-blue-200/80 leading-relaxed mb-3">
      Because AI is a chat, it remembers everything you said 10 messages ago. When you use the Pushback, you don't need to repeat your "Who, What, How" from the first prompt. You can literally just type: <em>"Make it shorter,"</em> and it knows exactly what "it" is.
    </p>
  </div>

  <div class="bg-gradient-to-br from-teal-900/40 to-gray-900 p-6 rounded-2xl border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)] mt-8">
    <div class="flex items-center space-x-3 mb-4 border-b border-teal-800/50 pb-3">
      <div class="bg-teal-500 text-gray-900 font-extrabold px-3 py-1 rounded text-sm uppercase tracking-widest shadow-lg">Live Mission</div>
      <h3 class="text-2xl font-bold text-teal-300">Mold the Clay</h3>
    </div>
    <p class="text-teal-50 leading-relaxed mb-5 text-lg">
      Let's practice pushing back right now.
    </p>
    <div class="space-y-4 text-teal-100 font-medium">
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
        <p class="pt-1">Open your AI and ask it: <strong class="text-white bg-black/30 px-2 py-1 rounded">"Give me a 3-day workout plan to lose weight."</strong></p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
        <p class="pt-1">Wait for it to give you the first draft (it will probably include gym equipment).</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
        <p class="pt-1"><strong>The Pushback:</strong> Reply in the same chat and say: <strong class="text-white bg-black/30 px-2 py-1 rounded">"I don't have access to a gym. Change this entire plan to exercises I can do in my living room without any equipment."</strong></p>
      </div>
    </div>
  </div>

  <div class="mt-16 pt-10 border-t border-gray-800 border-dashed">
    <h3 class="text-3xl font-extrabold text-white mb-6">🚨 Deep Dive: Chatting Over Searching</h3>
    <div class="prose prose-invert prose-lg max-w-none prose-p:text-gray-400">
      <p>The single biggest mistake beginners make is treating ChatGPT like Google Web Search. If a result is bad, they delete the conversation and start over. <strong>Do not restart the chat.</strong> AI models contain a "context window" which acts as short-term memory. Over the course of a long conversation, the AI actually learns your specific taste, your vocabulary, and your goals.</p>
      <p>A Lagos-based graphic designer was trying to generate ideas for a fintech logo. The AI kept suggesting images of dollar signs and piggy banks.</p>
      <p>Instead of giving up, she pushed back: <em>"These are too cliché and boring. I want something abstract that represents 'speed' and 'trust' without using obvious money symbols. Avoid green."</em> The next 5 suggestions were breathtakingly modern.</p>
      <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 my-8 italic text-cyan-100/80">
        "Think of the AI as a junior intern. If an intern hands you a report and the second paragraph is wrong, you don't fire the intern and hire a new one. You point at the paragraph and say: 'Fix this specific part, make it shorter.' The AI expects you to push back. It enjoys the pushback. Be ruthless in your editing."
      </div>
    </div>
  </div>
</div>`
          },
          { 
            id: "topic-4", 
            number: 4, 
            title: "Make It Simple", 
            description: "How to ask AI to explain very hard topics as if you were a 5-year-old.", 
            progress: 0, 
            completed: false,
            cheatSheetHtml: `<div class="space-y-10 text-gray-300">
  
  <div class="border-b border-gray-800 pb-6">
    <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-4 tracking-tight">
      The "Explain Like I'm 5" Superpower
    </h2>
    <p class="text-lg leading-relaxed text-gray-400">
      "Big Grammar" is a trap used by lawyers, tech companies, and government agencies to intimidate you. You never have to sign a confusing document or ignore a heavy news article again. Your AI is the ultimate, patient translator. It can take the most complex jargon on earth and break it down to its absolute basics.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-red-900/20 p-5 rounded-xl border border-red-800/50">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-red-400 font-bold text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> The Dangerous Way</span>
      </div>
      <p class="text-sm text-gray-400 mb-3 italic">
        Reading paragraph 4 of a shop tenancy agreement, seeing the words "force majeure" and "indemnify," feeling a headache coming on, and just signing the paper hoping for the best.
      </p>
      <div class="bg-black/30 p-2 rounded text-xs text-red-200/70 border-l-2 border-red-800">
        <strong>Result:</strong> You accidentally agree to pay for damages you didn't cause, putting your business at massive financial risk.
      </div>
    </div>
    
    <div class="bg-teal-900/20 p-5 rounded-xl border border-teal-800/50">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-teal-400 font-bold text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-teal-500"><path d="M20 6 9 17l-5-5"/></svg> The Thumbnail Way</span>
      </div>
      <p class="text-sm text-gray-400 mb-3 italic">
        Uploading a picture of the contract to AI and typing: "Explain this to me like I'm 5 years old. What exactly am I agreeing to, and is there any danger to my business?"
      </p>
      <div class="bg-black/30 p-2 rounded text-xs text-teal-200/70 border-l-2 border-teal-800">
        <strong>Result:</strong> You get a simple "Yes/No" translation in plain English. You protect your money and negotiate like a pro.
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-xl font-bold text-teal-400 mb-4 flex items-center">
      <span class="bg-teal-900/50 text-teal-300 p-2 rounded-lg mr-3 border border-teal-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </span>
      The Jargon-Buster Rules
    </h3>
    <div class="space-y-4">
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">1</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Set the Simplicity Level</h4>
          <p class="text-sm text-gray-400">Tell the AI exactly how "dumbed down" you want it. Use phrases like <em>"Explain like I'm 5,"</em> <em>"Explain to a beginner,"</em> or <em>"Explain it to a teenager."</em></p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">2</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Ask for the "Bottom Line"</h4>
          <p class="text-sm text-gray-400">Don't just ask for a summary. Ask the AI how it affects YOU. <em>(e.g., "What is the bottom line here? Does this mean my taxes are going up?")</em></p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">3</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Find the Hidden Traps</h4>
          <p class="text-sm text-gray-400">When reviewing contracts or policies, actively command the AI to look for danger. <em>(e.g., "Point out the 3 worst-case scenarios for me in this document.")</em></p>
        </div>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-2">The Translation Vault</h3>
    <p class="text-sm text-gray-400 mb-6">Use these templates whenever you encounter heavy grammar, legal threats, or confusing news.</p>
    
    <div class="space-y-5">
      
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-teal-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-teal-400 uppercase font-bold tracking-widest bg-teal-900/30 px-2 py-1 rounded">Legal & Contracts</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "I am about to sign this [insert document type, e.g., shop lease]. Read it carefully and explain it to me like I am a beginner. Give me a 3-bullet-point summary of what I am agreeing to, and point out any 'hidden traps' that could cost me money later."
        </p>
      </div>

      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-cyan-400 uppercase font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded">Government & Economy</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "Read this news article about the new [insert policy, e.g., CBN tax policy]. Strip away all the financial jargon. Explain the bottom line to me simply: exactly how will this affect the daily running of my small retail business next month?"
        </p>
      </div>

      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-blue-400 uppercase font-bold tracking-widest bg-blue-900/30 px-2 py-1 rounded">Tech Support</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "I just got this confusing email from my [insert service, e.g., web hosting company] talking about server migrations and DNS records. I am not a tech person. Explain what they want me to do like I'm 5 years old. What is the exact first step I should take right now?"
        </p>
      </div>

    </div>
  </div>

  <div class="bg-blue-900/20 border-l-4 border-blue-500 p-5 rounded-r-xl mt-8">
    <h4 class="text-blue-400 font-bold mb-2 flex items-center text-lg">
      <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></span> The "Grandmother Test"
    </h4>
    <p class="text-sm text-blue-200/80 leading-relaxed mb-3">
      If "Explain like I'm 5" still gives you an answer that feels too complicated, use the Grandmother Test. Tell the AI: <em>"This is still too hard. Rewrite it so my grandmother in the village would understand exactly how this works using everyday analogies like going to the market."</em> It works like magic every time.
    </p>
  </div>

  <div class="bg-gradient-to-br from-teal-900/40 to-gray-900 p-6 rounded-2xl border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)] mt-8">
    <div class="flex items-center space-x-3 mb-4 border-b border-teal-800/50 pb-3">
      <div class="bg-teal-500 text-gray-900 font-extrabold px-3 py-1 rounded text-sm uppercase tracking-widest shadow-lg">Live Mission</div>
      <h3 class="text-2xl font-bold text-teal-300">Decode the Matrix</h3>
    </div>
    <p class="text-teal-50 leading-relaxed mb-5 text-lg">
      Let's destroy some confusing grammar right now.
    </p>
    <div class="space-y-4 text-teal-100 font-medium">
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
        <p class="pt-1">Open a new tab and search for the "Terms and Conditions" of any app you use (like WhatsApp, Instagram, or your bank).</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
        <p class="pt-1">Copy a massive, confusing paragraph full of legal words.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
        <p class="pt-1">Paste it into your AI and command it: <strong class="text-white bg-black/30 px-2 py-1 rounded">"Explain this to me like I am 5 years old. What am I agreeing to?"</strong></p>
      </div>
    </div>
  </div>

  <div class="mt-16 pt-10 border-t border-gray-800 border-dashed">
    <h3 class="text-3xl font-extrabold text-white mb-6">🚨 Deep Dive: The Asymmetry of Jargon</h3>
    <div class="prose prose-invert prose-lg max-w-none prose-p:text-gray-400">
      <p>There is an unspoken rule in business: Whosoever controls the vocabulary, controls the negotiation. Lawyers use Latin terms. Doctors use unpronounceable syndromes. Mechanics use made-up engine parts. They do this to create an asymmetry of knowledge, forcing you to trust them blindly because you are too intimidated to ask what "sub-prime amortization" means.</p>
      <p>The <em>"Explain like I'm 5"</em> prompt is the great equalizer. It completely destroys the asymmetry of knowledge.</p>
      <p>In 2024, a small fleet owner in Abuja was handed a massive insurance renewal document. His premium had doubled, and the broker blamed "inflationary adjustment multipliers." The owner snapped a picture of the clause, uploaded it to his AI, and typed: <em>"Explain this exact clause to me like a 5-year-old. Is the broker lying?"</em></p>
      <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 my-8 italic text-cyan-100/80">
        "The AI translated the terrifying legal jargon into one brutal sentence: <em>'They aren't raising your price because of inflation. They added a hidden fee for premium roadside assistance that you didn't ask for.'</em> The fleet owner called his broker, cited the hidden fee, and saved ₦1.2 million in under ten minutes."
      </div>
    </div>
  </div>
</div>`
          },
          { id: "topic-5", number: 5, title: "From Brain to Screen", description: "How to turn your rough, messy ideas into clear, professional text.", progress: 0, completed: false,
            cheatSheetHtml: `<div class="space-y-10 text-gray-300">
  
  <div class="border-b border-gray-800 pb-6">
    <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-4 tracking-tight">
      From Brain to Screen: The Brain-Dump Technique
    </h2>
    <p class="text-lg leading-relaxed text-gray-400">
      Have you ever had an amazing idea for a project, an essay, or a business plan, but the moment you sit down to write it out, your mind goes blank? Staring at a blinking cursor is the death of creativity. The "Brain-Dump Technique" completely eliminates writer's block. You stop trying to write perfectly, and instead, you just vomit raw, messy words into your phone, and let the AI do the sorting, structuring, and polishing.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-red-900/20 p-5 rounded-xl border border-red-800/50">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-red-400 font-bold text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> The Painful Way</span>
      </div>
      <p class="text-sm text-gray-400 mb-3 italic">
        Sitting down to write a university project proposal. Typing one sentence, deleting it, staring at the screen for 20 minutes, getting distracted by Instagram, and feeling completely stressed out because the deadline is tomorrow.
      </p>
      <div class="bg-black/30 p-2 rounded text-xs text-red-200/70 border-l-2 border-red-800">
        <strong>Result:</strong> Anxiety, wasted time, and a proposal that sounds forced and unnatural.
      </div>
    </div>
    
    <div class="bg-teal-900/20 p-5 rounded-xl border border-teal-800/50">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-teal-400 font-bold text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-teal-500"><path d="M20 6 9 17l-5-5"/></svg> The Thumbnail Way</span>
      </div>
      <p class="text-sm text-gray-400 mb-3 italic">
        Opening your AI app and voice-typing: "I want to do my project on solar energy in rural Nigeria. The problem is people don't have money for panels. My idea is a cheaper panel made of local stuff. I don't know the materials yet but the goal is to make it under 20k. Take this messy idea and turn it into a 3-page academic proposal structure."
      </p>
      <div class="bg-black/30 p-2 rounded text-xs text-teal-200/70 border-l-2 border-teal-800">
        <strong>Result:</strong> Within 5 seconds, you have a professional, perfectly structured proposal outline ready to be filled out.
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-xl font-bold text-teal-400 mb-4 flex items-center">
      <span class="bg-teal-900/50 text-teal-300 p-2 rounded-lg mr-3 border border-teal-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
      </span>
      The 3 Phases of the Brain-Dump
    </h3>
    <div class="space-y-4">
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">1</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">The Vomit Phase (No Judging)</h4>
          <p class="text-sm text-gray-400">Record a voice note or type as fast as you can. Do not worry about spelling, grammar, or big English. Use Pidgin, use slang, mix languages. Just get the raw idea out of your head.</p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">2</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">The Sorting Phase (The Command)</h4>
          <p class="text-sm text-gray-400">Tell the AI exactly what you want it to build out of your mess. <em>(e.g., "Sort this mess into an official school essay outline," or "Turn this scattered idea into a 5-slide presentation format.")</em></p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">3</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">The Polish Phase (The Pushback)</h4>
          <p class="text-sm text-gray-400">Read what the AI gives you. If it sounds too robotic or missed a crucial point, apply the Tailor Rule from the previous lesson to adjust it perfectly.</p>
        </div>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-2">The Brain-Dump Vault</h3>
    <p class="text-sm text-gray-400 mb-6">Whenever you have a scattered idea, paste it below one of these commands.</p>
    
    <div class="space-y-5">
      
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-teal-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-teal-400 uppercase font-bold tracking-widest bg-teal-900/30 px-2 py-1 rounded">The Essay Outliner</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "I need to write a 10-page essay on [Topic]. Here are all my scattered, messy thoughts about it: [Paste your brain-dump]. Do not write the essay for me. Just organize these thoughts into a powerful, logical 5-part essay outline with headings and bullet points."
        </p>
      </div>

      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-cyan-400 uppercase font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded">The Pitch Constructor</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "I have a business idea but it's very messy in my head. Here is everything I know about it: [Paste your brain-dump]. Take this mess and structure it into a brilliant, 1-page business pitch. Include the Problem, the Solution, the Target Market, and Why it will work."
        </p>
      </div>

      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-blue-400 uppercase font-bold tracking-widest bg-blue-900/30 px-2 py-1 rounded">The Argument Decoder</span>
        </div>
        <p class="text-white italic text-[15px] leading-relaxed mb-3">
          "I want to respond to someone online but my thoughts are too emotional and scattered right now. Here is what I am trying to say: [Paste your angry/scattered mess]. Rewrite this into a calm, ice-cold, highly logical argument. Remove all the emotion and focus strictly on the facts."
        </p>
      </div>

    </div>
  </div>

  <div class="bg-gradient-to-br from-teal-900/40 to-gray-900 p-6 rounded-2xl border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)] mt-8">
    <div class="flex items-center space-x-3 mb-4 border-b border-teal-800/50 pb-3">
      <div class="bg-teal-500 text-gray-900 font-extrabold px-3 py-1 rounded text-sm uppercase tracking-widest shadow-lg">Live Mission</div>
      <h3 class="text-2xl font-bold text-teal-300">Dump The Brain</h3>
    </div>
    <p class="text-teal-50 leading-relaxed mb-5 text-lg">
      Let's map out that project you've been delaying.
    </p>
    <div class="space-y-4 text-teal-100 font-medium">
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
        <p class="pt-1">Pick a topic (an assignment, an email, or a creative project).</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
        <p class="pt-1">Open your AI app and voice-record yourself talking about it for exactly 60 seconds. Do not stop to think. Just talk.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
        <p class="pt-1">Paste the transcript and command the AI: <strong class="text-white bg-black/30 px-2 py-1 rounded">"Turn this raw thought into a structured, step-by-step action plan."</strong></p>
      </div>
      <div class="bg-black/40 p-3 rounded-lg mt-4 text-center text-cyan-400 font-bold border border-cyan-900/50">
        You will never stare at a blank screen again.
      </div>
    </div>
  </div>

  <div class="mt-16 pt-10 border-t border-gray-800 border-dashed">
    <h3 class="text-3xl font-extrabold text-white mb-6">🚨 Deep Dive: The Stalled Master's Thesis</h3>
    <div class="prose prose-invert prose-lg max-w-none prose-p:text-gray-400">
      <p>Let's look at what happens when the Brain-Dump technique saves a career. In 2024, a Nigerian postgraduate student in the UK was 3 months behind on her Master's thesis regarding "The Impact of Fintech on Rural Agriculture in Nigeria." She had done all the interviews, read 40 papers, and collected all the data. But sitting down to write the 15,000-word dissertation felt paralyzing. She stared at Microsoft Word for weeks.</p>
      <p>She tried to write the "Introduction" perfectly. Every sentence felt wrong. She was experiencing severe "Blank Canvas Syndrome."</p>
      <p>Then she tried the Brain-Dump technique. She recorded a 15-minute voice note on WhatsApp, just pacing around her room ranting about what she discovered: <em>"So basically, the apps work, but the farmers don't trust the apps because the UX is terrible. They prefer USSD codes. The banks think it's a tech problem, but it's really a trust problem. I interviewed Farmer John and he said..."</em></p>
      
      <h4>The AI Structuring Magic</h4>
      <p>She transcribed the 15-minute voice note using a free transcriber, got a massive, unstructured wall of text, and pasted it into her AI.</p>
      <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 my-8 italic text-cyan-100/80">
        "I am writing a Master's Thesis on Fintech in Rural Nigeria. Below is an unstructured rant containing all my key findings, arguments, and data points. Read through this mess. Extract the core arguments, and construct a highly academic, strictly formatted Chapter Outline for my thesis, placing each of my points into the correct chapter."
      </div>
      
      <h4>Case Study 2: The Social Media Manager's Nightmare</h4>
      <p>A social media manager in Yaba had to produce 30 days of content for a real estate client in 48 hours. The client just sent a basic brochure of the houses they sell.</p>
      <p>The manager opened his AI and dumped every random thought he had: <em>"Okay we need to sell these duplexes in Lekki. They have a pool. It's expensive so target rich diaspora people. Let's do a post about why investing in Nigeria is smart. Maybe a post about the kitchen design. Let's also do a post warning them about fake developers..."</em></p>
      <p><strong>The Command:</strong> <em>"This is my raw, messy brainstorming for a real estate client. Take all these half-baked ideas and expand them into a complete 30-day content calendar. Give me the hook, the caption, and the visual idea for each day."</em></p>
      <p><strong>The Result:</strong> The manager not only finished the work in 2 hours, but the AI identified gaps in his brainstorming and suggested 5 extra high-converting topics.</p>

      <h3 class="text-2xl font-bold text-white mt-12 mb-4">Advanced Tactics: The "Frankenstein" Draft</h3>
      <p>Sometimes you don't just have one brain-dump. You have a WhatsApp voice note, a couple of bullet points from a Notepad app, and an old email.</p>
      <ul class="space-y-4">
        <li><strong>Compile the Monster:</strong> Do not worry about formatting. Copy and paste the bullet points, the email, and the transcript directly into the same prompt box. It will look horrific. That is fine.</li>
        <li><strong>The "Synthesize" Command:</strong> Tell the AI: "Below are three completely different sets of notes, emails, and voice transcripts. Read all of them. Synthesize the overlapping information and pull out the 5 most important underlying themes."</li>
        <li><strong>The Iterative Polish:</strong> Once the AI gives you the clean version, you can then say, "Great, now rewrite theme 2 to be funnier, and expand theme 4 with more examples."</li>
      </ul>
    </div>
  </div>

  <div class="mt-16 pt-10 border-t border-gray-800 border-dashed pb-20">
    <h3 class="text-3xl font-extrabold text-white mb-6">Brain-Dump Cheat Sheet</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-black/40 p-5 rounded-lg border border-gray-800">
        <strong class="text-teal-400 block mb-2">The Golden Rule:</strong>
        <p class="text-gray-400 text-sm">Separation of creation and editing. You cannot do both at the same time. Let your brain create the mess, and let the AI do the editing, structuring, and formatting.</p>
      </div>
      <div class="bg-black/40 p-5 rounded-lg border border-gray-800">
        <strong class="text-red-400 block mb-2">What NOT to do:</strong>
        <p class="text-gray-400 text-sm">Do not ask the AI "What should I write about?" Start with your own raw thoughts, no matter how stupid they sound. AI amplifies your ideas, it shouldn't replace your soul.</p>
      </div>
    </div>
  </div>

</div>`
          },
        ]
      },
      {
        id: "module-b",
        title: "Module B: Fixing Everyday Problems",
        topics: [
          { id: "topic-6", number: 6, title: "Clearing Your Emails", description: "Letting AI write, reply to, and sort your daily messages.", progress: 0, completed: false },
          { id: "topic-7", number: 7, title: "Reading Less, Knowing More", description: "Getting short summaries of long reports or 2-hour YouTube videos.", progress: 65, completed: false },
          { id: "topic-8", number: 8, title: "Your Personal Assistant", description: "Using AI to plan your day, schedule tasks, and organize your life.", progress: 0, completed: false },
          { id: "topic-9", number: 9, title: "Starting from Scratch", description: "How to use AI to get ideas when you are stuck and don't know where to begin.", progress: 0, completed: false },
          { id: "topic-10", number: 10, title: "Fixing Real-Life Issues", description: "Asking AI for help with normal, hands-on tasks, like fixing a broken tap or planning a trip.", progress: 0, completed: false },
        ]
      },
      {
        id: "module-c",
        title: "Module C: Making It Work for Us (Local Focus)",
        topics: [
          { id: "topic-11", number: 11, title: "World News, Local Impact", description: "Seeing how big things happening abroad actually affect businesses back home in Africa.", progress: 0, completed: false },
          { id: "topic-12", number: 12, title: "Slang and Culture", description: "Helping AI understand our local language, pidgin, and context so it sounds natural.", progress: 0, completed: false },
          { id: "topic-13", number: 13, title: "Practice Makes Perfect", description: "Using AI to practice for job interviews or pitching to local clients.", progress: 0, completed: false },
          { id: "topic-14", number: 14, title: "Sorting Messy Notes", description: "Turning your scattered voice notes and thoughts into neat, actionable to-do lists.", progress: 0, completed: false },
          { id: "topic-15", number: 15, title: "Low Data, Old Phones", description: "How to get the best out of AI even if your internet is slow or your phone isn't the newest.", progress: 0, completed: false },
        ]
      },
      {
        id: "module-d",
        title: "Module D: Spotting Mistakes and Fixing Them",
        topics: [
          { id: "topic-16", number: 16, title: "Spotting Lies", description: "How to tell when the AI is confused or making things up.", progress: 0, completed: false },
          { id: "topic-17", number: 17, title: "Correcting the AI", description: "What to say when the AI gives you the wrong answer so it fixes it immediately.", progress: 0, completed: false },
          { id: "topic-18", number: 18, title: "Step-by-Step Guides", description: "Asking AI to teach you how to do physical tasks, one simple step at a time.", progress: 0, completed: false },
          { id: "topic-19", number: 19, title: "Using Your Voice", description: "How to talk to your phone instead of typing to get things done faster.", progress: 0, completed: false },
          { id: "topic-20", number: 20, title: "Working Backwards", description: "Showing the AI a finished product you like and asking it how to create it from scratch.", progress: 0, completed: false },
        ]
      }
    ]
  }
];

export function getActiveCourse() {
  let activeTopic = null;
  let activeModule = null;

  for (const tier of courseData) {
    for (const mod of tier.modules) {
      for (const topic of mod.topics) {
        if (topic.progress > 0 && topic.progress < 100) {
          activeTopic = topic;
          activeModule = mod;
          break;
        }
      }
      if (activeTopic) break;
    }
    if (activeTopic) break;
  }

  if (activeTopic && activeModule) {
    return {
      id: activeTopic.id,
      title: activeTopic.title,
      moduleTitle: activeModule.title,
      progress: activeTopic.progress,
      coverPhoto: "/images/covers/" + activeTopic.id + ".jpg"
    }
  }

  // Fallback
  return {
    id: courseData[0].modules[0].topics[0].id,
    title: courseData[0].modules[0].topics[0].title,
    moduleTitle: courseData[0].modules[0].title,
    progress: 0,
    coverPhoto: ""
  }
}

export function getTopicById(topicId: string) {
  for (const tier of courseData) {
    for (const mod of tier.modules) {
      const index = mod.topics.findIndex(t => t.id === topicId);
      if (index !== -1) {
        return {
          topic: mod.topics[index],
          module: mod,
          tier: tier,
          nextTopicId: mod.topics[index + 1]?.id || null,
          prevTopicId: index > 0 ? mod.topics[index - 1].id : null
        }
      }
    }
  }
  return null;
}
