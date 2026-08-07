function CheckItem({ label, passed }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <span className="text-gray-700">{label}</span>
      <span className={passed ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
        {passed ? '✓ Present' : '✗ Missing'}
      </span>
    </div>
  );
}

function SecurityReport({ data }) {
  if (data.error) {
    return <p className="text-red-500">Error: {data.error}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="divide-y divide-gray-100">
        <CheckItem label="HTTPS" passed={data.isHttps} />
        <CheckItem label="Content-Security-Policy" passed={data.hasCSP} />
        <CheckItem label="X-Frame-Options" passed={data.hasXFrameOptions} />
        <CheckItem label="Strict-Transport-Security (HSTS)" passed={data.hasHSTS} />
        <CheckItem label="X-Content-Type-Options" passed={data.hasXContentTypeOptions} />
        <CheckItem label="Referrer-Policy" passed={data.hasReferrerPolicy} />
        <CheckItem label="Permissions-Policy" passed={data.hasPermissionsPolicy} />
      </div>

      <div className="text-sm">
        <span className="font-medium text-gray-700">Server Header:</span> {data.serverHeader}
      </div>

      {data.issues?.length > 0 && (
        <div>
          <p className="font-medium text-red-600 mb-1">Issues Found:</p>
          <ul className="list-disc list-inside text-sm text-red-500 space-y-1">
            {data.issues.map((issue, i) => <li key={i}>{issue}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SecurityReport;