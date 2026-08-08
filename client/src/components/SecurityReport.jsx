function CheckItem({ label, description, passed }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${passed ? 'bg-[#22C55E]/15 text-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-[#EF4444]/15 text-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse-glow'}`}>
        {passed ? '✓' : '!'}
      </span>
      <div>
        <p className="text-sm font-medium text-[#E8EDF2]">{label}</p>
        <p className="text-xs text-[#8892A0]">{passed ? description.ok : description.missing}</p>
      </div>
    </div>
  );
}

const CHECKS = [
  { key: 'isHttps', label: 'HTTPS', description: { ok: 'Secure connection enabled', missing: 'Not using HTTPS' } },
  { key: 'hasCSP', label: 'Content-Security-Policy', description: { ok: 'Header is present', missing: 'Header is missing' } },
  { key: 'hasXFrameOptions', label: 'X-Frame-Options', description: { ok: 'Header is present', missing: 'Header is missing' } },
  { key: 'hasHSTS', label: 'Strict-Transport-Security', description: { ok: 'Header is present', missing: 'Header is missing' } },
  { key: 'hasXContentTypeOptions', label: 'X-Content-Type-Options', description: { ok: 'Header is present', missing: 'Header is missing' } },
  { key: 'hasReferrerPolicy', label: 'Referrer-Policy', description: { ok: 'Header is present', missing: 'Header is missing' } },
  { key: 'hasPermissionsPolicy', label: 'Permissions-Policy', description: { ok: 'Header is present', missing: 'Header is missing' } },
];

function SecurityReport({ data }) {
  if (data.error) {
    return <p className="text-[#EF4444] text-sm">Error: {data.error}</p>;
  }

  const issueCount = data.issues?.length || 0;

  return (
    <div className="space-y-4">
      {issueCount > 0 && (
        <div className="flex items-center gap-2 bg-[#EF4444]/10 border-l-4 border-[#EF4444] text-[#E8EDF2] text-sm font-medium px-3 py-2.5 rounded-lg">
          <span className="text-[#EF4444]">⚠</span> {issueCount} security {issueCount === 1 ? 'issue' : 'issues'} detected
        </div>
      )}

      <div className="divide-y divide-[#1E2530]">
        {CHECKS.map((check) => (
          <CheckItem key={check.key} label={check.label} description={check.description} passed={!!data[check.key]} />
        ))}
      </div>

      <div className="text-sm bg-[#0D1117] rounded-lg px-3 py-2.5 border border-[#1E2530] font-mono-score">
        <span className="text-[#8892A0] font-sans">Server Header:</span>{' '}
        <span className="font-medium text-[#00FF9C]">{data.serverHeader}</span>
      </div>
    </div>
  );
}

export default SecurityReport;