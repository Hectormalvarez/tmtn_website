import React, { Suspense } from 'react'

import { Repo } from '@/app/repo'
import { reposData } from '@/app/data'
import { RepoLoading } from '@/app/repo-loading'
import { Repo as RepoType } from '@/types/repo'

async function getRepoData() {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  await delay(4000)
  return reposData
}

export const RepoList = () => {
  return (
    <Suspense fallback={<RepoLoading />}>
      <RepoSection />
    </Suspense>
  )
}

const RepoSection = async () => {
  const repos = await getRepoData()
  repos.sort((a: RepoType, b: RepoType) => {
    const aTimestamp = new Date(a.updated_at).getTime()
    const bTimestamp = new Date(b.updated_at).getTime()
    return bTimestamp - aTimestamp
  })
  
  return (
    <section className="repo-list container">
      {repos.map((repo) => (
        <Repo repo={repo} key={repo.name} />
      ))}
    </section>
  )
}
