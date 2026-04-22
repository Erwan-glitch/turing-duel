export default function PlayersCounter({
  onlineCount,
}: {
  onlineCount: number;
}) {
  // Simple formula to estimate wait time based on online count
  const averageWaitTime = onlineCount > 0 ? Math.round(60 / onlineCount) : 60;

  return (
    <div className="mt-12 flex items-center justify-center gap-8 text-slate-500 text-sm">
      {onlineCount > 0 && (
        <>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>
              {`${onlineCount} player${onlineCount > 1 ? "s" : ""} online`}
            </span>
          </div>

          <div className="sm:block w-1 h-1 bg-slate-600 rounded-full" />
        </>
      )}
      <div>
        <span>Average wait time: {averageWaitTime} s</span>
      </div>
    </div>
  );
}
