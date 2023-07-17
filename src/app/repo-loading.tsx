import React from 'react'

export const RepoLoading = () => {
  return (
    // show LoadingRepo component 4 times
    [1, 2, 3, 4].map((i) => <LoadingRepo key={i} />)
  )
}

const LoadingRepo = () => {
  return (
    <article
      className="
        flex flex-col justify-between rounded-lg w-full container
      bg-gray-100 border-2 border-gray-400 py-4 px-2 m-2
      "
    >
      <div className="animate-pulse flex flex-col py-2 max-w-4xl mx-auto w-full">
        <div className="w-8/12 space-y-2 py-2 ml-4">
          <div className="h-2 my-2 bg-slate-400 rounded"></div>
          <div className="h-2 my-2 bg-slate-400 rounded"></div>
          <div className="h-2 my-2 bg-slate-400 rounded"></div>
        </div>
        <div className="w-4/12 self-end space-y-2 ml-4 py-1">
          <div className="h-2 my-2 bg-slate-400 rounded"></div>
          <div className="h-2 my-2 bg-slate-400 rounded"></div>
        </div>
      </div>
    </article>
  )
}
