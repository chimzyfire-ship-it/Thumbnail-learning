export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-300">
      <div className="mb-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c9a84c] mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: May 2026</p>
      </div>

      <div className="space-y-10 leading-relaxed text-[15px]">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Who we are</h2>
          <p>Aethel Solutions operates the Aethel Solutions Learning platform (&quot;the Platform&quot;). We are committed to protecting the information you share with us. This policy explains what we collect, why we collect it, and how we use it.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Information we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">Account information:</strong> Your name and email address, collected when you create an account.</li>
            <li><strong className="text-white">Learning progress:</strong> Which lessons you have started, completed, your study time, and your XP — stored to power your personal dashboard.</li>
            <li><strong className="text-white">Usage data:</strong> Pages visited and features used, collected to improve the platform.</li>
            <li><strong className="text-white">Local storage:</strong> We store a session identifier and your preferences (language, theme) in your browser&apos;s local storage.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. How we use your information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide and personalise your learning experience.</li>
            <li>To remember your progress across devices.</li>
            <li>To send account-related emails (confirmation, password reset).</li>
            <li>To improve the platform based on how it is used.</li>
          </ul>
          <p className="mt-3">We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Data storage and security</h2>
          <p>Your data is stored securely using Supabase, which uses industry-standard encryption at rest and in transit. We retain your data for as long as your account is active. You can request deletion at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Your rights</h2>
          <p>You have the right to access, correct, or delete your personal data. To exercise these rights, email us at <a href="mailto:support@aethelsolutions.com" className="text-[#c9a84c] hover:underline">support@aethelsolutions.com</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Cookies</h2>
          <p>We use session cookies set by Supabase for authentication. We do not use advertising or tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">7. Changes to this policy</h2>
          <p>We may update this policy from time to time. Significant changes will be communicated via email or an in-app notice. Continued use of the Platform after changes means you accept the updated policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
          <p>Questions about this policy? Reach us at <a href="mailto:support@aethelsolutions.com" className="text-[#c9a84c] hover:underline">support@aethelsolutions.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
