export default function HomeLoading() {
  return (
    <>
      <div className="animate-pulse flex py-8 justify-center items-center max-w-4xl mx-auto">
        <div className="rounded-full bg-slate-200 h-20 w-20"></div>
        <div className="w-4/12 space-y-6 ml-4 py-1">
          <div className="h-2 bg-slate-200 rounded"></div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="animate-pulse flex py-8 justify-center items-center max-w-4xl mx-auto">
        <div className="w-8/12 space-y-6 py-1">
          <div className="h-2 bg-slate-200 rounded"></div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </>
  )
}
