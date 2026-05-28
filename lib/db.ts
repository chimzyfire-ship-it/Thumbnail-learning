// Local lesson catalogue used as the built-in MVP course source.
// Admin-published lessons can override these records through lib/lesson-overrides.ts.

import { toYouTubeEmbedUrl } from "@/lib/youtube";

export type Lesson = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  videoUrl?: string; // Normalized YouTube embed URL
  cheatSheetHtml: string; // Raw HTML or rendered Markdown for Lab Notes
  order: number;
  completed: boolean;
};

const screenshotLessonHtml = `<div class="space-y-10 text-gray-300">
  <div class="border-b border-gray-800 pb-6">
    <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-4 tracking-tight">The Power of Screenshots</h2>
    <p class="text-lg leading-relaxed text-gray-400">A screenshot can save you from long, tiring explanation. Instead of struggling to describe what you are seeing, you can simply show it. The moment you share the picture and add one clear instruction, your helper can understand faster, answer better, and guide you with more confidence.</p>
    <p class="text-base leading-relaxed text-gray-400 mt-4">This matters because many people do not get stuck because they are slow. They get stuck because they are trying to explain a problem with words when the problem is already sitting clearly on the screen. A screenshot closes that gap. It turns confusion into something visible, and once it becomes visible, it becomes easier to solve.</p>
  </div>

  <div class="bg-teal-900/20 p-6 rounded-2xl border border-teal-800/50">
    <h3 class="text-2xl font-bold text-teal-300 mb-3">Why this is such a big deal</h3>
    <div class="space-y-3 text-gray-300 leading-relaxed">
      <p>A screenshot gives the full picture at once: the words on the screen, the buttons, the warning, the layout, and the small details you may forget to mention.</p>
      <p>It removes guessing. Instead of your helper trying to imagine what you mean, they can react to what is actually there.</p>
      <p>It helps when you feel overwhelmed. If your screen feels messy or stressful, a screenshot lets you say, "Look at this and help me," without needing the perfect explanation first.</p>
      <p>It also helps with speed. Many problems that take ten minutes to explain with typing can be understood in seconds with one clear image.</p>
    </div>
  </div>

  <div>
    <h3 class="text-xl font-bold text-teal-400 mb-4 flex items-center">
      <span class="bg-teal-900/50 text-teal-300 p-2 rounded-lg mr-3 border border-teal-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </span>
      The 3-Step Move
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all">
        <div class="text-2xl font-black text-teal-500 mb-2">1. Snap</div>
        <p class="text-sm text-gray-400 leading-relaxed">Take a clean screenshot or clear photo of the exact thing you need help with. Do not send the whole world if the problem is only one small part.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all">
        <div class="text-2xl font-black text-teal-500 mb-2">2. Share</div>
        <p class="text-sm text-gray-400 leading-relaxed">Upload the picture straight into the chat. If the first image does not tell the full story, add a second one that shows what happened before or after.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all">
        <div class="text-2xl font-black text-teal-500 mb-2">3. Say</div>
        <p class="text-sm text-gray-400 leading-relaxed">Add one simple instruction. Say what you want: explain it, summarize it, tell me what button to press, or help me reply.</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-red-900/20 p-5 rounded-xl border border-red-800/50">
      <h3 class="text-xl font-bold text-red-300 mb-3">Weak way</h3>
      <p class="text-sm text-gray-400 italic leading-relaxed">"My screen is acting strange and I do not know what to do."</p>
      <p class="text-sm text-red-100/80 mt-3 leading-relaxed">This is too vague. Your helper has to guess what screen, what warning, and what outcome you want.</p>
    </div>
    <div class="bg-teal-900/20 p-5 rounded-xl border border-teal-800/50">
      <h3 class="text-xl font-bold text-teal-300 mb-3">Strong way</h3>
      <p class="text-sm text-gray-200 italic leading-relaxed">"Look at this screenshot. I want to send an invoice, but I do not know which button to press next. Walk me through it in plain steps."</p>
      <p class="text-sm text-teal-100/80 mt-3 leading-relaxed">Now the picture shows the situation, and the instruction shows the goal. That is where strong help begins.</p>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-2">The Prompt Vault</h3>
    <p class="text-sm text-gray-400 mb-6">Use these ready-made lines with your screenshots. They are simple, direct, and easy to copy.</p>
    <div class="space-y-5">
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-teal-500 shadow-lg">
        <span class="text-xs text-teal-400 uppercase font-bold tracking-widest bg-teal-900/30 px-2 py-1 rounded">Confusing Screen</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Look at this screenshot and tell me exactly what to press next to get the result I want. Keep your answer simple and direct."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> forms, settings pages, payment pages, sign-up steps, and any place where you feel stuck.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
        <span class="text-xs text-cyan-400 uppercase font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded">Letter or Document</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Read this image and tell me the main point, the important dates, and the next thing I should do. Explain it like you are talking to a beginner."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> letters, bills, notices, forms, printed instructions, and handwritten notes.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
        <span class="text-xs text-blue-400 uppercase font-bold tracking-widest bg-blue-900/30 px-2 py-1 rounded">Product or Item</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Look at this picture and tell me what this is, what the important information means, and anything I should be careful about."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> labels, medicine packs, food packs, home tools, machine panels, and items with confusing writing.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-emerald-500 shadow-lg">
        <span class="text-xs text-emerald-400 uppercase font-bold tracking-widest bg-emerald-900/30 px-2 py-1 rounded">Proof of Payment or Receipt</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Read this receipt and pull out the amount, date, sender, and reference number. Put the answer in a neat list I can copy."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> receipts, transfer slips, checkout confirmations, and order summaries.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-fuchsia-500 shadow-lg">
        <span class="text-xs text-fuchsia-400 uppercase font-bold tracking-widest bg-fuchsia-900/30 px-2 py-1 rounded">Message Help</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Look at this message and help me reply. Keep my reply calm, clear, and respectful."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> customer chats, business messages, family messages, and tense conversations.</p>
      </div>
    </div>
  </div>

  <div class="bg-gray-900/70 p-6 rounded-2xl border border-gray-800">
    <h3 class="text-2xl font-bold text-white mb-4">What makes a screenshot truly useful</h3>
    <div class="space-y-4 text-sm text-gray-400 leading-relaxed">
      <p><strong class="text-white">Show the exact problem.</strong> If the issue is a warning box, make sure that warning box is easy to see.</p>
      <p><strong class="text-white">Cut out distractions.</strong> Remove extra parts that do not matter. A cleaner image makes the answer cleaner too.</p>
      <p><strong class="text-white">Point to the important part.</strong> If needed, draw a circle or arrow before you upload.</p>
      <p><strong class="text-white">Say the outcome you want.</strong> Do not only say what is wrong. Also say what you are trying to achieve.</p>
      <p><strong class="text-white">Ask for the style of answer you need.</strong> You can ask for bullet points, short steps, a summary, or a reply you can copy.</p>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-5">Everyday moments where this helps a lot</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When a payment page feels confusing</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Send the screenshot and ask which option is the safe one, what each option means, and which step should come next.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When a form has strange words</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Share the form and ask for a simple explanation of each box so you do not fill the wrong thing.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When a letter arrives and you feel pressure</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Upload it and ask for the main message, deadline, and what action matters most right now.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When a customer sends a confusing screenshot</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Use the image to understand the customer faster, then ask for a helpful reply you can send back.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When a label or instructions feel unclear</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Take a photo and ask for the meaning in simple words, plus any warning or important detail you should not miss.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When you need confidence before you act</h4>
        <p class="text-sm text-gray-400 leading-relaxed">A screenshot can help you double-check what you are seeing before you click, submit, pay, or respond.</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    <div class="bg-orange-900/20 p-5 rounded-xl border border-orange-800/50">
      <h4 class="text-orange-400 font-bold mb-2 flex items-center text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Privacy First
      </h4>
      <p class="text-sm text-orange-200/80 leading-relaxed">Do not upload private details you would not want shared. Cover account numbers, passwords, personal ID details, private phone numbers, or anything sensitive before you send the image. If it feels too private, hide it first.</p>
    </div>
    <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
      <h4 class="text-gray-200 font-bold mb-2 flex items-center text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Quick Rescue
      </h4>
      <ul class="text-sm text-gray-400 space-y-2">
        <li><strong class="text-white">The answer is too general:</strong> Ask again and say the exact result you want.</li>
        <li><strong class="text-white">The picture is hard to read:</strong> Take a cleaner image with better light or a closer view.</li>
        <li><strong class="text-white">Too much is happening in one image:</strong> crop it or send two images in order.</li>
        <li><strong class="text-white">You still feel lost:</strong> ask for the answer in short steps, one step at a time.</li>
      </ul>
    </div>
  </div>

  <div class="mt-10 pt-10 border-t border-gray-800 border-dashed">
    <h3 class="text-3xl font-extrabold text-white mb-6">Real-Life Impact</h3>
    <div class="space-y-5 text-gray-400 leading-relaxed">
      <p>A screenshot is not just a convenience tool. It can protect your time, your money, and your peace of mind. One clear image can stop you from filling the wrong form, sending the wrong reply, missing an important date, or pressing the wrong button in a stressful moment.</p>
      <p>It also gives people courage. Many people stay quiet because they do not know how to explain what they are seeing. A screenshot gives them a voice. It says, "I may not have the perfect words, but here is the situation. Help me understand it."</p>
      <p>That is powerful. It means help is no longer only for people who are good at explaining. Help becomes available to anyone who can point, show, and ask.</p>
    </div>
  </div>

  <div class="bg-gradient-to-br from-teal-900/40 to-gray-900 p-6 rounded-2xl border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)] mt-8">
    <div class="flex items-center space-x-3 mb-4 border-b border-teal-800/50 pb-3">
      <div class="bg-teal-500 text-gray-900 font-extrabold px-3 py-1 rounded text-sm uppercase tracking-widest shadow-lg">Practice</div>
      <h3 class="text-2xl font-bold text-teal-300">Do This Right Now</h3>
    </div>
    <p class="text-teal-50 leading-relaxed mb-5 text-lg">The fastest way to believe this lesson is to try it immediately.</p>
    <div class="space-y-4 text-teal-100 font-medium">
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
        <p class="pt-1">Find one thing around you that feels unclear: a message, a label, a form, a page, a receipt, or a setting on your phone.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
        <p class="pt-1">Take a clean screenshot or photo of only the part that matters most.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
        <p class="pt-1">Send it with this line: <strong class="text-white bg-black/30 px-2 py-1 rounded">"Look at this image and help me understand what I am seeing. Then tell me the next best step in simple words."</strong></p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span>
        <p class="pt-1">If the answer feels too broad, ask one more time: <strong class="text-white">"Make it shorter and give me only the exact step to take first."</strong></p>
      </div>
    </div>
  </div>

  <div class="mt-10 pt-10 border-t border-gray-800 border-dashed pb-20">
    <h3 class="text-3xl font-extrabold text-white mb-6">Remember This</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-black/40 p-5 rounded-lg border border-gray-800">
        <strong class="text-teal-400 block mb-2">Do</strong>
        <ul class="text-sm text-gray-400 space-y-2 list-disc pl-4">
          <li>Show the exact issue.</li>
          <li>Ask for a clear result.</li>
          <li>Keep the image clean and easy to read.</li>
          <li>Ask for simple steps if you want action.</li>
        </ul>
      </div>
      <div class="bg-black/40 p-5 rounded-lg border border-gray-800">
        <strong class="text-red-400 block mb-2">Do Not</strong>
        <ul class="text-sm text-gray-400 space-y-2 list-disc pl-4">
          <li>Send private details without hiding them.</li>
          <li>Upload blurry images and hope for the best.</li>
          <li>Send a screenshot with no instruction.</li>
          <li>Ask a vague question when you already know the result you want.</li>
        </ul>
      </div>
    </div>
  </div>
</div>`;

const askingLessonHtml = `<div class="space-y-10 text-gray-300">
  <div class="border-b border-gray-800 pb-6">
    <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-4 tracking-tight">Asking the Right Questions</h2>
    <p class="text-lg leading-relaxed text-gray-400">Most people do not get weak answers because the helper is useless. They get weak answers because they ask in a rushed, unclear way. If your question is foggy, the answer will also be foggy. If your question is sharp, the answer becomes more useful, more human, and much closer to what you actually need.</p>
    <p class="text-base leading-relaxed text-gray-400 mt-4">This lesson is really about control. You do not need long speeches. You do not need fancy words. You just need to guide the helper properly. A few clear details can change a bland answer into something you can truly use.</p>
  </div>

  <div class="bg-teal-900/20 p-6 rounded-2xl border border-teal-800/50">
    <h3 class="text-2xl font-bold text-teal-300 mb-3">Why this matters so much</h3>
    <div class="space-y-3 text-gray-300 leading-relaxed">
      <p>A clear question saves time. Instead of going back and forth again and again, you get closer to the right answer much faster.</p>
      <p>A clear question protects your tone. If you want something warm, calm, respectful, bold, or simple, you need to say so.</p>
      <p>A clear question gives better results in real life. It can help you send better messages, make clearer plans, understand difficult topics, and avoid embarrassing mistakes.</p>
      <p>Most importantly, a clear question helps you feel less frustrated. You stop guessing and start directing.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-red-900/20 p-5 rounded-xl border border-red-800/50">
      <h3 class="text-xl font-bold text-red-300 mb-3">Weak question</h3>
      <p class="text-sm text-gray-400 italic leading-relaxed">"Write a message to my customer."</p>
      <p class="text-sm text-red-100/80 mt-3 leading-relaxed">This leaves out almost everything that matters. What happened? What tone do you want? How short should it be? What result are you trying to get?</p>
    </div>
    <div class="bg-teal-900/20 p-5 rounded-xl border border-teal-800/50">
      <h3 class="text-xl font-bold text-teal-300 mb-3">Strong question</h3>
      <p class="text-sm text-gray-200 italic leading-relaxed">"Write a short WhatsApp message to a customer whose order is late. Apologize, explain that delivery will happen tomorrow, and keep the tone calm and respectful."</p>
      <p class="text-sm text-teal-100/80 mt-3 leading-relaxed">Now the helper knows the situation, the goal, and the style. That makes the answer far more useful.</p>
    </div>
  </div>

  <div>
    <h3 class="text-xl font-bold text-teal-400 mb-4 flex items-center">
      <span class="bg-teal-900/50 text-teal-300 p-2 rounded-lg mr-3 border border-teal-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      </span>
      The 3-Part Formula
    </h3>
    <div class="space-y-4">
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">1</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Who</h4>
          <p class="text-sm text-gray-400 leading-relaxed">Say who the helper should sound like. This shapes the voice of the answer. You can ask for a calm teacher, a polite business owner, a caring assistant, or a confident planner.</p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">2</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">What</h4>
          <p class="text-sm text-gray-400 leading-relaxed">Say exactly what you need. This is the job. It could be a message, a summary, an explanation, a plan, a list, or a reply.</p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">3</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">How</h4>
          <p class="text-sm text-gray-400 leading-relaxed">Say how you want it delivered. Short or detailed. Warm or firm. In bullet points or plain lines. Simple words or professional words. This is where the answer becomes yours.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-900/70 p-6 rounded-2xl border border-gray-800">
    <h3 class="text-2xl font-bold text-white mb-4">The easiest way to remember it</h3>
    <div class="space-y-4 text-sm text-gray-400 leading-relaxed">
      <p><strong class="text-white">Who:</strong> Who should the helper sound like?</p>
      <p><strong class="text-white">What:</strong> What exactly do you want it to do?</p>
      <p><strong class="text-white">How:</strong> How should the final answer feel, sound, and look?</p>
      <p>When these three parts are present, your question becomes much stronger, even if it is still short.</p>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-2">The Prompt Vault</h3>
    <p class="text-sm text-gray-400 mb-6">Use these ready-made lines when you want better answers without overthinking it.</p>
    <div class="space-y-5">
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-teal-500 shadow-lg">
        <span class="text-xs text-teal-400 uppercase font-bold tracking-widest bg-teal-900/30 px-2 py-1 rounded">Message Writing</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Write a short message to [person] about [situation]. Keep it [tone] and make sure the main point is [goal]."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> customer messages, follow-ups, apology notes, reminders, and personal replies.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
        <span class="text-xs text-cyan-400 uppercase font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded">Simple Explanation</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Explain [topic] to me in simple words. Assume I am new to it. Use everyday examples and keep it easy to follow."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> confusing topics, new ideas, money questions, contracts, forms, and life admin.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
        <span class="text-xs text-blue-400 uppercase font-bold tracking-widest bg-blue-900/30 px-2 py-1 rounded">Planning Help</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Help me make a simple plan for [goal]. Break it into steps I can actually follow this week."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> business plans, study plans, budgeting, event prep, and task organization.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-emerald-500 shadow-lg">
        <span class="text-xs text-emerald-400 uppercase font-bold tracking-widest bg-emerald-900/30 px-2 py-1 rounded">Ideas and Options</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Give me 5 realistic ideas for [goal]. Keep them low-cost, practical, and easy to start."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> business ideas, marketing ideas, side income ideas, and creative problem solving.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-fuchsia-500 shadow-lg">
        <span class="text-xs text-fuchsia-400 uppercase font-bold tracking-widest bg-fuchsia-900/30 px-2 py-1 rounded">Reply Help</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Help me reply to this in a calm and respectful way. Keep my reply short and clear."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> tense chats, awkward replies, customer complaints, and delicate conversations.</p>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-5">Small details that make a huge difference</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">Say the audience</h4>
        <p class="text-sm text-gray-400 leading-relaxed">A message to a close friend should not sound like a message to a client. Mention who the answer is for.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">Say the tone</h4>
        <p class="text-sm text-gray-400 leading-relaxed">If you want warm, kind, bold, polite, firm, or relaxed, say it plainly.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">Say the length</h4>
        <p class="text-sm text-gray-400 leading-relaxed">If you want one paragraph, three bullet points, or a very short answer, ask for that directly.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">Say the result you want</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Do you want to calm someone down, get payment, understand a topic, or make a plan? Name the end goal.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">Say what to avoid</h4>
        <p class="text-sm text-gray-400 leading-relaxed">You can say things like: do not sound rude, do not make it too formal, do not make up details, do not use big words.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">Ask again when needed</h4>
        <p class="text-sm text-gray-400 leading-relaxed">If the first answer is close but not perfect, do not start over. Ask for a cleaner, shorter, warmer, or stronger version.</p>
      </div>
    </div>
  </div>

  <div class="bg-blue-900/20 border border-blue-800/40 p-5 rounded-2xl">
    <h4 class="text-blue-300 font-bold mb-3 text-lg">One powerful move people forget</h4>
    <p class="text-sm text-blue-100/80 leading-relaxed mb-3">Tell the helper what not to do. This is one of the fastest ways to improve the answer.</p>
    <ul class="text-sm text-blue-100 space-y-2 list-disc pl-5">
      <li>Do not use big words.</li>
      <li>Do not make it too long.</li>
      <li>Do not sound cold or robotic.</li>
      <li>Do not invent facts if something is missing.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-5">Everyday moments where this helps a lot</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When you need to send a difficult message</h4>
        <p class="text-sm text-gray-400 leading-relaxed">A better question helps you get a message that sounds human instead of harsh, weak, or awkward.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When you want to understand something new</h4>
        <p class="text-sm text-gray-400 leading-relaxed">A strong question helps you learn without drowning in confusing language.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When you want practical ideas</h4>
        <p class="text-sm text-gray-400 leading-relaxed">If you ask for ideas in the right way, you get options you can actually use instead of vague inspiration.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When you want a reply you can send immediately</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Good questions produce answers that need less editing and feel more like you.</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    <div class="bg-orange-900/20 p-5 rounded-xl border border-orange-800/50">
      <h4 class="text-orange-400 font-bold mb-2 flex items-center text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Common Mistake
      </h4>
      <p class="text-sm text-orange-200/80 leading-relaxed">Many people ask in a way that is too broad, then blame the answer. Before you do that, check if your question clearly said the job, the tone, and the result you wanted.</p>
    </div>
    <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
      <h4 class="text-gray-200 font-bold mb-2 flex items-center text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Quick Rescue
      </h4>
      <ul class="text-sm text-gray-400 space-y-2">
        <li><strong class="text-white">The answer is too long:</strong> ask for a shorter version in 3 points or 4 lines.</li>
        <li><strong class="text-white">The answer sounds strange:</strong> ask for a warmer, simpler, more natural tone.</li>
        <li><strong class="text-white">The answer is too broad:</strong> restate the exact situation and end goal.</li>
        <li><strong class="text-white">The answer feels fake:</strong> tell it not to invent details and to stay realistic.</li>
      </ul>
    </div>
  </div>

  <div class="mt-10 pt-10 border-t border-gray-800 border-dashed">
    <h3 class="text-3xl font-extrabold text-white mb-6">Real-Life Impact</h3>
    <div class="space-y-5 text-gray-400 leading-relaxed">
      <p>Knowing how to ask well is like learning how to steer. Without it, you are just hoping for something useful. With it, you start guiding the outcome.</p>
      <p>This can save relationships, improve sales conversations, make learning easier, and reduce the stress that comes from not knowing what to say.</p>
      <p>A better question does not only give you a better answer. It gives you more confidence because you can shape the help you receive.</p>
    </div>
  </div>

  <div class="bg-gradient-to-br from-teal-900/40 to-gray-900 p-6 rounded-2xl border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)] mt-8">
    <div class="flex items-center space-x-3 mb-4 border-b border-teal-800/50 pb-3">
      <div class="bg-teal-500 text-gray-900 font-extrabold px-3 py-1 rounded text-sm uppercase tracking-widest shadow-lg">Practice</div>
      <h3 class="text-2xl font-bold text-teal-300">Build One Strong Question</h3>
    </div>
    <p class="text-teal-50 leading-relaxed mb-5 text-lg">Try this now with a real task you have been putting off.</p>
    <div class="space-y-4 text-teal-100 font-medium">
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
        <p class="pt-1">Think of one thing you need help with today: a message, a plan, a reply, or an explanation.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
        <p class="pt-1">Write the <strong>Who</strong>: who should the helper sound like?</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
        <p class="pt-1">Write the <strong>What</strong>: what exactly do you want it to do?</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span>
        <p class="pt-1">Write the <strong>How</strong>: how should the answer feel, sound, or be arranged?</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">5</span>
        <p class="pt-1">If needed, add one line for what to avoid, like: <strong class="text-white">"Do not use big words."</strong></p>
      </div>
    </div>
  </div>

  <div class="mt-10 pt-10 border-t border-gray-800 border-dashed pb-20">
    <h3 class="text-3xl font-extrabold text-white mb-6">Remember This</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-black/40 p-5 rounded-lg border border-gray-800">
        <strong class="text-teal-400 block mb-2">Do</strong>
        <ul class="text-sm text-gray-400 space-y-2 list-disc pl-4">
          <li>Say the exact job clearly.</li>
          <li>Say the tone you want.</li>
          <li>Say who the answer is for.</li>
          <li>Say the result you want.</li>
          <li>Ask for a rewrite if the first answer is close but not right.</li>
        </ul>
      </div>
      <div class="bg-black/40 p-5 rounded-lg border border-gray-800">
        <strong class="text-red-400 block mb-2">Do Not</strong>
        <ul class="text-sm text-gray-400 space-y-2 list-disc pl-4">
          <li>Ask in a vague way and expect a perfect answer.</li>
          <li>Leave out the tone and audience.</li>
          <li>Accept a long answer when you needed something short.</li>
          <li>Start over too quickly instead of refining the first answer.</li>
        </ul>
      </div>
    </div>
  </div>
</div>`;

const chattingLessonHtml = `<div class="space-y-10 text-gray-300">
  <div class="border-b border-gray-800 pb-6">
    <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-4 tracking-tight">Chatting, Not Searching</h2>
    <p class="text-lg leading-relaxed text-gray-400">Many people still treat AI like a search box. They ask one question, get one answer, and if the answer feels wrong, they throw everything away and start again. That habit wastes time. AI works better when you treat it like a real back-and-forth conversation.</p>
    <p class="text-base leading-relaxed text-gray-400 mt-4">You do not need the first answer to be perfect. You only need it to be a starting point. From there, you can shape it, trim it, soften it, sharpen it, or redirect it. That is where the real power begins.</p>
  </div>

  <div class="bg-teal-900/20 p-6 rounded-2xl border border-teal-800/50">
    <h3 class="text-2xl font-bold text-teal-300 mb-3">Why this changes everything</h3>
    <div class="space-y-3 text-gray-300 leading-relaxed">
      <p>A conversation lets you improve the answer step by step instead of hoping for perfection in one shot.</p>
      <p>You save time because you build on what already exists instead of rewriting your whole request from the beginning.</p>
      <p>You get more personal results because the helper learns what style, tone, and direction you want as the chat continues.</p>
      <p>You feel less stuck because you stop thinking, "This failed," and start thinking, "Let me guide it better."</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-red-900/20 p-5 rounded-xl border border-red-800/50">
      <h3 class="text-xl font-bold text-red-300 mb-3">Search-box habit</h3>
      <p class="text-sm text-gray-400 italic leading-relaxed">Ask once. Dislike the answer. Delete everything. Start over from zero.</p>
      <p class="text-sm text-red-100/80 mt-3 leading-relaxed">This creates frustration. You lose context, repeat yourself, and often end up with another average answer.</p>
    </div>
    <div class="bg-teal-900/20 p-5 rounded-xl border border-teal-800/50">
      <h3 class="text-xl font-bold text-teal-300 mb-3">Conversation habit</h3>
      <p class="text-sm text-gray-200 italic leading-relaxed">Keep the same chat open and reply with what needs to change: shorter, simpler, warmer, stronger, clearer, cheaper, or more direct.</p>
      <p class="text-sm text-teal-100/80 mt-3 leading-relaxed">This helps the helper improve the same answer instead of guessing again from scratch.</p>
    </div>
  </div>

  <div>
    <h3 class="text-xl font-bold text-teal-400 mb-4 flex items-center">
      <span class="bg-teal-900/50 text-teal-300 p-2 rounded-lg mr-3 border border-teal-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>
      </span>
      The 4 Ways to Push the Answer Forward
    </h3>
    <div class="space-y-4">
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">1</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Change the tone</h4>
          <p class="text-sm text-gray-400 leading-relaxed">If it sounds cold, awkward, or robotic, say so directly. Ask for warmer, calmer, friendlier, firmer, or more natural wording.</p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">2</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Change the facts or limits</h4>
          <p class="text-sm text-gray-400 leading-relaxed">If the answer assumes too much money, time, tools, or experience, correct it. Tell it your real limits and ask for a version that fits.</p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">3</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Change the length</h4>
          <p class="text-sm text-gray-400 leading-relaxed">If it is too long, cut it down. If it is too thin, ask it to add more depth, examples, or steps.</p>
        </div>
      </div>
      <div class="flex items-start bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
        <div class="text-2xl font-black text-teal-500 mr-4 mt-1 w-8 text-center">4</div>
        <div>
          <h4 class="text-white font-bold text-lg mb-1">Change the direction</h4>
          <p class="text-sm text-gray-400 leading-relaxed">If the whole answer is moving the wrong way, ask for new angles, fresh options, or a different approach completely.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-900/70 p-6 rounded-2xl border border-gray-800">
    <h3 class="text-2xl font-bold text-white mb-4">The mindset shift</h3>
    <div class="space-y-4 text-sm text-gray-400 leading-relaxed">
      <p><strong class="text-white">Do not ask once and judge forever.</strong> The first answer is a draft, not a final verdict.</p>
      <p><strong class="text-white">Do not throw away useful context.</strong> Staying in the same chat helps the helper remember what you already said.</p>
      <p><strong class="text-white">Do not hide your reaction.</strong> If something feels wrong, say what feels wrong and what should change.</p>
      <p><strong class="text-white">Think like an editor.</strong> You are not just receiving answers. You are shaping them.</p>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-2">The Pushback Vault</h3>
    <p class="text-sm text-gray-400 mb-6">Use these follow-up lines to improve a draft instead of starting over.</p>
    <div class="space-y-5">
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-teal-500 shadow-lg">
        <span class="text-xs text-teal-400 uppercase font-bold tracking-widest bg-teal-900/30 px-2 py-1 rounded">Make It Simpler</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"This is too heavy. Rewrite it in simpler words and make it easier for a beginner to understand."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> explanations, instructions, learning topics, and anything that feels too dense.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg">
        <span class="text-xs text-cyan-400 uppercase font-bold tracking-widest bg-cyan-900/30 px-2 py-1 rounded">Make It Shorter</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"Cut this down. Keep only the most important part and give it to me in 3 short points."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> long answers, summaries, messages, and anything you need quickly.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg">
        <span class="text-xs text-blue-400 uppercase font-bold tracking-widest bg-blue-900/30 px-2 py-1 rounded">Make It Fit My Reality</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"This assumes I have more money and time than I actually do. Rewrite it for a low-budget version I can start this week."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> plans, business ideas, routines, and any answer that feels unrealistic.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-emerald-500 shadow-lg">
        <span class="text-xs text-emerald-400 uppercase font-bold tracking-widest bg-emerald-900/30 px-2 py-1 rounded">Give Me Options</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"I do not love this version. Give me 3 different options: one safe, one bold, and one creative."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> writing, ideas, planning, branding, and decision making.</p>
      </div>
      <div class="bg-gray-800 p-5 rounded-xl border-l-4 border-fuchsia-500 shadow-lg">
        <span class="text-xs text-fuchsia-400 uppercase font-bold tracking-widest bg-fuchsia-900/30 px-2 py-1 rounded">Fix One Part</span>
        <p class="text-white italic text-lg leading-relaxed mt-3 mb-3">"The beginning is good, but the middle feels weak. Rewrite only that part and make it clearer."</p>
        <p class="text-sm text-gray-500"><strong>Best for:</strong> messages, pitches, essays, proposals, and any answer that is partly right.</p>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-bold text-white mb-5">Everyday moments where this helps a lot</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When a message is almost right</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Instead of asking for a brand-new message, tell it what to soften, shorten, or strengthen.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When a plan feels unrealistic</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Push back and explain your real limits so the answer becomes more useful for your actual life.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When an explanation still feels confusing</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Ask it to explain one step again in simpler words instead of discarding the whole answer.</p>
      </div>
      <div class="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
        <h4 class="text-lg font-bold text-teal-300 mb-2">When you want better ideas</h4>
        <p class="text-sm text-gray-400 leading-relaxed">Ask for different angles in the same chat so the ideas keep improving instead of restarting from scratch.</p>
      </div>
    </div>
  </div>

  <div class="bg-blue-900/20 border border-blue-800/40 p-5 rounded-2xl">
    <h4 class="text-blue-300 font-bold mb-3 text-lg">One quiet advantage people miss</h4>
    <p class="text-sm text-blue-100/80 leading-relaxed mb-3">The helper remembers the conversation. That means your short follow-up messages can still be powerful.</p>
    <ul class="text-sm text-blue-100 space-y-2 list-disc pl-5">
      <li>"Make it warmer."</li>
      <li>"Now shorten it."</li>
      <li>"Give me a version for WhatsApp."</li>
      <li>"Keep everything but remove the expensive part."</li>
    </ul>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    <div class="bg-orange-900/20 p-5 rounded-xl border border-orange-800/50">
      <h4 class="text-orange-400 font-bold mb-2 flex items-center text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Common Mistake
      </h4>
      <p class="text-sm text-orange-200/80 leading-relaxed">People often think a weak first answer means the tool has failed. In many cases, it only means the next instruction is needed.</p>
    </div>
    <div class="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
      <h4 class="text-gray-200 font-bold mb-2 flex items-center text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Quick Rescue
      </h4>
      <ul class="text-sm text-gray-400 space-y-2">
        <li><strong class="text-white">It feels too generic:</strong> ask for more detail or a version tailored to your situation.</li>
        <li><strong class="text-white">It feels too formal:</strong> ask for a more natural and human tone.</li>
        <li><strong class="text-white">It misses your reality:</strong> add your true limits and ask for a rewrite.</li>
        <li><strong class="text-white">It is partly right:</strong> ask it to fix only the weak section.</li>
      </ul>
    </div>
  </div>

  <div class="mt-10 pt-10 border-t border-gray-800 border-dashed">
    <h3 class="text-3xl font-extrabold text-white mb-6">Real-Life Impact</h3>
    <div class="space-y-5 text-gray-400 leading-relaxed">
      <p>When you learn to stay in the conversation, you become much more efficient. You stop wasting energy on restarts and begin improving what is already there.</p>
      <p>This can help you write faster, think better, learn with less frustration, and get answers that feel more personal and useful.</p>
      <p>More than anything, it teaches you that strong results often come from guidance, not from a perfect first attempt.</p>
    </div>
  </div>

  <div class="bg-gradient-to-br from-teal-900/40 to-gray-900 p-6 rounded-2xl border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.1)] mt-8">
    <div class="flex items-center space-x-3 mb-4 border-b border-teal-800/50 pb-3">
      <div class="bg-teal-500 text-gray-900 font-extrabold px-3 py-1 rounded text-sm uppercase tracking-widest shadow-lg">Practice</div>
      <h3 class="text-2xl font-bold text-teal-300">Keep the Chat Alive</h3>
    </div>
    <p class="text-teal-50 leading-relaxed mb-5 text-lg">Try this now with a simple real example.</p>
    <div class="space-y-4 text-teal-100 font-medium">
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">1</span>
        <p class="pt-1">Ask for something ordinary, like a message, a short plan, or a quick explanation.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">2</span>
        <p class="pt-1">Read the first answer and notice what feels off.</p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">3</span>
        <p class="pt-1">Reply in the same chat with one clear improvement, such as: <strong class="text-white bg-black/30 px-2 py-1 rounded">"Make it shorter and sound more natural."</strong></p>
      </div>
      <div class="flex items-start">
        <span class="bg-teal-800/50 text-teal-300 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">4</span>
        <p class="pt-1">If needed, follow up once more with another improvement instead of restarting.</p>
      </div>
    </div>
  </div>

  <div class="mt-10 pt-10 border-t border-gray-800 border-dashed pb-20">
    <h3 class="text-3xl font-extrabold text-white mb-6">Remember This</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-black/40 p-5 rounded-lg border border-gray-800">
        <strong class="text-teal-400 block mb-2">Do</strong>
        <ul class="text-sm text-gray-400 space-y-2 list-disc pl-4">
          <li>Stay in the same chat when the answer is close but not perfect.</li>
          <li>Say exactly what should change.</li>
          <li>Use short follow-up lines when they are enough.</li>
          <li>Think like an editor, not just a receiver.</li>
        </ul>
      </div>
      <div class="bg-black/40 p-5 rounded-lg border border-gray-800">
        <strong class="text-red-400 block mb-2">Do Not</strong>
        <ul class="text-sm text-gray-400 space-y-2 list-disc pl-4">
          <li>Delete the chat too quickly.</li>
          <li>Assume the first answer must be final.</li>
          <li>Restart from zero when one follow-up could fix it.</li>
          <li>Keep quiet about what feels wrong in the answer.</li>
        </ul>
      </div>
    </div>
  </div>
</div>`;

// ── Mock Data ──────────────────────────────────────────────────────────────────
const courseLessons: Lesson[] = [
  {
    id: "lesson-1",
    moduleId: "module-a",
    moduleTitle: "Module A: Talking to AI the Right Way",
    title: "The Power of Screenshots",
    cheatSheetHtml: screenshotLessonHtml,
    order: 1,
    completed: true,
  },
  {
    id: "lesson-2",
    moduleId: "module-a",
    moduleTitle: "Module A: Talking to AI the Right Way",
    title: "Asking the Right Questions",
    videoUrl: "https://youtu.be/SLXuy-QLSzs",
    cheatSheetHtml: askingLessonHtml,
    order: 2,
    completed: true,
  },
  {
    id: "lesson-3",
    moduleId: "module-a",
    moduleTitle: "Module A: Talking to AI the Right Way",
    title: "Chatting, Not Searching",
    cheatSheetHtml: chattingLessonHtml,
    order: 3,
    completed: true,
  },
  {
    id: "lesson-4",
    moduleId: "module-a",
    moduleTitle: "Module A: Talking to AI the Right Way",
    title: "Make It Simple",
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
</div>`,
    order: 4,
    completed: false,
  },
  {
    id: "lesson-5",
    moduleId: "module-a",
    moduleTitle: "Module A: Talking to AI the Right Way",
    title: "From Brain to Screen",
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

</div>`,
    order: 5,
    completed: false,
  },
];

// ── Fetch Functions ─────────────────────────────────────────────────────────────

/**
 * Fetches a single lesson by its ID from a specific module.
 */
export async function getLesson(moduleId: string, lessonId: string): Promise<Lesson | null> {
  const lesson = courseLessons.find(l => l.id === lessonId && l.moduleId === moduleId);
  if (!lesson) return null;

  return {
    ...lesson,
    videoUrl: toYouTubeEmbedUrl(lesson.videoUrl) ?? undefined,
  };
}

/**
 * Fetches all lessons belonging to a module, ordered by their position.
 */
export async function getModuleLessons(moduleId: string): Promise<Lesson[]> {
  return courseLessons
    .filter(l => l.moduleId === moduleId)
    .map((lesson) => ({
      ...lesson,
      videoUrl: toYouTubeEmbedUrl(lesson.videoUrl) ?? undefined,
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns all unique module IDs and titles.
 */
export async function getModules(): Promise<{ id: string; title: string }[]> {
  const seen = new Map<string, string>();
  for (const l of courseLessons) {
    if (!seen.has(l.moduleId)) {
      seen.set(l.moduleId, l.moduleTitle);
    }
  }
  return Array.from(seen, ([id, title]) => ({ id, title }));
}
