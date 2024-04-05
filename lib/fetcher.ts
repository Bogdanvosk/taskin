export const fetcher = async (url: string) => {
  if (!url) return
  const res = await fetch(url)

  return res.json()
}
