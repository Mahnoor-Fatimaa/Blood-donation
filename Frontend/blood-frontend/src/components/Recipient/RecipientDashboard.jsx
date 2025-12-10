import Card from "../ui/Card";

const sampleMatches = [
  { requestId: "#REQ-1024", group: "O-", donors: 3, status: "Matching" },
  { requestId: "#REQ-1025", group: "A+", donors: 5, status: "Contacting" }
];

export default function RecipientDashboard() {
  return (
    <div className="space-y-4 text-sm">
      <p className="text-slate-600">
        Track example requests and how many potential donors have been identified.
      </p>
      <Card>
        <div className="space-y-3">
          {sampleMatches.map(match => (
            <div
              key={match.requestId}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400">{match.requestId}</p>
                <p className="text-sm font-semibold text-slate-900">
                  Blood group needed:{" "}
                  <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand-dark">
                    {match.group}
                  </span>
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{match.donors} matching donors</p>
                <p>{match.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
