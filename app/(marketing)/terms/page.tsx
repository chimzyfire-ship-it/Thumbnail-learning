export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-300">
      <div className="mb-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c9a84c] mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Terms of Service</h1>
        <p className="text-muted-foreground text-sm">Last updated: May 2026</p>
      </div>

      <div className="space-y-10 leading-relaxed text-[15px]">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of terms</h2>
          <p>By creating an account or using the Aethel Solutions Learning platform (&quot;the Platform&quot;), you agree to these Terms of Service. If you do not agree, do not use the Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Your account</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You are responsible for keeping your password secure.</li>
            <li>You must provide accurate information when creating an account.</li>
            <li>You may not create an account on behalf of someone else without their permission.</li>
            <li>You must be at least 13 years old to use the Platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Use of the Platform</h2>
          <p>You agree to use the Platform only for lawful purposes. You must not:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Share course content externally without permission.</li>
            <li>Attempt to reverse-engineer, scrape, or otherwise exploit the Platform.</li>
            <li>Use the Platform to harass, harm, or deceive others.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Content ownership</h2>
          <p>All course content — lessons, videos, notes, and materials — is owned by Aethel Solutions. You receive a personal, non-transferable licence to access the content for learning purposes. You may not redistribute or resell any content.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. XP, streaks, and progress</h2>
          <p>XP, learning streaks, and progress data are features of the Platform and have no monetary value. Aethel Solutions reserves the right to adjust or reset these values at any time.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Termination</h2>
          <p>We reserve the right to suspend or terminate your account if you violate these terms. You may also delete your account at any time from your Settings page.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">7. Disclaimer</h2>
          <p>The Platform is provided &quot;as is&quot;. Aethel Solutions does not warrant that the Platform will be error-free or uninterrupted. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">8. Changes</h2>
          <p>We may update these terms at any time. We will notify you of material changes via email or an in-app notice. Continued use after notification means you accept the updated terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">9. Contact</h2>
          <p>Questions? Email us at <a href="mailto:support@aethelsolutions.com" className="text-[#c9a84c] hover:underline">support@aethelsolutions.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
