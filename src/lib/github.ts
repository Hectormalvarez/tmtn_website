export interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
}

export async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      'https://api.github.com/users/Hectormalvarez/repos?sort=updated&per_page=4',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
